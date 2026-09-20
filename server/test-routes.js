require('ts-node').register({transpileOnly: true});
console.log('Step 1: ts-node registered');

try {
  console.log('Step 2: Loading config...');
  require('./src/config');
  console.log('Step 2: config loaded');
  
  console.log('Step 3: Loading database...');
  require('./src/config/database');
  console.log('Step 3: database loaded');
  
  console.log('Step 4: Loading auth routes...');
  require('./src/routes/auth.routes');
  console.log('Step 4: auth routes loaded');
  
  console.log('Step 5: Loading student routes...');
  require('./src/routes/student.routes');
  console.log('Step 5: student routes loaded');
  
  console.log('Step 6: Loading parent routes...');
  require('./src/routes/parent.routes');
  console.log('Step 6: parent routes loaded');
  
  console.log('Step 7: Loading teacher routes...');
  require('./src/routes/teacher.routes');
  console.log('Step 7: teacher routes loaded');
  
  console.log('Step 8: Loading class routes...');
  require('./src/routes/class.routes');
  console.log('Step 8: class routes loaded');
  
  console.log('Step 9: Loading subject routes...');
  require('./src/routes/subject.routes');
  console.log('Step 9: subject routes loaded');
  
  console.log('Step 10: Loading attendance routes...');
  require('./src/routes/attendance.routes');
  console.log('Step 10: attendance routes loaded');
  
  console.log('Step 11: Loading exam routes...');
  require('./src/routes/exam.routes');
  console.log('Step 11: exam routes loaded');
  
  console.log('Step 12: Loading mark routes...');
  require('./src/routes/mark.routes');
  console.log('Step 12: mark routes loaded');
  
  console.log('Step 13: Loading reportCard routes...');
  require('./src/routes/reportCard.routes');
  console.log('Step 13: reportCard routes loaded');
  
  console.log('Step 14: Loading fee routes...');
  require('./src/routes/fee.routes');
  console.log('Step 14: fee routes loaded');
  
  console.log('Step 15: Loading payment routes...');
  require('./src/routes/payment.routes');
  console.log('Step 15: payment routes loaded');
  
  console.log('Step 16: Loading timetable routes...');
  require('./src/routes/timetable.routes');
  console.log('Step 16: timetable routes loaded');
  
  console.log('Step 17: Loading event routes...');
  require('./src/routes/event.routes');
  console.log('Step 17: event routes loaded');
  
  console.log('Step 18: Loading news routes...');
  require('./src/routes/news.routes');
  console.log('Step 18: news routes loaded');
  
  console.log('Step 19: Loading announcement routes...');
  require('./src/routes/announcement.routes');
  console.log('Step 19: announcement routes loaded');
  
  console.log('Step 20: Loading gallery routes...');
  require('./src/routes/gallery.routes');
  console.log('Step 20: gallery routes loaded');
  
  console.log('Step 21: Loading document routes...');
  require('./src/routes/document.routes');
  console.log('Step 21: document routes loaded');
  
  console.log('Step 22: Loading admission routes...');
  require('./src/routes/admission.routes');
  console.log('Step 22: admission routes loaded');
  
  console.log('Step 23: Loading schoolVisit routes...');
  require('./src/routes/schoolVisit.routes');
  console.log('Step 23: schoolVisit routes loaded');
  
  console.log('Step 24: Loading contact routes...');
  require('./src/routes/contact.routes');
  console.log('Step 24: contact routes loaded');
  
  console.log('Step 25: Loading testimonial routes...');
  require('./src/routes/testimonial.routes');
  console.log('Step 25: testimonial routes loaded');
  
  console.log('Step 26: Loading dashboard routes...');
  require('./src/routes/dashboard.routes');
  console.log('Step 26: dashboard routes loaded');
  
  console.log('Step 27: Loading report routes...');
  require('./src/routes/report.routes');
  console.log('Step 27: report routes loaded');
  
  console.log('Step 28: Loading academic routes...');
  require('./src/routes/academic.routes');
  console.log('Step 28: academic routes loaded');
  
  console.log('Step 29: Loading setting routes...');
  require('./src/routes/setting.routes');
  console.log('Step 29: setting routes loaded');
  
  console.log('Step 30: Loading user routes...');
  require('./src/routes/user.routes');
  console.log('Step 30: user routes loaded');
  
  console.log('Step 31: Loading auditLog routes...');
  require('./src/routes/auditLog.routes');
  console.log('Step 31: auditLog routes loaded');
  
  console.log('ALL ROUTES LOADED SUCCESSFULLY!');
  
} catch(e) {
  console.error('FAILED at:', e.message);
  console.error('Stack:', e.stack);
}
process.exit(0);
