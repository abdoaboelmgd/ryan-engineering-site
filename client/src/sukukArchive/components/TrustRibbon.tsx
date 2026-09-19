import React from 'react';
import { Award, HardHat, Zap } from 'lucide-react';

const items = [
  ['مكتب معتمد رسمياً', 'معتمدون لدى الجهات الحكومية والبلديات', Award],
  ['خبرة هندسية واسعة', 'كوادر متخصصة بخبرات تتجاوز 15 عاماً', HardHat],
  ['إنجاز سريع ودقيق', 'نلتزم بالوقت مع ضمان أعلى معايير الجودة', Zap],
] as const;

export const TrustRibbon: React.FC = () => <div className="container mx-auto px-4 lg:max-w-7xl relative z-10 -mt-10 mb-16 rk-trust-ribbon"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{items.map(([title, description, Icon], index) => <div key={title} className={`bg-white rounded-2xl p-6 text-center shadow-lg rk-card-hover rk-reveal border border-gray-100 delay-${index * 100}`}><div className="w-16 h-16 mx-auto bg-rkGold/15 rounded-full flex items-center justify-center text-rkGoldDark text-3xl mb-4 rk-icon-hover"><Icon className="w-8 h-8" /></div><h4 className="font-bold text-rkNavy mb-2 text-xl">{title}</h4><p className="text-sm text-rkMuted">{description}</p></div>)}</div></div>;
