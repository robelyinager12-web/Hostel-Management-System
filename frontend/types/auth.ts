export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  username: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  academicYear: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}