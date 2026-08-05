import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Plus, Edit, Trash2, Eye, EyeOff,
  FileText, Image as ImageIcon, Save, X, Layout, BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useArticles } from '../hooks/useArticles';
import { useHomepage } from '../hooks/useHomepage';
import { uploadFile, getPublicUrl } from '../hooks/useStorage';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const REQUEST_TIMEOUT_MS = 8000;
const DEFAULT_BUCKET = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'media';

const runWithTimeout = async (request, fallback = []) => {
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([request, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [homepageSections, setHomepageSections] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [consultationsCount, setConsultationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Article Editor State
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    subtitle: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image_url: '',
    published: false,
  });

  // Homepage Editor State
  const [editingSection, setEditingSection] = useState(null);
  const [sectionFormData, setSectionFormData] = useState({});
  
  const [uploadingImage, setUploadingImage] = useState(false);

  const { user, loading: authLoading, signOut } = useAuth();
  const { list: listArticles, create: createArticle, update: updateArticle, remove: removeArticle } = useArticles();
  const { fetchAllSections, updateSection } = useHomepage();
  const adminEmail = user?.email || 'Admin';

  const fetchArticles = useCallback(async (isActive = () => true) => {
    try {
      const data = await runWithTimeout(
        listArticles({ limit: 100, language: 'it', published_only: false }),
        []
      );
      if (isActive()) setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      if (isActive()) setArticles([]);
    }
  }, [listArticles]);

  const fetchHomepage = useCallback(async (isActive = () => true) => {
    try {
      const data = await fetchAllSections('it');
      if (isActive()) setHomepageSections(data || []);
    } catch (error) {
      console.error('Error fetching homepage sections:', error);
    }
  }, [fetchAllSections]);

  const fetchMetrics = useCallback(async (isActive = () => true) => {
    try {
      const [appointmentsRes, consultationsRes] = await Promise.allSettled([
        runWithTimeout(supabase.from('appointments').select('*'), { data: [], error: null }),
        runWithTimeout(supabase.from('consultations').select('*'), { data: [], error: null }),
      ]);

      if (appointmentsRes.status === 'rejected') {
        throw appointmentsRes.reason;
      }

      if (consultationsRes.status === 'rejected') {
        throw consultationsRes.reason;
      }

      const appts = appointmentsRes.value?.data || [];
      const consults = consultationsRes.value?.data || [];

      if (isActive()) {
        setAppointmentsCount(Array.isArray(appts) ? appts.length : 0);
        setConsultationsCount(Array.isArray(consults) ? consults.length : 0);
      }
    } catch (error) {
      console.warn('Unable to load appointment or consultation metrics:', error);
      if (isActive()) {
        setAppointmentsCount(0);
        setConsultationsCount(0);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (authLoading) {
      return () => {
        active = false;
      };
    }

    if (!user) {
      navigate('/admin/login', { replace: true });
      return () => {
        active = false;
      };
    }

    setIsLoading(false);
    void fetchArticles(() => active);
    void fetchHomepage(() => active);
    void fetchMetrics(() => active);

    return () => {
      active = false;
    };
  }, [authLoading, user, navigate, fetchArticles, fetchHomepage, fetchMetrics]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.warn('Logout warning:', error);
    }
    navigate('/admin/login');
  };

  // Article Handlers
  const handleArticleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const uploadedFileName = `${Date.now()}-${file.name}`;
      await uploadFile(DEFAULT_BUCKET, uploadedFileName, file);
      const publicUrl = getPublicUrl(DEFAULT_BUCKET, uploadedFileName);

      setArticleFormData((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();

    const articleData = {
      ...articleFormData,
      tags: String(articleFormData.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      excerpt: articleFormData.excerpt || articleFormData.content.slice(0, 160),
      category: articleFormData.category || 'general',
      language: 'it',
      published: Boolean(articleFormData.published),
      status: articleFormData.published ? 'published' : 'draft',
    };

    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, articleData);
      } else {
        await createArticle(articleData);
      }

      await fetchArticles();
      resetArticleForm();
    } catch (error) {
      console.error('Error saving article:', error);
      alert(error?.message || 'Failed to save article');
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleFormData({
      title: article.title || '',
      subtitle: article.subtitle || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      image_url: article.image_url || article.fileUrl || '',
      published: Boolean(article.published),
    });
    setShowArticleEditor(true);
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await removeArticle(articleId);
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(error?.message || 'Failed to delete article');
    }
  };

  const togglePublishArticle = async (article) => {
    try {
      const isPublished = !(article.status === 'published' || article.published === true);
      await updateArticle(article.id, {
        published: isPublished,
        status: isPublished ? 'published' : 'draft',
      });
      await fetchArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert(error?.message || 'Failed to update article status');
    }
  };

  const resetArticleForm = () => {
    setArticleFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      image_url: '',
      published: false,
    });
    setEditingArticle(null);
    setShowArticleEditor(false);
  };

  // Homepage Handlers
  const handleEditSection = (section) => {
    setEditingSection(section);
    // Ensure content is at least an empty object to avoid crashes when mapping over keys
    setSectionFormData(section.content || {});
  };

  const handleSectionContentChange = (key, value) => {
    setSectionFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSectionImageUpload = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadedFileName = `homepage-${Date.now()}-${file.name}`;
      await uploadFile(DEFAULT_BUCKET, uploadedFileName, file);
      const publicUrl = getPublicUrl(DEFAULT_BUCKET, uploadedFileName);
      handleSectionContentChange(key, publicUrl);
    } catch (error) {
      console.error('Error uploading homepage image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    console.log('Saving section:', editingSection?.id, sectionFormData);
    try {
      await updateSection(editingSection.id, { content: sectionFormData });
      await fetchHomepage();
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section: ' + (error.message || JSON.stringify(error)));
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{adminEmail}</p>
              </div>
              <nav className="hidden md:flex space-x-4">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'articles' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Articles
                </button>
                <button
                  onClick={() => setActiveTab('homepage')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'homepage' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Homepage
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Analytics
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                data-testid="view-website-link"
                onClick={() => window.open('/', '_blank')}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                View Website
              </button>
              <Button
                data-testid="admin-logout-btn"
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointmentsCount}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{consultationsCount}</p>
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <>
            {!showArticleEditor ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
                    <p className="text-gray-600 mt-1">{articles.length} total articles</p>
                  </div>
                  <Button
                    data-testid="create-article-btn"
                    onClick={() => setShowArticleEditor(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New Article</span>
                  </Button>
                </div>

                <div className="grid gap-4">
                  {articles.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No articles yet. Create your first article!</p>
                    </div>
                  ) : (
                    articles.map((article) => (
                      <div
                        key={article.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {article.title}
                              </h3>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  article.published
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {article.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{article.excerpt || article.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Category: {article.category || 'general'}</span>
                              <span>•</span>
                              <span>{new Date(article.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => togglePublishArticle(article)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title={article.published ? 'Unpublish' : 'Publish'}
                            >
                              {article.published ? (
                                <EyeOff className="w-5 h-5 text-gray-600" />
                              ) : (
                                <Eye className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditArticle(article)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-5 h-5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingArticle ? 'Edit Article' : 'Create New Article'}
                  </h2>
                  <Button
                    onClick={resetArticleForm}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </div>

                <form onSubmit={handleArticleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <Input
                      value={articleFormData.title}
                      onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                      placeholder="Article title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <Input
                      value={articleFormData.subtitle}
                      onChange={(e) => setArticleFormData({ ...articleFormData, subtitle: e.target.value })}
                      placeholder="Article subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <Textarea
                      value={articleFormData.excerpt}
                      onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
                      placeholder="Brief summary of the article"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <Textarea
                      value={articleFormData.content}
                      onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                      placeholder="Full article content"
                      rows={12}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Input
                        value={articleFormData.category}
                        onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value })}
                        placeholder="e.g., Nutrition, Wellness"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags (comma-separated)
                      </label>
                      <Input
                        value={articleFormData.tags}
                        onChange={(e) => setArticleFormData({ ...articleFormData, tags: e.target.value })}
                        placeholder="health, nutrition, tips"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-700">
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleArticleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      {articleFormData.image_url && (
                        <img
                          src={articleFormData.image_url}
                          alt="Preview"
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={articleFormData.published}
                      onChange={(e) => setArticleFormData({ ...articleFormData, published: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm text-gray-700">
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{editingArticle ? 'Update Article' : 'Create Article'}</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={resetArticleForm}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {activeTab === 'homepage' && (
          <div className="space-y-8">
            {!editingSection ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Homepage Sections</h2>
                    <p className="text-gray-600 mt-1">Manage sections and content</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {homepageSections.map((section, index) => (
                    <div
                      key={section.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 uppercase">
                          {section.section_key.replace(/_/g, ' ')}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5 text-blue-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Section: <span className="uppercase">{editingSection.section_key.replace(/_/g, ' ')}</span>
                  </h2>
                  <Button
                    onClick={() => setEditingSection(null)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </div>

                <form onSubmit={handleSaveSection} className="space-y-6">
                  <div className="grid gap-6">
                    {Object.entries(sectionFormData).map(([key, value]) => {
                      const isImage = key.toLowerCase().includes('image') || key.toLowerCase().includes('url');
                      const isLongText = typeof value === 'string' && value.length > 50;

                      return (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {key.replace(/_/g, ' ')}
                          </label>
                          
                          {isImage ? (
                            <div className="flex items-center space-x-4">
                              <Input
                                value={value}
                                onChange={(e) => handleSectionContentChange(key, e.target.value)}
                                className="flex-1"
                              />
                              <label className="cursor-pointer">
                                <div className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                                  <ImageIcon className="w-5 h-5 text-gray-600" />
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSectionImageUpload(e, key)}
                                  className="hidden"
                                />
                              </label>
                              {value && (
                                <img src={value} alt="Preview" className="h-10 w-10 object-cover rounded border" />
                              )}
                            </div>
                          ) : isLongText ? (
                            <Textarea
                              value={value}
                              onChange={(e) => handleSectionContentChange(key, e.target.value)}
                              rows={4}
                            />
                          ) : typeof value === 'object' && value !== null ? (
                            <div className="p-4 bg-gray-50 rounded border border-gray-200 space-y-4">
                              {Object.entries(value).map(([subKey, subValue]) => (
                                <div key={subKey}>
                                  <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                                    {subKey.replace(/_/g, ' ')}
                                  </label>
                                  <Input
                                    value={subValue}
                                    onChange={(e) => {
                                      const newVal = { ...value, [subKey]: e.target.value };
                                      handleSectionContentChange(key, newVal);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Input
                              value={value}
                              onChange={(e) => handleSectionContentChange(key, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
