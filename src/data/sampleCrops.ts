import { GovtScheme } from '../types';

export interface SampleCrop {
  id: string;
  name: string;
  hindiName: string;
  condition: string;
  hint: string;
  imageUrl: string;
}

// Crisp base64 / SVG representations of leaf symptoms for instant one-click testing
export const SAMPLE_CROPS: SampleCrop[] = [
  {
    id: 'sample-wheat-rust',
    name: 'Wheat Yellow Stripe Rust',
    hindiName: 'गेहूं का पीला रतुआ (Puccinia striiformis)',
    condition: 'Puccinia striiformis (Yellow Rust)',
    hint: 'Wheat crop leaf showing yellow stripes and powdery pustules',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%232d5a27"/><path d="M50 380 Q 280 60 550 380" fill="%234d7c0f" stroke="%233f6212" stroke-width="8"/><g fill="%23eab308" opacity="0.9"><ellipse cx="180" cy="220" rx="40" ry="12" transform="rotate(-35 180 220)"/><ellipse cx="230" cy="180" rx="55" ry="14" transform="rotate(-30 230 180)"/><ellipse cx="300" cy="150" rx="70" ry="15" transform="rotate(-20 300 150)"/><ellipse cx="380" cy="170" rx="60" ry="14" transform="rotate(15 380 170)"/><ellipse cx="440" cy="220" rx="45" ry="12" transform="rotate(30 440 220)"/></g><g fill="%23ca8a04"><circle cx="210" cy="200" r="5"/><circle cx="270" cy="165" r="6"/><circle cx="340" cy="155" r="5"/><circle cx="410" cy="190" r="6"/></g><text x="300" y="360" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23fef08a" text-anchor="middle">Wheat Yellow Rust (Puccinia)</text></svg>',
  },
  {
    id: 'sample-tomato-blight',
    name: 'Tomato Early Blight',
    hindiName: 'टमाटर का अगेती झुलसा (Alternaria solani)',
    condition: 'Alternaria solani (Early Blight with target spots)',
    hint: 'Tomato plant leaf with dark brown concentric bullseye rings',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23166534"/><path d="M100 200 C 150 50, 450 50, 500 200 C 450 350, 150 350, 100 200 Z" fill="%2315803d"/><circle cx="240" cy="180" r="45" fill="%2378350f" opacity="0.85"/><circle cx="240" cy="180" r="32" fill="%23451a03"/><circle cx="240" cy="180" r="16" fill="%2378350f"/><circle cx="360" cy="220" r="50" fill="%2378350f" opacity="0.85"/><circle cx="360" cy="220" r="35" fill="%23451a03"/><circle cx="360" cy="220" r="18" fill="%2378350f"/><path d="M100 200 Q 300 200 500 200" stroke="%23facc15" stroke-width="4" stroke-dasharray="8 6"/><text x="300" y="360" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23fef08a" text-anchor="middle">Tomato Early Blight (Alternaria solani)</text></svg>',
  },
  {
    id: 'sample-rice-blast',
    name: 'Paddy / Rice Blast',
    hindiName: 'धान का ब्लास्ट / झोंका रोग (Magnaporthe oryzae)',
    condition: 'Rice Blast fungal lesions',
    hint: 'Rice blade with spindle-shaped necrotic lesions with grey centres',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2314532d"/><path d="M80 350 Q 250 80 520 220" fill="none" stroke="%2322c55e" stroke-width="60" stroke-linecap="round"/><g fill="%23991b1b" stroke="%237f1d1d" stroke-width="3"><polygon points="220,170 270,160 320,170 270,185"/><polygon points="340,190 390,180 430,195 380,205"/><ellipse cx="270" cy="172" rx="15" ry="6" fill="%23e5e7eb"/><ellipse cx="385" cy="192" rx="12" ry="5" fill="%23e5e7eb"/></g><text x="300" y="360" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23fef08a" text-anchor="middle">Rice Blast (Magnaporthe oryzae)</text></svg>',
  },
  {
    id: 'sample-healthy-crop',
    name: 'Healthy Mustard Leaf',
    hindiName: 'स्वस्थ सरसों की फसल (Healthy Crop)',
    condition: 'Healthy dark green vibrant plant tissue',
    hint: 'Healthy Brassica mustard leaf with strong turgor and no pathogen lesions',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23064e3b"/><path d="M120 200 C 180 70, 420 70, 480 200 C 420 330, 180 330, 120 200 Z" fill="%2316a34a"/><path d="M120 200 L 480 200" stroke="%2386efac" stroke-width="6"/><path d="M220 200 L 260 140 M 220 200 L 260 260 M 340 200 L 380 140 M 340 200 L 380 260" stroke="%2386efac" stroke-width="3"/><circle cx="480" cy="140" r="16" fill="%23facc15"/><text x="300" y="360" font-family="sans-serif" font-size="20" font-weight="bold" fill="%2386efac" text-anchor="middle">Healthy Mustard Plant (No disease)</text></svg>',
  },
];

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    hindiTitle: 'प्रधानमंत्री किसान सम्मान निधि योजना',
    category: 'Financial Assistance',
    benefit: '₹6,000 direct income support per year in 3 equal installments of ₹2,000 directly into farmer bank accounts via DBT.',
    eligibility: 'All small, marginal, and landholding farmer families with cultivable land in their names.',
    documents: ['Aadhaar Card', 'Land Ownership Records (Khatauni / Jamabandi)', 'Bank Account details (DBT linked)', 'Mobile number linked to Aadhaar'],
    portalUrl: 'https://pmkisan.gov.in',
  },
  {
    id: 'pmfby',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    hindiTitle: 'प्रधानमंत्री फसल बीमा योजना (फसल सुरक्षा)',
    category: 'Insurance',
    benefit: 'Comprehensive crop insurance covering non-preventable natural risks (drought, flood, unseasonal rain, pest outbreaks). Premium: Only 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops.',
    eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
    documents: ['Land Possession Certificate (LPC) or Sowing Certificate', 'Aadhaar Card', 'Bank Passbook copy', 'Crop sowing declaration'],
    portalUrl: 'https://pmfby.gov.in',
  },
  {
    id: 'pm-kusum',
    title: 'PM-KUSUM Solar Pump Scheme',
    hindiTitle: 'पीएम-कुसुम सौर ऊर्जा पंप योजना',
    category: 'Equipment & Solar',
    benefit: 'Up to 60% government subsidy (30% Central + 30% State) to install solar agricultural irrigation pumps, replacing diesel pumps and saving huge electricity costs.',
    eligibility: 'Individual farmers, farmer groups, cooperatives, and water user associations with farmland requiring irrigation.',
    documents: ['Land ownership documents', 'Aadhaar Card', 'Electricity bill (if grid-connected)', 'Bank account details'],
    portalUrl: 'https://pmkusum.mnre.gov.in',
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    hindiTitle: 'मृदा स्वास्थ्य कार्ड योजना',
    category: 'Soil & Water',
    benefit: 'Free soil testing report covering 12 nutrient parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) along with customized fertilizer dosage recommendations to reduce chemical cost by 25%.',
    eligibility: 'Open to all farmers across all Indian states through local Krishi Vigyan Kendras (KVK) and block agriculture offices.',
    documents: ['Farmer Name & Address', 'Khasra / Survey Number of field', 'Soil sample collected by field officer'],
    portalUrl: 'https://soilhealth.dac.gov.in',
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC) & Interest Subvention',
    hindiTitle: 'किसान क्रेडिट कार्ड (सस्ती ब्याज दर पर ऋण)',
    category: 'Financial Assistance',
    benefit: 'Collateral-free agricultural production credit up to ₹1.60 Lakh (and up to ₹3.00 Lakh with low interest rate effective 4% on timely repayment).',
    eligibility: 'Owner cultivators, tenant farmers, oral lessees, sharecroppers, and SHGs of farmers.',
    documents: ['Filled application form', 'Identity and address proof (Aadhaar / Voter ID)', 'Land records certified by revenue authority'],
    portalUrl: 'https://myscheme.gov.in/schemes/kcc',
  },
];
