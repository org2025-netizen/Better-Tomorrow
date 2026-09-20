import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { contactSchema } from '@/utils/validation';
import { contactApi } from '@/api/contact.api';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { schoolConfig } from '@/config/schoolConfig';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: any) => {
    try {
      await contactApi.sendMessage(data);
      setSubmitted(true);
      toast.success('Message sent successfully!');
      reset();
    } catch (err) { toast.error('Failed to send message'); }
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-white/70 max-w-2xl mx-auto">We would love to hear from you. Get in touch with us today.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-gray-900">Location</h3><p className="text-gray-600">{schoolConfig.location}</p><p className="text-sm text-gray-500">{schoolConfig.landmark}</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-gray-900">Phone</h3><a href={`https://wa.me/${schoolConfig.whatsapp}?text=${encodeURIComponent('Hello! I would like to inquire about Better Tomorrow School.')}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors">{schoolConfig.phone}</a></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-gray-900">Email</h3><p className="text-gray-600">{schoolConfig.email || 'Coming soon'}</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-gray-900">School Hours</h3><p className="text-gray-600">Monday - Friday: 7:30 AM - 4:30 PM</p><p className="text-sm text-gray-500">Saturday: 8:00 AM - 12:00 PM (Office only)</p></div>
                </div>
              </div>
              <div className="mt-8 bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center text-gray-500"><MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" /><p className="text-sm">Map - {schoolConfig.location}</p></div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="text-center py-16 bg-green-50 rounded-xl">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you. We will get back to you soon.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input label="Your Name" {...register('name')} error={errors.name?.message} required />
                    <Input label="Email" type="email" {...register('email')} error={errors.email?.message} required />
                  </div>
                  <Input label="Phone (optional)" {...register('phone')} error={errors.phone?.message} />
                  <Input label="Subject" {...register('subject')} error={errors.subject?.message} required />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-secondary">*</span></label>
                    <textarea {...register('message')} rows={5} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="How can we help you?" />
                    {errors.message && <p className="mt-1 text-sm text-red-500">{String(errors.message?.message || '')}</p>}
                  </div>
                  <Button type="submit" loading={isSubmitting} icon={<Send className="w-4 h-4" />} className="w-full">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
