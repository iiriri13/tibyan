# واجهة تِبيَان (HTML/CSS/JS) — جاهزة للربط بالـ API

## التشغيل
1. شغّل الـ API: `uvicorn main:app --port 8000` (داخل مجلد tibyan_api).
2. افتح `index.html` بخادم محلي: `python3 -m http.server 5500` ثم http://localhost:5500
3. إذا الـ API يرفض الاتصال من المتصفح فعّل CORS في main.py:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5500"], allow_methods=["*"], allow_headers=["*"])
```

## الملفات
- `index.html` — كل الشاشات (login, main, queue, overview, case) والتنقل بـ #hash
- `css/tibyan.css` — الستايل العام (أغلب التنسيق inline داخل الـ HTML)
- `js/config.js` — عنوان الـ API
- `js/api.js` — دوال الاتصال: `TibyanAPI.getInvestigation(id)` ... الخ
- `js/app.js` — التنقل وأزرار القرار والطباعة

## أي شاشة تتغذى من أي endpoint
| الشاشة | الـ endpoint | الحقول المستخدمة |
|---|---|---|
| مراقبة العمليات (main) — العدادات | `GET /api/v1/metrics` | حسب ما يرجعه الـ API |
| مراقبة العمليات — جدول العمليات | `POST /api/v1/transactions` لكل عملية واردة، أو `GET /api/v1/transactions/{id}` | `decision`, `decision_ar`, `combined_risk_score`, `merchant_id`, `created_at` |
| الحالات ذات الأولوية (overview) | نفس الجدول مفلتر على `decision == HOLD/REVIEW` | `reason_codes`, `risk_score` |
| تقرير الحالة (case) | `GET /api/v1/investigations/{transaction_id}` | `investigation_id`, `status`, `severity`, `decision`, `fraud_risk_score`, `aml_risk_score`, `reasons`, `reason_codes`, `linked_entities`, `engine_results`, `model_versions` |
| طابور الإيداعات (queue) | يُجمَّع من العمليات حسب `merchant_id` (لا يوجد endpoint مخصص حالياً) | مبالغ المعلّق/الإجمالي تحتاج endpoint جديد أو حساب في الواجهة |

## ما يلزم إضافته في الـ API
- قائمة العمليات (list) مع pagination — الموجود حالياً جلب بمعرّف واحد فقط.
- حفظ قرار المختص (تمرير/تعليق/تصعيد): أزرار صفحة الحالة تغيّر الواجهة فقط الآن (`data-decision` في app.js).
- تسجيل الدخول والأدوار (المختص / التاجر).

## ملاحظة
الواجهة الحالية بيانات تجريبية ثابتة داخل HTML. للربط: استبدل النصوص الثابتة بقيم الـ API من `TibyanAPI`، وأضف `data-field="..."` على العناصر اللي تتغير لتسهيل التعبئة.
