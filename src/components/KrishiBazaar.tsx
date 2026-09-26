import React, { useState } from 'react';
import {
  ShoppingBag,
  Tag,
  MapPin,
  Phone,
  ShieldCheck,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Leaf,
  IndianRupee,
  X,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface BazaarProduct {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'Seeds' | 'Fertilizers & Bio' | 'Equipment & Sprayers' | 'Farmer Produce';
  price: number;
  originalPrice?: number;
  unit: string;
  sellerName: string;
  sellerType: 'Verified Dealer' | 'Certified Farmer' | 'FPO Cooperative';
  location: string;
  state: string;
  rating: number;
  badge?: string;
  inStock: boolean;
  contactPhone: string;
  description: string;
}

const INITIAL_PRODUCTS: BazaarProduct[] = [
  {
    id: 'prod-1',
    title: 'Certified Wheat Seeds (HD-2967 / Pusa)',
    hindiTitle: 'प्रमाणित गेहूं बीज (एचडी-2967)',
    category: 'Seeds',
    price: 1850,
    originalPrice: 2200,
    unit: '40 kg Bag',
    sellerName: 'Kisan Beej Seva Kendra',
    sellerType: 'Verified Dealer',
    location: 'Karnal, Haryana',
    state: 'Haryana',
    rating: 4.8,
    badge: '98% Germination Certified',
    inStock: true,
    contactPhone: '9876543210',
    description: 'High-yielding, rust-resistant certified wheat seed suitable for North Indian plains. Treated with Trichoderma for seedling vigor.',
  },
  {
    id: 'prod-2',
    title: 'Cold-Pressed Neem Oil (10,000 PPM Azadirachtin)',
    hindiTitle: 'शुद्ध नीम तेल (10,000 पीपीएम)',
    category: 'Fertilizers & Bio',
    price: 650,
    originalPrice: 850,
    unit: '1 Litre Bottle',
    sellerName: 'PunarArpan Bio-Agri',
    sellerType: 'FPO Cooperative',
    location: 'Sehore, Madhya Pradesh',
    state: 'Madhya Pradesh',
    rating: 4.9,
    badge: '100% Organic India',
    inStock: true,
    contactPhone: '9823456789',
    description: 'Natural broad-spectrum biopesticide for whitefly, aphid, thrip, and leaf-miner control. Mix 3-5 ml per liter water with soap emulsifier.',
  },
  {
    id: 'prod-3',
    title: '16L Battery Operated Knapsack Sprayer',
    hindiTitle: '16 लीटर बैटरी वाला नैपसैक स्प्रेयर',
    category: 'Equipment & Sprayers',
    price: 2450,
    originalPrice: 3200,
    unit: 'Per Unit (with 12V 8Ah battery)',
    sellerName: 'Bharat Agri Equipments',
    sellerType: 'Verified Dealer',
    location: 'Rajkot, Gujarat',
    state: 'Gujarat',
    rating: 4.7,
    badge: '1 Year Motor Warranty',
    inStock: true,
    contactPhone: '9811223344',
    description: 'Double motor high-pressure sprayer with adjustable brass nozzle, telescopic stainless steel lance, and battery level voltmeter.',
  },
  {
    id: 'prod-4',
    title: 'Organic Enriched Vermicompost (केंचुआ खाद)',
    hindiTitle: 'उच्च गुणवत्ता केंचुआ खाद',
    category: 'Fertilizers & Bio',
    price: 360,
    originalPrice: 450,
    unit: '50 kg Bag',
    sellerName: 'Gramin Krishi FPO',
    sellerType: 'Certified Farmer',
    location: 'Nashik, Maharashtra',
    state: 'Maharashtra',
    rating: 4.9,
    badge: 'NPOP Organic Certified',
    inStock: true,
    contactPhone: '9765432109',
    description: 'Rich in organic carbon, humic acid, and beneficial microbes. Enhances soil water retention and reduces chemical fertilizer requirement.',
  },
  {
    id: 'prod-5',
    title: 'Fresh Farm Mustard (Grade A Organic)',
    hindiTitle: 'खेत की ताज़ा देसी सरसों (ग्रेड-ए)',
    category: 'Farmer Produce',
    price: 5800,
    unit: 'Per Quintal (100 kg)',
    sellerName: 'Suresh Patel (Farmer)',
    sellerType: 'Certified Farmer',
    location: 'Bharatpur, Rajasthan',
    state: 'Rajasthan',
    rating: 5.0,
    badge: 'Direct From Farmer',
    inStock: true,
    contactPhone: '9456789012',
    description: 'Freshly harvested yellow-brown bold mustard seeds with 42% high oil content. Direct farm gate pickup or transport arranged.',
  },
  {
    id: 'prod-6',
    title: 'Hybrid Tomato F1 Seeds (Abhinav / Arka)',
    hindiTitle: 'संकर टमाटर F1 बीज (अर्का रक्षक)',
    category: 'Seeds',
    price: 820,
    originalPrice: 950,
    unit: '10g (approx 3,000 seeds)',
    sellerName: 'National Seed Store',
    sellerType: 'Verified Dealer',
    location: 'Kolar, Karnataka',
    state: 'Karnataka',
    rating: 4.6,
    badge: 'ToLCV Virus Resistant',
    inStock: true,
    contactPhone: '9988776655',
    description: 'Triple disease resistant (ToLCV, Bacterial Wilt, and Early Blight). Excellent fruit firmness suitable for long-distance transport.',
  },
];

interface KrishiBazaarProps {
  currentLang: LanguageCode;
}

export const KrishiBazaar: React.FC<KrishiBazaarProps> = () => {
  const [products, setProducts] = useState<BazaarProduct[]>(INITIAL_PRODUCTS);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [contactSuccess, setContactSuccess] = useState<string | null>(null);

  // New listing form state
  const [newTitle, setNewTitle] = useState('');
  const [newHindi, setNewHindi] = useState('');
  const [newCat, setNewCat] = useState<'Seeds' | 'Fertilizers & Bio' | 'Equipment & Sprayers' | 'Farmer Produce'>('Farmer Produce');
  const [newPrice, setNewPrice] = useState<number>(1000);
  const [newUnit, setNewUnit] = useState('Per Quintal');
  const [newSeller, setNewSeller] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const categories = ['All', 'Seeds', 'Fertilizers & Bio', 'Equipment & Sprayers', 'Farmer Produce'];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesQuery =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.hindiTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newPhone) return;

    const newProd: BazaarProduct = {
      id: 'prod-' + Date.now(),
      title: newTitle,
      hindiTitle: newHindi || newTitle,
      category: newCat,
      price: Number(newPrice),
      unit: newUnit,
      sellerName: newSeller || 'Local Farmer',
      sellerType: 'Certified Farmer',
      location: newLocation || 'Local Mandi',
      state: 'India',
      rating: 5.0,
      badge: 'Direct Farm Listing',
      inStock: true,
      contactPhone: newPhone,
      description: newDesc || 'Fresh agricultural produce direct from farm.',
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewHindi('');
    setNewPhone('');
    setNewDesc('');
  };

  const handleContact = (sellerName: string, phone: string) => {
    setContactSuccess(`Connected with ${sellerName}! Call or WhatsApp at ${phone}`);
    setTimeout(() => setContactSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-3">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Krishi Bazaar • कृषि बाज़ार (Direct Farmer-Dealer Marketplace)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fair Agri-Marketplace for Seeds, Fertilizers &amp; Produce
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Eliminate middlemen margins. Buy certified seeds, neem biopesticides, and farm sprayers with warranties, or list your harvested produce for direct buyers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start md:self-center flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.99]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Your Crop / Equipment (निःशुल्क विज्ञापन)</span>
        </button>
      </div>

      {contactSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{contactSuccess}</span>
          <button onClick={() => setContactSuccess(null)}>✕</button>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search seeds, bio-fertilizer, sprayer..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {prod.category}
                </span>
                {prod.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-700" />
                    <span>{prod.badge}</span>
                  </span>
                )}
              </div>

              <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                {prod.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-800 mb-2">
                {prod.hindiTitle}
              </p>

              <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                {prod.description}
              </p>

              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-3 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">Price:</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-stone-400 line-through ml-2">
                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-500 block">/ {prod.unit}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <p className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Seller: <strong>{prod.sellerName}</strong> ({prod.sellerType})</span>
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{prod.location}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Ready for dispatch
              </span>
              <button
                onClick={() => handleContact(prod.sellerName, prod.contactPhone)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3 h-3" />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post New Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Post Your Produce / Agri-Supplies (नया विज्ञापन जोड़ें)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              List your harvested crops, farm machinery for rent, or organic compost for direct buyers.
            </p>

            <form onSubmit={handleAddListing} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Item Name (English): *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Organic Soybean, High Yield Wheat Seed..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Item Name (Hindi / Regional):
                </label>
                <input
                  type="text"
                  value={newHindi}
                  onChange={(e) => setNewHindi(e.target.value)}
                  placeholder="e.g. जैविक सोयाबीन, गेहूं का बीज..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category:</label>
                  <select
                    value={newCat}
                    onChange={(e: any) => setNewCat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="Farmer Produce">Farmer Produce (फसल)</option>
                    <option value="Seeds">Seeds (बीज)</option>
                    <option value="Fertilizers & Bio">Fertilizers &amp; Bio (खाद)</option>
                    <option value="Equipment & Sprayers">Equipment &amp; Sprayers (उपकरण)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹): *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Unit:</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="Per Quintal, 50kg bag, etc."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Mobile / WhatsApp: *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Farmer / Business Name:</label>
                  <input
                    type="text"
                    value={newSeller}
                    onChange={(e) => setNewSeller(e.target.value)}
                    placeholder="Your Name"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Village / District / State:</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Sehore, Madhya Pradesh"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details about quality, moisture content, variety..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
              >
                Publish Listing Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
