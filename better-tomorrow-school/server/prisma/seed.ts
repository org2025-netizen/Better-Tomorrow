import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const maleNames = ['James','John','Peter','David','Daniel','Samuel','Joseph','Michael','Brian','Kevin','Eric','Martin','Victor','Patrick','Charles','Stephen','Andrew','Nicholas','Anthony','Robert','William','Thomas','Richard','Benjamin','Nathan','Isaac','Elijah','Caleb','Aaron','Moses','Joshua','Adrian','Dennis','Felix','Gilbert','Henry','Ibrahim','Jeffrey','Lawrence','Marcus','Oscar','Raymond','Sean','Trevor','Walter','Zack'];
const femaleNames = ['Grace','Faith','Joyce','Mary','Sarah','Agnes','Jane','Esther','Janet','Rose','Anne','Lilian','Catherine','Diana','Florence','Hannah','Irene','Jennifer','Karen','Lucy','Martha','Nancy','Patricia','Priscilla','Rachel','Rebecca','Ruth','Stella','Susan','Teresa','Victoria','Vivian','Winnie','Zawadi','Amina','Charity','Evelyn','Gladys','Happiness','Judith','Lydia','Mercy','Olivia','Purity','Sandra','Teresia','Wanjiru','Felistas'];
const lastNames = ['Mwangi','Ochieng','Kamau','Otieno','Wanjiku','Kipchoge','Njoroge','Odhiambo','Mutua','Wafula','Kariuki','Onyango','Maina','Omondi','Njenga','Akinyi','Gichuru','Owino','Kimani','Ogutu','Nderitu','Okeyo','Macharia','Simiyu','Wekesa','Njeri','Omollo','Kiprop','Chebet','Lagat','Rono','Korir','Barasa','Wambua','Mukhtar','Abdi','Hassan','Ibrahim','Omar','Ali','Bakari','Juma','Hemedi','Salum','Khamis','Said','Athuman','Ismail','Shariff'];
const teacherFullNames = ['Alice Wambui','Beatrice Achieng','Charles Mutenyo','Diana Nyambura','Emmanuel Kibet','Florence Akinyi','George Njau','Helen Wangari','Isaac Odhiambo','Juliet Muthoni','Kennedy Ouma','Lilian Chebet','Michael Kirui','Nancy Auma','Oscar Ochieng','Patricia Nekesa','Quinton Maina','Rose Adhiambo','Samuel Kipkorir','Teresa Wairimu','Victor Simiyu','Winnie Naledi'];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

async function main() {
  console.log('Starting database seed...\n');
  console.log('Cleaning existing data...');
  await prisma.mark.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.reportCardSubject.deleteMany();
  await prisma.reportCard.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.studentSubject.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.class.deleteMany();
  await prisma.stream.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.term.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.event.deleteMany();
  await prisma.newsPost.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.document.deleteMany();
  await prisma.admissionEnquiry.deleteMany();
  await prisma.schoolVisit.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.schoolSetting.deleteMany();
  await prisma.user.deleteMany();
  console.log('Data cleaned\n');

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const adminUser = await prisma.user.create({
    data: { email: 'admin@bts.ac.ke', password: adminPassword, name: 'System Administrator', phone: '+254725839099', role: 'SUPER_ADMIN', isActive: true },
  });
  console.log('Admin: admin@bts.ac.ke / Admin@123');

  const academicYear = await prisma.academicYear.create({ data: { name: '2026', startDate: new Date('2026-01-05'), endDate: new Date('2026-12-18'), isCurrent: true } });
  const term1 = await prisma.term.create({ data: { name: 'Term 1', academicYearId: academicYear.id, startDate: new Date('2026-01-05'), endDate: new Date('2026-04-01'), isCurrent: true } });
  await prisma.term.create({ data: { name: 'Term 2', academicYearId: academicYear.id, startDate: new Date('2026-04-20'), endDate: new Date('2026-08-07'), isCurrent: false } });
  await prisma.term.create({ data: { name: 'Term 3', academicYearId: academicYear.id, startDate: new Date('2026-08-31'), endDate: new Date('2026-12-18'), isCurrent: false } });
  console.log('Academic year and terms created');

  const playgroup = await prisma.class.create({ data: { name: 'Playgroup', description: 'Ages 2-3', capacity: 60 } });
  const pp1 = await prisma.class.create({ data: { name: 'PP1', description: 'Pre-Primary 1', capacity: 60 } });
  const pp2 = await prisma.class.create({ data: { name: 'PP2', description: 'Pre-Primary 2', capacity: 60 } });
  const lp1 = await prisma.class.create({ data: { name: 'Lower Primary 1', description: 'Grade 1', capacity: 60 } });
  const lp2 = await prisma.class.create({ data: { name: 'Lower Primary 2', description: 'Grade 2', capacity: 60 } });
  const lp3 = await prisma.class.create({ data: { name: 'Lower Primary 3', description: 'Grade 3', capacity: 60 } });
  const allClasses = [playgroup, pp1, pp2, lp1, lp2, lp3];
  console.log('6 classes created');

  const subjects: any[] = [];
  const subDefs: [string, string][] = [['Mathematics','MATH'],['English','ENG'],['Kiswahili','KIS'],['Science','SCI'],['Social Studies','SST'],['Creative Arts','ART'],['Music','MUS'],['Physical Education','PE'],['Religious Education','RE'],['Life Skills','LS']];
  for (const [n, c] of subDefs) { subjects.push(await prisma.subject.create({ data: { name: n, code: c, description: n } })); }
  console.log('10 subjects created');

  console.log('Creating 22 teachers...');
  const teacherPassword = await bcrypt.hash('Teacher@123', 12);
  const teachers: any[] = [];
  const usedTeacherEmails = new Set<string>();
  for (let i = 0; i < teacherFullNames.length; i++) {
    const fullName = teacherFullNames[i];
    const email = `teacher${i + 1}@bts.ac.ke`;
    if (usedTeacherEmails.has(email)) continue;
    usedTeacherEmails.add(email);
    const tUser = await prisma.user.create({
      data: { email, password: teacherPassword, name: fullName, phone: `+2547${String(10000000 + i).slice(0, 8)}`, role: 'TEACHER', isActive: true },
    });
    const teacher = await prisma.teacher.create({
      data: { userId: tUser.id, employeeNumber: `TCH${String(i + 1).padStart(3, '0')}`, name: fullName, phone: `+2547${String(10000000 + i).slice(0, 8)}`, email, qualification: 'Bachelor of Education', specialization: pick(['Early Childhood', 'Primary Education', 'Creative Arts', 'Science', 'Mathematics']), hireDate: new Date(2020 + Math.floor(i / 4), (i % 12), 1), status: 'ACTIVE' },
    });
    teachers.push(teacher);
    const assignedSubjects = [subjects[i % subjects.length], subjects[(i + 3) % subjects.length]];
    for (const sub of assignedSubjects) {
      const cls = allClasses[i % allClasses.length];
      try {
        await prisma.teacherSubject.create({ data: { teacherId: teacher.id, subjectId: sub.id, classId: cls.id, academicYearId: academicYear.id, termId: term1.id } });
      } catch {}
    }
  }
  console.log(`${teachers.length} teachers created`);

  console.log('Creating 20 parents...');
  const parentPassword = await bcrypt.hash('Parent@123', 12);
  const parents: any[] = [];
  for (let i = 0; i < 20; i++) {
    const gender = i % 2 === 0 ? 'male' : 'female';
    const firstName = pick(gender === 'male' ? maleNames : femaleNames);
    const lastName = pick(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `parent${i + 1}@example.com`;
    const pUser = await prisma.user.create({
      data: { email, password: parentPassword, name: fullName, phone: `+2547${String(20000000 + i).slice(0, 8)}`, role: 'PARENT', isActive: true },
    });
    const parent = await prisma.parent.create({
      data: { userId: pUser.id, name: fullName, phone: `+2547${String(20000000 + i).slice(0, 8)}`, email, relationship: pick(['Father', 'Mother', 'Guardian']), address: `Donholm, Nairobi` },
    });
    parents.push(parent);
  }
  console.log('20 parents created');

  console.log('Creating 310 students...');
  const studentsPerClass = [35, 55, 55, 55, 55, 55];
  const allStudents: any[] = [];
  let studentCount = 0;
  for (let ci = 0; ci < allClasses.length; ci++) {
    const cls = allClasses[ci];
    const count = studentsPerClass[ci];
    for (let s = 0; s < count; s++) {
      studentCount++;
      const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
      const firstName = pick(gender === 'MALE' ? maleNames : femaleNames);
      const lastName = pick(lastNames);
      const parent = pick(parents);
      const birthYear = 2019 + ci;
      const birthMonth = Math.floor(Math.random() * 12);
      const birthDay = Math.floor(Math.random() * 28) + 1;
      const student = await prisma.student.create({
        data: {
          admissionNumber: `BTS/2026/${String(studentCount).padStart(3, '0')}`,
          firstName,
          lastName,
          dateOfBirth: new Date(birthYear, birthMonth, birthDay),
          gender,
          classId: cls.id,
          parentId: parent.id,
          admissionDate: new Date('2026-01-05'),
          status: 'ACTIVE',
        },
      });
      allStudents.push(student);
    }
  }
  console.log(`${allStudents.length} students created\n`);

  console.log('Creating fee records...');
  const feeAmounts: Record<string, number> = { 'Playgroup': 35000, 'PP1': 40000, 'PP2': 45000, 'Lower Primary 1': 50000, 'Lower Primary 2': 55000, 'Lower Primary 3': 60000 };
  for (const cls of allClasses) {
    const fee = feeAmounts[cls.name] || 40000;
    await prisma.feeStructure.create({ data: { name: 'Term 1 Fees', classId: cls.id, academicYearId: academicYear.id, termId: term1.id, amount: fee, description: 'Term 1 school fees' } });
  }
  for (const student of allStudents) {
    if (!student.classId) continue;
    const feeStructure = await prisma.feeStructure.findFirst({ where: { classId: student.classId } });
    if (!feeStructure) continue;
    const feeConfig = allClasses.find(c => c.id === student.classId);
    const amount = feeAmounts[feeConfig?.name || ''] || 40000;
    const invoice = await prisma.invoice.create({ data: { studentId: student.id, feeStructureId: feeStructure.id, amount, dueDate: new Date('2026-02-28'), status: pick(['PARTIAL', 'PAID', 'PENDING'] as any) } });
    if (Math.random() > 0.4) {
      const payment = await prisma.payment.create({ data: { invoiceId: invoice.id, studentId: student.id, amount: Math.floor(amount * (0.3 + Math.random() * 0.7)), paymentMethod: pick(['M_PESA', 'CASH', 'BANK'] as any), referenceNumber: `MP${Date.now()}${studentCount}${Math.floor(Math.random() * 99999)}`, recordedBy: adminUser.id } });
      await prisma.receipt.create({ data: { paymentId: payment.id, receiptNumber: `BTS-REC-${Date.now()}-${studentCount}-${Math.floor(Math.random() * 99999)}`, studentId: student.id, amount: payment.amount, paymentMethod: payment.paymentMethod, description: 'Term 1 Fees Payment', issuedBy: adminUser.id } });
    }
  }
  console.log('Fee records created\n');

  console.log('Creating attendance records...');
  const attDates = ['2026-01-06','2026-01-07','2026-01-08'];
  const attData: any[] = [];
  for (const student of allStudents) {
    for (const d of attDates) {
      attData.push({ studentId: student.id, date: new Date(d), status: Math.random() > 0.15 ? 'PRESENT' : 'ABSENT', recordedBy: adminUser.id });
    }
  }
  for (let i = 0; i < attData.length; i += 100) {
    await prisma.attendance.createMany({ data: attData.slice(i, i + 100) });
  }
  console.log('Attendance records created\n');

  console.log('Creating exams and marks...');
  const exam = await prisma.exam.create({ data: { name: 'Term 1 Assessment', termId: term1.id, academicYearId: academicYear.id, startDate: new Date('2026-03-24'), endDate: new Date('2026-03-28') } });
  for (const sub of subjects.slice(0, 4)) {
    const assessment = await prisma.assessment.create({ data: { name: `${sub.name} Exam`, examId: exam.id, subjectId: sub.id, maxMarks: 100, weight: 1.0 } });
    const marksData: any[] = [];
    for (const student of allStudents) {
      const marks = Math.floor(Math.random() * 50) + 40;
      marksData.push({ assessmentId: assessment.id, studentId: student.id, marksObtained: marks, grade: marks >= 80 ? 'A' : marks >= 70 ? 'B' : marks >= 60 ? 'C' : marks >= 50 ? 'D' : 'E', comment: 'Good performance', teacherId: pick(teachers).id });
    }
    for (let i = 0; i < marksData.length; i += 100) {
      await prisma.mark.createMany({ data: marksData.slice(i, i + 100) });
    }
  }
  console.log('Exams and marks created\n');

  console.log('Creating events...');
  const eventData = [
    { title: 'Opening Day - Term 1', description: 'Welcome back students and parents for Term 1, 2026.', date: new Date('2026-01-05'), location: 'School Assembly Hall', category: 'Academic', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' },
    { title: 'Parents Meeting', description: 'Term 1 parents meeting to discuss curriculum and student expectations.', date: new Date('2026-01-20'), location: 'School Hall', category: 'Social', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800' },
    { title: 'Sports Day', description: 'Annual inter-class sports day featuring football, athletics, and relay races.', date: new Date('2026-02-14'), location: 'School Sports Field', category: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0bca?w=800' },
    { title: 'Cultural Day', description: 'Students showcase different Kenyan cultures through dance, food, and attire.', date: new Date('2026-03-15'), location: 'School Compound', category: 'Cultural', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800' },
    { title: 'Mid-Term Break', description: 'School closed for mid-term break.', date: new Date('2026-02-23'), location: 'N/A', category: 'Holiday', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800' },
    { title: 'Term 1 Examinations', description: 'End of Term 1 examinations for all classes.', date: new Date('2026-03-24'), location: 'Various Classrooms', category: 'Academic', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800' },
    { title: 'Graduation Ceremony 2026', description: 'Annual graduation ceremony for students completing their early childhood education.', date: new Date('2026-10-20'), location: 'School Assembly Hall', category: 'Social', image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800' },
    { title: 'Teachers Professional Development', description: 'Internal training workshop for teachers on CBC methodology.', date: new Date('2026-01-17'), location: 'Staff Room', category: 'Academic', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800' },
    { title: 'School Talent Show', description: 'Students showcase their talents in music, dance, and drama.', date: new Date('2026-04-10'), location: 'School Assembly Hall', category: 'Cultural', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' },
    { title: 'Inter-School Science Fair', description: 'Students present science projects and experiments.', date: new Date('2026-05-15'), location: 'School Hall', category: 'Academic', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800' },
    { title: 'End of Year Party', description: 'Fun day to celebrate the end of the academic year.', date: new Date('2026-12-10'), location: 'School Compound', category: 'Social', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800' },
    { title: 'Swimming Gala', description: 'Annual swimming competition for all age groups.', date: new Date('2026-06-20'), location: 'School Pool', category: 'Sports', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800' },
  ];
  for (const e of eventData) {
    await prisma.event.create({ data: { title: e.title, description: e.description, date: e.date, startTime: new Date(e.date.getTime() + 8 * 3600000), endTime: new Date(e.date.getTime() + 15 * 3600000), location: e.location, category: e.category, image: e.image, status: 'UPCOMING', createdBy: adminUser.id } });
  }
  console.log('12 events created with images\n');

  console.log('Creating news posts...');
  const newsData = [
    { title: 'Welcome to Term 1, 2026!', slug: 'welcome-term-1-2026', summary: 'Welcome back students and parents for Term 1, 2026!', content: 'Dear Parents and Guardians,\n\nWe are excited to welcome all our students back for Term 1, 2026! We hope you had a wonderful holiday break.\n\nThis term promises to be full of exciting learning opportunities and activities.\n\nWarm regards,\nBetter Tomorrow School Administration', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' },
    { title: 'New School Garden Project', slug: 'school-garden-project', summary: 'Launching our new school garden initiative.', content: 'We are thrilled to announce the launch of our new school garden project! This initiative will teach students about environmental conservation, nutrition, and responsibility.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800' },
    { title: 'Online Fee Payment Now Available', slug: 'online-fee-payment', summary: 'M-Pesa Paybill is now available for convenient fee payment.', content: 'Dear Parents,\n\nWe are pleased to inform you that you can now pay school fees through M-Pesa Paybill.\n\nPaybill Number: 123456\nAccount Number: Student ID', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800' },
    { title: 'Parent-Teacher Conference Scheduled', slug: 'parent-teacher-conference', summary: 'Parent-Teacher Conference on 20th January.', content: 'We invite all parents to attend the upcoming Parent-Teacher Conference scheduled for 20th January 2026.', image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800' },
    { title: 'Health and Safety Update', slug: 'health-safety-update', summary: 'Important health and safety measures for the new term.', content: 'As part of our commitment to student safety, we have implemented several measures including regular handwashing stations and daily health checks.', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800' },
  ];
  for (const n of newsData) {
    await prisma.newsPost.create({ data: { title: n.title, slug: n.slug, summary: n.summary, content: n.content, featuredImage: n.image, category: 'School News', authorId: adminUser.id, status: 'PUBLISHED', publishedAt: new Date('2026-01-02') } });
  }
  console.log('5 news posts created\n');

  console.log('Creating announcements...');
  await prisma.announcement.create({ data: { title: 'School Hours', message: 'School hours are from 7:30 AM to 4:30 PM, Monday through Friday.', audience: 'ALL', priority: 'MEDIUM', status: 'PUBLISHED', publishDate: new Date('2026-01-01'), createdBy: adminUser.id } });
  await prisma.announcement.create({ data: { title: 'Admission Process', message: 'To enroll your child, please visit our admissions office with required documents or apply online through our website.', audience: 'ALL', priority: 'MEDIUM', status: 'PUBLISHED', publishDate: new Date('2026-01-01'), createdBy: adminUser.id } });
  await prisma.announcement.create({ data: { title: 'School Calendar - Term 1 2026', message: 'Important dates for Term 1 2026. Please mark these dates in your calendar.', audience: 'ALL', priority: 'HIGH', status: 'PUBLISHED', publishDate: new Date('2026-01-01'), createdBy: adminUser.id } });
  console.log('3 announcements created\n');

  console.log('Creating gallery items...');
  const galleryData = [
    { title: 'School Front View', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800' },
    { title: 'Classroom Activity', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800' },
    { title: 'Playground Fun', image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800' },
    { title: 'Art Class', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800' },
    { title: 'Sports Day 2025', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0bca?w=800' },
    { title: 'Library Corner', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800' },
    { title: 'Music Lesson', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800' },
    { title: 'Science Discovery', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800' },
    { title: 'Swimming Lessons', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800' },
    { title: 'Graduation Day', image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800' },
    { title: 'Computer Lab', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' },
    { title: 'Dance Practice', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800' },
  ];
  for (const g of galleryData) {
    await prisma.galleryItem.create({ data: { title: g.title, description: `${g.title} at Better Tomorrow School`, imageUrl: g.image, category: 'School Life', status: 'PUBLISHED', uploadedBy: adminUser.id } });
  }
  console.log('12 gallery items created with images\n');

  console.log('Creating school settings...');
  const settings = [
    { key: 'school_name', value: 'Better Tomorrow School' },
    { key: 'school_short_name', value: 'BTS' },
    { key: 'school_tagline', value: 'Incubating Learners for a Better Tomorrow' },
    { key: 'school_location', value: 'Donholm, Nairobi, Kenya' },
    { key: 'school_landmark', value: 'Behind Quickmart Supermarket' },
    { key: 'school_phone', value: '+254725839099' },
    { key: 'school_email', value: 'info@betterschool.ac.ke' },
    { key: 'school_whatsapp', value: '254725839099' },
  ];
  for (const setting of settings) {
    await prisma.schoolSetting.create({ data: setting });
  }
  console.log('School settings created\n');

  console.log('\n========================================');
  console.log('Database seeding completed!');
  console.log('========================================\n');
  console.log(`  - 1 Super Admin`);
  console.log(`  - ${teachers.length} Teachers`);
  console.log(`  - ${parents.length} Parents`);
  console.log(`  - ${allStudents.length} Students`);
  console.log(`  - 6 Classes, 10 Subjects`);
  console.log(`  - 12 Events with images`);
  console.log(`  - 5 News posts with images`);
  console.log(`  - 12 Gallery items with images`);
  console.log('\nCredentials:');
  console.log('  Admin:   admin@bts.ac.ke / Admin@123');
  console.log('  Teacher: teacher1@bts.ac.ke / Teacher@123');
  console.log('  Parent:  parent1@example.com / Parent@123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
