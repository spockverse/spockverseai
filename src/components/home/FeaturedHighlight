import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function FeaturedHighlight({ title, subtitle, description, image, url, ctaText }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col md:flex-row items-center gap-6 p-4 bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 rounded-lg transition-all duration-300 overflow-hidden"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 group-hover:shadow-[0_0_10px_currentColor] transition-shadow" />

      {/* Image */}
      <div className="relative w-full md:w-40 h-40 md:h-28 shrink-0 rounded-md overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full md:w-auto text-center md:text-left">
        {subtitle && (
          <div className="mb-1">
            <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/40 rounded px-2 py-0.5">
              {subtitle}
            </span>
          </div>
        )}
        <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
          {title}
        </h3>
        {description && <p className="text-sm text-zinc-400 mt-1">{description}</p>}
        {ctaText && (
          <div className="mt-3 inline-block text-sm font-semibold text-yellow-400 group-hover:underline">
            {ctaText} →
          </div>
        )}
      </div>
    </a>
  );
}
