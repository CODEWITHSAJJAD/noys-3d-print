'use client';

import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Coins } from 'lucide-react';

interface CreditCardProps {
  id: string;
  credits: number;
  price: string;
  onAction: (id: string) => void;
}

export function CreditCard({ id, credits, price, onAction }: CreditCardProps) {
  return (
    <Card className="h-full group hover:-translate-y-2 transition-transform duration-300 bg-gradient-to-br from-white to-sky-50 shadow-[6px_6px_0px_#1a4073]">
      <CardContent className="flex flex-col items-center justify-between p-6 h-full text-center">
        
        <div className="mb-4 text-orange-500 bg-orange-100 p-4 rounded-full border-2 border-orange-200 group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Coins className="w-10 h-10 stroke-[2.5px]" />
        </div>

        <div className="mb-4">
          <h4 className="text-4xl font-black text-[#0c2a50] mb-1">{credits}</h4>
          <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">Credits</p>
        </div>

        <div className="w-full flex-grow flex flex-col justify-end mt-4 pt-4 border-t-2 border-dashed border-blue-200">
          <div className="text-2xl font-extrabold text-[#0a2342] mb-4">
            {price}
          </div>
          <Button 
            variant="outline" 
            className="w-full py-3"
            onClick={() => onAction(id)}
          >
            Buy Credits
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
