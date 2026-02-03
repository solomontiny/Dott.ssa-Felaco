import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { blogData } from '../mock/data';

const BlogSection = () => {
  return (
    <section id="articoli" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            {blogData.sectionLabel}
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
            {blogData.mainTitle}
          </h2>
          <Button
            variant="outline"
            className="border-2 border-teal-500 text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-full font-medium inline-flex items-center space-x-2"
          >
            <span>{blogData.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {blogData.posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Categorie</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {blogData.categories.map((category, index) => (
              <button
                key={index}
                className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200"
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