import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, FileCheck2, MapPin, MessageCircle, Phone, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { Footer } from './sukukArchive/components/Footer';
import { Header } from './sukukArchive/components/Header';
import { track, whatsappLink } from './content/siteData';

type LandingPageData = {
  slug: string; title: string; description: string; service: string; heroCopy: string;
  image?: string; cta: string; whatsapp: string; choices: string[];
  locationLabel?: string; locationPlaceholder?: string; problemTitle?: string; problem?: string;
  services: string[][]; process: string[]; faqs: string[][];
  primaryKeyword?: string; keywordGroups?: { primary?: string[]; supporting?: string[]; longtail?: string[] };
};

const trustPoints = ['اعتماد ومخرجات واضحة', 'فريق هندسي ومساحي مرخص', 'متابعة منظمة حتى اكتمال الخدمة'];
const iconSet = [FileCheck2, MapPin, ShieldCheck, Sparkles, CheckCircle2, FileCheck2];

export default function UnifiedLandingPage({ page }: { page: LandingPageData }) {
  const [sent, setSent] = useState(false);
  useEffect(() => {
    document.title = page.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
    track('landing_page_view', { page: page.slug, service: page.service });
  }, [page]);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = `${page.whatsapp}\n\nالاسم: ${data.get('name')}\nالجوال: ${data.get('phone')}\nالخدمة: ${data.get('service')}\nالموقع: ${data.get('location')}\nالتفاصيل: ${data.get('message')}`;
    setSent(true);
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    track('landing_lead_submit', { page: page.slug, service: page.service });
  };
  const keywords = page.keywordGroups || {};
  return <div className="unified-lp" dir="rtl">
    <Header />
    <main>
      <section className="unified-lp-hero" style={page.image ? { backgroundImage: `linear-gradient(90deg, rgba(43,15,22,.97), rgba(43,15,22,.78)), url(${page.image})` } : undefined}>
        <div className="container unified-lp-hero-grid">
          <div className="unified-lp-hero-copy">
            <span className="unified-eyebrow"><CheckCircle2 size={16}/> مكتب ريان للمساحة والاستشارات الهندسية</span>
            <h1>{page.title}</h1>
            <p>{page.heroCopy}</p>
            <div className="unified-lp-actions"><a className="unified-btn unified-btn-gold" href="#lead">{page.cta} <ArrowLeft size={18}/></a><a className="unified-btn unified-btn-whatsapp" href={whatsappLink(page.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={19}/> استشارة عبر واتساب</a></div>
            <div className="unified-trust-row">{trustPoints.map(x => <span key={x}><CheckCircle2 size={16}/>{x}</span>)}</div>
          </div>
          <form className="unified-quick-form" onSubmit={submit}>
            <div><span className="unified-form-kicker">خطوة أولى واضحة</span><h2>اطلب تقييم احتياجك</h2><p>أرسل التفاصيل الأساسية وسنوضح لك المسار والمخرج المناسب.</p></div>
            {sent ? <div className="unified-success"><CheckCircle2 size={34}/><h3>تم تجهيز طلبك</h3><p>سيواصل معك الفريق عبر واتساب لتحديد الخطوة التالية.</p></div> : <>
              <label>الاسم الكريم<input name="name" required placeholder="الاسم الكامل" /></label><label>رقم الجوال<input name="phone" required dir="ltr" placeholder="05xxxxxxxx" /></label>
              <label>الخدمة المطلوبة<select name="service" defaultValue="" required><option value="" disabled>اختر الخدمة الأقرب</option>{page.choices?.map(x => <option key={x}>{x}</option>)}</select></label>
              <label>{page.locationLabel || 'موقع المشروع'}<input name="location" placeholder={page.locationPlaceholder || 'المدينة والحي'} /></label>
              <button className="unified-btn unified-btn-maroon" type="submit"><Send size={17}/> أرسل التفاصيل عبر واتساب</button>
            </>}
          </form>
        </div>
      </section>

      <section className="unified-lp-keywords"><div className="container"><div className="unified-section-heading"><span className="unified-eyebrow dark"><Sparkles size={15}/> صلة البحث بالخدمة</span><h2>محتوى واضح يبدأ من احتياجك</h2><p>نستخدم مصطلحات {page.service} داخل أقسامها المناسبة حتى تجد إجابة مباشرة ومتسقة مع بحثك.</p></div><div className="unified-keyword-grid"><article><b>الكلمة الرئيسية</b><strong>{page.primaryKeyword || page.service}</strong>{keywords.primary?.map(x=><span key={x}>{x}</span>)}</article><article><b>الكلمات الداعمة</b>{(keywords.supporting || []).slice(0,6).map(x=><span key={x}>{x}</span>)}</article><article><b>عبارات البحث التفصيلية</b>{(keywords.longtail || []).slice(0,6).map(x=><span key={x}>{x}</span>)}</article></div></div></section>

      <section className="unified-lp-problem"><div className="container unified-lp-two-col"><div><span className="unified-eyebrow dark">فهم احتياجك</span><h2>{page.problemTitle || `تحتاج إلى مسار واضح في ${page.service}؟`}</h2><p>{page.problem || page.description}</p><a className="unified-text-link" href="#services">استعرض نطاق الخدمة <ArrowLeft size={16}/></a></div><div className="unified-reassurance">{['نحدد المطلوب قبل البدء', 'نرتب البيانات والمخرجات', 'نوضح المتطلبات والجهة ذات العلاقة', 'نبقي التواصل منظماً حتى التسليم'].map(x=><div key={x}><ShieldCheck size={22}/><span>{x}</span></div>)}</div></div></section>

      <section id="services" className="unified-lp-services"><div className="container"><div className="unified-section-heading"><span className="unified-eyebrow dark">خدمات مصممة لمسارك</span><h2>{page.service} بترتيب يساعدك على الإنجاز</h2><p>اختر المخرج الأقرب لاحتياجك، وسنراجع التفاصيل قبل بدء التنفيذ.</p></div><div className="unified-service-grid">{page.services.map((item, i) => { const Icon = iconSet[i % iconSet.length]; return <article key={item[0]}><div className="unified-service-icon"><Icon size={25}/></div><span className="unified-service-number">{String(i + 1).padStart(2, '0')}</span><h3>{item[0]}</h3><p>{item[1]}</p><a href="#lead">اطلب الخدمة <ArrowLeft size={15}/></a></article>; })}</div></div></section>

      <section className="unified-lp-process"><div className="container"><div className="unified-section-heading light"><span className="unified-eyebrow">رحلة الخدمة</span><h2>من أول تواصل إلى مخرج واضح</h2></div><div className="unified-process-grid">{page.process.slice(0,4).map((step, i) => <article key={step}><b>0{i + 1}</b><h3>{step}</h3><p>{['نفهم هدفك وموقع المشروع ونطاق الطلب.', 'نراجع البيانات ونحدد المتطلبات والمخرج.', 'ننّفذ الأعمال وفق نطاق واضح ومراحل قابلة للمتابعة.', 'نسلم المخرج ونوضح الخطوة التالية.'][i]}</p></article>)}</div></div></section>

      <section className="unified-lp-faq"><div className="container"><div className="unified-section-heading"><span className="unified-eyebrow dark">الأسئلة الشائعة</span><h2>إجابات قبل طلب الخدمة</h2></div>{page.faqs.map(f => <details key={f[0]}><summary>{f[0]}<ChevronDown size={18}/></summary><p>{f[1]}</p></details>)}</div></section>
      <section id="lead" className="unified-lp-contact"><div className="container unified-lp-contact-grid"><div><span className="unified-eyebrow">خطوتك التالية</span><h2>هل تريد معرفة المسار المناسب لمشروعك؟</h2><p>{page.cta}. أرسل تفاصيلك الأساسية وسنوضح لك المخرج والخطوة التالية بوضوح.</p><a className="unified-btn unified-btn-whatsapp" href={whatsappLink(page.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={19}/> تحدث مع مهندس عبر واتساب</a><span className="unified-phone"><Phone size={16}/> 050 313 0302</span></div><div className="unified-contact-note"><CheckCircle2 size={34}/><h3>وضوح قبل الالتزام</h3><p>نبدأ بتقييم الاحتياج وتحديد نطاق العمل، ثم نوضح المتطلبات والمخرجات قبل اتخاذ الخطوة التالية.</p></div></div></section>
    </main><Footer />
  </div>;
}
