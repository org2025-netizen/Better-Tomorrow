import { BookOpen, GraduationCap, Award, Target, Users, Brain, Lightbulb, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const academicAreas = [
  {
    title: 'Early Years Education',
    description: 'Playgroup, PP1, and PP2 programs that build foundational skills through exploration and play-based learning.',
    icon: Heart,
    color: 'bg-pink-500',
  },
  {
    title: 'Lower Primary',
    description: 'Competency-based curriculum developing communication, collaboration, critical thinking, and creativity.',
    icon: BookOpen,
    color: 'bg-blue-500',
  },
  {
    title: 'Competency-Based Education',
    description: 'Focus on 7 core competencies: communication, collaboration, critical thinking, creativity, citizenship, digital literacy, and self-direction.',
    icon: Target,
    color: 'bg-green-500',
  },
  {
    title: 'Daycare',
    description: 'Nurturing care in a safe, stimulating environment for the youngest learners.',
    icon: Users,
    color: 'bg-purple-500',
  },
];

const approach = [
  { icon: Brain, title: 'Learner-Centered', description: 'Every child is unique. Our approach puts learners at the center of the educational experience.' },
  { icon: Lightbulb, title: 'Inquiry-Based', description: 'We encourage curiosity and questioning, helping children discover knowledge through exploration.' },
  { icon: TrendingUp, title: 'Holistic Development', description: 'Academic, social, emotional, and physical development are all equally important.' },
  { icon: Award, title: 'Assessment for Learning', description: 'Continuous assessment helps track progress and tailor instruction to each learner.' },
];

export default function AcademicsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academics</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Quality education rooted in Kenya's Competency-Based Curriculum, nurturing every learner for a better tomorrow.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Academic Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From early years to lower primary, we offer age-appropriate programs designed to nurture every stage of development.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {academicAreas.map((area, i) => (
              <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${area.color} rounded-xl flex items-center justify-center mb-5`}>
                  <area.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Learning Approach</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in nurturing the whole child through modern, evidence-based educational practices.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {approach.map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join BTS?</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Give your child the foundation for a better tomorrow. Enquire about admissions today.
          </p>
          <Link to="/admissions" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Enquire Now
          </Link>
        </div>
      </section>
    </div>
  );
}

function Heart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
