import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  ShieldCheck,
  RefreshCw,
  Info,
  Bug,
  Leaf,
  Layers,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { CropDiagnosis, LanguageCode } from '../types';
import { SAMPLE_CROPS, SampleCrop } from '../data/sampleCrops';
import { UI_TEXTS } from '../data/translations';

interface CropDoctorProps {
  currentLang: LanguageCode;
}

export const CropDoctor: React.FC<CropDoctorProps> = ({ currentLang }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_CROPS[0].imageUrl);
  const [cropHint, setCropHint] = useState<string>('Wheat / गेहूं');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<CropDiagnosis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = UI_TEXTS[currentLang] || UI_TEXTS.en;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setDiagnosis(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const selectSample = (sample: SampleCrop) => {
    setSelectedImage(sample.imageUrl);
    setCropHint(sample.hint);
    setDiagnosis(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setErrorMsg('Please upload or select a crop image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setDiagnosis(null);

    // Stop existing speech if any
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const response = await fetch('/api/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
          cropHint: cropHint,
          language: currentLang,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Analysis failed');
      }

      setDiagnosis(data.diagnosis);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze crop. Please verify connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Audio speech synthesis helper
  const handleToggleSpeak = async (text: string) => {
    if (isSpeaking) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioRef.current) audioRef.current.pause();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    // Try audio TTS service
    try {
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore' }),
      });
      if (ttsRes.ok) {
        const ttsData = await ttsRes.json();
        if (ttsData.audioBase64) {
          const audio = new Audio(`data:audio/mp3;base64,${ttsData.audioBase64}`);
          audioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => fallbackBrowserSpeech(text);
          audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('Falling back to browser speech synthesis', e);
    }

    fallbackBrowserSpeech(text);
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'severe':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'mild':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Leaf className="w-80 h-80" />
        </div>
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Plant Pathologist &amp; Doctor • फसल चिकित्सक</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Instant Crop Disease Diagnosis &amp; Scientific Cure
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Take a photo of diseased leaves, fruits, or stems. The clinical pathology scanner analyzes pathogen symptoms, calculates severity, and provides immediate organic remedies and exact fungicide dosages.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Image Upload & Preset samples (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>{t.uploadTitle}</span>
              </h2>
              <span className="text-[11px] font-medium text-stone-500">Live AI Vision</span>
            </div>

            {/* Image Preview Box */}
            <div className="relative rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-500 transition-colors bg-stone-50 overflow-hidden min-h-[240px] flex flex-col items-center justify-center p-3 group">
              {selectedImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Crop Leaf Preview"
                    className="max-h-64 w-full object-contain rounded-lg shadow-xs"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 px-3 py-1.5 bg-stone-900/80 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-stone-700">
                    Click to upload leaf or plant photo
                  </p>
                  <p className="text-[11px] text-stone-400">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Hidden Input Files */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              className="hidden"
            />

            {/* Action Buttons: Camera & Gallery */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-200"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>{t.takePhoto}</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-200"
              >
                <Upload className="w-4 h-4 text-emerald-700" />
                <span>{t.chooseGallery}</span>
              </button>
            </div>

            {/* Crop Hint input */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Crop Name / Symptoms Hint (Optional):
              </label>
              <input
                type="text"
                value={cropHint}
                onChange={(e) => setCropHint(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Paddy, Cotton leaf yellowing..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* 1-Click Sample Previews for instant test */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-700">
                  Or Test with Sample Photos (1-Click):
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Quick Demo</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_CROPS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => selectSample(sample)}
                    className="flex items-center gap-2 p-1.5 rounded-lg border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all text-left group"
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-10 h-10 object-cover rounded-md border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-stone-800 truncate group-hover:text-emerald-900">
                        {sample.name}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">
                        {sample.hindiName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Diagnose Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedImage}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                isAnalyzing
                  ? 'bg-emerald-800 opacity-80 cursor-wait'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] shadow-emerald-700/20'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.analyzing}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.getAdvice}</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnostic Results (7 cols) */}
        <div className="lg:col-span-7">
          {diagnosis ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-5 animate-in fade-in duration-300">
              
              {/* Header Status & Audio readout */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityBadgeClass(diagnosis.severity)}`}>
                      Severity: {diagnosis.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                      {diagnosis.pathogenType} Pathogen
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      {diagnosis.confidenceScore}% confidence
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    {diagnosis.diseaseName}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    Crop: <strong className="text-stone-800">{diagnosis.cropName}</strong> {diagnosis.scientificName && `(${diagnosis.scientificName})`}
                  </p>
                </div>

                {/* Voice Readout Button */}
                {diagnosis.audioSummaryText && (
                  <button
                    onClick={() => handleToggleSpeak(diagnosis.audioSummaryText)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                      isSpeaking
                        ? 'bg-amber-600 text-white animate-pulse'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>{t.speaking}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>{t.voiceSummary}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Immediate Action Banner (24-48 hrs) */}
              {diagnosis.immediateAction && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        {t.immediateAction}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-amber-900 mt-1 leading-relaxed">
                        {diagnosis.immediateAction}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Symptoms */}
              {diagnosis.keySymptoms && diagnosis.keySymptoms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-700" />
                    <span>{t.symptoms} &amp; Cause</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {diagnosis.keySymptoms.map((sym, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                  {diagnosis.primaryCause && (
                    <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                      <strong>Causal Factors:</strong> {diagnosis.primaryCause}
                    </p>
                  )}
                </div>
              )}

              {/* Organic Remedies */}
              {diagnosis.organicTreatments && diagnosis.organicTreatments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-700" />
                    <span>{t.organicCure} (Natural / Eco-friendly)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {diagnosis.organicTreatments.map((org, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-emerald-950 bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-lg flex items-start gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{org}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chemical Fungicide/Pesticide Table with exact dosages */}
              {diagnosis.chemicalTreatments && diagnosis.chemicalTreatments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-blue-700" />
                    <span>{t.chemicalCure}</span>
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-stone-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                        <tr>
                          <th className="p-2.5">Chemical / Active Ingredient</th>
                          <th className="p-2.5">Dosage / 15L Knapsack Tank</th>
                          <th className="p-2.5">Method</th>
                          <th className="p-2.5">Safety Wait (PHI)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {diagnosis.chemicalTreatments.map((chem, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="p-2.5 font-semibold text-stone-900">
                              {chem.chemicalName}
                              {chem.commonBrandName && (
                                <span className="block text-[10px] text-stone-500 font-normal">
                                  Brand: {chem.commonBrandName}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-stone-700 font-medium">
                              {chem.dosage}
                            </td>
                            <td className="p-2.5 text-stone-600">
                              {chem.applicationMethod}
                            </td>
                            <td className="p-2.5 text-stone-600 font-mono">
                              {chem.waitingPeriodDays} days
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Preventive Measures */}
              {diagnosis.preventiveMeasures && diagnosis.preventiveMeasures.length > 0 && (
                <div className="pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Future Prevention &amp; Field Care</span>
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                    {diagnosis.preventiveMeasures.map((prev, idx) => (
                      <li key={idx}>{prev}</li>
                    ))}
                  </ul>
                  {diagnosis.yieldImpactRisk && (
                    <p className="text-[11px] text-amber-800 font-semibold mt-2">
                      ⚠️ Potential Yield Impact if untreated: {diagnosis.yieldImpactRisk}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Empty state when no diagnosis yet */
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center shadow-xs flex flex-col items-center justify-center min-h-[380px] space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center ring-8 ring-emerald-50/50">
                <Leaf className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-stone-800">
                  Ready to Diagnose Your Crop Health
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Upload an image from your field or click one of the quick demo samples on the left, then click <strong>"{t.getAdvice}"</strong>. The system will analyze the leaf texture, pustules, lesions, and provide verified agronomic treatment.
                </p>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <span>Run Diagnosis Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
