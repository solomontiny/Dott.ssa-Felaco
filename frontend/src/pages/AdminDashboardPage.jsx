import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Save,
  X,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../hooks/useAuth';
import { useArticles } from '../hooks/useArticles';
import { uploadFile, getPublicUrl } from '../hooks/useStorage';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { i18n } = useTranslation();
  const { loading: articlesLoading, list, create, update, remove } = useArticles();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    language: i18n.language || 'it',
    tags: '',
    featured_image: '',
    image_url: '',
    published: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [consultationsCount, setConsultationsCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/admin/login', { replace: true });
      return;
    }

    let mounted = true;

    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchArticles(), fetchMetrics()]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (mounted) {
          setErrorMessage('Unable to load dashboard data. Please refresh and try again.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [authLoading, user, navigate]);

  const fetchArticles = async () => {
    try {
      const currentLanguage = i18n.language || 'en';
      const data = await list({ limit: 100, language: currentLanguage, published_only: false });
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Minimal metrics: count appointments & consultations
      const { data: appts, error: apptsErr } = await (await import('../lib/supabaseClient')).supabase.from('appointments').select('*');
      const { data: consults, error: consultErr } = await (await import('../lib/supabaseClient')).supabase.from('consultations').select('*');
      setAppointmentsCount(appts?.length || 0);
      setConsultationsCount(consults?.length || 0);
    } catch (error) {
      console.warn('Unable to load appointment or consultation metrics:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/admin/login', { replace: true });
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setErrorMessage('');
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const bucket = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'media';
      const path = `${Date.now()}-${file.name}`;
      const res = await uploadFile(bucket, path, file);
      if (res.error) throw res.error;
      const publicUrl = getPublicUrl(bucket, path);
      setFormData((prev) => ({
        ...prev,
        featured_image: publicUrl,
        image_url: publicUrl,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Unable to upload the image. Please try again later.');
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      setDragActive(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleFileUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !formData.title.trim() ||
      !formData.excerpt.trim() ||
      !formData.content.trim() ||
      !formData.category.trim()
    ) {
      setErrorMessage('Title, excerpt, content, and category are required.');
      return;
    }

    const articleData = {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      category: formData.category.trim(),
      language: formData.language || 'it',
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      featured_image: formData.featured_image || formData.image_url || null,
      image_url: formData.image_url || formData.featured_image || null,
      published: Boolean(formData.published),
      status: formData.published ? 'published' : 'draft',
    };

    try {
      if (editingArticle) {
        await update(editingArticle.id, articleData);
      } else {
        await create(articleData);
      }

      await fetchArticles();
      resetForm();
    } catch (error) {
      console.error('Error saving article:', error);
      setErrorMessage('Saving the article failed. Please review the values and try again.');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      language: article.language || i18n.language || 'it',
      tags: article.tags?.join(', ') || '',
      featured_image: article.featured_image || article.image_url || '',
      image_url: article.image_url || article.featured_image || '',
      published: article.published,
    });
    setShowPreview(false);
    setShowEditor(true);
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await remove(articleId);
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      setErrorMessage('Article deletion failed.');
    }
  };

  const togglePublish = async (article) => {
    try {
      await update(article.id, { published: !article.published });
      await fetchArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      setErrorMessage('Unable to update the publication status.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      language: i18n.language || 'it',
      tags: '',
      featured_image: '',
      image_url: '',
      published: false,
    });
    setEditingArticle(null);
    setShowEditor(false);
    setShowPreview(false);
    setErrorMessage('');
    setUploadProgress(0);
    setDragActive(false);
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

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">{user?.email || ''}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                data-testid="view-website-link"
                onClick={() => window.open('/', '_blank')}
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                Visualizza sito
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
        {!showEditor ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
                <p className="text-gray-600 mt-1">{articles.length} total articles</p>
              </div>
              <Button
                data-testid="create-article-btn"
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create article</span>
              </Button>
            </div>

            <div className="grid gap-4 mb-8 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500">Articles</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{articles.length}</p>
                <p className="mt-2 text-sm text-gray-600">Published articles and drafts</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500">Appointments</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{appointmentsCount}</p>
                <p className="mt-2 text-sm text-gray-600">Appointment requests received</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500">Consultations</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{consultationsCount}</p>
                <p className="mt-2 text-sm text-gray-600">Consultation requests</p>
              </div>
            </div>

            <div className="grid gap-4">
              {articles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No articles yet. Create the first one now.</p>
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
                          <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
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
                        <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Category: {article.category}</span>
                          <span>•</span>
                          <span>{article.language?.toUpperCase() || 'IT'}</span>
                          <span>•</span>
                          <span>{new Date(article.created_at).toLocaleDateString('en-US')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => togglePublish(article)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={article.published ? 'Remove publication' : 'Publish'}
                        >
                          {article.published ? (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
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
                {editingArticle ? 'Edit article' : 'Create article'}
              </h2>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short summary of the article"
                  rows={3}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Content *</label>
                  <button
                    type="button"
                    onClick={() => setShowPreview((prev) => !prev)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>

                {showPreview ? (
                  <div className="prose max-w-full rounded-xl border border-gray-200 bg-slate-50 p-5 text-slate-900">
                    <ReactMarkdown>{formData.content || 'Use the editor field to write Markdown content.'}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write the article content here..."
                    rows={12}
                    required
                  />
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Es. Nutrizione, Benessere"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="it">Italian</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="health, nutrition, tips"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured image</label>
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`rounded-2xl border-dashed border-2 p-6 transition ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      Drag an image here or browse manually.
                    </p>
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                      <span>{uploadingImage ? 'Uploading...' : 'Upload image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                </div>

                {uploadProgress > 0 && (
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {formData.image_url && (
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={formData.image_url}
                      alt="Uploaded image preview"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <span className="text-sm text-gray-600">Uploaded image preview</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  id="publishToggle"
                />
                <label htmlFor="publishToggle" className="text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingArticle ? 'Update article' : 'Create article'}</span>
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;