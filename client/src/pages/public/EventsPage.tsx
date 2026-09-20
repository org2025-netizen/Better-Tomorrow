import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventsApi } from '@/api/events.api';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params: any = { limit: 50 };
        if (filter !== 'all') params.category = filter;
        const res = await eventsApi.getAll(params);
        setEvents(res.data || []);
      } catch (err) { setEvents([]); }
      setLoading(false);
    };
    fetchEvents();
  }, [filter]);

  const categories = ['all', 'academic', 'cultural', 'sports', 'social', 'holiday'];

  const getEventDate = (event: any) => event.date || event.startDate || '';
  const getEventTime = (event: any) => event.startTime || '';

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Stay updated with our latest events, activities, and celebrations.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat === 'all' ? 'All Events' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          {loading ? (
            <LoadingSpinner text="Loading events..." />
          ) : events.length === 0 ? (
            <EmptyState title="No events found" description="Check back later for upcoming events." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: any) => {
                const eventDate = getEventDate(event);
                return (
                  <div key={event.id} className="card overflow-hidden hover:shadow-xl transition-all">
                    {event.image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <Badge variant={event.category === 'academic' ? 'primary' : event.category === 'sports' ? 'success' : 'accent'} size="sm">{event.category || 'general'}</Badge>
                      <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        {eventDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {(() => { try { return format(new Date(eventDate), 'MMM dd, yyyy'); } catch { return eventDate; } })()}
                          </div>
                        )}
                        {getEventTime(event) && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {(() => { try { return format(new Date(getEventTime(event)), 'HH:mm'); } catch { return getEventTime(event); } })()}
                          </div>
                        )}
                        {event.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
