import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SidePanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Reset panel state on route change
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close panel when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener('touchstart', handleClickOutside);
    return () => document.removeEventListener('touchstart', handleClickOutside);
  }, [isMobile, isExpanded]);

  const handleClick = () => {
    if (isMobile) {
      if (isExpanded) {
        setIsExpanded(false);
        navigate(createPageUrl('About'));
      } else {
        setIsExpanded(true);
      }
    } else {
      navigate(createPageUrl('About'));
    }
  };

  return (
    <div 
      ref={panelRef}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40 cursor-pointer"
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
      onClick={handleClick}
    >
      {/* Collapsed State - Vertical Bar */}
      <motion.div
        className="relative"
        animate={{ width: isExpanded ? 280 : 48 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Main Container */}
        <div className="relative bg-zinc-950/90 backdrop-blur-md border-l border-t border-b border-purple-900/30 rounded-l-lg overflow-hidden">
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-20" />
          
          {/* Purple Glow Edge */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-600 to-transparent opacity-60" />

          {/* Animated Pulse Line */}
          <motion.div 
            className="absolute left-0 top-0 w-[2px] h-8 bg-purple-500 blur-[2px]"
            animate={{ 
              top: ['0%', '100%', '0%'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
          />

          <motion.div
            className="relative"
            animate={{ 
              height: isExpanded ? 320 : 180,
              padding: isExpanded ? 16 : 8
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                /* Collapsed - Vertical Text */
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-8 h-8 rounded border border-purple-900/50 overflow-hidden">
                    <img 
                      src="https://i.imgur.com/MWJTtK3.png"
                                                alt="SPOCK"
                                                loading="lazy"
                                                className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  <span 
                    className="text-purple-500 text-xs font-bold tracking-[0.3em] uppercase"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    SPOCK
                  </span>

                  {/* Blinking indicator */}
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-purple-600"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ) : (
                /* Expanded - Full Profile */
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="h-full flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-600/50 to-transparent" />
                    <span className="text-[10px] text-purple-500 font-mono tracking-widest">ARTIST_PROFILE</span>
                  </div>

                  {/* Profile Image */}
                  <div className="relative flex-1 rounded-lg overflow-hidden border border-red-900/30 group">
                    <img 
                      src="https://i.imgur.com/MWJTtK3.png"
                                              alt="SPOCK"
                                              loading="lazy"
                                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                    />
                    
                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-purple-900/20" />

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-purple-600/60" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-600/60" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-600/60" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-600/60" />

                    {/* Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-lg tracking-wider">SPOCK</h3>
                      <p className="text-purple-500/80 text-xs font-mono">MUSIC_PRODUCER</p>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-3 flex items-center justify-between text-[9px] font-mono text-zinc-600">
                    <span>CLICK TO VIEW MORE</span>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-purple-500"
                    >
                      ● LIVE
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Ambient Glow */}
        <motion.div 
          className="absolute -inset-4 bg-purple-600/10 blur-xl rounded-full pointer-events-none"
          animate={{ opacity: isExpanded ? 0.3 : 0.1 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
}