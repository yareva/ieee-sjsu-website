'use client';

import { ExternalLink } from 'lucide-react';

export function SnackBar() {
  const drinks = [{ name: 'Red Bull Energy Drink', price: '$3.00' }];
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
    <section className="py-8 px-4 bg-slate-50">
      <div className="max-w-xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="mb-4">
            <h3 className="text-lg font-heading font-bold text-slate-900 mb-1">Innovation Garage Snack Bar</h3>
            <p className="text-sm text-slate-500">Stop by ENGR 376 between classes</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-widest">Drinks</h4>
              <ul className="space-y-2">
                {drinks.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-widest">Snacks</h4>
              <ul className="space-y-2">
                {snacks.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <a
              href="https://square.link/u/ieee-sjsu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
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
