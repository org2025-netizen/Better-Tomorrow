import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { newsApi } from '@/api/news.api';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import SearchInput from '@/components/common/SearchInput';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsApi.getAll({ limit: 50, search });
        setNews(res.data || []);
      } catch (err) { setNews([]); }
      setLoading(false);
    };
    fetchNews();
  }, [search]);

  const getExcerpt = (item: any) => item.excerpt || item.summary || '';
  const getAuthor = (item: any) => {
    if (!item.author) return '';
    if (typeof item.author === 'string') return item.author;
    return item.author.name || '';
  };
  const getPublishedAt = (item: any) => item.publishedAt || item.createdAt || '';

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Stay informed with the latest news and happenings at Better Tomorrow School.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-md mb-8">
            <SearchInput value={search} onChange={setSearch} placeholder="Search news..." />
          </div>
          {loading ? (
            <LoadingSpinner text="Loading news..." />
          ) : news.length === 0 ? (
            <EmptyState title="No news articles found" description="Check back later for updates." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item: any) => (
                <Link key={item.id} to={`/news/${item.slug}`} className="group card overflow-hidden hover:shadow-xl transition-all">
                  {item.featuredImage && <div className="aspect-video overflow-hidden"><img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{(() => { try { return format(new Date(getPublishedAt(item)), 'MMM dd, yyyy'); } catch { return ''; } })()}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{getAuthor(item)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{getExcerpt(item)}</p>
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
