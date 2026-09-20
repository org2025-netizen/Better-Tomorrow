import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { admissionEnquirySchema, schoolVisitSchema } from '@/utils/validation';
import { admissionsApi } from '@/api/admissions.api';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { schoolConfig } from '@/config/schoolConfig';
import toast from 'react-hot-toast';

export default function AdmissionsPage() {
  const [activeTab, setActiveTab] = useState<'enquiry' | 'visit'>('enquiry');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  const enquiryForm = useForm({ resolver: zodResolver(admissionEnquirySchema) });
  const visitForm = useForm({ resolver: zodResolver(schoolVisitSchema) });

  const onEnquirySubmit = async (data: any) => {
    try {
      await admissionsApi.submitEnquiry(data);
      setEnquirySubmitted(true);
      toast.success('Enquiry submitted successfully!');
    } catch (err) { toast.error('Failed to submit enquiry'); }
  };

  const onVisitSubmit = async (data: any) => {
    try {
      await admissionsApi.bookVisit(data);
      setVisitSubmitted(true);
      toast.success('School visit booked successfully!');
    } catch (err) { toast.error('Failed to book visit'); }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admissions</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Begin your child's journey to a better tomorrow. Apply now or schedule a visit.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button onClick={() => setActiveTab('enquiry')} className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'enquiry' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Admission Enquiry
              </button>
              <button onClick={() => setActiveTab('visit')} className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'visit' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Book School Visit
              </button>
            </div>

            {/* Enquiry Form */}
            {activeTab === 'enquiry' && (
              enquirySubmitted ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Submitted!</h2>
                  <p className="text-gray-600">Thank you for your interest. Our admissions team will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={enquiryForm.handleSubmit(onEnquirySubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Child's Full Name" {...enquiryForm.register('childName')} error={enquiryForm.formState.errors.childName?.message} required />
                    <Input label="Child's Date of Birth" type="date" {...enquiryForm.register('childDob')} error={enquiryForm.formState.errors.childDob?.message} required />
                    <Select label="Gender" options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} {...enquiryForm.register('gender')} error={enquiryForm.formState.errors.gender?.message} placeholder="Select gender" required />
                    <Select label="Class Applying For" options={[{ value: 'daycare', label: 'Daycare' }, { value: 'playgroup', label: 'Playgroup' }, { value: 'pp1', label: 'PP1' }, { value: 'pp2', label: 'PP2' }, { value: 'lower-primary', label: 'Lower Primary' }, { value: 'cbe', label: 'CBE' }]} {...enquiryForm.register('classApplyingFor')} error={enquiryForm.formState.errors.classApplyingFor?.message} placeholder="Select class" required />
                    <Input label="Parent/Guardian Name" {...enquiryForm.register('parentName')} error={enquiryForm.formState.errors.parentName?.message} required />
                    <Input label="Phone Number" {...enquiryForm.register('parentPhone')} error={enquiryForm.formState.errors.parentPhone?.message} required />
                    <Input label="Email" type="email" {...enquiryForm.register('parentEmail')} error={enquiryForm.formState.errors.parentEmail?.message} required />
                    <Input label="Current School (if any)" {...enquiryForm.register('currentSchool')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                    <textarea {...enquiryForm.register('message')} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Any specific questions or requirements..." />
                  </div>
                  <Button type="submit" loading={enquiryForm.formState.isSubmitting} className="w-full">Submit Enquiry</Button>
                </form>
              )
            )}

            {/* Visit Form */}
            {activeTab === 'visit' && (
              visitSubmitted ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit Booked!</h2>
                  <p className="text-gray-600">We look forward to welcoming you. Our team will confirm your visit shortly.</p>
                </div>
              ) : (
                <form onSubmit={visitForm.handleSubmit(onVisitSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Your Name" {...visitForm.register('parentName')} error={visitForm.formState.errors.parentName?.message} required />
                    <Input label="Phone Number" {...visitForm.register('parentPhone')} error={visitForm.formState.errors.parentPhone?.message} required />
                    <Input label="Email" type="email" {...visitForm.register('parentEmail')} error={visitForm.formState.errors.parentEmail?.message} required />
                    <Input label="Preferred Date" type="date" {...visitForm.register('visitDate')} error={visitForm.formState.errors.visitDate?.message} required />
                    <Input label="Preferred Time" type="time" {...visitForm.register('visitTime')} error={visitForm.formState.errors.visitTime?.message} required />
                    <Input label="Number of Children" type="number" {...visitForm.register('numberOfChildren', { valueAsNumber: true })} error={visitForm.formState.errors.numberOfChildren?.message} required />
                    <div className="md:col-span-2">
                      <Input label="Children's Ages" {...visitForm.register('childrenAges')} error={visitForm.formState.errors.childrenAges?.message} placeholder="e.g., 3 and 5" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea {...visitForm.register('notes')} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Any special requirements..." />
                  </div>
                  <Button type="submit" loading={visitForm.formState.isSubmitting} className="w-full">Book School Visit</Button>
                </form>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
