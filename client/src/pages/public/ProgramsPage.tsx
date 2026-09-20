import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Users, BookOpen, Award, ArrowRight, Target, Clock, Star } from 'lucide-react';

const programs = [
  { name: 'Playgroup', ages: '1-2 years', description: 'A gentle introduction to structured learning through play-based exploration. Our playgroup program focuses on sensory development, basic motor skills, and social interaction in a warm, nurturing environment.', features: ['Sensory play activities', 'Basic motor skill development', 'Social interaction skills', 'Safe and stimulating environment', 'Qualified caregivers'], icon: Heart, color: 'bg-pink-500' },
  { name: 'Pre-Primary 1 (PP1)', ages: '3-4 years', description: 'Building foundational skills in literacy, numeracy, and social development. Children begin to explore language, numbers, and creative expression through engaging activities.', features: ['Early literacy skills', 'Number concepts', 'Creative arts introduction', 'Physical development', 'Character building'], icon: Star, color: 'bg-yellow-500' },
  { name: 'Pre-Primary 2 (PP2)', ages: '4-5 years', description: 'Advanced pre-primary curriculum preparing children for primary school transition. Focus on reading readiness, mathematical concepts, and independence.', features: ['Reading readiness', 'Mathematical foundations', 'Science exploration', 'Independence skills', 'School readiness program'], icon: BookOpen, color: 'bg-blue-500' },
  { name: 'Lower Primary', ages: '5-7 years', description: 'Competency-based education aligned with the new CBE curriculum. Developing communication, collaboration, critical thinking, and creativity.', features: ['CBE curriculum implementation', 'Core competency development', 'Project-based learning', 'Digital literacy', 'Assessment for learning'], icon: GraduationCap, color: 'bg-green-500' },
  { name: 'Competency-Based Education', ages: 'All levels', description: 'Our CBE pathway focuses on developing 7 core competencies: communication, collaboration, critical thinking, creativity, citizenship, digital literacy, and self-direction.', features: ['7 core competencies', 'Learner-centered approach', 'Performance tasks', 'Holistic assessment', 'Life skills integration'], icon: Target, color: 'bg-purple-500' },
  { name: 'Daycare', ages: '6 months-2 years', description: 'Nurturing care in a safe, stimulating environment for working parents. Our daycare provides a home-away-from-home with trained caregivers and age-appropriate activities.', features: ['Trained caregivers', 'Safe environment', 'Age-appropriate activities', 'Nutritious meals', 'Flexible hours'], icon: Shield, color: 'bg-indigo-500' },
];

export default function ProgramsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Age-appropriate programs designed to nurture every stage of your child's development.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="space-y-16">
            {programs.map((program, i) => (
              <div key={i} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                  <div className={`w-16 h-16 ${program.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <program.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{program.name}</h2>
                  <p className="text-accent font-semibold mb-4">{program.ages}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{program.description}</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12 text-center">
                    <program.icon className="w-20 h-20 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-primary">{program.name}</h3>
                    <p className="text-primary/60 mt-2">{program.ages}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enroll Your Child?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">Give your child the best foundation for a brighter tomorrow.</p>
          <Link to="/admissions" className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent-400 transition-all">
            Apply Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
