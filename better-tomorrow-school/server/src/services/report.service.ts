import prisma from '../config/database';

export const getStudentReport = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { class: true, stream: true, parent: true },
  });
  if (!student) throw new Error('Student not found');

  const [attendance, marks, invoices, payments] = await Promise.all([
    prisma.attendance.findMany({ where: { studentId } }),
    prisma.mark.findMany({ where: { studentId }, include: { assessment: { include: { subject: true, exam: true } } } }),
    prisma.invoice.findMany({ where: { studentId }, include: { payments: true } }),
    prisma.payment.findMany({ where: { studentId } }),
  ]);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOwed = invoices.reduce((sum, i) => sum + i.amount, 0);

  return {
    student,
    attendance: {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'PRESENT').length,
      absent: attendance.filter(a => a.status === 'ABSENT').length,
      late: attendance.filter(a => a.status === 'LATE').length,
    },
    marks,
    finances: { totalPaid, totalOwed, balance: totalOwed - totalPaid },
  };
};

export const getClassReport = async (classId: string, termId?: string) => {
  const students = await prisma.student.findMany({
    where: { classId, status: 'ACTIVE' },
    include: { attendance: termId ? { where: { date: { gte: new Date() } } } : true },
  });

  return {
    class: await prisma.class.findUnique({ where: { id: classId } }),
    students: students.map(s => ({
      id: s.id, firstName: s.firstName, lastName: s.lastName,
      admissionNumber: s.admissionNumber,
    })),
    totalStudents: students.length,
  };
};

export const getFinancialReport = async (startDate?: string, endDate?: string) => {
  const dateFilter: any = {};
  if (startDate) dateFilter.gte = new Date(startDate);
  if (endDate) dateFilter.lte = new Date(endDate);
  const where = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

  const [payments, invoices] = await Promise.all([
    prisma.payment.aggregate({ where, _sum: { amount: true }, _count: true }),
    prisma.invoice.aggregate({ where: Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}, _sum: { amount: true }, _count: true }),
  ]);

  return {
    totalPayments: payments._sum.amount || 0,
    paymentCount: payments._count,
    totalInvoiced: invoices._sum.amount || 0,
    invoiceCount: invoices._count,
    outstanding: (invoices._sum.amount || 0) - (payments._sum.amount || 0),
  };
};
