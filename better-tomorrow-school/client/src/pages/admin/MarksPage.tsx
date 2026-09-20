import { useState, useEffect } from 'react';
import { marksApi } from '@/api/marks.api';
import { examsApi } from '@/api/exams.api';
import { studentsApi } from '@/api/students.api';
import { Exam, Student } from '@/types';
import Card from '@/components/common/Card';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

export default function MarksPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { examsApi.getAll({ limit: 100 }).then((res) => setExams(res.data || [])); }, []);

  useEffect(() => {
    if (selectedExam) {
      const exam = exams.find(e => e.id === selectedExam);
      if (exam?.classId) {
        studentsApi.getByClass(exam.classId).then((res) => {
          setStudents(Array.isArray(res) ? res : []);
          const initial: Record<string, number> = {};
          (Array.isArray(res) ? res : []).forEach((s: Student) => { initial[s.id] = 0; });
          setMarks(initial);
        });
      }
    }
  }, [selectedExam, exams]);

  const handleSave = async () => {
    if (!selectedExam) { toast.error('Select an exam'); return; }
    setLoading(true);
    try {
      const marksList = Object.entries(marks).map(([studentId, marksObtained]) => ({ studentId, marksObtained }));
      await marksApi.enterMarks({ examId: selectedExam, marks: marksList });
      toast.success('Marks saved');
    } catch (err) { toast.error('Failed to save'); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
      <Card>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Select label="Exam" options={exams.map(e => ({ value: e.id, label: e.name }))} value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} placeholder="Select exam" />
          <div className="flex items-end"><Button onClick={handleSave} loading={loading}>Save Marks</Button></div>
        </div>
        {students.length > 0 ? (
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">{student.firstName?.[0]}{student.lastName?.[0]}</div>
                  <span className="font-medium text-sm">{student.firstName} {student.lastName}</span>
                </div>
                <Input type="number" value={marks[student.id] || 0} onChange={(e) => setMarks(prev => ({ ...prev, [student.id]: Number(e.target.value) }))} className="w-24" />
              </div>
            ))}
          </div>
        ) : selectedExam ? <p className="text-center text-gray-500 py-8">No students found for this exam's class</p> : <p className="text-center text-gray-500 py-8">Select an exam to enter marks</p>}
      </Card>
    </div>
  );
}
