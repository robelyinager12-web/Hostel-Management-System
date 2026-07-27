import { prisma } from '../../config/db';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function buildStudentContext(userId: string) {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: { select: { fullName: true } },
      room: true,
      fees: { orderBy: { dueDate: 'desc' }, take: 10 },
    },
  });

  if (!student) {
    return null;
  }

  const complaints = await prisma.complaint.findMany({
    where: { raisedById: userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    fullName: student.user.fullName,
    studentId: student.studentId,
    department: student.department,
    academicYear: student.academicYear,
    room: student.room
      ? {
          roomNumber: student.room.roomNumber,
          block: student.room.block,
          floor: student.room.floor,
          status: student.room.status,
        }
      : null,
    fees: student.fees.map((f) => ({
      semester: f.semester,
      amount: Number(f.amount),
      status: f.status,
      dueDate: f.dueDate.toISOString().split('T')[0],
    })),
    complaints: complaints.map((c) => ({
      title: c.title,
      category: c.category,
      status: c.status,
      createdAt: c.createdAt.toISOString().split('T')[0],
    })),
  };
}

function buildSystemPrompt(context: NonNullable<Awaited<ReturnType<typeof buildStudentContext>>>) {
  return `You are the Heroy Hostel assistant, helping a student named ${context.fullName} (Student ID: ${context.studentId}, ${context.department}, ${context.academicYear}).

You may ONLY discuss this student's own hostel data below. Never discuss other students, staff, or hostel-wide information. If asked about anything outside this data, politely say you can only help with their own room, fees, and complaints, and suggest contacting the hostel office for anything else.

ROOM:
${context.room ? JSON.stringify(context.room) : 'No room assigned yet.'}

FEES (most recent 10):
${context.fees.length ? JSON.stringify(context.fees) : 'No fee records.'}

COMPLAINTS (most recent 10):
${context.complaints.length ? JSON.stringify(context.complaints) : 'No complaints submitted.'}

Answer naturally and concisely, like a helpful hostel staff member would. Use the data above to answer specific questions (e.g. "when is my fee due", "what's my room number", "is my complaint resolved"). Don't make up information not present above.`;
}

export async function chatWithAssistant(userId: string, message: string, history: ChatMessage[] = []) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw { status: 500, message: 'AI assistant is not configured yet' };
  }

  const context = await buildStudentContext(userId);
  if (!context) {
    throw { status: 404, message: 'Student profile not found' };
  }

  const systemPrompt = buildSystemPrompt(context);

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ],
      temperature: 0.4,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error('Groq API error:', errBody);
    throw { status: 502, message: 'The AI assistant is temporarily unavailable' };
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw { status: 502, message: 'The AI assistant returned an empty response' };
  }

  return reply;
}