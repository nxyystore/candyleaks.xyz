import React from 'react';
import { ExternalLink, Crown } from 'lucide-react';
import { Creator } from '../data/types';

interface CreatorCardProps {
  creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transform transition-all duration-700 hover:scale-105 hover:-translate-y-2">
      <div className="absolute inset-0 card-border opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative bg-black/20 backdrop-blur-sm">
        {creator.isVip && (
          <div className="absolute top-4 left-4 z-10">
            <div className="relative">
              <div className="vip-badge glass-effect px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <Crown className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-300 font-bold text-lg tracking-wide">VIP</span>
              </div>
              <div className="absolute inset-0 vip-border rounded-lg"></div>
            </div>
          </div>
        )}

        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={creator.image} 
            alt={creator.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="glass-effect rounded-xl p-4 transform transition-all duration-500 group-hover:translate-y-[-4px]">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              {creator.name}
            </h3>
            
            <a
              href={creator.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-500 transform hover:translate-x-1 hover:shadow-[0_0_20px_rgba(167,139,250,0.3)]"
            >
              <span>Get Mega</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}