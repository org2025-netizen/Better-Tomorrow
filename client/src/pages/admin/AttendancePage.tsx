import { useState, useEffect } from 'react';
import { Calendar, Check, X } from 'lucide-react';
import { attendanceApi } from '@/api/attendance.api';
import { classesApi } from '@/api/classes.api';
import { studentsApi } from '@/api/students.api';
import { Class, Student } from '@/types';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { classesApi.getAll({ limit: 100 }).then((res) => setClasses(res.data || [])); }, []);

  useEffect(() => {
    if (selectedClass) {
      studentsApi.getByClass(selectedClass).then((res) => {
        setStudents(Array.isArray(res) ? res : []);
        const initial: Record<string, string> = {};
        (Array.isArray(res) ? res : []).forEach((s: Student) => { initial[s.id] = 'present'; });
        setAttendance(initial);
      });
    }
  }, [selectedClass]);

  const handleSave = async () => {
    if (!selectedClass) { toast.error('Select a class'); return; }
    setLoading(true);
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }));
      await attendanceApi.record({ classId: selectedClass, date, records });
      toast.success('Attendance recorded');
    } catch (err) { toast.error('Failed to save'); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
      <Card>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Select label="Class" options={classes.map(c => ({ value: c.id, label: c.name }))} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} placeholder="Select class" />
          <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex items-end"><Button onClick={handleSave} loading={loading}>Save Attendance</Button></div>
        </div>
        {students.length > 0 ? (
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">{student.firstName?.[0]}{student.lastName?.[0]}</div>
                  <span className="font-medium text-sm">{student.firstName} {student.lastName}</span>
                </div>
                <div className="flex gap-2">
                  {['present', 'absent', 'late', 'excused'].map((status) => (
                    <button key={status} onClick={() => setAttendance(prev => ({ ...prev, [student.id]: status }))}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${attendance[student.id] === status ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : selectedClass ? (
          <p className="text-center text-gray-500 py-8">No students in this class</p>
        ) : (
          <p className="text-center text-gray-500 py-8">Select a class to record attendance</p>
        )}
      </Card>
    </div>
  );
}
