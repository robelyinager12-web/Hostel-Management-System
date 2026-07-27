import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@heroyhostel.com';
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
const ADMIN_FULL_NAME = process.env.SEED_ADMIN_NAME || 'System Administrator';

async function seedAdmin() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    console.log(`Admin account already exists: ${existing.email} (role: ${existing.role})`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.user.create({
    data: {
      fullName: ADMIN_FULL_NAME,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'ADMINISTRATOR',
      isEmailVerified: true,
    },
  });

  console.log('Admin account created successfully:');
  console.log(`  Username: ${admin.username}`);
  console.log(`  Email:    ${admin.email}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log('  (change this password after first login)');
}

const SAMPLE_ROOMS = [
  { roomNumber: 'A-101', block: 'A', floor: 1, capacity: 4, amenities: ['WiFi', 'Study Desk', 'Locker'] },
  { roomNumber: 'A-102', block: 'A', floor: 1, capacity: 2, amenities: ['WiFi', 'AC', 'Balcony'] },
  { roomNumber: 'A-201', block: 'A', floor: 2, capacity: 4, amenities: ['WiFi', 'Study Desk'] },
  { roomNumber: 'B-101', block: 'B', floor: 1, capacity: 3, amenities: ['WiFi', 'Locker', 'Attached Bathroom'] },
  { roomNumber: 'B-102', block: 'B', floor: 1, capacity: 4, amenities: ['WiFi'] },
  { roomNumber: 'B-201', block: 'B', floor: 2, capacity: 2, amenities: ['WiFi', 'AC'] },
];

async function seedRooms() {
  let createdCount = 0;

  for (const room of SAMPLE_ROOMS) {
    const existing = await prisma.room.findUnique({ where: { roomNumber: room.roomNumber } });
    if (existing) continue;

    await prisma.room.create({ data: room });
    createdCount++;
  }

  console.log(`Created ${createdCount} new room(s) (skipped any that already existed).`);
}

async function assignStudentsToRooms() {
  const unassignedStudents = await prisma.student.findMany({
    where: { roomId: null },
    include: { user: { select: { fullName: true } } },
  });

  if (unassignedStudents.length === 0) {
    console.log('No unassigned students to place into rooms.');
    return;
  }

  const rooms = await prisma.room.findMany({ include: { students: true } });
  let assignedCount = 0;

  for (const student of unassignedStudents) {
    const availableRoom = rooms.find((r) => r.students.length < r.capacity);
    if (!availableRoom) break;

    await prisma.student.update({
      where: { id: student.id },
      data: { roomId: availableRoom.id },
    });

    await prisma.room.update({
      where: { id: availableRoom.id },
      data: {
        status:
          availableRoom.students.length + 1 >= availableRoom.capacity ? 'OCCUPIED' : 'AVAILABLE',
      },
    });

    availableRoom.students.push({} as any); // keep local count in sync for this loop
    assignedCount++;
    console.log(`Assigned ${student.user.fullName} to room ${availableRoom.roomNumber}`);
  }

  console.log(`Assigned ${assignedCount} student(s) to rooms.`);
}

async function seedFees() {
  const students = await prisma.student.findMany();

  if (students.length === 0) {
    console.log('No students found — skipping fee seeding.');
    return;
  }

  let createdCount = 0;

  for (const student of students) {
    const existingFees = await prisma.fee.count({ where: { studentId: student.id } });
    if (existingFees > 0) continue;

    await prisma.fee.create({
      data: {
        studentId: student.id,
        amount: 8500,
        semester: 'Semester 1, 2026',
        dueDate: new Date('2026-09-15'),
        status: 'PENDING',
      },
    });

    await prisma.fee.create({
      data: {
        studentId: student.id,
        amount: 8500,
        semester: 'Semester 2, 2025',
        dueDate: new Date('2026-02-15'),
        status: 'PAID',
        paidDate: new Date('2026-02-10'),
      },
    });

    createdCount += 2;
  }

  console.log(`Created ${createdCount} fee record(s) across ${students.length} student(s).`);
}

async function main() {
  await seedAdmin();
  await seedRooms();
  await assignStudentsToRooms();
  await seedFees();
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });