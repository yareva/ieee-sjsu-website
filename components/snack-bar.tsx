'use client';

import { ExternalLink } from 'lucide-react';

export function SnackBar() {
  const drinks = [
    { name: 'Red Bull Energy Drink', price: '$3.00' },
  ];

  const snacks = [
    { name: 'Doritos Nacho Cheese', price: '$1.50' },
    { name: 'Doritos Cool Ranch', price: '$1.50' },
    { name: "Lay's Classic", price: '$1.50' },
    { name: "Lay's Barbecue", price: '$1.50' },
    { name: 'Ruffles Cheddar', price: '$1.50' },
    { name: 'Cheetos', price: '$1.50' },
    { name: 'Fritos Corn Chips', price: '$1.50' },
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-xl mx-auto">
        {/* Apple-style compact card */}
        <div className="bg-white border border-[#e5e5ea] rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-[#1d1d1f] mb-1">
                Innovation Garage Snack Bar
              </h3>
              <p className="text-sm text-[#6e6e73]">Stop by ENGR 376 between classes</p>
            </div>
            {/* Flyer image slot */}
            <div className="w-14 h-14 bg-[#f5f5f7] rounded-lg flex-shrink-0 hidden sm:flex items-center justify-center border border-[#e5e5ea]">
              <span className="text-[9px] text-[#6e6e73]">Flyer</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Drinks column */}
            <div>
              <h4 className="text-xs font-bold text-[#2563eb] mb-3 uppercase tracking-widest">
                Drinks
              </h4>
              <ul className="space-y-2">
                {drinks.map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-[#1d1d1f]">{item.name}</span>
                    <span className="text-[#6e6e73] font-medium">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Snacks column */}
            <div>
              <h4 className="text-xs font-bold text-[#2563eb] mb-3 uppercase tracking-widest">
                Snacks
              </h4>
              <ul className="space-y-2">
                {snacks.map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-[#1d1d1f]">{item.name}</span>
                    <span className="text-[#6e6e73] font-medium">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e5e5ea]">
            <a
              href="https://tinyurl.com/IEEE-sjsu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-xl font-semibold text-sm hover:bg-[#1d4ed8] transition-colors"
            >
              Pay via Square
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
