import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, Youtube, DollarSign, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Back Button */}
      <Link
        to={createPageUrl('Home')}
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-purple-500 transition-colors text-sm font-mono">
        <ArrowLeft className="w-4 h-4" />
        RETURN_HOME
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white glitch-text" data-text="ABOUT THE ARTIST">
          ABOUT THE ARTIST
        </h1>
        <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-purple-600 to-transparent" />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        
        {/* Profile Image Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2">
          <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            {/* Header Bar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest">ARTIST_PROFILE.IMG</span>
            </div>

            {/* Image Frame */}
            <div className="relative aspect-square rounded-lg overflow-hidden border border-purple-900/30">
              <img
                src="https://i.imgur.com/MWJTtK3.png"
                alt="SPOCK"
                className="w-full h-full object-cover" />
              
              {/* Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-purple-900/10" />
              
              {/* Corner Brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-600/60" />
              <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-600/60" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-600/60" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-600/60" />

              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-30" />
            </div>

            {/* Name Tag */}
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white tracking-wider">SPOCK</h2>
              <p className="text-purple-500/80 text-xs font-mono tracking-widest">MUSIC_PRODUCER // ARTIST</p>
            </div>
          </div>
        </motion.div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-6">

          {/* About Text Panel */}
          <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            {/* Header Bar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-600/50 to-transparent" />
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest">BIO.TXT</span>
            </div>

            <div className="space-y-4 text-zinc-400 leading-relaxed">
              <p className="bg-transparent text-gray-400"><span className="text-purple-500 font-semibold">SPOCK</span> has been producing dubstep since he was a kid. Fifteen years in, he's built a sound that leans into heavy bass, sharp design choices, and the kind of wubs you can pick out instantly. His catalog moves between dubstep, soft rock, and experimental electronic work, always pushing arrangement and sound design forward.
              </p>
              <p className="">He creates cinematic AI visuals for the SpockVerse. The work ranges from portraits to full scenes and keeps the same style throughout. His Instagram and Patreon grew from that blend of music and visuals. Everything connects into one space that is recognizable.
              </p>
              <p className="text-zinc-500 text-sm italic border-l-2 border-purple-900/50 pl-4">
                "WUB WUB TO THE MAX"
              </p>
            </div>
          </div>

          {/* Featured Video */}
          <div className="relative bg-zinc-900/50 border border-zinc-800 hover:border-purple-900/50 hover:shadow-[0_0_20px_rgba(160,32,240,0.1)] rounded-lg p-6 transition-all duration-500">
            <div className="text-center mb-4">
              <p className="text-xs text-zinc-400 tracking-wide">🎬 FEATURED VIDEO</p>
              <p className="text-xs text-zinc-500 mt-1">"Experience the SpockVerse"</p>
            </div>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/GMmDvcBW1Ws?autoplay=1&mute=1&loop=1&playlist=GMmDvcBW1Ws"
                title="SpockVerse Experience"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />

            </div>
          </div>

          {/* Links Panel */}
          <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-600/50 to-transparent" />
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest">CONNECTIONS</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a
                href="https://open.spotify.com/artist/5bALkHAws6xFfGeddsmmGP?si=j3Ll9zpmQsWE6XZJgeg7zg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-green-600/50 hover:bg-green-900/10 transition-all group">
                <Music className="w-5 h-5 text-green-500" />
                <span className="text-sm text-zinc-300 group-hover:text-green-400 transition-colors">Spotify</span>
              </a>
              <a
                href="https://youtube.com/@SpocksFridayNights"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-red-600/50 hover:bg-red-900/10 transition-all group">
                <Youtube className="w-5 h-5 text-red-500" />
                <span className="text-sm text-zinc-300 group-hover:text-red-400 transition-colors">YouTube</span>
              </a>
              <a
                href="https://patreon.com/spocks"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-orange-600/50 hover:bg-orange-900/10 transition-all group">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-zinc-300 group-hover:text-orange-400 transition-colors">Patreon</span>
              </a>
              <a
                href="https://instagram.com/spock_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-pink-600/50 hover:bg-pink-900/10 transition-all group">
                <Instagram className="w-5 h-5 text-pink-500" />
                <span className="text-sm text-zinc-300 group-hover:text-pink-400 transition-colors">Instagram</span>
              </a>
            </div>
          </div>

          {/* Status Footer */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 px-2">
            <span>SYS.STATUS: ACTIVE</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-purple-500">
              ● TRANSMITTING
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>);

}