import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { newsApi } from '@/api/news.api';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    newsApi.getBySlug(slug).then(setArticle).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading article..." />;
  if (!article) return <div className="section-padding text-center"><h2 className="text-2xl font-bold">Article not found</h2><Link to="/news" className="text-primary mt-4 inline-block">Back to News</Link></div>;

  const getAuthor = () => {
    if (!article.author) return '';
    if (typeof article.author === 'string') return article.author;
    return article.author.name || '';
  };

  const getPublishedAt = () => article.publishedAt || article.createdAt || '';

  return (
    <div>
      <section className="bg-gray-50 py-12">
        <div className="container-custom max-w-4xl">
          <Link to="/news" className="inline-flex items-center gap-2 text-primary mb-6 hover:text-primary-600">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{(() => { try { return format(new Date(getPublishedAt()), 'MMMM dd, yyyy'); } catch { return ''; } })()}</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" />{getAuthor()}</span>
          </div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {article.featuredImage && <img src={article.featuredImage} alt={article.title} className="w-full rounded-xl mb-8" />}
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </section>
    </div>
  );
}
