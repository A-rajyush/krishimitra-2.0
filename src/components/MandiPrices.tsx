import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  RefreshCw,
  Calculator,
  IndianRupee,
  Building2,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { MandiItem, LanguageCode } from '../types';

interface MandiPricesProps {
  currentLang: LanguageCode;
}

export const MandiPrices: React.FC<MandiPricesProps> = ({ currentLang }) => {
  const [mandiItems, setMandiItems] = useState<MandiItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');

  // Revenue Calculator States
  const [calcCropId, setCalcCropId] = useState<string>('');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(25);

  const fetchMandiData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mandi-prices');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMandiItems(data.data);
        if (data.data.length > 0 && !calcCropId) {
          setCalcCropId(data.data[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching mandi prices:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMandiData();
  }, []);

  const states = ['All', ...Array.from(new Set(mandiItems.map((item) => item.state)))];

  const filteredItems = mandiItems.filter((item) => {
    const matchesState = selectedState === 'All' || item.state === selectedState;
    const matchesQuery =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesQuery;
  });

  const selectedCalcItem = mandiItems.find((i) => i.id === calcCropId) || mandiItems[0];
  const calculatedTotal = selectedCalcItem ? selectedCalcItem.modalPrice * quantityQuintals : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>APMC Mandi Bhav • दैनिक कृषि उपज मंडी भाव</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Real-time Wholesale Mandi Commodity Rates
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Live prices across major agricultural markets in India. Compare modal prices with official Minimum Support Prices (MSP) to make informed selling decisions.
          </p>
        </div>

        <button
          onClick={fetchMandiData}
          disabled={loading}
          className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-md transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Harvest Revenue Calculator Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Quick Harvest Value Calculator (कमाई कैलकुलेटर)
            </h3>
            <p className="text-xs text-stone-500">
              Estimate your gross earnings based on today's modal market price
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Select Commodity / Market:
            </label>
            <select
              value={calcCropId}
              onChange={(e) => setCalcCropId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              {mandiItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.commodity} - {item.market} (₹{item.modalPrice}/Qtl)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Harvest Quantity (Quintals / 100 kg):
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              value={quantityQuintals}
              onChange={(e) => setQuantityQuintals(Number(e.target.value) || 0)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-5 bg-amber-50 rounded-xl p-3 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-800 font-semibold block">
                Estimated Gross Value:
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-amber-950 flex items-center">
                <IndianRupee className="w-4 h-4 inline" />
                {calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 bg-amber-200/60 px-2 py-1 rounded-md font-mono">
              @ ₹{selectedCalcItem?.modalPrice}/Qtl
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, mandi, district..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* State filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> State:
          </span>
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedState === st
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Price Table / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isAboveMsp = item.msp && item.modalPrice >= item.msp;
          const mspDiff = item.msp ? item.modalPrice - item.msp : null;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-base font-extrabold text-stone-900">
                      {item.commodity}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">
                      Variety: {item.variety}
                    </p>
                  </div>

                  {/* Trend Indicator */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.trend === 'up'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.trend === 'down'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                    {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                    {item.trend === 'stable' && <Minus className="w-3 h-3" />}
                    <span>{item.change}</span>
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-stone-600 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-semibold text-stone-800">{item.market}</span>
                  <span className="text-stone-400">•</span>
                  <span>{item.district}, {item.state}</span>
                </div>

                {/* Prices Highlight */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 mb-3 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500 font-medium">Modal Price (औसत भाव):</span>
                    <span className="text-lg font-extrabold text-emerald-800">
                      ₹{item.modalPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-stone-500">/ Qtl</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-stone-200">
                    <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                    <span className="text-[11px] text-stone-500">Arrivals: {item.arrivalsTons} Tons</span>
                  </div>
                </div>
              </div>

              {/* MSP comparison footer */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                {item.msp ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-400">MSP: ₹{item.msp}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isAboveMsp
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {isAboveMsp ? `+₹${mspDiff} above MSP` : `-₹${Math.abs(mspDiff!)} below MSP`}
                    </span>
                  </div>
                ) : (
                  <span className="text-stone-400 text-[11px]">Free market commodity</span>
                )}
                <span className="text-[10px] text-stone-400">{item.updatedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
          <p className="text-stone-500 text-sm">
            No commodities match your filter criteria. Try clearing search or choosing another state.
          </p>
        </div>
      )}
    </div>
  );
};
