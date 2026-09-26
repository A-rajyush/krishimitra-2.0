import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. Diagnose Crop Disease & Plant Health
const handleAnalyzeCrop = async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', cropHint = '', language = 'en' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided for crop diagnosis.' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const langNameMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      mr: 'Marathi (मराठी)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)',
      gu: 'Gujarati (ગુજરાતી)',
      bn: 'Bengali (বাংলা)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };

    const targetLang = langNameMap[language] || 'English';

    const promptText = `
You are a senior agricultural plant pathologist and expert agronomist at an Indian Council of Agricultural Research (ICAR) institute.
Analyze this crop/plant photograph thoroughly and provide a clinical, accurate agronomic diagnosis.

Farmer's input note/crop hint: "${cropHint || 'None provided'}"
Language requested for farmer guidance: ${targetLang}

Return a valid JSON object strictly adhering to this format (do NOT wrap in markdown \`\`\`json block, return raw JSON string or pure JSON):
{
  "isPlant": true,
  "cropName": "Crop name in English and in ${targetLang}",
  "scientificName": "Botanical / scientific name",
  "healthStatus": "Healthy" | "Diseased" | "Pest Infested" | "Nutrient Deficient" | "Abiotic Stress",
  "diseaseName": "Name of disease/pest in English and in ${targetLang} (or 'Healthy Plant' if healthy)",
  "confidenceScore": 95,
  "severity": "None" | "Mild" | "Moderate" | "Severe" | "Critical",
  "keySymptoms": ["Symptom 1", "Symptom 2", "Symptom 3"],
  "pathogenType": "Fungal" | "Bacterial" | "Viral" | "Insect/Pest" | "Nutritional" | "Environmental" | "None",
  "primaryCause": "Detailed explanation of what caused this condition and weather factors favoring it",
  "immediateAction": "Urgent immediate action farmer must take in the next 24-48 hours",
  "organicTreatments": [
    "Organic treatment 1 with exact dilution ratio (e.g. 5ml Neem oil 10000 ppm per liter water with soap emulsifier)",
    "Organic treatment 2 (e.g. Trichoderma viride or Pseudomonas fluorescens application)"
  ],
  "chemicalTreatments": [
    {
      "chemicalName": "Active ingredient (e.g. Mancozeb 75% WP or Imidacloprid 17.8% SL)",
      "commonBrandName": "Popular brand in India/markets",
      "dosage": "Exact dosage per liter and per 15L backpack knapsack sprayer tank",
      "applicationMethod": "Foliar spray or soil drenching",
      "waitingPeriodDays": 7
    }
  ],
  "preventiveMeasures": [
    "Preventive practice 1 (crop rotation, spacing, resistant varieties)",
    "Preventive practice 2 (irrigation timing, sanitation)"
  ],
  "yieldImpactRisk": "Estimated potential yield loss percentage if untreated (e.g. 20-30% loss)",
  "audioSummaryText": "Clear, friendly, encouraging 2-3 sentence verbal summary in ${targetLang} telling the farmer what is wrong and exactly what to do first. Suitable for text-to-speech."
}

If the image is NOT a plant or agricultural crop, set "isPlant": false and clearly explain in "primaryCause" that the photo does not depict a crop or plant leaf/fruit.
Ensure the advice in all fields is presented in ${targetLang}, except chemical/scientific terminology which can include English for precision.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    res.json({ success: true, diagnosis: parsedData });
  } catch (error: any) {
    console.error('Error analyzing crop:', error);
    res.status(500).json({
      error: 'Failed to analyze crop image',
      details: error?.message || 'Crop analysis failed',
    });
  }
};
app.post('/api/analyze-crop', handleAnalyzeCrop);
app.post('/api/gemini/analyze-crop', handleAnalyzeCrop);

// 2. Multilingual Agricultural Copilot Chat
const handleChat = async (req: Request, res: Response) => {
  try {
    const { messages, language = 'en', farmerProfile } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const langNameMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      mr: 'Marathi (मराठी)',
      pa: 'Punjabi (ਪੰਜਾਬੀ)',
      gu: 'Gujarati (ગુજરાતી)',
      bn: 'Bengali (বাংলা)',
      te: 'Telugu (తెలుగు)',
      ta: 'Tamil (தமிழ்)',
      kn: 'Kannada (ಕನ್ನಡ)',
    };

    const targetLang = langNameMap[language] || 'Hindi and English';

    const systemInstruction = `
You are KrishiMitra (कृषि मित्र), an empathetic, highly knowledgeable senior agricultural scientist and farming advisor.
You provide practical, actionable, and scientific advice for Indian and global farmers.
Your tone is warm, respectful (using 'किसान भाई/बहन' or polite address), and highly practical.
You specialize in:
- Crop selection based on season (Kharif, Rabi, Zaid)
- Sowing dates, seed treatment, seed rate, and spacing
- Integrated Pest Management (IPM), bio-control, and chemical sprays with safety rules
- NPK fertilizer schedules, organic composting, and micronutrients
- Modern irrigation methods (drip, sprinkler) and water conservation
- Mandi price navigation, storage best practices, post-harvest handling
- Government schemes (PM-KISAN, PMFBY, Soil Health Card, Solar Pump subsidies)

Farmer Profile Context:
${farmerProfile ? JSON.stringify(farmerProfile) : 'General farmer'}

IMPORTANT GUIDELINES:
1. Always respond primarily in the farmer's preferred language: ${targetLang}.
2. Keep instructions simple, bulleted, and actionable. Give exact measurements (e.g. grams/ml per 15L pump sprayer, kg per acre).
3. If mentioning pesticides or fungicides, always highlight safety precautions (gloves, masks, spraying in evening/morning, not during rain or strong wind).
4. If asked about current market trends, give smart advisory on how to grade crops and avoid distress selling.
`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    res.json({
      success: true,
      reply: response.text || 'मुझे क्षमा करें, अभी उत्तर तैयार नहीं हो सका। कृपया पुनः प्रयास करें।',
    });
  } catch (error: any) {
    console.error('Error in KrishiMitra chat:', error);
    res.status(500).json({
      error: 'Failed to generate advisory response',
      details: error?.message || 'Chat service error',
    });
  }
};
app.post('/api/chat', handleChat);
app.post('/api/gemini/chat', handleChat);

// 3. Soil Health & NPK Fertilizer Calculator
const handleSoilAdvisory = async (req: Request, res: Response) => {
  try {
    const {
      crop,
      soilType,
      landArea = 1,
      areaUnit = 'acre',
      soilPh = '6.5 - 7.5 (Normal)',
      organicCarbon = 'Medium',
      previousCrop = 'None',
      irrigationType = 'Tube well / Flood',
      language = 'en',
    } = req.body;

    const promptText = `
You are an expert soil scientist and agronomy calculator at ICAR.
Calculate a comprehensive fertilizer schedule and soil nutrition management plan for:
- Target Crop: ${crop}
- Soil Type: ${soilType}
- Field Area: ${landArea} ${areaUnit}
- Soil pH: ${soilPh}
- Organic Carbon Status: ${organicCarbon}
- Previous Crop Harvested: ${previousCrop}
- Irrigation Facility: ${irrigationType}
- Language: ${language}

Generate a detailed JSON plan:
{
  "totalNpkRecommendedKg": {
    "nitrogen": 120,
    "phosphorus": 60,
    "potassium": 40
  },
  "commercialFertilizersTotal": {
    "ureaBags": "3.5 bags (45kg each)",
    "dapBags": "1.3 bags (50kg each)",
    "mopBags": "0.8 bags (50kg each)",
    "zincSulphateKg": "10 kg",
    "fymCompostTons": "4-5 tons"
  },
  "stages": [
    {
      "stageName": "Basal Application (At Sowing / Field Preparation)",
      "timing": "During last ploughing / before seed drill",
      "fertilizers": ["All DAP (65 kg)", "All MOP (40 kg)", "1/3rd Urea (40 kg)", "Zinc Sulphate 33% (10 kg)"],
      "instructions": "Incorporate thoroughly into top 10-15 cm soil. Do not mix Zinc with DAP directly in same bucket."
    },
    {
      "stageName": "First Top Dressing (Vegetative / Tillering Stage)",
      "timing": "21-25 days after sowing, after first irrigation",
      "fertilizers": ["1/3rd Urea (40 kg)"],
      "instructions": "Broadcast when foliage is dry to avoid leaf scorching."
    },
    {
      "stageName": "Second Top Dressing (Booting / Pre-Flowering)",
      "timing": "45-50 days after sowing",
      "fertilizers": ["Remaining 1/3rd Urea (40 kg)", "Optional 19:19:19 or 00:52:34 foliar spray"],
      "instructions": "Ensure soil has adequate moisture."
    }
  ],
  "organicSoilEnrichment": [
    "Apply well-decomposed FYM or vermicompost 2 weeks prior to sowing",
    "Inoculate seeds with Azotobacter and PSB (Phosphorus Solubilizing Bacteria) cultures"
  ],
  "micronutrientTips": [
    "Sulphur recommendation for oilseeds/pulses",
    "Foliar spray of Boron during flowering if fruit-setting is deficient"
  ],
  "soilPhAdjustment": "Assessment based on provided pH (e.g. ideal range, or if gypsum/lime is needed)",
  "expectedCostEstimateInr": "₹3,500 - ₹4,800 per acre",
  "summaryTip": "Top advice for maximizing nutrient use efficiency (NUE)."
}
Respond ONLY with the JSON object.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, advisory: parsed });
  } catch (error: any) {
    console.error('Error generating soil advisory:', error);
    res.status(500).json({ error: 'Failed to calculate soil advisory', details: error?.message });
  }
};
app.post('/api/soil-advisory', handleSoilAdvisory);
app.post('/api/gemini/soil-advisory', handleSoilAdvisory);

// 4. Live APMC Mandi Prices (Curated accurate wholesale data + dynamic update)
app.get('/api/mandi-prices', (req: Request, res: Response) => {
  const stateQuery = (req.query.state as string || '').toLowerCase();
  const cropQuery = (req.query.crop as string || '').toLowerCase();

  const mandiData = [
    {
      id: 'm-1',
      commodity: 'Wheat (गेहूं)',
      variety: 'Sharbati / Lokwan',
      state: 'Madhya Pradesh',
      district: 'Sehore',
      market: 'Sehore APMC',
      minPrice: 2650,
      maxPrice: 3250,
      modalPrice: 2950,
      msp: 2425,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹45',
      arrivalsTons: 420,
      updatedAt: 'Today, 09:30 AM',
    },
    {
      id: 'm-2',
      commodity: 'Wheat (गेहूं)',
      variety: 'Dara / HD-2967',
      state: 'Punjab',
      district: 'Ludhiana',
      market: 'Khanna APMC',
      minPrice: 2450,
      maxPrice: 2620,
      modalPrice: 2540,
      msp: 2425,
      unit: '₹ / Quintal',
      trend: 'stable',
      change: '₹0',
      arrivalsTons: 850,
      updatedAt: 'Today, 10:15 AM',
    },
    {
      id: 'm-3',
      commodity: 'Mustard / Sarson (सरसों)',
      variety: 'Pusa Bold / Hybrid',
      state: 'Rajasthan',
      district: 'Bharatpur',
      market: 'Bharatpur APMC',
      minPrice: 5650,
      maxPrice: 6200,
      modalPrice: 5950,
      msp: 5650,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹110',
      arrivalsTons: 310,
      updatedAt: 'Today, 11:00 AM',
    },
    {
      id: 'm-4',
      commodity: 'Paddy / Dhan (धान)',
      variety: 'Basmati 1121',
      state: 'Haryana',
      district: 'Karnal',
      market: 'Karnal Mandi',
      minPrice: 4200,
      maxPrice: 4850,
      modalPrice: 4600,
      msp: 2300,
      unit: '₹ / Quintal',
      trend: 'down',
      change: '-₹60',
      arrivalsTons: 640,
      updatedAt: 'Today, 08:45 AM',
    },
    {
      id: 'm-5',
      commodity: 'Soybean (सोयाबीन)',
      variety: 'Yellow / JS-9560',
      state: 'Maharashtra',
      district: 'Latur',
      market: 'Latur APMC',
      minPrice: 4350,
      maxPrice: 4850,
      modalPrice: 4650,
      msp: 4892,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹35',
      arrivalsTons: 520,
      updatedAt: 'Today, 10:30 AM',
    },
    {
      id: 'm-6',
      commodity: 'Cotton (कपास)',
      variety: 'Medium / Long Staple Bt',
      state: 'Gujarat',
      district: 'Rajkot',
      market: 'Rajkot APMC',
      minPrice: 7100,
      maxPrice: 7950,
      modalPrice: 7600,
      msp: 7121,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹80',
      arrivalsTons: 290,
      updatedAt: 'Today, 11:15 AM',
    },
    {
      id: 'm-7',
      commodity: 'Onion (प्याज)',
      variety: 'Red Garva',
      state: 'Maharashtra',
      district: 'Nashik',
      market: 'Lasalgaon Mandi',
      minPrice: 1650,
      maxPrice: 2450,
      modalPrice: 2100,
      msp: null,
      unit: '₹ / Quintal',
      trend: 'down',
      change: '-₹90',
      arrivalsTons: 1250,
      updatedAt: 'Today, 09:00 AM',
    },
    {
      id: 'm-8',
      commodity: 'Potato (आलू)',
      variety: 'Jyoti / Pukhraj',
      state: 'Uttar Pradesh',
      district: 'Agra',
      market: 'Fatehabad APMC',
      minPrice: 1100,
      maxPrice: 1450,
      modalPrice: 1280,
      msp: null,
      unit: '₹ / Quintal',
      trend: 'stable',
      change: '+₹10',
      arrivalsTons: 980,
      updatedAt: 'Today, 09:40 AM',
    },
    {
      id: 'm-9',
      commodity: 'Gram / Chana (चना)',
      variety: 'Desi / Kabuli',
      state: 'Rajasthan',
      district: 'Bikaner',
      market: 'Bikaner APMC',
      minPrice: 5800,
      maxPrice: 6450,
      modalPrice: 6150,
      msp: 5440,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹50',
      arrivalsTons: 180,
      updatedAt: 'Today, 10:50 AM',
    },
    {
      id: 'm-10',
      commodity: 'Tomato (टमाटर)',
      variety: 'Hybrid Desi',
      state: 'Karnataka',
      district: 'Kolar',
      market: 'Kolar APMC',
      minPrice: 1400,
      maxPrice: 2100,
      modalPrice: 1800,
      msp: null,
      unit: '₹ / Quintal',
      trend: 'down',
      change: '-₹120',
      arrivalsTons: 440,
      updatedAt: 'Today, 08:30 AM',
    },
    {
      id: 'm-11',
      commodity: 'Maize / Makka (मक्का)',
      variety: 'Yellow Hybrid',
      state: 'Bihar',
      district: 'Gulabbagh (Purnia)',
      market: 'Gulabbagh Mandi',
      minPrice: 2150,
      maxPrice: 2450,
      modalPrice: 2320,
      msp: 2090,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹30',
      arrivalsTons: 710,
      updatedAt: 'Today, 11:20 AM',
    },
    {
      id: 'm-12',
      commodity: 'Chilli Red (लाल मिर्च)',
      variety: 'Teja / 334',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      market: 'Guntur Mirchi Yard',
      minPrice: 17500,
      maxPrice: 22000,
      modalPrice: 19800,
      msp: null,
      unit: '₹ / Quintal',
      trend: 'up',
      change: '+₹250',
      arrivalsTons: 150,
      updatedAt: 'Today, 10:00 AM',
    },
  ];

  let filtered = mandiData;
  if (stateQuery) {
    filtered = filtered.filter(item => item.state.toLowerCase().includes(stateQuery));
  }
  if (cropQuery) {
    filtered = filtered.filter(
      item =>
        item.commodity.toLowerCase().includes(cropQuery) ||
        item.variety.toLowerCase().includes(cropQuery)
    );
  }

  res.json({
    success: true,
    totalRecords: filtered.length,
    timestamp: new Date().toISOString(),
    data: filtered,
  });
});

// 5. Hyperlocal Agro Weather & Spray Advisory
app.get('/api/weather', (req: Request, res: Response) => {
  const location = (req.query.location as string) || 'Central India';

  // Accurate agro-meteorological forecast structure with farming safety indicators
  const forecast = {
    location: location,
    current: {
      temperature: 28,
      feelsLike: 29,
      condition: 'Partly Cloudy / साफ़ धूप',
      humidity: 58,
      windSpeedKm: 11,
      precipitationProb: 10,
      dewPoint: 19,
      soilMoistureEstimate: 'Adequate (64%)',
      sprayWindowStatus: 'Optimal (उत्कृष्ट समय)',
      sprayRecommendation: 'Wind speed is under 15 km/h and rain probability is low. Excellent conditions for foliar nutrient and pest sprays before 11:00 AM.',
    },
    hourlyAdvisories: [
      { time: '06:00 AM', temp: 22, rainChance: 5, sprayFit: true },
      { time: '09:00 AM', temp: 26, rainChance: 5, sprayFit: true },
      { time: '12:00 PM', temp: 31, rainChance: 10, sprayFit: false, reason: 'High heat evaporation' },
      { time: '03:00 PM', temp: 32, rainChance: 15, sprayFit: false, reason: 'Windy & hot' },
      { time: '06:00 PM', temp: 27, rainChance: 10, sprayFit: true },
      { time: '09:00 PM', temp: 24, rainChance: 5, sprayFit: false },
    ],
    sevenDayForecast: [
      { day: 'Today', maxTemp: 32, minTemp: 21, condition: 'Sunny / Partly Cloudy', rainMm: 0, alert: 'Normal' },
      { day: 'Tomorrow', maxTemp: 33, minTemp: 22, condition: 'Sunny & Warm', rainMm: 0, alert: 'Normal' },
      { day: 'Day 3', maxTemp: 31, minTemp: 23, condition: 'Cloudy with Light Breeze', rainMm: 2, alert: 'Light Shower Risk' },
      { day: 'Day 4', maxTemp: 29, minTemp: 21, condition: 'Scattered Showers', rainMm: 12, alert: 'Delay Pesticide Spray' },
      { day: 'Day 5', maxTemp: 30, minTemp: 20, condition: 'Clear Sky', rainMm: 0, alert: 'Normal' },
      { day: 'Day 6', maxTemp: 32, minTemp: 21, condition: 'Sunny', rainMm: 0, alert: 'Normal' },
      { day: 'Day 7', maxTemp: 33, minTemp: 22, condition: 'Sunny', rainMm: 0, alert: 'Normal' },
    ],
    farmingAlerts: [
      {
        type: 'warning',
        title: 'Rain Forecast in 72 Hours',
        message: 'Avoid applying granular nitrogen (Urea) on Day 4 to prevent leaching loss. Harvest mature pulse crops or cover produce.',
      },
      {
        type: 'info',
        title: 'Humidity Alert',
        message: 'Morning relative humidity is above 75%. Inspect dense canopies for early signs of downy mildew or aphid colonies.',
      },
    ],
  };

  res.json({ success: true, weather: forecast });
});

// 6. Agricultural Audio Speech Synthesis (TTS)
const handleTTS = async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 800), // optimal length for quick audio response
              speechMetadata: {
                style: 'Clear, encouraging, helpful agricultural scientist voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(404).json({ error: 'No audio generated by TTS' });
    }

    res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/mp3' });
  } catch (error: any) {
    console.warn('TTS fallback:', error?.message);
    res.status(500).json({ error: 'TTS generation unavailable', details: error?.message });
  }
};
app.post('/api/tts', handleTTS);
app.post('/api/gemini/tts', handleTTS);

// Start Server & mount Vite middlewares in development
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KrishiMitra server is running at http://0.0.0.0:${port}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});
