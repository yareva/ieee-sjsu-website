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
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1a1d24] border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Innovation Garage Snack Bar</h3>
              <p className="text-sm text-gray-400">Stop by ENGR 376 between classes</p>
            </div>
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0 hidden sm:flex items-center justify-center">
              <span className="text-[10px] text-gray-600">Flyer</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">Drinks</h4>
              <ul className="space-y-2">
                {drinks.map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-white font-medium">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-3 uppercase tracking-wide">Snacks</h4>
              <ul className="space-y-2">
                {snacks.map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="text-white font-medium">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href="https://tinyurl.com/IEEE-sjsu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-colors"
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