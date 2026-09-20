import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const activities = [
  { name: 'Swimming', description: 'Professional swimming lessons in our modern pool. Children learn water safety and build confidence.', icon: '🏊', color: 'bg-blue-500', schedule: 'Tuesdays & Thursdays' },
  { name: 'Sports', description: 'Football, basketball, athletics. Our sports program develops fitness, teamwork, and competitive spirit.', icon: '⚽', color: 'bg-green-500', schedule: 'Wednesdays & Fridays' },
  { name: 'Creative Arts', description: 'Painting, drawing, sculpture, and craftwork. Children express themselves through various art forms.', icon: '🎨', color: 'bg-purple-500', schedule: 'Mondays & Wednesdays' },
  { name: 'Music & Dance', description: 'Instruments, singing, and cultural dance. Nurturing rhythm and appreciation for diverse cultures.', icon: '🎵', color: 'bg-pink-500', schedule: 'Tuesdays & Thursdays' },
  { name: 'Educational Trips', description: 'Field trips to museums, parks, farms, and cultural sites to expand learning horizons.', icon: '🚌', color: 'bg-yellow-500', schedule: 'Monthly' },
  { name: 'Mentorship', description: 'Guidance from experienced educators. Older students mentor younger ones building leadership.', icon: '🤝', color: 'bg-indigo-500', schedule: 'Fridays' },
  { name: 'Talent Shows', description: 'Platforms for students to showcase their gifts. Regular performances build confidence.', icon: '🎭', color: 'bg-red-500', schedule: 'End of Term' },
  { name: 'Cultural Events', description: 'Celebrating diversity through cultural programs. Children learn about different cultures.', icon: '🌍', color: 'bg-teal-500', schedule: 'Quarterly' },
  { name: 'Community Service', description: 'Teaching compassion through community engagement and charitable activities.', icon: '❤️', color: 'bg-orange-500', schedule: 'Monthly' },
];

export default function ActivitiesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Activities & Programs</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Developing the whole child through diverse co-curricular activities.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all">
                <div className={`${activity.color} h-2`} />
                <div className="p-8">
                  <span className="text-4xl mb-4 block">{activity.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
                  <div className="text-xs font-medium text-primary bg-primary-50 px-3 py-1 rounded-full inline-block">{activity.schedule}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Want Your Child to Join?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">Enroll today and give your child access to our comprehensive activity programs.</p>
          <Link to="/admissions" className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent-400 transition-all">
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
