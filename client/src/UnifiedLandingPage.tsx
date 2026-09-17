import React, { useEffect } from 'react';
import { ChevronDown, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { Header } from './sukukArchive/components/Header';
import { Hero, HeroConfig } from './sukukArchive/components/Hero';
import { WhyUs, WhyUsConfig } from './sukukArchive/components/WhyUs';
import { Services, ServicesConfig } from './sukukArchive/components/Services';
import { WorkProcess } from './sukukArchive/components/WorkProcess';
import { PartnersMarquee } from './sukukArchive/components/PartnersMarquee';
import { ProjectsGallery } from './sukukArchive/components/ProjectsGallery';
import { StatsBar } from './sukukArchive/components/StatsBar';
import { Testimonials } from './sukukArchive/components/Testimonials';
import { FAQ } from './sukukArchive/components/FAQ';
import { ContactSection } from './sukukArchive/components/ContactSection';
import { Footer } from './sukukArchive/components/Footer';
import { FloatingActions } from './sukukArchive/components/FloatingActions';
import { track, whatsappLink } from './content/siteData';
import { SERVICES_DATA } from './sukukArchive/data/siteData';

export default function UnifiedLandingPage({ page }: { page: any }) {
  useEffect(() => {
    document.title = page.title;
    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let node = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!node) { node = document.createElement('meta'); document.head.appendChild(node); }
      Object.entries(attrs).forEach(([key, value]) => node!.setAttribute(key, value));
    };
    upsertMeta('meta[name="description"]', { name: 'description', content: page.description });
    const keywordText = [page.primaryKeyword, ...(page.keywordGroups?.primary || []), ...(page.keywordGroups?.supporting || [])].filter(Boolean).join(', ');
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywordText });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: page.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: page.description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); document.head.appendChild(canonical); }
    canonical.rel = 'canonical';
    canonical.href = `${window.location.origin}${import.meta.env.BASE_URL}lp/${page.slug}/`;
    track('landing_page_view', { page: page.slug, service: page.service });
  }, [page]);

  const items = page.services.map((item: string[], index: number) => ({
    ...(SERVICES_DATA[index % SERVICES_DATA.length]), id: index + 1, title: item[0], desc: item[1], icon: SERVICES_DATA[index % SERVICES_DATA.length].icon,
    badge: index === 0 ? 'الأكثر طلباً' : index === 1 ? 'خدمة متخصصة' : 'مخرج واضح',
    features: ['مراجعة المتطلبات والبيانات', 'مخرج هندسي قابل للمراجعة', 'متابعة منظمة ضمن نطاق الخدمة'],
  }));
  const hero: HeroConfig = {
    eyebrow: `حلول معتمدة في ${page.service}`,
    headline: 'أفضل مكتب معتمد في المملكة',
    highlightedHeadline: page.service,
    description: page.heroCopy,
    defaultService: page.choices?.[0] || page.service,
    choices: page.choices,
    formTitle: page.formTitle || `طلب خدمة ${page.service}`,
    whatsappMessage: page.whatsapp,
  };
  const services: ServicesConfig = { title: page.servicesTitle || `خدماتنا المتخصصة في ${page.service}`, description: page.servicesDescription || `حلول هندسية ومساحية متكاملة في ${page.service} بمخرجات واضحة ومتطلبات مرتبة قبل بدء التنفيذ.`, items };
  const why: WhyUsConfig = {
    title: page.whyTitle || `لماذا تختار مكتب ريان في ${page.service}؟`,
    description: `نربط الخبرة الهندسية والمساحية بمتطلبات ${page.service} لنقدم لك مخرجاً واضحاً وتواصلاً منظماً من أول خطوة حتى التسليم.`,
    reasons: ['دقة وخبرة مرتبطة بالخدمة', 'متطلبات ومخرجات واضحة', 'متابعة مهنية حتى اكتمال الإجراء'].map((title, i) => ({ title, desc: [page.description, 'نراجع البيانات والموقع ونوضح المطلوب قبل التنفيذ.', 'نبقي التواصل منظماً ونشرح الخطوة التالية بوضوح.'][i] })),
  };
  const groups = page.keywordGroups || {};
  const schema = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: `مكتب ريان - ${page.service}`, description: page.description, areaServed: ['الرياض', 'المملكة العربية السعودية'], serviceType: page.service, url: `${window.location.origin}${import.meta.env.BASE_URL}lp/${page.slug}/` };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><div dir="rtl" className="sukuk-archive-page unified-lp"><Header /><main><Hero config={hero} /><section className="unified-keyword-band"><div className="container"><div className="unified-keyword-heading"><Sparkles size={18}/><div><span>صلة البحث بالخدمة</span><h2>محتوى واضح يبدأ من احتياجك</h2></div></div><div className="unified-keyword-pills"><b>{page.primaryKeyword || page.service}</b>{[...(groups.primary || []), ...(groups.supporting || []), ...(groups.longtail || [])].slice(0, 12).map((keyword: string) => <span key={keyword}>{keyword}</span>)}</div></div></section><WhyUs config={why} /><Services config={services} /><WorkProcess /><PartnersMarquee /><ProjectsGallery /><StatsBar /><Testimonials /><FAQ /><section className="unified-lp-final"><div className="container"><div><span className="eyebrow">خطوتك التالية</span><h2>{page.cta || `اطلب خدمة ${page.service}`}</h2><p>أرسل تفاصيلك الأساسية وسنوضح لك المتطلبات والمخرج المناسب لخدمتك.</p><a href={whatsappLink(page.whatsapp)} target="_blank" rel="noreferrer"><MessageCircle size={18}/> تحدث مع مهندس عبر واتساب</a></div><div className="unified-final-card"><Phone size={25}/><strong>نموذج طلب {page.service}</strong><span>تواصل مباشر وشرح واضح للخطوة التالية</span></div></div></section><ContactSection /></main><Footer /><FloatingActions /></div></>;
}
