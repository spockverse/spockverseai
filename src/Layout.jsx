import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SidePanel from '@/components/SidePanel';

const ADMIN_EMAIL = 'sigzerzz@gmail.com';

export default function Layout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.email === ADMIN_EMAIL);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);
  React.useEffect(() => {
    document.title = "SPOCK | OFFICIAL";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-red-900 selection:text-white overflow-x-hidden">
      {/* Preload critical assets */}
      <link rel="preload" as="image" href="https://i.imgur.com/GNjrrNr.jpeg" />
      <link rel="preload" as="image" href="https://i.imgur.com/eQ9Lqjr.jpeg" />
      <link rel="preload" as="image" href="https://i.imgur.com/CnK8l4H.png" />
      <style>{`
        @font-face {
          font-family: 'GunarCustom';
          src: url('https://base44.app/api/apps/692cb4f2e2a5a0701d4d867f/files/public/692cb4f2e2a5a0701d4d867f/7316af1d4_GunarW00Bold.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;500;700;900&family=Inter:wght@300;400;600&display=swap');
            
            /* GPU acceleration for animations */
            .glitch-text::before,
            .glitch-text::after {
              will-change: clip;
            }
            
            /* Performance optimizations */
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
        
        :root {
          --font-heading: 'GunarCustom', 'Rajdhani', sans-serif;
          --font-body: 'GunarCustom', 'Inter', sans-serif;
        }

        body {
                        font-family: var(--font-body);
                      }

                      h1, h2, h3, h4, h5, h6, .font-heading {
                        font-family: var(--font-heading);
                      }

                      .glitch-text {
                        position: relative;
                      }

                      .glitch-text::before,
                      .glitch-text::after {
                      content: attr(data-text);
                      position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: #09090b;
                      }

                      .glitch-text::before {
                        left: 2px;
                        text-shadow: -1px 0 #A020F0;
                        clip: rect(44px, 450px, 56px, 0);
                        animation: glitch-anim-1 5s infinite linear alternate-reverse;
                      }

                      .glitch-text::after {
                        left: -2px;
                        text-shadow: -1px 0 #CC66FF;
                        clip: rect(44px, 450px, 56px, 0);
                        animation: glitch-anim-2 5s infinite linear alternate-reverse;
                      }
        
        @keyframes glitch-anim-1 {
          0% { clip: rect(20px, 9999px, 15px, 0); }
          20% { clip: rect(69px, 9999px, 88px, 0); }
          40% { clip: rect(12px, 9999px, 5px, 0); }
          60% { clip: rect(80px, 9999px, 42px, 0); }
          80% { clip: rect(30px, 9999px, 90px, 0); }
          100% { clip: rect(50px, 9999px, 20px, 0); }
        }
        
        @keyframes glitch-anim-2 {
          0% { clip: rect(10px, 9999px, 80px, 0); }
          20% { clip: rect(50px, 9999px, 20px, 0); }
          40% { clip: rect(90px, 9999px, 10px, 0); }
          60% { clip: rect(30px, 9999px, 60px, 0); }
          80% { clip: rect(70px, 9999px, 40px, 0); }
          100% { clip: rect(20px, 9999px, 50px, 0); }
        }

        /* Retro scrollbar styling */
                      .retro-scrollbar::-webkit-scrollbar {
                        width: 6px;
                      }

                      .retro-scrollbar::-webkit-scrollbar-track {
                        background: rgba(39, 39, 42, 0.5);
                        border-radius: 3px;
                      }

                      .retro-scrollbar::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, #A020F0 0%, #7A29CC 100%);
                        border-radius: 3px;
                        box-shadow: 0 0 8px rgba(160, 32, 240, 0.5);
                      }

                      .retro-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(180deg, #CC66FF 0%, #A020F0 100%);
                        box-shadow: 0 0 12px rgba(204, 102, 255, 0.7);
                      }

                      .retro-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #A020F0 rgba(39, 39, 42, 0.5);
                      }
        `}</style>
      {/* Scanline overlay effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
      
      {/* Ambient Purple Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-purple-900/10 blur-[120px] pointer-events-none rounded-full"></div>

      {isAdmin && (
                    <div className="fixed top-4 right-4 z-50">
                      <Link 
                        to={createPageUrl('Admin')} 
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Admin"
                      >
                        <Settings className="w-5 h-5" />
                      </Link>
                    </div>
                  )}

      <SidePanel />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <footer className="relative z-10 border-t border-zinc-900 bg-black/50 py-12 mt-20">
        <div className="container mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide uppercase">Legal Documentation</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              This website serves as the central hub for the artist known as "Spock". 
              All content linked herein is the intellectual property of the respective creators 
              and is distributed via authorized platforms (Spotify, YouTube, Patreon).
              Unauthorized reproduction or redistribution of the visual or audio materials 
              hosted on these platforms is strictly prohibited.
            </p>
          </div>
          <div className="text-right">
             <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} SPOCK_AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}