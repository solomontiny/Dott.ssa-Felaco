import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Plus, Edit, Trash2, Eye, EyeOff,
  FileText, Image as ImageIcon, Save, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useArticles } from '../hooks/useArticles';
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
  const [articles, setArticles] = useState([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [consultationsCount, setConsultationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image_url: '',
    published: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const { user, signOut } = useAuth();
  const { list, create, update, remove } = useArticles();
  const adminEmail = user?.email || 'Admin';

  const fetchArticles = useCallback(async () => {
    try {
      const data = await runWithTimeout(
        list({ limit: 100, language: 'it', published_only: false }),
        []
      );
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  }, [list]);

  const fetchMetrics = useCallback(async () => {
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

      setAppointmentsCount(Array.isArray(appts) ? appts.length : 0);
      setConsultationsCount(Array.isArray(consults) ? consults.length : 0);
    } catch (error) {
      console.warn('Unable to load appointment or consultation metrics:', error);
      setAppointmentsCount(0);
      setConsultationsCount(0);
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (!user) {
      navigate('/admin/login');
      return () => {
        active = false;
      };
    }

    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        await Promise.allSettled([fetchArticles(), fetchMetrics()]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      active = false;
    };
  }, [user, navigate, fetchArticles, fetchMetrics]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.warn('Logout warning:', error);
    }
    navigate('/admin/login');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const uploadedFileName = `${Date.now()}-${file.name}`;
      await uploadFile(DEFAULT_BUCKET, uploadedFileName, file);
      const publicUrl = getPublicUrl(DEFAULT_BUCKET, uploadedFileName);

      setFormData((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const articleData = {
      ...formData,
      tags: String(formData.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      excerpt: formData.excerpt || formData.content.slice(0, 160),
      category: formData.category || 'general',
      language: 'it',
      published: Boolean(formData.published),
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
      alert(error?.message || 'Failed to save article');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      image_url: article.image_url || article.fileUrl || '',
      published: Boolean(article.published),
    });
    setShowEditor(true);
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await remove(articleId);
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(error?.message || 'Failed to delete article');
    }
  };

  const togglePublish = async (article) => {
    try {
      await update(article.id, { published: !article.published });
      await fetchArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert(error?.message || 'Failed to update article status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      image_url: '',
      published: false,
    });
    setEditingArticle(null);
    setShowEditor(false);
  };

  if (isLoading) {
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
              <p className="text-sm text-gray-600">{adminEmail}</p>
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
                          onClick={() => togglePublish(article)}
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
                {editingArticle ? 'Edit Article' : 'Create New Article'}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Nutrition, Wellness"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
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
                  onClick={resetForm}
                  variant="outline"
                >
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

export default AdminDashboard;