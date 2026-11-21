
    // ---------- التنقل بين الصفحات ----------
    const pages = ['login', 'main', 'queue', 'overview', 'case'];
    const pageNames = { main: 'مراقبة العمليات', queue: 'طابور الإيداعات', overview: 'الحالات ذات الأولوية' };
    let previous = 'overview'; // الصفحة اللي جاء منها المستخدم لصفحة التقرير
    let current = null;

    function show() {
      let route = (location.hash || '#login').slice(1);
      if (!pages.includes(route)) route = 'login';
      if (route === 'case' && pageNames[current]) previous = current;
      current = route === 'case' ? current : route;
      pages.forEach(p => { document.getElementById('page-' + p).hidden = (p !== route); });
      const back = document.querySelector('[data-role="back"]');
      if (back) { back.href = '#' + previous; back.lastChild.textContent = 'العودة إلى ' + pageNames[previous]; }
      window.scrollTo(0, 0);
    }
    window.addEventListener('hashchange', show);

    // الروابط الداخلية القديمة (Main.dc.html ...) تتحول لروابط #
    document.querySelectorAll('a[href$=".dc.html"]').forEach(a => {
      a.href = '#' + a.getAttribute('href').replace('.dc.html', '').toLowerCase();
    });

    // ---------- قرار المختص في التقرير ----------
    const statuses = {
      hold:     { label: 'تعليق مثبت',      bg: '#FDE8EA', bd: '#F6BFC4', fg: '#B4232F', dot: '#D92D3A',
                  text: 'تم تثبيت التعليق للحالة CASE-1042 عند 01:49. المبلغ 18,450.00 ريال يبقى في زد باي، ويُسجَّل القرار في سجل القرارات مع معرّف المختص.' },
      pass:     { label: 'تم التمرير',      bg: '#E6F7E9', bd: '#BFE8C8', fg: '#1D6B2E', dot: '#2F9A3A',
                  text: 'تم تمرير الحالة CASE-1042 عند 01:49. سيدخل المبلغ 18,450.00 ريال ضمن إيداع 02:00 ويُسجَّل القرار في سجل القرارات.' },
      escalate: { label: 'مُصعّد للمراجعة', bg: '#FEF3C7', bd: '#F4DE96', fg: '#8A5A00', dot: '#D98E04',
                  text: 'تم تصعيد الحالة CASE-1042 عند 01:49 لمراجعة أعلى. يبقى المبلغ معلّقاً حتى صدور القرار.' }
    };
    document.querySelectorAll('[data-decision]').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = statuses[btn.dataset.decision];
        const badge = document.querySelector('[data-role="status"]');
        const dot = document.querySelector('[data-role="status-dot"]');
        badge.style.background = s.bg; badge.style.borderColor = s.bd; badge.style.color = s.fg;
        dot.style.background = s.dot;
        badge.lastChild.textContent = s.label;
        document.querySelector('[data-role="decision-text"]').textContent = s.text;
      });
    });

    // ---------- تنزيل PDF (يفتح نافذة الطباعة، اختر «حفظ كـ PDF») ----------
    document.querySelectorAll('[data-action="print"]').forEach(b => b.addEventListener('click', () => window.print()));

    // ---------- ضبط التقرير على صفحة A4 واحدة عند الطباعة / PDF ----------
    function fitReport(reset) {
      const el = document.querySelector('[data-role="report"]');
      if (!el) return;
      el.style.zoom = '';
      if (reset) return;
      const PAGE_W = 190 / 25.4 * 96, PAGE_H = 277 / 25.4 * 96; // A4 ناقص الهوامش (10مم) بالبكسل
      const w = 980, h = el.getBoundingClientRect().height || el.scrollHeight;
      el.style.zoom = String(Math.min(1, PAGE_W / w, PAGE_H / h) * 0.97);
    }
    window.addEventListener('beforeprint', () => fitReport(false));
    window.addEventListener('afterprint', () => fitReport(true));
    window.fitReport = fitReport;

    show();
  