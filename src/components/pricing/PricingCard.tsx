'use client';

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  onAction: (id: string) => void;
}

export function PricingCard({
  id,
  name,
  price,
  features,
  isPopular = false,
  ctaText = 'Subscribe',
  onAction
}: PricingCardProps) {
  return (
    <div className={`relative h-full transition-transform duration-300 transform hover:-translate-y-2 ${isPopular ? 'scale-105 z-10' : 'scale-100 z-0'}`}>
      {}
      {isPopular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-black text-sm uppercase tracking-wider py-1.5 px-4 rounded-full border-2 border-[#1a4073] shadow-[2px_2px_0px_#1a4073] z-20 whitespace-nowrap">
          Most Popular
        </div>
      )}

      {}
      <Card className={`h-full flex flex-col group relative ${isPopular ? 'border-orange-500 shadow-[8px_8px_0px_#cc6200] bg-gradient-to-b from-orange-50 to-white' : 'bg-gradient-to-b from-white to-sky-50'}`}>
        {}
        {isPopular && (
          <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"></div>
        )}

        <CardContent className="flex flex-col flex-grow p-8">
          <div className="text-center mb-6">
            <h4 className={`text-2xl font-black mb-2 ${isPopular ? 'text-orange-600' : 'text-[#0c2a50]'}`}>{name}</h4>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-[#0a2342]">{price}</span>
              {price !== 'Free' && <span className="text-lg font-bold text-gray-500">/month</span>}
            </div>
          </div>

          <div className="h-[2px] w-full bg-blue-100 mb-6 rounded-full overflow-hidden">
            <div className="h-full bg-blue-300 w-1/3 mx-auto rounded-full"></div>
          </div>

          <ul className="flex-grow space-y-4 mb-8">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3px]" />
                </div>
                <span className="text-gray-700 font-semibold leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <Button 
              variant={isPopular ? 'primary' : 'secondary'} 
              className="w-full text-lg py-4"
              onClick={() => onAction(id)}
            >
              {ctaText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
