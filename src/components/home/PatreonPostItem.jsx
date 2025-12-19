import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export default function PatreonPostItem({ post, index }) {
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col md:flex-row items-center gap-6 p-4 bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 rounded-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 group-hover:shadow-[0_0_10px_currentColor] transition-shadow" />

      {/* Image */}
      <div className="relative w-full md:w-32 h-32 md:h-24 shrink-0 rounded-md overflow-hidden">
        <img 
          src={post.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop'} 
          alt={post.title} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ExternalLink className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full md:w-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
          <Badge variant="outline" className="w-fit mx-auto md:mx-0 text-xs border-opacity-50 text-purple-400 border-purple-400 bg-purple-400/10">
            PATREON POST
          </Badge>
          <span className="text-xs text-zinc-500 flex items-center justify-center md:justify-start gap-1">
            <Calendar className="w-3 h-3" />
            {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'Recent'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white group-hover:text-purple-500 transition-colors duration-300 line-clamp-1">
          {post.title}
        </h3>
        <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1 justify-center md:justify-start">
          <Lock className="w-3 h-3" /> Exclusive content on Patreon
        </p>
      </div>
    </motion.a>
  );
}