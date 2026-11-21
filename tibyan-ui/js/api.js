// طبقة الاتصال بـ API تِبيَان (tibyan_api / FastAPI). كل الدوال ترجع JSON أو ترمي Error.
(function () {
  const cfg = window.TIBYAN_CONFIG;

  async function call(path, opts = {}) {
    const headers = { "Content-Type": "application/json" };
    if (cfg.API_KEY) headers["X-API-Key"] = cfg.API_KEY;
    const res = await fetch(cfg.API_BASE + path, { ...opts, headers });
    if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
  }

  window.TibyanAPI = {
    health:  ()   => call("/health"),
    metrics: ()   => call("/api/v1/metrics"),

    // تقييم عملية جديدة (يحفظ القرار). body حسب TransactionRequest
    // {transaction_id, merchant_id, customer_id, buyer_id, txn_kind, amount, device_id,
    //  refund_to_different_instrument, minutes_since_checkout, category_mismatch_flag,
    //  basket_mismatch_score, payout_covers_n_checkouts, iban_changed, gt_scenario_type}
    submitTransaction: (body) => call("/api/v1/transactions", { method: "POST", body: JSON.stringify(body) }),

    // تقييم بدون حفظ
    evaluate: (body) => call("/api/v1/evaluate", { method: "POST", body: JSON.stringify(body) }),

    // تقييم عملية موجودة في الداتا بمعرّفها
    evaluateById: (transaction_id) => call("/api/v1/evaluate-by-id", { method: "POST", body: JSON.stringify({ transaction_id }) }),

    // جلب قرار عملية محفوظة
    getTransaction: (id) => call("/api/v1/transactions/" + encodeURIComponent(id)),

    // تقرير التحقيق (صفحة الحالة)
    getInvestigation: (id) => call("/api/v1/investigations/" + encodeURIComponent(id)),
  };
})();
