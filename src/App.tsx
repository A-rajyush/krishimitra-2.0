import React, { useState } from 'react';
import { Header } from './components/Header';
import { CropDoctor } from './components/CropDoctor';
import { MandiPrices } from './components/MandiPrices';
import { WeatherAdvisory } from './components/WeatherAdvisory';
import { SoilCalculator } from './components/SoilCalculator';
import { KrishiBazaar } from './components/KrishiBazaar';
import { AgriChat } from './components/AgriChat';
import { GovtSchemes } from './components/GovtSchemes';
import { LanguageCode } from './types';
import { Phone, Sprout, Heart, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('hi');
  const [activeTab, setActiveTab] = useState<string>('doctor');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Header */}
      <Header
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'doctor' && <CropDoctor currentLang={currentLang} />}
        {activeTab === 'mandi' && <MandiPrices currentLang={currentLang} />}
        {activeTab === 'weather' && <WeatherAdvisory currentLang={currentLang} />}
        {activeTab === 'soil' && <SoilCalculator currentLang={currentLang} />}
        {activeTab === 'bazaar' && <KrishiBazaar currentLang={currentLang} />}
        {activeTab === 'chat' && <AgriChat currentLang={currentLang} />}
        {activeTab === 'schemes' && <GovtSchemes currentLang={currentLang} />}
      </main>

      {/* Kisan Call Center Helpline & Footer */}
      <footer className="bg-stone-900 text-stone-300 mt-12 border-t border-stone-800">
        {/* Helpline Banner */}
        <div className="bg-emerald-950/80 border-b border-emerald-800/40 py-3.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-emerald-200">
            <span className="font-bold flex items-center gap-1.5 text-white">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Toll-Free Kisan Call Center Helpline:
            </span>
            <a
              href="tel:18001801551"
              className="font-mono font-bold text-emerald-300 hover:text-white underline text-sm"
            >
              1800-180-1551 (6:00 AM - 10:00 PM)
            </a>
            <span className="hidden sm:inline text-emerald-600">•</span>
            <span className="text-emerald-300/80">Free voice agricultural advice in 22 languages</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-sm">KrishiMitra (कृषि मित्र)</span>
            <span>• National Agriculture Advisory &amp; Digital Farm Assistance</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone-400">ICAR Agronomy Guidelines</span>
            <span>•</span>
            <span className="text-stone-400">APMC Mandi Integration</span>
            <span>•</span>
            <span className="text-stone-400">Agro-Meteorology Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
