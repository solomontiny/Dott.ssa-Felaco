import React, { useState, useEffect } from 'react';
import { useArticles } from '../hooks/useArticles';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ArticlesPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { list } = useArticles();
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch all published articles
        const data = await list({ published_only: true });
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchArticles();
  }, [list]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-gray-900 mb-12 text-center">Articoli</h1>
        
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image_url || 'https://images.unsplash.com/photo-1566895733044-d2bdda8b6234?w=400&h=300&fit=crop'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                  <a href={`#/articles/${post.id}`} className="block mt-4 text-blue-600 font-medium hover:underline">
                    Read more
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
