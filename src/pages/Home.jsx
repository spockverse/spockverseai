import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Youtube, Music, DollarSign, Disc, Lock, Star } from 'lucide-react';
import HeroLinkCard from '@/components/home/HeroLinkCard';
import ReleaseItem from '@/components/home/ReleaseItem';
import HighlightsScroll from '@/components/home/HighlightsScroll';
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const logoRef = useRef(null);
  const heroRef = useRef(null);
  const audioRef = useRef(null);
  const [introPlayed, setIntroPlayed] = useState(false);

  function FeaturedHighlight({ title, subtitle, description, image, url, ctaText }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col md:flex-row items-center gap-6 p-4 bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 rounded-lg transition-all duration-300 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />

      <div className="relative w-full md:w-40 h-40 md:h-28 shrink-0 rounded-md overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 w-full md:w-auto text-center md:text-left">
        {subtitle && (
          <div className="mb-1">
            <span className="text-xs text-yellow-400">
              {subtitle}
            </span>
          </div>
        )}
        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-zinc-400 mt-1">
            {description}
          </p>
        )}
        {ctaText && (
          <div className="mt-3 text-sm font-semibold text-yellow-400">
            {ctaText}
          </div>
        )}
      </div>
    </a>
  )
}

  // ========================================
  // GLITCH INTRO EFFECT - HOMEPAGE ONLY
  // Triggers every time homepage loads
  // ========================================
  useEffect(() => {
    // Preload audio immediately
    const audio = new Audio('https://base44.app/api/apps/692cb4f2e2a5a0701d4d867f/files/public/692cb4f2e2a5a0701d4d867f/6c8795188_glitch.mp3');
    audio.volume = 0.85;
    audio.preload = 'auto';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    // Trigger intro after slight delay (0.25s)
    const introTimer = setTimeout(() => {
      // Try to play audio (works on mobile, may be blocked on desktop)
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Autoplay blocked - ignore silently
        });
      }

      // Apply glitch animation to hero
      if (heroRef.current) {
        heroRef.current.classList.add('glitch-intro');
        
        // Remove glitch after 0.6s animation duration
        setTimeout(() => {
          if (heroRef.current) {
            heroRef.current.classList.remove('glitch-intro');
          }
          setIntroPlayed(true);
        }, 600);
      }
    }, 250);

    return () => {
      clearTimeout(introTimer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Rare logo flicker effect (every 45-90 seconds)
  useEffect(() => {
    const triggerFlicker = () => {
      if (logoRef.current) {
        logoRef.current.classList.add('spock-flicker');
        setTimeout(() => {
          if (logoRef.current) {
            logoRef.current.classList.remove('spock-flicker');
          }
        }, 180);
      }
    };

    const scheduleNextFlicker = () => {
      const delay = 45000 + Math.random() * 45000; // 45-90 seconds
      return setTimeout(() => {
        triggerFlicker();
        scheduleNextFlicker();
      }, delay);
    };

    const timeoutId = scheduleNextFlicker();
    return () => clearTimeout(timeoutId);
  }, []);
  const { data: releases, isLoading } = useQuery({
    queryKey: ['releases'],
    queryFn: () => base44.entities.Release.list('sort_order'),
    initialData: []
  });

  const { data: highlights = [] } = useQuery({
            queryKey: ['highlights'],
            queryFn: () => base44.entities.CommentHighlight.list('sort_order'),
            initialData: []
          });

          const { data: featured = [], isLoading: featuredLoading } = useQuery({
            queryKey: ['featured'],
            queryFn: () => base44.entities.Release.filter({ type: 'featured' }, 'sort_order', 1),
            initialData: []
          });



  // Filter releases - songs/videos for Latest Releases
  const latestSongs = releases.filter((r) => r.type === 'song' || r.type === 'video');

  // Hero Cards Data
  const heroLinks = [
  {
    id: 'patreon',
    label: 'Subscribe!',
    platform: 'Patreon',
    url: 'https://patreon.com/spocks',
    icon: DollarSign,
    defaultImage: 'https://i.imgur.com/GNjrrNr.jpeg',
    color: 'orange'
  },
  {
    id: 'spotify',
    label: 'Listen on Spotify',
    platform: 'Spotify',
    url: 'https://open.spotify.com/artist/5bALkHAws6xFfGeddsmmGP?si=j3Ll9zpmQsWE6XZJgeg7zg',
    icon: Music,
    defaultImage: 'https://i.imgur.com/eQ9Lqjr.jpeg',
    color: 'green'
  },
  {
    id: 'youtube',
    label: 'Music Videos Here',
    platform: 'YouTube',
    url: 'https://youtube.com/@SpocksFridayNights',
    icon: Youtube,
    defaultImage: 'https://i.imgur.com/CnK8l4H.png',
    color: 'red'
  }];


  return (
    <div className="space-y-20" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      <style>{`
        /* Ultra-subtle CRT scanlines - barely visible */
        .hero-background::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.012) 0px,
            rgba(255,255,255,0.012) 1px,
            transparent 2px
          );
          mix-blend-mode: soft-light;
          opacity: 0.012;
        }

        /* SPOCK Logo Micro-Flicker */
        @keyframes spockMicroFlicker {
          0% { filter: none; }
          40% { filter: brightness(0.85) saturate(1.1) hue-rotate(1deg); }
          70% { filter: brightness(1.1) hue-rotate(-1deg); }
          100% { filter: none; }
        }

        .spock-flicker {
          animation: spockMicroFlicker 0.15s ease-out;
        }

        /* ========================================
           ONE-TIME GLITCH INTRO ANIMATION
           Duration: 0.6s (triggered at 0.25s after load)
           Total effect time: 0.25s delay + 0.6s animation = 0.85s
           ======================================== */
        
        @keyframes glitchIntro {
          0% { 
            transform: translate(0);
            filter: none;
          }
          10% { 
            transform: translate(-2px, 1px);
            filter: hue-rotate(90deg) saturate(3);
          }
          20% { 
            transform: translate(3px, -2px);
            filter: hue-rotate(-90deg) saturate(3);
          }
          25% {
            transform: translate(-1px, 2px) skewX(2deg);
            filter: brightness(1.3) contrast(1.5);
          }
          30% { 
            transform: translate(2px, -1px);
            filter: hue-rotate(45deg) brightness(0.7);
          }
          40% {
            transform: translate(-3px, 0px);
            filter: saturate(5) hue-rotate(-45deg);
          }
          50% {
            transform: translate(1px, 1px) skewX(-1deg);
            filter: brightness(1.2) contrast(2);
          }
          60% {
            transform: translate(-2px, 0px);
            filter: hue-rotate(20deg) saturate(2);
          }
          75% {
            transform: translate(1px, -1px);
            filter: brightness(0.9) hue-rotate(-20deg);
          }
          85% {
            transform: translate(-1px, 0px);
            filter: saturate(1.5);
          }
          100% { 
            transform: translate(0);
            filter: none;
          }
        }

        /* RGB split effect for logo */
        @keyframes rgbSplit {
          0%, 100% {
            text-shadow: none;
          }
          20% {
            text-shadow: 
              -3px 0 0 rgba(255, 0, 0, 0.7),
              3px 0 0 rgba(0, 255, 255, 0.7);
          }
          40% {
            text-shadow: 
              3px 0 0 rgba(255, 0, 0, 0.8),
              -3px 0 0 rgba(0, 255, 255, 0.8);
          }
          60% {
            text-shadow: 
              -2px 0 0 rgba(255, 0, 0, 0.6),
              2px 0 0 rgba(0, 255, 255, 0.6);
          }
          80% {
            text-shadow: 
              1px 0 0 rgba(255, 0, 0, 0.4),
              -1px 0 0 rgba(0, 255, 255, 0.4);
          }
        }

        /* Apply glitch to hero section */
        .glitch-intro {
          animation: glitchIntro 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Apply RGB split to logo during intro */
        .glitch-intro h1 {
          animation: rgbSplit 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Slight distortion on tagline and micro-trust during intro */
        .glitch-intro p {
          animation: glitchIntro 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-delay: 0.05s;
        }
      `}</style>

      {/* Hero Section with Ultra-subtle CRT Effect */}
      <div ref={heroRef} className="relative hero-background">
        {/* Intro Text */}
        <section className="relative text-center space-y-4 max-w-3xl mx-auto pt-8 z-10">
          <h1 
            ref={logoRef}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-2 glitch-text" 
            data-text="SPOCK"
          >
            SPOCK
          </h1>
          <p className="text-purple-500 font-mono text-sm md:text-base tracking-[0.3em] uppercase">WUB WUB TO THE MAX</p>
          <p className="text-zinc-500 font-mono text-xs md:text-sm tracking-wide opacity-85 mt-2">160+ Supporters • New Drops Weekly</p>
        </section>

        {/* Main Hero Links */}
        <section className="relative grid grid-cols-1 md:grid-cols-3 gap-6 px-2 mt-8 z-10">
          {heroLinks.map((link) =>
          <HeroLinkCard
            key={link.id}
            {...link} />

          )}
        </section>
      </div>

      {/* Comment Highlights Scroll */}
      <HighlightsScroll highlights={highlights} />

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Latest Releases */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Disc className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-white tracking-tight">LATEST MUSIC</h2>
          </div>
          
          <div className="relative">
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-3 retro-scrollbar">
              {isLoading ?
              [1, 2, 3].map((i) =>
              <Skeleton key={i} className="h-24 w-full bg-zinc-900" />
              ) :
              latestSongs.length > 0 ?
              latestSongs.map((release, idx) =>
              <ReleaseItem key={release.id} release={release} index={idx} />
              ) :

              <p className="text-zinc-500 italic">No public transmissions detected...</p>
              }
            </div>
            <div className="absolute bottom-0 left-0 right-3 h-20 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Featured Highlight */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">MOST PROUD OF</h2>
          </div>

          {featuredLoading ? (
            <Skeleton className="h-28 w-full bg-zinc-900" />
          ) : featured.length > 0 ? (
            <FeaturedHighlight
              title={featured[0].title}
              subtitle="Creator's Pick"
              description={featured[0].description}
              image={featured[0].cover_image || 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=1600&auto=format&fit=crop'}
              url={featured[0].url || featured[0].patreon_url || featured[0].spotify_url || featured[0].youtube_url || featured[0].suno_url}
              ctaText="Explore the piece"
            />
          ) : (
            <p className="text-zinc-500 italic">No featured item yet.</p>
          )}
        </section>

      </div>
    </div>);

}


