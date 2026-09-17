export interface ServiceItem {
  id: number;
  title: string;
  icon: string;
  desc: string;
  badge?: string;
  features?: string[];
  duration?: string;
}

export interface ProjectItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  category?: string;
  location?: string;
  equipment?: string;
  badge?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  comment: string;
  initial: string;
  rating: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}
