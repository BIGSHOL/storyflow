import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Image,
  Type,
  Download,
  Smartphone,
  Palette,
  MousePointerClick,
  Eye,
  Share2,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Music,
  Video,
  BarChart3,
  Layout,
  Zap,
  Globe,
} from 'lucide-react';
import { translations, Language } from '../data/landingTranslations';

const LANG_STORAGE_KEY = 'storyflow_landing_lang';

const FEATURE_ICONS = [
  <MousePointerClick className="w-6 h-6" />,
  <Layers className="w-6 h-6" />,
  <Eye className="w-6 h-6" />,
  <Palette className="w-6 h-6" />,
  <Image className="w-6 h-6" />,
  <Video className="w-6 h-6" />,
  <Music className="w-6 h-6" />,
  <BarChart3 className="w-6 h-6" />,
  <Smartphone className="w-6 h-6" />,
  <Download className="w-6 h-6" />,
  <Share2 className="w-6 h-6" />,
  <Layout className="w-6 h-6" />,
];

const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [lang, setLang] = React.useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'en' || stored === 'ko') return stored;
    } catch {}
    return 'ko';
  });

  const t = translations[lang];

  const toggleLanguage = () => {
    const next: Language = lang === 'ko' ? 'en' : 'ko';
    setLang(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {}
  };

  const features = FEATURE_ICONS.map((icon, i) => ({
    icon,
    ...t.features.items[i],
  }));

  const steps = t.howItWorks.steps.map((step, i) => ({
    step: String(i + 1),
    ...step,
  }));

  const useCases = t.useCases.items;
  const faqs = t.faq.items;

  return (
    <div className="min-h-screen bg-gray-950 text-white scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="StoryFlow Creator" className="w-8 h-8 rounded-lg" />
            <span className="font-serif font-bold text-lg">StoryFlow Creator</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t.nav.features}
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t.nav.howItWorks}
            </a>
            <a
              href="#faq"
              className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t.nav.faq}
            </a>
            <button
              onClick={toggleLanguage}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'ko' ? 'EN' : 'KO'}</span>
            </button>
            <Link
              to="/editor"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm mb-8">
            <Zap className="w-4 h-4" />
            <span>{t.hero.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t.hero.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {t.hero.titleLine2}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              {t.hero.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.features.sectionTitle}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t.features.sectionDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.howItWorks.sectionTitle}</h2>
            <p className="text-gray-400 text-lg">
              {t.howItWorks.sectionDescription}
            </p>
          </div>
          <div className="space-y-8">
            {steps.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.useCases.sectionTitle}</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t.useCases.sectionDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{useCase.description}</p>
                <span className="text-xs text-indigo-400 bg-indigo-600/10 px-3 py-1 rounded-full">
                  {useCase.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.faq.sectionTitle}</h2>
            <p className="text-gray-400 text-lg">
              {t.faq.sectionDescription}
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-400 leading-relaxed pl-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-gray-400 text-lg mb-8">
            {t.cta.descriptionLine1}
            <br />
            {t.cta.descriptionLine2}
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
          >
            {t.cta.button}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t.cta.benefits[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t.cta.benefits[1]}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{t.cta.benefits[2]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="StoryFlow" className="w-7 h-7 rounded-lg" />
                <span className="font-serif font-bold">StoryFlow Creator</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t.footer.description}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-gray-300">{t.footer.productHeader}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/editor" className="text-gray-500 hover:text-gray-300 transition-colors">
                    {t.footer.editor}
                  </Link>
                </li>
                <li>
                  <a href="#features" className="text-gray-500 hover:text-gray-300 transition-colors">
                    {t.footer.featuresIntro}
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-500 hover:text-gray-300 transition-colors">
                    {t.footer.howToUse}
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-500 hover:text-gray-300 transition-colors">
                    {t.footer.faqLink}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-gray-300">{t.footer.policyHeader}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:st2000423@gmail.com"
                    className="text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {t.footer.contact}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} StoryFlow Creator. All rights reserved.
            </p>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
              aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            >
              <Globe className="w-4 h-4" />
              <span>{t.footer.languageLabel}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
