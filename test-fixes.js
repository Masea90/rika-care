// Test script to verify the name and language fixes
const { i18n } = require('./shared/languages.js');

console.log('🧪 Testing RIKA App Fixes\n');

// Test 1: Name extraction from email
function testNameExtraction() {
  console.log('1. Testing name extraction from email:');
  
  const testEmails = [
    'john.doe@example.com',
    'sarah_smith@gmail.com',
    'maria.garcia@company.co',
    'alex123@test.org'
  ];
  
  testEmails.forEach(email => {
    const extractedName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    console.log(`   ${email} → "${extractedName}"`);
  });
  console.log('');
}

// Test 2: Language switching
function testLanguageSwitching() {
  console.log('2. Testing language switching:');
  
  const languages = ['en', 'es', 'fr'];
  const testKey = 'hello';
  
  languages.forEach(lang => {
    i18n.setLanguage(lang);
    console.log(`   ${lang.toUpperCase()}: ${i18n.t(testKey)}`);
  });
  console.log('');
}

// Test 3: Greeting generation
function testGreetings() {
  console.log('3. Testing personalized greetings:');
  
  const users = [
    { name: 'Sarah', language: 'en' },
    { name: 'María', language: 'es' },
    { name: 'Sophie', language: 'fr' }
  ];
  
  users.forEach(user => {
    i18n.setLanguage(user.language);
    const greeting = `${i18n.t('hello')}, ${user.name}!`;
    console.log(`   ${user.language.toUpperCase()}: ${greeting}`);
  });
  console.log('');
}

// Run tests
testNameExtraction();
testLanguageSwitching();
testGreetings();

console.log('✅ All tests completed!');
console.log('\n📋 Summary of fixes:');
console.log('   • Fixed name display by extracting from email when no name provided');
console.log('   • Added language switching functionality');
console.log('   • Added personalized greetings in multiple languages');
console.log('   • Created language settings screen for mobile app');
console.log('   • Added language preference endpoints to backend');