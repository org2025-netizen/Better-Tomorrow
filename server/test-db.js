const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findMany().then(users => { 
  console.log('Users found:', users.length); 
  return prisma.$disconnect(); 
}).catch(e => { 
  console.error('Error:', e.message); 
  return prisma.$disconnect(); 
});
