import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    studentId: z.string().min(1, 'Student ID is required'),
    email: z
      .string()
      .email('Enter a valid university email')
      .refine((val) => val.endsWith('.edu') || val.includes('university'), {
        message: 'Use your official university email',
      }),
    phoneNumber: z.string().min(7, 'Enter a valid phone number'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
      errorMap: () => ({ message: 'Select a gender' }),
    }),
    department: z.string().min(1, 'Department is required'),
    academicYear: z.string().min(1, 'Academic year is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;