export interface StudentProfile {
  id: string;
  studentId: string;
  department: string;
  academicYear: string;
  guardianName: string | null;
  guardianPhone: string | null;
  user: {
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string | null;
    gender: string | null;
  };
}