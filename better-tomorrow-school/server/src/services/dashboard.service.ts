import prisma from '../config/database';

export const getDashboardStats = async () => {
  const [totalStudents, totalTeachers, totalParents, totalClasses, activeStudents, recentEnquiries] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.parent.count(),
    prisma.class.count(),
    prisma.student.count({ where: { status: 'ACTIVE' } }),
    prisma.admissionEnquiry.count({ where: { status: 'NEW' } }),
  ]);

  const currentMonth = new Date();
  currentMonth.setDate(1);
  const [monthlyPayments, monthlyEnquiries] = await Promise.all([
    prisma.payment.aggregate({ where: { createdAt: { gte: currentMonth } }, _sum: { amount: true }, _count: true }),
    prisma.admissionEnquiry.count({ where: { createdAt: { gte: currentMonth } } }),
  ]);

  const overdueInvoices = await prisma.invoice.count({ where: { status: 'OVERDUE' } });

  const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });

  const totalPending = await prisma.invoice.aggregate({
    where: { status: { in: ['PENDING', 'OVERDUE'] } },
    _sum: { amount: true },
  });

  const studentDistribution = await prisma.class.findMany({
    select: { name: true, _count: { select: { students: true } } },
    orderBy: { name: 'asc' },
  });

  const recentEnrollments = await prisma.student.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, firstName: true, lastName: true, admissionNumber: true, createdAt: true },
  });

  const recentPayments = await prisma.payment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, amount: true, paymentMethod: true, createdAt: true, receipt: { select: { receiptNumber: true } } },
  });

  const monthlyRevenueData = await prisma.payment.groupBy({
    by: ['createdAt'],
    _sum: { amount: true },
    where: { createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) } },
  });

  const monthlyRevenueMap: Record<string, number> = {};
  monthlyRevenueData.forEach((p) => {
    const month = new Date(p.createdAt).toLocaleString('default', { month: 'short' });
    monthlyRevenueMap[month] = (monthlyRevenueMap[month] || 0) + (p._sum.amount || 0);
  });
  const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, amount]) => ({ month, amount }));

  return {
    totalStudents, totalTeachers, totalParents, totalClasses, activeStudents,
    recentEnquiries, monthlyPayments: monthlyPayments._sum.amount || 0,
    monthlyPaymentCount: monthlyPayments._count, monthlyEnquiries, overdueInvoices,
    totalRevenue: totalRevenue._sum.amount || 0,
    pendingPayments: totalPending._sum.amount || 0,
    attendanceToday: 0,
    recentEnrollments,
    recentPayments: recentPayments.map(p => ({
      ...p,
      receiptNumber: p.receipt?.receiptNumber || '',
    })),
    monthlyRevenue,
    studentDistribution: studentDistribution.map(c => ({ className: c.name, count: c._count.students })),
  };
};

export const getEnrollmentByClass = async () => {
  return prisma.class.findMany({
    select: { id: true, name: true, _count: { select: { students: true } } },
    orderBy: { name: 'asc' },
  });
};

export const getAttendanceChart = async (startDate: string, endDate: string) => {
  const attendance = await prisma.attendance.groupBy({
    by: ['date', 'status'],
    where: { date: { gte: new Date(startDate), lte: new Date(endDate) } },
    _count: true,
  });
  return attendance;
};

export const getPaymentSummary = async () => {
  const monthlyPayments = await prisma.payment.groupBy({
    by: ['paymentMethod'],
    _sum: { amount: true },
    _count: true,
  });
  return monthlyPayments;
};

export const getRecentActivity = async (limit = 10) => {
  return prisma.auditLog.findMany({
    take: limit,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
};
