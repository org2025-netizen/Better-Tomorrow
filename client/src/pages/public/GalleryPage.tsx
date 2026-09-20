import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryApi } from '@/api/gallery.api';
import { GalleryItem } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [category, setCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    galleryApi.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const params: any = { limit: 50 };
        if (category !== 'all') params.category = category;
        const res = await galleryApi.getPublic(params);
        setItems(res.data);
      } catch (err) { /* empty */ }
      setLoading(false);
    };
    setLoading(true);
    fetch();
  }, [category]);

  const allCategories = ['all', ...categories];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Explore moments captured at Better Tomorrow School.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 mb-8">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          {loading ? (
            <LoadingSpinner text="Loading gallery..." />
          ) : items.length === 0 ? (
            <EmptyState title="No photos found" description="Check back later for new photos." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative" onClick={() => setSelectedImage(item)}>
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-4">
                    <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
          <img src={selectedImage.imageUrl} alt={selectedImage.title} className="max-w-4xl max-h-[80vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-8 text-center text-white">
            <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
            {selectedImage.description && <p className="text-sm text-white/70 mt-1">{selectedImage.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
