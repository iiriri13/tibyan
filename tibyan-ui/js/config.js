// عدّل العنوان حسب مكان تشغيل الـ API (FastAPI: uvicorn main:app --port 8000)
window.TIBYAN_CONFIG = {
  API_BASE: "http://localhost:8000",
  API_KEY: "",          // إذا فعّلت مفتاح في الـ API ضعه هنا
  USE_MOCK_ON_ERROR: true // لو فشل الاتصال تبقى الشاشات بالبيانات التجريبية
};
