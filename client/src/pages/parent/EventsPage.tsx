import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventsApi } from '@/api/events.api';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function ParentEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.getAll({ limit: 20 }).then((res) => setEvents(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading events..." />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Events</h1>
      {events.length === 0 ? (
        <Card><p className="text-center text-gray-500 py-8">No upcoming events.</p></Card>
      ) : (
        <div className="space-y-4">
          {events.map((event: any) => {
            const eventDate = event.date || event.startDate || '';
            return (
              <Card key={event.id}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <Badge variant="accent" size="sm">{event.category || 'general'}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {eventDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {(() => { try { return format(new Date(eventDate), 'MMM dd, yyyy'); } catch { return eventDate; } })()}
                        </span>
                      )}
                      {event.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(() => { try { return format(new Date(event.startTime), 'HH:mm'); } catch { return event.startTime; } })()}
                        </span>
                      )}
                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
