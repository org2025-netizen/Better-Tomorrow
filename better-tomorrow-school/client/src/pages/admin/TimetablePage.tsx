import { useState, useEffect } from "react";
import { timetableApi } from "@/api/timetable.api";
import { Timetable } from "@/types";
import Card from "@/components/common/Card";
import Select from "@/components/common/Select";
import { format } from "date-fns";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];

export default function TimetablePage() {
  const [entries, setEntries] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      timetableApi.getByClass(selectedClass).then(setEntries).catch(() => {}).finally(() => setLoading(false));
    }
  }, [selectedClass]);

  const getEntry = (day: string, time: string) => entries.find(e => e.dayOfWeek === day && e.startTime <= time && e.endTime > time);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Timetable</h1>
      <Card>
        <div className="mb-6 max-w-xs">
          <Select label="Select Class" options={[]} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} placeholder="Select a class" />
        </div>
        {selectedClass ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50"><th className="p-3 text-left">Time</th>{days.map(d => <th key={d} className="p-3 text-left">{d}</th>)}</tr></thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-t"><td className="p-3 font-medium">{time}</td>{days.map(d => { const entry = getEntry(d, time); return (<td key={d} className="p-3">{entry ? <div className="bg-primary-50 rounded-lg p-2 text-xs"><p className="font-semibold text-primary">{entry.subject?.name}</p><p className="text-gray-500">{entry.teacher?.firstName}</p></div> : ""}</td>); })}</tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-center text-gray-500 py-8">Select a class to view timetable</p>}
      </Card>
    </div>
  );
}
