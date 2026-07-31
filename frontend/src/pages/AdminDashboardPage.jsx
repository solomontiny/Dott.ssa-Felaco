import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user, signOut } = useAuth();
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
    language: 'it',
    tags: '',
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
    if (!user) {
      navigate('/admin/login');
      return;
    }

    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchArticles(), fetchMetrics()]);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        handleLogout();
      }
    };

    initializeDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchArticles = async () => {
    try {
      const data = await list({ limit: 100, language: 'it', published_only: false });
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
    } finally {
      navigate('/admin/login');
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
      const publicUrl = getPublicUrl(bucket, path).publicUrl;
      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Impossibile caricare l'immagine. Riprova più tardi.');
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

    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      setErrorMessage('Titolo, estratto e contenuto sono obbligatori.');
      return;
    }

    const articleData = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
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
      setErrorMessage('Salvataggio dell'articolo non riuscito. Controlla i dati e riprova.');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      language: article.language || 'it',
      tags: article.tags?.join(', ') || '',
      image_url: article.image_url || '',
      published: article.published,
    });
    setShowPreview(false);
    setShowEditor(true);
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo articolo?')) return;

    try {
      await remove(articleId);
      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      setErrorMessage('Eliminazione articolo non riuscita.');
    }
  };

  const togglePublish = async (article) => {
    try {
      await update(article.id, { published: !article.published });
      await fetchArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      setErrorMessage('Impossibile aggiornare lo stato di pubblicazione.');
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
    setShowPreview(false);
    setErrorMessage('');
    setUploadProgress(0);
    setDragActive(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
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
                <h2 className="text-2xl font-bold text-gray-900">Articoli</h2>
                <p className="text-gray-600 mt-1">{articles.length} articoli totali</p>
              </div>
              <Button
                data-testid="create-article-btn"
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Crea nuovo articolo</span>
              </Button>
            </div>

            <div className="grid gap-4 mb-8 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500">Articoli</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{articles.length}</p>
                <p className="mt-2 text-sm text-gray-600">Articoli pubblicati e bozze</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500">Appuntamenti</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{appointmentsCount}</p>
                <p className="mt-2 text-sm text-gray-600">Richieste di appuntamento ricevute</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-wide text-gray-500">Consultazioni</p>
                <p className="mt-4 text-3xl font-semibold text-gray-900">{consultationsCount}</p>
                <p className="mt-2 text-sm text-gray-600">Richieste di consulenza</p>
              </div>
            </div>

            <div className="grid gap-4">
              {articles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nessun articolo presente. Crea il primo articolo!</p>
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
                            {article.published ? 'Pubblicato' : 'Bozza'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Categoria: {article.category}</span>
                          <span>•</span>
                          <span>{article.language?.toUpperCase() || 'IT'}</span>
                          <span>•</span>
                          <span>{new Date(article.created_at).toLocaleDateString('it-IT')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => togglePublish(article)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={article.published ? 'Rimuovi pubblicazione' : 'Pubblica'}
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
                {editingArticle ? 'Modifica articolo' : 'Crea nuovo articolo'}
              </h2>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Annulla</span>
              </Button>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titolo dell'articolo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estratto *</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve riassunto dell'articolo"
                  rows={3}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Contenuto *</label>
                  <button
                    type="button"
                    onClick={() => setShowPreview((prev) => !prev)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showPreview ? 'Modifica' : 'Anteprima'}
                  </button>
                </div>

                {showPreview ? (
                  <div className="prose max-w-full rounded-xl border border-gray-200 bg-slate-50 p-5 text-slate-900">
                    <ReactMarkdown>{formData.content || 'Usa il campo di modifica per inserire contenuti in Markdown.'}</ReactMarkdown>
                  </div>
                ) : (
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Scrivi il contenuto dell'articolo qui..."
                    rows={12}
                    required
                  />
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="E.g. Nutrizione, Benessere"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lingua</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="it">Italiano</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tag (separati da virgola)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="salute, nutrizione, consigli"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Immagine in evidenza</label>
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
                      Trascina un'immagine qui, oppure selezionala manualmente.
                    </p>
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                      <span>{uploadingImage ? 'Caricamento...' : 'Carica immagine'}</span>
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
                      alt="Anteprima immagine"
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <span className="text-sm text-gray-600">Anteprima immagine caricata</span>
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
                  Pubblica immediatamente
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingArticle ? 'Aggiorna articolo' : 'Crea articolo'}</span>
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Annulla
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
