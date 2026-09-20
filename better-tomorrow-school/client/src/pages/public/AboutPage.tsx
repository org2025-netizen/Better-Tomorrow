import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Users, BookOpen, Award, ArrowRight, Target, Lightbulb } from 'lucide-react';
import { schoolConfig } from '@/config/schoolConfig';

const values = [
  { icon: Heart, title: 'Compassion', description: 'We nurture every child with love and care in a supportive environment.' },
  { icon: Shield, title: 'Safety', description: 'A secure campus with CCTV monitoring and trained staff for child protection.' },
  { icon: BookOpen, title: 'Excellence', description: 'High academic standards through dedicated teachers and proven methods.' },
  { icon: Users, title: 'Community', description: 'Building strong relationships between parents, teachers, and students.' },
  { icon: Target, title: 'Integrity', description: 'Teaching honesty, responsibility, and strong moral values.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Embracing modern teaching methods and technology in education.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Better Tomorrow School</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Incubating Learners for a Better Tomorrow - Our story, mission, and the values that drive us.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-primary-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">To provide quality, holistic education that develops every child intellectually, socially, emotionally, and physically, preparing them to be responsible global citizens who contribute positively to society.</p>
            </div>
            <div className="bg-accent-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">To be the leading early childhood and primary education institution in Kenya, known for producing well-rounded, confident, and competent learners who are equipped for the challenges of the 21st century.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                <div className="w-8 h-0.5 bg-accent" />
                OUR STORY
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Building Tomorrow's Leaders Today</h2>
              <p className="text-gray-600 leading-relaxed">
                Better Tomorrow School was founded with a vision to transform early childhood education in Kenya. Located in the heart of Donholm, Nairobi, we have been serving families with dedication and excellence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our school follows the Competency-Based Education (CBE) curriculum, focusing on developing the whole child through academic learning, creative arts, sports, and character development.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With qualified and caring teachers, modern facilities, and a safe learning environment, we ensure every child at BTS discovers their potential and grows into confident, capable individuals ready for a better tomorrow.
              </p>
            </div>
            <div className="relative">
              <img src={schoolConfig.logoUrl} alt={schoolConfig.name} className="w-full max-w-md mx-auto rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-xl mx-auto">The principles that guide everything we do at Better Tomorrow School.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More About Us?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">Schedule a visit to see our facilities and meet our team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admissions" className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent-400 transition-all">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
