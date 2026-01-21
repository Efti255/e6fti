import { useProfile } from "@/hooks/use-profile";
import { Background } from "@/components/Background";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioPlayer, type AudioPlayerHandle } from "@/components/AudioPlayer";
import { DiscordWidget } from "@/components/DiscordWidget";
import { SocialLinks } from "@/components/SocialLinks";
import { Loader2, Heart, Music, Gamepad2, Globe, Mail, Link as LinkIcon, Code, Video, Camera, Eye, MapPin, Users } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanyard } from "@/hooks/use-lanyard";
import { useRef } from "react";

export default function Home() {
  const { data: profile, isLoading, error } = useProfile();
  // Fallback to VITE_USERNAME if API fails
  const fallbackUsername = import.meta.env.VITE_USERNAME || "User";

  // Provide default effects if missing to prevent runtime errors
  const defaultEffects = { tiltEnabled: true, tiltMaxAngle: 20, noiseEnabled: false, showViews: true, viewCount: 0 };
  const effects = profile?.effects || defaultEffects;
  const { data: lanyard } = useLanyard({ userId: profile?.discord.userId });
  const audioRef = useRef<AudioPlayerHandle>(null);

  // Scroll-based tilt state
  const [scrollTilt, setScrollTilt] = useState({ x: 0, y: 0 });
  const [lastScrollY, setLastScrollY] = useState(0);
  const [tapTilt, setTapTilt] = useState(0); // -maxAngle for left, +maxAngle for right

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxAngle = effects.tiltMaxAngle;
      const tiltMultiplier = 1.2;
      // Determine scroll direction for X tilt
      let x = 0;
      if (scrollY > lastScrollY) {
        x = maxAngle * tiltMultiplier; // Scroll down → tilt right
      } else if (scrollY < lastScrollY) {
        x = -maxAngle * tiltMultiplier; // Scroll up → tilt left
      }
      setLastScrollY(scrollY);
      // Y tilt still based on scroll position
      const y = Math.max(-maxAngle, Math.min(maxAngle, (scrollY / 100) * maxAngle * tiltMultiplier));
      setScrollTilt({ x, y });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [effects.tiltMaxAngle, lastScrollY]);

            const maxAngle = effects.tiltMaxAngle;
  const handleTiltTap = (e: React.MouseEvent) => {
    const maxAngle = effects.tiltMaxAngle;
    const tiltMultiplier = 2.5;
    const x = e.clientX;
    const width = window.innerWidth;
    // Left half → tilt left, right half → tilt right
    if (x < width / 2) {
      setTapTilt(-maxAngle * tiltMultiplier);
    } else {
      setTapTilt(maxAngle * tiltMultiplier);
    }
    // Reset after short delay for effect
    setTimeout(() => setTapTilt(0), 400);
  };

  // Play music on any click in the profile
  const handleProfileClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
          const maxAngle = effects.tiltMaxAngle;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If API fails, use fallback username for minimal display
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white gap-4">
        <h2 className="text-xl font-bold text-red-500">Failed to load profile</h2>
        <h3 className="text-lg font-bold">{fallbackUsername}</h3>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const useDiscordAvatar = profile.avatar.useDiscord && lanyard?.discord_user;
  const avatarSrc = useDiscordAvatar 
    ? `https://cdn.discordapp.com/avatars/${lanyard.discord_user.id}/${lanyard.discord_user.avatar}.webp?size=256`
    : profile.avatar.src;
  
  const decorationUrl = useDiscordAvatar && profile.discord.showDecoration && lanyard.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${lanyard.discord_user.avatar_decoration_data.asset}.png`
    : null;

  // Use fallback username if profile.username is missing
  // Always use username from profile API (which is sourced from .env via backend)
  // Prefer .env USERNAME if available, else use profile.username or fallback
  const displayUsername = import.meta.env.VITE_USERNAME || profile.username || fallbackUsername;
  const bioTags = profile.bio.split(" ");

  return (
    <>
      <CustomCursor config={profile.cursor} />
      <Background config={profile.background} effects={profile.effects || defaultEffects} theme={profile.theme} />
      <AudioPlayer ref={audioRef} config={profile.audio} />

      <main className="min-h-screen py-8 px-4 flex flex-col items-center justify-start relative z-10 overflow-y-auto gap-4" onClick={e => { handleProfileClick(); handleTiltTap(e); }}>
        {/* Profile UI Content */}
        <div className="flex flex-col items-center">
          {/* Main Profile Card */}
          {effects.tiltEnabled ? (
            <Tilt
              tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
              tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
              perspective={1000}
              scale={1.03}
              transitionSpeed={2000}
              gyroscope={true}
              tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
              tiltAngleYManual={scrollTilt.y}
              className="w-full max-w-[400px] sm:max-w-[420px]"
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#1a1a1a]/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
              >
                {/* Banner */}
                <div className="h-36 w-full relative">
                  <img
                    src={profile.banner}
                    className="w-full h-full object-cover brightness-50"
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]/80" />
                </div>
                <div className="px-5 pb-5 -mt-10 relative z-10">
                  {/* Avatar */}
                  <div className="relative inline-block mb-3">
                    <div className="relative w-20 h-20">
                      <div className="relative w-full h-full">
                        <img
                          src={avatarSrc}
                          alt={displayUsername}
                          className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover"
                        />
                        {decorationUrl && (
                          <img
                            src={decorationUrl}
                            alt="Decoration"
                            className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                            style={{ boxSizing: 'border-box' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Username */}
                  <motion.div variants={item} className="mb-2">
                    <h1 className="text-3xl font-bold text-white tracking-tighter uppercase text-glow-blue">
                      {displayUsername}
                    </h1>
                  </motion.div>
                  {/* Badges Row */}
                  <motion.div variants={item} className="relative flex gap-1 mb-3 items-center">
                    {/* Horizontal white glowing effect inside badges */}
                    <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0" style={{height: 0, boxShadow: '0 0 32px 12px rgba(255,255,255,0.7)'}} />
                    {[...Array(10)].map((_, i) => {
                      const badgeNum = i + 1;
                      const pngPath = `/assets/badge${badgeNum}.png`;
                      const jpgPath = `/assets/badge${badgeNum}.jpg`;
                      // Try png first, fallback to jpg if not found (handled by browser)
                      return (
                        <span key={badgeNum} className="flex items-center justify-center w-6 h-6 z-10">
                          <img
                            src={pngPath}
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = jpgPath; }}
                            alt={`badge${badgeNum}`}
                            className="w-6 h-6 object-contain p-0.5"
                          />
                        </span>
                      );
                    })}
                  </motion.div>
                  {/* Bio Tags */}
                  <motion.div variants={item} className="flex flex-row flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex flex-wrap gap-1">
                      {bioTags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-[1px] border-[#0c4a6e] text-[11px] font-extrabold text-white" style={{boxShadow: '0 0 8px 2px #0c4a6e'}}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <SocialLinks
                        links={
                          [
                            ...profile.socialLinks.filter(l => l.platform.toLowerCase() === 'discord'),
                            ...profile.socialLinks.filter(l => l.platform.toLowerCase() !== 'discord' && l.platform.toLowerCase() !== 'email')
                          ]
                        }
                      />
                    </div>
                  </motion.div>
                  {/* Stats Row */}
                  <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1 text-white/40">
                      <Eye size={12} />
                      <span className="text-[10px] font-medium">{effects.viewCount ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <MapPin size={12} />
                      <span className="text-[10px] font-medium">Spotify</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      <Users size={12} />
                      <span className="text-[10px] font-medium">0</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Tilt>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#1a1a1a]/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
            >
              {/* Banner */}
              <div className="h-36 w-full relative">
                <img
                  src={profile.banner}
                  className="w-full h-full object-cover brightness-50"
                  alt="Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]/80" />
              </div>
              <div className="px-5 pb-5 -mt-10 relative z-10">
                {/* Avatar */}
                <div className="relative inline-block mb-3">
                  <div className="relative w-20 h-20">
                    <div className="relative w-full h-full">
                      <img
                        src={avatarSrc}
                        alt={profile.username}
                        className="w-full h-full rounded-full border-[3px] border-[#1a1a1a] shadow-2xl relative z-10 object-cover"
                      />
                      {decorationUrl && (
                        <img
                          src={decorationUrl}
                          alt="Decoration"
                          className="absolute top-1/3 left-1/3 w-full h-full rounded-full z-20 pointer-events-none transform -translate-x-1/3 -translate-y-1/3 border-[0px] border-transparent"
                          style={{ boxSizing: 'border-box' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {/* Username */}
                <motion.div variants={item} className="mb-2">
                  <h1 className="text-3xl font-bold text-white tracking-tighter uppercase text-glow-blue">
                    {displayUsername}
                  </h1>
                </motion.div>
                {/* Badges Row */}
                <motion.div variants={item} className="relative flex gap-1 mb-3 items-center">
                  {/* Horizontal white glowing effect inside badges */}
                  <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0" style={{height: 0, boxShadow: '0 0 32px 12px rgba(255,255,255,0.7)'}} />
                  {profile.badges?.map((badge, i) => (
                    <span key={i} className="flex items-center justify-center w-6 h-6 z-10">
                      <img src={badge.icon} alt={badge.label} className="w-6 h-6 object-contain p-0.5" />
                    </span>
                  ))}
                </motion.div>
                {/* Bio Tags */}
                <motion.div variants={item} className="flex flex-wrap gap-1 mb-2 justify-left">
                  {bioTags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-medium text-white/90">
                      {tag}
                    </span>
                  ))}
                </motion.div>
                {/* Social Links - After Bio, aligned with bio */}
                <motion.div variants={item} className="flex flex-wrap gap-2 justify-left mb-5">
                  <SocialLinks
                    links={
                      [
                        ...profile.socialLinks.filter(l => l.platform.toLowerCase() === 'discord'),
                        ...profile.socialLinks.filter(l => l.platform.toLowerCase() !== 'discord' && l.platform.toLowerCase() !== 'email')
                      ]
                    }
                  />
                </motion.div>
                {/* Stats Row */}
                <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-white/40">
                    <Eye size={12} />
                    <span className="text-[10px] font-medium">{effects.viewCount ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <MapPin size={12} />
                    <span className="text-[10px] font-medium">Spotify</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <Users size={12} />
                    <span className="text-[10px] font-medium">0</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          {/* Stacked Widgets with Tilt */}
          <div className="w-full max-w-[400px] sm:max-w-[420px] space-y-3 mt-4">
            {/* Discord Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                gyroscope={true}
                tiltAngleXManual={tapTilt !== 0 ? tapTilt : scrollTilt.x}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <DiscordWidget config={profile.discord} spotifyConfig={profile.spotify} />
              </Tilt>
            ) : (
              <DiscordWidget config={profile.discord} spotifyConfig={profile.spotify} />
            )}
            {/* Spotify Playlist Widget */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-[1.25rem] overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl flex items-center"
                  style={{ minHeight: 80, height: 80 }}
                >
                  <iframe 
                    src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    className="w-full h-full border-0 rounded-[1.25rem]"
                    style={{ minHeight: 80, height: 80, maxHeight: 100, width: '100%', borderRadius: '1.25rem' }}
                  />
                </motion.div>
              </Tilt>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[1.25rem] overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl flex items-center"
                style={{ minHeight: 80, height: 80 }}
              >
                <iframe 
                  src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="rounded-[1.25rem] border-0 w-full h-full"
                  style={{ minHeight: 80, height: 80, maxHeight: 84, width: '100%', borderRadius: '1.25rem' }}
                />
              </motion.div>
            )}
            {/* Server Widget Mockup */}
            {effects.tiltEnabled ? (
              <Tilt
                tiltMaxAngleX={effects?.tiltMaxAngle ?? 20}
                tiltMaxAngleY={effects?.tiltMaxAngle ?? 20}
                perspective={1000}
                scale={1.03}
                transitionSpeed={2000}
                gyroscope={true}
                tiltAngleXManual={scrollTilt.x}
                tiltAngleYManual={scrollTilt.y}
                className="w-full"
              >
                {/* Server Widget Mockup */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-[1.25rem] p-4 flex items-center justify-between bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/5 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-[#2b2d31] flex items-center justify-center">
                      {profile.discord.serverIcon ? (
                        <img
                          src={profile.discord.serverIcon}
                          alt="Server Icon"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-[#313338] flex items-center justify-center">
                          <span className="font-black text-[8px] text-center leading-tight text-white/50 uppercase px-1">No Server</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">BeyondTheBanters</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                          <div className="w-1 h-1 rounded-full bg-[#23a55a]" /> 1.4k Online
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                          <div className="w-1 h-1 rounded-full bg-white/10" /> 16.41k Members
                        </span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href="https://discord.gg/banters"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-[10px] font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/10 flex items-center justify-center"
                  >
                    Join Server
                  </a>
                </motion.div>
              </Tilt>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel rounded-[1.25rem] p-4 flex items-center justify-between bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/5 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg bg-[#2b2d31] flex items-center justify-center">
                    {profile.discord.serverIcon ? (
                      <img
                        src={profile.discord.serverIcon}
                        alt="Server Icon"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#313338] flex items-center justify-center">
                        <span className="font-black text-[8px] text-center leading-tight text-white/50 uppercase px-1">No Server</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">BeyondTheBanters</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                        <div className="w-1 h-1 rounded-full bg-[#23a55a]" /> 1.4k Online
                      </span>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-white/40">
                        <div className="w-1 h-1 rounded-full bg-white/10" /> 16.41k Members
                      </span>
                    </div>
                  </div>
                </div>
                <a 
                  href="https://discord.gg/banters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-[10px] font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/10 flex items-center justify-center"
                >
                  Join Server
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
