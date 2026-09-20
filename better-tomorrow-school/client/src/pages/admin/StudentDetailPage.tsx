import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { studentsApi } from '@/api/students.api';
import { Student } from '@/types';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) studentsApi.getById(id).then(setStudent).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading student..." />;
  if (!student) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Student not found</h2></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/students" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">{student.firstName?.[0]}{student.lastName?.[0]}</div>
            <h2 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
            <p className="text-sm text-gray-500">{student.admissionNumber}</p>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant={student.gender === 'male' ? 'info' : 'secondary'}>{student.gender}</Badge>
              <Badge variant={student.isActive ? 'success' : 'danger'}>{student.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{student.firstName} {student.middleName || ''} {student.lastName}</p></div>
            <div><p className="text-sm text-gray-500">Admission Number</p><p className="font-medium">{student.admissionNumber}</p></div>
            <div><p className="text-sm text-gray-500">Date of Birth</p><p className="font-medium">{format(new Date(student.dateOfBirth), 'MMMM dd, yyyy')}</p></div>
            <div><p className="text-sm text-gray-500">Gender</p><p className="font-medium capitalize">{student.gender}</p></div>
            <div><p className="text-sm text-gray-500">Class</p><p className="font-medium">{student.className?.name || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Enrollment Date</p><p className="font-medium">{format(new Date(student.enrollmentDate), 'MMMM dd, yyyy')}</p></div>
            {student.address && <div className="md:col-span-2"><p className="text-sm text-gray-500">Address</p><p className="font-medium">{student.address}</p></div>}
            {student.medicalInfo && <div className="md:col-span-2"><p className="text-sm text-gray-500">Medical Info</p><p className="font-medium">{student.medicalInfo}</p></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
