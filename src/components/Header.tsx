import React from 'react';
import { Sprout, Globe, Phone, CloudSun, Leaf, ShoppingBag, MessageSquare, Info, ShieldCheck, Stethoscope } from 'lucide-react';
import { LANGUAGES } from '../data/translations';
import { LanguageCode } from '../types';

interface HeaderProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top micro ticker */}
      <div className="bg-emerald-900 text-emerald-100 text-[11px] py-1 px-4 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-bold text-amber-300">🌾 Live Mandi Update:</span>
            <span>Wheat Sehore: ₹2,950/Qtl</span>
            <span className="text-emerald-500">•</span>
            <span>Mustard Bharatpur: ₹5,950/Qtl</span>
            <span className="text-emerald-500">•</span>
            <span>Cotton Rajkot: ₹7,600/Qtl</span>
            <span className="text-emerald-500 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Paddy Karnal: ₹4,600/Qtl</span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-emerald-200 shrink-0">
            <a
              href="tel:18001801551"
              className="hover:text-white flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Kisan Call Center: 1800-180-1551 (Toll-Free)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab('doctor')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-950 font-serif">
                  KrishiMitra
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Smart Farming Portal
                </span>
              </div>
              <p className="text-xs font-medium text-stone-500 hidden sm:block">
                कृषि मित्र • Empowering Farmers with Science & Market Intelligence
              </p>
            </div>
          </div>

          {/* Right Tools: Helpline & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="tel:18001801551"
              className="flex md:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>1800-180-1551</span>
            </a>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-stone-800">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                <select
                  value={currentLang}
                  onChange={(e) => onSelectLang(e.target.value as LanguageCode)}
                  aria-label="Select Language"
                  className="bg-transparent font-medium focus:outline-hidden cursor-pointer pr-1"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none border-t border-stone-100">
          {[
            { id: 'doctor', label: 'Crop Doctor', hindi: 'फसल चिकित्सक', icon: Stethoscope },
            { id: 'mandi', label: 'Mandi Bhav', hindi: 'मंडी भाव', icon: '₹' },
            { id: 'weather', label: 'Agro Weather & Spray', hindi: 'मौसम व स्प्रे', icon: CloudSun },
            { id: 'soil', label: 'NPK Calculator', hindi: 'खाद कैलकुलेटर', icon: Leaf },
            { id: 'bazaar', label: 'Krishi Bazaar', hindi: 'कृषि बाज़ार', icon: ShoppingBag },
            { id: 'chat', label: 'Farmer Advisory', hindi: 'किसान सलाहकार', icon: MessageSquare },
            { id: 'schemes', label: 'Govt Schemes', hindi: 'सरकारी योजनाएं', icon: Info },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/30'
                    : 'text-stone-600 hover:text-emerald-800 hover:bg-stone-100'
                }`}
              >
                {typeof Icon === 'string' ? (
                  <span className="font-bold">{Icon}</span>
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{tab.label}</span>
                <span className={`text-[11px] font-normal hidden lg:inline ${isActive ? 'text-emerald-200' : 'text-stone-400'}`}>
                  ({tab.hindi})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
