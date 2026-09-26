import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Sun,
  Coins,
  Layers,
  Search,
} from 'lucide-react';
import { GOVT_SCHEMES } from '../data/sampleCrops';
import { LanguageCode } from '../types';

interface GovtSchemesProps {
  currentLang: LanguageCode;
}

export const GovtSchemes: React.FC<GovtSchemesProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Financial Assistance', 'Insurance', 'Equipment & Solar', 'Soil & Water'];

  const filtered = GOVT_SCHEMES.filter((scheme) => {
    const matchesCat = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesQuery =
      scheme.title.toLowerCase().includes(search.toLowerCase()) ||
      scheme.hindiTitle.toLowerCase().includes(search.toLowerCase()) ||
      scheme.benefit.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <Coins className="w-3.5 h-3.5" />
            <span>Government Subsidies &amp; Support • सरकारी योजनाएं व सब्सिडी</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central &amp; State Agricultural Schemes
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Direct access to government income support, crop insurance coverage, 60% solar pump subsidies, low-interest Kisan Credit Cards (KCC), and free soil testing cards.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scheme name or benefit..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-1.5">
                    {scheme.category}
                  </span>
                  <h3 className="text-base font-extrabold text-stone-900">
                    {scheme.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800">
                    {scheme.hindiTitle}
                  </p>
                </div>
              </div>

              {/* Benefit Box */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 my-3">
                <span className="text-[11px] font-bold text-emerald-900 block mb-0.5">
                  Direct Benefit (मुख्य लाभ):
                </span>
                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  {scheme.benefit}
                </p>
              </div>

              {/* Eligibility */}
              <div className="text-xs text-stone-600 mb-3">
                <strong className="text-stone-800">Eligibility:</strong> {scheme.eligibility}
              </div>

              {/* Documents Needed */}
              <div>
                <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                  Required Documents (जरूरी दस्तावेज):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{doc}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portal Link Footer */}
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">Official Govt Portal</span>
              <a
                href={scheme.portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>Visit Portal &amp; Apply</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
