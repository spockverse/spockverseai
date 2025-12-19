import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function HeroLinkCard({ 
  platform, 
  url, 
  defaultImage, 
  icon: Icon, 
  color,
  label 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group w-full h-64 md:h-96 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-500 hover:border-purple-900/50 hover:shadow-[0_0_30px_rgba(160,32,240,0.15)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {/* Background Image */}
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
          <img 
            src={defaultImage}
            loading="lazy"
            decoding="async"
            alt={platform} 
            className="w-full h-full object-cover transition-transform duration-500"
          />
          {/* Reduced gradient to just ensure bottom text is readable, removed grey wash */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent`} />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white ${isHovered ? 'text-purple-500 border-purple-500/30' : ''} transition-colors duration-300`}>
              <Icon className="w-8 h-8" />
            </div>
            </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter uppercase">
              {label}
            </h2>
            <div className="flex items-center gap-2 text-sm font-medium tracking-widest text-zinc-400 group-hover:text-purple-500 transition-colors duration-300">
              <span>VISIT {platform.toUpperCase()}</span>
              <ExternalLink className="w-4 h-4" />
            </div>

            {platform === 'Patreon' && (
              <ul className="mt-2 pl-0 list-none text-[0.65rem] text-zinc-400 opacity-75 space-y-0.5">
                <li className="before:content-['•'] before:mr-2">5-Day Early <span className="text-purple-400">Access</span></li>
                <li className="before:content-['•'] before:mr-2">HD Wallpapers & Videos</li>
                <li className="before:content-['•'] before:mr-2"><span className="text-purple-400">Exclusive</span> Music & Extras</li>
              </ul>
            )}
          </div>
        </div>
        
        {/* Scanline effect on hover */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </a>


    </div>
  );
}