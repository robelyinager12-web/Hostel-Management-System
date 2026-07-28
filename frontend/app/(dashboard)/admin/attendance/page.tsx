import AttendanceTracker from '@/features/attendance/AttendanceTracker';

export default function AdminAttendancePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">
          Mark and review daily attendance for all students.
        </p>
      </div>
      <AttendanceTracker />
    </div>
  );
}