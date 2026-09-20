try {
  require('ts-node').register();
  console.log('ts-node registered');
  console.log('Loading index.ts...');
  require('./src/index.ts');
  console.log('index.ts loaded');
} catch(e) {
  console.error('ERROR:', e.message);
  console.error('Stack:', e.stack);
}
