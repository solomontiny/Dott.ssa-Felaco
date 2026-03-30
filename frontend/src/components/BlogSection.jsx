import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const STATIC_POSTS = [
  {
    id: 'static-1',
    image: 'https://images.unsplash.com/photo-1566895733044-d2bdda8b6234?w=400&h=300&fit=crop',
    created_at: '2026-01-13T00:00:00',
    title: "Collaborazione per Prevenire e Ridurre l'Obesita Infantile: Un Impegno Collettivo",
    excerpt: "L'obesita infantile e una problematica crescente che puo causare complicazioni di salute a lungo termine. Per prevenirla e ridurla, e essenziale una collaborazione tra famiglie, scuole e professionisti della salute.",
  },
  {
    id: 'static-2',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=300&fit=crop',
    created_at: '2026-01-12T00:00:00',
    title: "Obesita Infantile: Crescita e Influenza della Famiglia",
    excerpt: "L'obesita infantile e un problema di salute globale in forte aumento. Secondo i dati ISTAT 2025, il sovrappeso tra i giovani e in crescita, con abitudini alimentari peggiorate.",
  },
  {
    id: 'static-3',
    image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&h=300&fit=crop',
    created_at: '2023-11-07T00:00:00',
    title: 'Perche non dobbiamo usare eccessivamente gli integratori?',
    excerpt: "Fin dai tempi dei nostri nonni, integratori e medicine di vario tipo erano da evitare. Ad oggi le statistiche indicano un aumento spropositato dell'uso di questi prodotti.",
  },
  {
    id: 'static-4',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    created_at: '2023-11-05T00:00:00',
    title: 'BRODO DI OSSA, un vero super food',
    excerpt: "Il brodo di ossa e un piatto funzionale al benessere globale dell'organismo. Introdotto in modo costante nella propria routine alimentare, puo aiutare a lenire infiammazioni.",
  },
];

const categories = [
  'Composizione corporea',
  'Educazione e risorse',
  'Ricerca e formazione',
  'Ricette',
  'Strumenti',
];

const BlogSection = () => {
  const [posts, setPosts] = useState(STATIC_POSTS);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/articles?published_only=true&limit=4`);
        if (res.data.articles && res.data.articles.length > 0) {
          setPosts(res.data.articles);
        }
      } catch {
        // Keep static posts on error
      }
    };
    fetchArticles();
  }, []);

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
    <section id="articoli" className="py-24 bg-gray-50" data-testid="blog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 font-medium tracking-wider text-sm mb-4">BLOG</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">Ultimi articoli</h2>
          <Button
            variant="outline"
            className="border-2 border-blue-500 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-medium inline-flex items-center space-x-2"
            data-testid="view-all-articles-btn"
          >
            <span>Vedi tutti gli articoli</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {posts.map((post) => (
            <article
              key={post.id}
              data-testid={`blog-card-${post.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image_url || post.image || 'https://images.unsplash.com/photo-1566895733044-d2bdda8b6234?w=400&h=300&fit=crop'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Categorie</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                data-testid={`blog-category-${index}`}
                className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
