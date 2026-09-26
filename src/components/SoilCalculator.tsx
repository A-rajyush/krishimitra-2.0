import React, { useState } from 'react';
import {
  Sprout,
  Calculator,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  IndianRupee,
  RefreshCw,
  Clock,
  FlaskConical,
} from 'lucide-react';
import { SoilAdvisory, LanguageCode } from '../types';

interface SoilCalculatorProps {
  currentLang: LanguageCode;
}

export const SoilCalculator: React.FC<SoilCalculatorProps> = ({ currentLang }) => {
  const [crop, setCrop] = useState<string>('Wheat (गेहूं)');
  const [soilType, setSoilType] = useState<string>('Alluvial Soil (जलोढ़ मिट्टी)');
  const [landArea, setLandArea] = useState<number>(2);
  const [areaUnit, setAreaUnit] = useState<string>('acre');
  const [soilPh, setSoilPh] = useState<string>('6.5 - 7.5 (Normal Neutral)');
  const [organicCarbon, setOrganicCarbon] = useState<string>('Medium (0.5% - 0.75%)');
  const [previousCrop, setPreviousCrop] = useState<string>('Paddy (धान / चावल)');
  const [irrigationType, setIrrigationType] = useState<string>('Tubewell / Flood');

  const [loading, setLoading] = useState<boolean>(false);
  const [advisory, setAdvisory] = useState<SoilAdvisory | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cropsList = [
    'Wheat (गेहूं)',
    'Paddy / Rice (धान / चावल)',
    'Mustard / Sarson (सरसों)',
    'Cotton (कपास)',
    'Soybean (सोयाबीन)',
    'Sugarcane (गन्ना)',
    'Maize (मक्का)',
    'Potato (आलू)',
    'Tomato (टमाटर)',
    'Gram / Chana (चना)',
    'Onion (प्याज)',
  ];

  const soilTypes = [
    'Alluvial Soil (जलोढ़ मिट्टी)',
    'Black Cotton Soil (काली मिट्टी / रेगुर)',
    'Red & Yellow Soil (लाल मिट्टी)',
    'Sandy Loam (बलुई दोमट)',
    'Clayey Soil (चिकनी मिट्टी)',
  ];

  const handleCalculate = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/soil-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop,
          soilType,
          landArea,
          areaUnit,
          soilPh,
          organicCarbon,
          previousCrop,
          irrigationType,
          language: currentLang,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to calculate fertilizer dose');
      }

      setAdvisory(data.advisory);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error computing fertilizer schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>ICAR Scientific Formulation • खाद व उर्वरक कैलकुलेटर</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Soil Health &amp; NPK Fertilizer Dose Calculator
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            Stop overpaying for excess fertilizer. Calculate exact bags of Urea, DAP, MOP, and Zinc needed for your land with a stage-by-stage application timeline.
          </p>
        </div>
      </div>

      {/* Input Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <span>Farm &amp; Soil Specifications</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Target Crop (फसल):
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {cropsList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Land Size:
              </label>
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={landArea}
                onChange={(e) => setLandArea(Number(e.target.value) || 1)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Unit (इकाई):
              </label>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="acre">Acres (एकड़)</option>
                <option value="hectare">Hectares (हेक्टेयर)</option>
                <option value="bigha">Bighas (बीघा)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Soil Type (मिट्टी का प्रकार):
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {soilTypes.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Soil pH Status:
              </label>
              <select
                value={soilPh}
                onChange={(e) => setSoilPh(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="6.5 - 7.5 (Normal Neutral)">6.5 - 7.5 (Normal Neutral)</option>
                <option value="Under 6.0 (Acidic soil)">Under 6.0 (Acidic soil)</option>
                <option value="Above 8.0 (Alkaline soil)">Above 8.0 (Alkaline / Usar)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Organic Carbon (OC):
              </label>
              <select
                value={organicCarbon}
                onChange={(e) => setOrganicCarbon(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Medium (0.5% - 0.75%)">Medium (0.5% - 0.75%)</option>
                <option value="Low (< 0.5% needs FYM)">Low (&lt; 0.5% needs FYM)</option>
                <option value="High (> 0.75% fertile)">High (&gt; 0.75% fertile)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Previous Crop (पिछली फसल):
              </label>
              <input
                type="text"
                value={previousCrop}
                onChange={(e) => setPreviousCrop(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Irrigation System:
              </label>
              <select
                value={irrigationType}
                onChange={(e) => setIrrigationType(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tubewell / Flood">Tubewell / Flood</option>
                <option value="Drip Irrigation (Fertigation)">Drip Irrigation (Fertigation)</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Rainfed (Barani)">Rainfed (Barani)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Scientific Dosage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Fertilizer &amp; NPK Schedule</span>
              </>
            )}
          </button>

          {errorMsg && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7">
          {advisory ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <div>
                  <h4 className="text-lg font-black text-stone-900">
                    Fertilizer Plan for {crop} ({landArea} {areaUnit})
                  </h4>
                  <p className="text-xs text-stone-500">
                    Calculated for {soilType} • Soil pH: {soilPh}
                  </p>
                </div>
                <div className="bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900">
                  Estimated Cost: {advisory.expectedCostEstimateInr}
                </div>
              </div>

              {/* Total Commercial Fertilizer Bags Cards */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Total Commercial Fertilizers to Purchase:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-amber-800">Urea (46% N)</span>
                    <p className="text-sm sm:text-base font-black text-amber-950 mt-1">
                      {advisory.commercialFertilizersTotal.ureaBags}
                    </p>
                  </div>
                  <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-sky-800">DAP (18:46:0)</span>
                    <p className="text-sm sm:text-base font-black text-sky-950 mt-1">
                      {advisory.commercialFertilizersTotal.dapBags}
                    </p>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-rose-800">MOP (Potash 60%)</span>
                    <p className="text-sm sm:text-base font-black text-rose-950 mt-1">
                      {advisory.commercialFertilizersTotal.mopBags}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">Zinc Sulphate</span>
                    <p className="text-sm sm:text-base font-black text-emerald-950 mt-1">
                      {advisory.commercialFertilizersTotal.zincSulphateKg}
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Timeline Stages */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Stage-by-Stage Application Timeline:
                </h5>
                {advisory.stages.map((stg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        {stg.stageName}
                      </span>
                      <span className="text-[11px] font-medium text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {stg.timing}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {stg.fertilizers.map((fert, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded-md text-xs font-bold bg-white text-stone-800 border border-stone-300"
                        >
                          {fert}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 mt-1">
                      <strong>Method:</strong> {stg.instructions}
                    </p>
                  </div>
                ))}
              </div>

              {/* Organic Soil Enrichment & Micronutrients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                  <h6 className="text-xs font-bold text-emerald-900 mb-1.5">
                    Organic Soil Enrichment:
                  </h6>
                  <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                    {advisory.organicSoilEnrichment.map((org, i) => (
                      <li key={i}>{org}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <h6 className="text-xs font-bold text-stone-800 mb-1.5">
                    Micronutrient Guidelines:
                  </h6>
                  <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
                    {advisory.micronutrientTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Summary Tip */}
              {advisory.summaryTip && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-950">
                  💡 <strong>Expert Agronomist Advice:</strong> {advisory.summaryTip}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center shadow-xs flex flex-col items-center justify-center min-h-[380px] space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center ring-8 ring-emerald-50/50">
                <Sprout className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-800">
                Calculate Exact Nutrient Doses
              </h4>
              <p className="text-xs text-stone-500 max-w-sm">
                Enter your crop, land acreage, and soil type on the left to generate an ICAR-compliant fertilizer schedule with bag counts and basal application timings.
              </p>
              <button
                onClick={handleCalculate}
                className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Compute Wheat Baseline (2 Acres)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
