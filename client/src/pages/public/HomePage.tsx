import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Users, BookOpen, Star, Calendar, ChevronRight, ChevronDown, Play, Palette, Music, MapPin, Phone, Mail, Clock, Award, Heart, Shield, Target, Lightbulb, Globe, Sparkles, ChevronUp, Eye, ChevronLeft } from 'lucide-react';
import { schoolConfig } from '@/config/schoolConfig';
import { eventsApi } from '@/api/events.api';
import { newsApi } from '@/api/news.api';
import { announcementsApi } from '@/api/announcements.api';
import { format } from 'date-fns';

const programs = [
  { name: 'Playgroup', ages: '1-2 years', description: 'Gentle introduction to structured learning through play-based exploration', icon: Heart },
  { name: 'PP1', ages: '3-4 years', description: 'Building foundational skills in literacy, numeracy, and social development', icon: Star },
  { name: 'PP2', ages: '4-5 years', description: 'Advanced pre-primary curriculum preparing for primary school transition', icon: BookOpen },
  { name: 'Lower Primary', ages: '5-7 years', description: 'Competency-based education aligned with the new CBE curriculum', icon: GraduationCap },
  { name: 'CBE', ages: 'All ages', description: 'Competency-Based Education pathway for holistic learner development', icon: Target },
  { name: 'Daycare', ages: '6 months-2 years', description: 'Nurturing care in a safe, stimulating environment for working parents', icon: Shield },
];

const activities = [
  { name: 'Swimming', description: 'Professional swimming lessons', icon: '🏊', color: 'bg-blue-500' },
  { name: 'Sports', description: 'Football, basketball, athletics', icon: '⚽', color: 'bg-green-500' },
  { name: 'Creative Arts', description: 'Painting, drawing, sculpture', icon: '🎨', color: 'bg-purple-500' },
  { name: 'Music & Dance', description: 'Instruments, singing, dance', icon: '🎵', color: 'bg-pink-500' },
  { name: 'Educational Trips', description: 'Field trips to expand horizons', icon: '🚌', color: 'bg-yellow-500' },
  { name: 'Mentorship', description: 'Guidance from experienced educators', icon: '🤝', color: 'bg-indigo-500' },
  { name: 'Talent Shows', description: 'Showcase student gifts', icon: '🎭', color: 'bg-red-500' },
  { name: 'Cultural Events', description: 'Celebrating diversity', icon: '🌍', color: 'bg-teal-500' },
  { name: 'Community Service', description: 'Teaching compassion', icon: '❤️', color: 'bg-orange-500' },
];

const testimonials = [
  { name: 'Mrs. Grace Wanjiku', role: 'Parent', text: 'Better Tomorrow School has been a blessing for our family. Our daughter has grown so much in confidence and academics.' },
  { name: 'Mr. James Ochieng', role: 'Parent', text: 'The CBE curriculum implementation here is outstanding. My son loves going to school every day.' },
  { name: 'Mrs. Faith Muthoni', role: 'Parent', text: 'We chose BTS because of their holistic approach to education. Three years later, we know we made the right choice!' },
];

const whyChooseUs = [
  { title: 'Qualified Teachers', description: 'Certified educators passionate about early childhood development', icon: Award },
  { title: 'Safe Environment', description: 'Secure campus with CCTV monitoring and child-friendly infrastructure', icon: Shield },
  { title: 'CBE Curriculum', description: "Fully aligned with Kenya's Competency-Based Education framework", icon: BookOpen },
  { title: 'Holistic Development', description: 'Academic excellence paired with arts, sports, and character building', icon: Heart },
  { title: 'Small Class Sizes', description: 'Personalized attention with manageable student-to-teacher ratios', icon: Users },
  { title: 'Modern Facilities', description: 'Well-equipped classrooms, playground, and learning resources', icon: Lightbulb },
];

const faqs = [
  { question: 'What ages do you accept?', answer: 'We accept children from 6 months (Daycare) up to 7 years (Lower Primary).' },
  { question: 'What is the school fees structure?', answer: 'Fees vary by program level. Contact our admissions office for current rates.' },
  { question: 'Do you follow the CBE curriculum?', answer: "Yes, we fully implement Kenya's Competency-Based Education (CBE) curriculum." },
  { question: 'What activities are offered?', answer: 'Swimming, sports, creative arts, music, trips, mentorship, talent shows, and more.' },
  { question: 'How can I enroll my child?', answer: 'Visit our Admissions page to fill an enquiry form or book a school visit.' },
  { question: 'Is there a school bus service?', answer: 'We are exploring bus services. Currently parents handle transportation.' },
];

function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  useEffect(() => {
    announcementsApi.getPublic({ limit: 3 }).then((res) => { if (res?.data) setAnnouncements(res.data); }).catch(() => {});
  }, []);
  if (announcements.length === 0) return null;
  return (
    <div className="bg-accent text-primary py-2 overflow-hidden">
      <div className="container-custom">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="flex-shrink-0 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">NEW</span>
          <p className="whitespace-nowrap">{announcements[0]?.title} - {announcements[0]?.content?.slice(0, 80)}</p>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-600 to-primary-800 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>
      <div className="container-custom py-20 md:py-28 lg:py-36 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              Admissions Open for 2027
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Incubating Learners for a{' '}
              <span className="text-accent">Better Tomorrow</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl leading-relaxed">
              Where every child discovers their potential in a nurturing environment of excellence, creativity, and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admissions" className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-400 transition-all hover:shadow-lg active:scale-95">
                Apply for Admission
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/about" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all active:scale-95">
                Learn About Us
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div><p className="text-3xl font-bold text-accent">300+</p><p className="text-sm text-white/60">Students</p></div>
              <div className="w-px h-12 bg-white/20" />
              <div><p className="text-3xl font-bold text-accent">10+</p><p className="text-sm text-white/60">Teachers</p></div>
              <div className="w-px h-12 bg-white/20" />
              <div><p className="text-3xl font-bold text-accent">6</p><p className="text-sm text-white/60">Programs</p></div>
            </div>
          </div>
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <img src={schoolConfig.logoUrl} alt={schoolConfig.name} className="w-48 h-48 object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickInfoCards() {
  const cards = [
    { icon: GraduationCap, title: 'Playgroup to Grade 3', desc: 'Ages 6 months to 7 years' },
    { icon: Users, title: '300+ Students', desc: 'Growing community of learners' },
    { icon: Award, title: 'CBE Aligned', desc: 'Competency-based curriculum' },
    { icon: Clock, title: '7:30 AM - 4:30 PM', desc: 'Monday to Friday' },
  ];
  return (
    <section className="-mt-12 relative z-20 px-4">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
              <div className="w-8 h-0.5 bg-accent" />
              ABOUT US
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Nurturing Young Minds for a <span className="text-primary">Brighter Future</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Better Tomorrow School is a premier early childhood and primary education institution located in Donholm, Nairobi. We are committed to providing quality education that develops the whole child.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our approach combines academic excellence with creative arts, sports, and character development, ensuring each child reaches their full potential in a safe and stimulating environment.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Child-Centered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Safe & Secure</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">CBE Curriculum</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Global Standards</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6">
              <div className="text-center"><p className="text-4xl font-bold text-accent">300+</p><p className="text-sm text-white/70 mt-1">Students</p></div>
                <div className="text-center"><p className="text-4xl font-bold text-accent">10+</p><p className="text-sm text-white/70 mt-1">Teachers</p></div>
                <div className="text-center"><p className="text-4xl font-bold text-accent">6</p><p className="text-sm text-white/70 mt-1">Programs</p></div>
                <div className="text-center"><p className="text-4xl font-bold text-accent">9+</p><p className="text-sm text-white/70 mt-1">Activities</p></div>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-xl">
                <p className="text-center text-sm italic">"Incubating Learners for a Better Tomorrow"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4">
            <div className="w-8 h-0.5 bg-accent" />
            WHY BTS
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Better Tomorrow?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseUs.map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4">
            <div className="w-8 h-0.5 bg-accent" />
            OUR PROGRAMS
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Programs We Offer</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">From daycare to lower primary, we offer age-appropriate programs that nurture every stage of your child's development.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, i) => (
            <div key={i} className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl transition-all hover:border-primary/20">
              <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                <program.icon className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{program.name}</h3>
              <p className="text-sm text-accent font-medium mb-3">{program.ages}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/programs" className="inline-flex items-center gap-2 btn-primary">
            View All Programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ActivitiesSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary to-primary-800 text-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-accent font-semibold text-sm mb-4">
            <div className="w-8 h-0.5 bg-accent" />
            BEYOND ACADEMICS
            <div className="w-8 h-0.5 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Activities & Programs</h2>
          <p className="text-white/70 max-w-2xl mx-auto">We believe in developing the whole child through diverse co-curricular activities.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {activities.map((activity, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all text-center">
              <span className="text-4xl mb-3 block">{activity.icon}</span>
              <h3 className="font-semibold mb-1">{activity.name}</h3>
              <p className="text-sm text-white/70">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedEvent() {
  return (
    <section className="section-padding bg-accent/5">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl border border-accent/20 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                <Calendar className="w-4 h-4" />
                Featured Event
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Annual Graduation Ceremony</h2>
              <p className="text-gray-600 mb-6">Join us as we celebrate the achievements of our learners. A joyful occasion marking the completion of another successful academic year.</p>
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> 20 October 2027</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 10:00 AM</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> School Grounds</div>
              </div>
              <Link to="/events" className="inline-flex items-center gap-2 btn-primary">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-md">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">20</h3>
              <p className="text-accent font-semibold">October 2027</p>
              <p className="text-sm text-gray-500 mt-2">Annual Graduation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSection() {
  const [news, setNews] = useState<any[]>([]);
  useEffect(() => { newsApi.getPublic({ limit: 3 }).then((res) => { if (res?.data) setNews(res.data); }).catch(() => {}); }, []);
  if (news.length === 0) return null;
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4"><div className="w-8 h-0.5 bg-accent" />LATEST NEWS</div>
            <h2 className="text-3xl font-bold text-gray-900">News & Announcements</h2>
          </div>
          <Link to="/news" className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-600">View All<ChevronRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link key={item.id} to={`/news/${item.slug}`} className="group card overflow-hidden hover:shadow-xl">
              {item.featuredImage && <div className="aspect-video overflow-hidden"><img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>}
              <div className="p-6">
                <p className="text-xs text-primary font-medium mb-2">{item.publishedAt ? format(new Date(item.publishedAt), 'MMM dd, yyyy') : ''}</p>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4"><div className="w-8 h-0.5 bg-accent" />TESTIMONIALS</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Parents Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-xl shadow-md relative">
              <div className="text-5xl text-accent/20 absolute top-4 right-6">"</div>
              <p className="text-gray-600 leading-relaxed mb-6 relative z-10 italic">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">{t.name[0]}</div>
                <div><p className="font-semibold text-gray-900 text-sm">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4"><div className="w-8 h-0.5 bg-accent" />FAQ</div>
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdmissionsCTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-secondary to-secondary-600 text-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Better Tomorrow?</h2>
        <p className="text-white/80 max-w-xl mx-auto mb-8">Give your child the best foundation for a brighter future. Admissions are now open for the 2027 academic year.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/admissions" className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-accent-400 transition-all active:scale-95">
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
          <a href={`https://wa.me/${schoolConfig.whatsapp}?text=${encodeURIComponent('Hello! I would like to inquire about Better Tomorrow School.')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all active:scale-95">
            WhatsApp Us <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-4"><div className="w-8 h-0.5 bg-accent" />GET IN TOUCH</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4"><div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div><div><p className="font-medium text-gray-900">Location</p><p className="text-sm text-gray-600">{schoolConfig.location}</p><p className="text-xs text-gray-500">{schoolConfig.landmark}</p></div></div>
              {schoolConfig.phone && <div className="flex items-start gap-4"><div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-primary" /></div><div><p className="font-medium text-gray-900">Phone</p><a href={`https://wa.me/${schoolConfig.whatsapp}?text=${encodeURIComponent('Hello! I would like to inquire about Better Tomorrow School.')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">{schoolConfig.phone}</a></div></div>}
              {schoolConfig.email && <div className="flex items-start gap-4"><div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-primary" /></div><div><p className="font-medium text-gray-900">Email</p><p className="text-sm text-gray-600">{schoolConfig.email}</p></div></div>}
              <div className="flex items-start gap-4"><div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-primary" /></div><div><p className="font-medium text-gray-900">School Hours</p><p className="text-sm text-gray-600">Monday - Friday: 7:30 AM - 4:30 PM</p></div></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Map - {schoolConfig.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <AnnouncementBar />
      <HeroSection />
      <QuickInfoCards />
      <AboutSection />
      <WhyChooseUsSection />
      <ProgramsSection />
      <ActivitiesSection />
      <FeaturedEvent />
      <NewsSection />
      <TestimonialsSection />
      <FAQSection />
      <AdmissionsCTA />
      <ContactSection />
    </div>
  );
}
