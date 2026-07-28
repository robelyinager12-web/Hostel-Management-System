export const ROLES = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  HOSTEL_MANAGER: 'HOSTEL_MANAGER',
  RECEPTIONIST: 'RECEPTIONIST',
  WARDEN: 'WARDEN',
  STUDENT: 'STUDENT',
  SECURITY_GUARD: 'SECURITY_GUARD',
  MAINTENANCE_STAFF: 'MAINTENANCE_STAFF',
  ACCOUNTANT: 'ACCOUNTANT',
  PARENT: 'PARENT',
} as const;

export const ROOM_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  MAINTENANCE: 'Maintenance',
  RESERVED: 'Reserved',
};

export const FEE_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  PARTIAL: 'Partial',
};

export const COMPLAINT_STATUS_LABELS: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
};