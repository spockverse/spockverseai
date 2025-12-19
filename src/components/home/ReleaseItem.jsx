import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Lock, Calendar, Music, Zap, Youtube, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

export default function ReleaseItem({ release, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const isPatreon = release.type === 'patreon_post';

  // Lock body scroll and prevent page shift when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col md:flex-row items-center gap-6 p-4 bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 rounded-lg transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-purple-600 group-hover:shadow-[0_0_10px_currentColor] transition-shadow`} />

        {/* Image */}
        <div className="relative w-full md:w-32 h-32 md:h-24 shrink-0 rounded-md overflow-hidden">
          <img 
            src={release.cover_image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop'} 
            alt={release.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isPatreon ? <Lock className="w-8 h-8 text-white" /> : <PlayCircle className="w-8 h-8 text-white" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full md:w-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
            <Badge variant="outline" className="w-fit mx-auto md:mx-0 text-xs border-opacity-50 text-purple-400 border-purple-400 bg-purple-400/10">
              {release.type?.replace('_', ' ').toUpperCase() || 'RELEASE'}
            </Badge>
            <span className="text-xs text-zinc-500 flex items-center justify-center md:justify-start gap-1">
              <Calendar className="w-3 h-3" />
              {release.release_date ? format(new Date(release.release_date), 'MMM dd, yyyy') : 'Coming Soon'}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-white group-hover:text-purple-500 transition-colors duration-300 line-clamp-1">
            {release.title}
          </h3>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-1">
            {release.description || 'Click to view details'}
          </p>
        </div>
      </motion.div>

      {/* Modal */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl"
              style={{ 
                position: 'relative',
                maxHeight: '90vh', 
                overflowY: 'auto' 
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Image */}
              <div className="relative w-full h-48">
                <img
                  src={release.cover_image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop'}
                  alt={release.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 -mt-12 relative">
                <Badge variant="outline" className="mb-2 text-xs text-purple-400 border-purple-400 bg-purple-400/10">
                  {release.type?.replace('_', ' ').toUpperCase() || 'RELEASE'}
                </Badge>
                
                <h2 className="text-2xl font-bold text-white mb-2">{release.title}</h2>
                
                {release.release_date && (
                  <p className="text-xs text-zinc-500 mb-4 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(release.release_date), 'MMMM dd, yyyy')}
                  </p>
                )}

                {release.description && (
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    {release.description}
                  </p>
                )}

                {/* Platform Buttons */}
                <div className="flex flex-col gap-3">
                  {release.spotify_url && (
                    <a
                      href={release.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]"
                    >
                      <Music className="w-5 h-5" />
                      Listen on Spotify
                    </a>
                  )}

                  {release.suno_url && (
                    <a
                      href={release.suno_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]"
                    >
                      <Zap className="w-5 h-5" />
                      Listen on Suno
                    </a>
                  )}

                  {release.youtube_url && (
                    <a
                      href={release.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
                    >
                      <Youtube className="w-5 h-5" />
                      Watch on YouTube
                    </a>
                  )}

                  {release.patreon_url && (
                    <a
                      href={release.patreon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 py-3 px-6 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]"
                    >
                      <Lock className="w-5 h-5" />
                      View on Patreon
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}