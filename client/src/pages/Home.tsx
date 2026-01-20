import { useProfile } from "@/hooks/use-profile";
import { Background } from "@/components/Background";
import { CustomCursor } from "@/components/CustomCursor";
import { AudioPlayer, type AudioPlayerHandle } from "@/components/AudioPlayer";
import { DiscordWidget } from "@/components/DiscordWidget";
import { SocialLinks } from "@/components/SocialLinks";
import { Loader2, Heart, Music, Gamepad2, Globe, Mail, Link as LinkIcon, Code, Video, Camera, Eye, MapPin, Users } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { useLanyard } from "@/hooks/use-lanyard";
import { useRef } from "react";

export default function Home() {
  const { data: profile, isLoading, error } = useProfile();
  const { data: lanyard } = useLanyard({ userId: profile?.discord.userId });
  const audioRef = useRef<AudioPlayerHandle>(null);

  // Play music on any click in the profile
  const handleProfileClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio playback failed
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

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white gap-4">
        <h2 className="text-xl font-bold text-red-500">Failed to load profile</h2>
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

  const bioTags = profile.bio.split(" ");

  return (
    <>
      <CustomCursor config={profile.cursor} />
      <Background config={profile.background} effects={profile.effects} theme={profile.theme} />
      <AudioPlayer ref={audioRef} config={profile.audio} />

      <main className="min-h-screen py-8 px-4 flex flex-col items-center justify-start relative z-10 overflow-y-auto gap-4" onClick={handleProfileClick}>
        
        {/* Profile UI Content */}
        <div className="flex flex-col items-center">
            {/* Main Profile Card */}
            <Tilt
              tiltMaxAngleX={profile.effects.tiltMaxAngle}
              tiltMaxAngleY={profile.effects.tiltMaxAngle}
              perspective={1000}
              scale={1.03}
              transitionSpeed={2000}
              gyroscope={true}
              className="w-full max-w-[400px] sm:max-w-[420px]"
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="glass-card rounded-[2rem] w-full relative overflow-hidden bg-[#1a1a1a]/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
              >
                {/* Banner */}
                <div className="h-28 w-full relative">
                  <img 
                    src={profile.banner || "/assets/banner.jpg"} 
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
                      {profile.username}
                    </h1>
                  </motion.div>


                  {/* Badges Row */}
                  <motion.div variants={item} className="flex gap-1 mb-3">
                    {profile.badges?.map((badge, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform">
                        <img src={badge.icon} alt={badge.label} className="w-4 h-4 object-contain p-0.5" />
                      </div>
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
                    <SocialLinks links={profile.socialLinks.filter(l => l.platform.toLowerCase() !== 'email')} />
                  </motion.div>


              {/* Stats Row */}
              <motion.div variants={item} className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-1 text-white/40">
                  <Eye size={12} />
                  <span className="text-[10px] font-medium">{profile.effects.viewCount}</span>
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

        {/* Stacked Widgets with Tilt */}
        <div className="w-full max-w-[400px] sm:max-w-[420px] space-y-3 mt-4">
          <Tilt
            tiltMaxAngleX={profile.effects.tiltMaxAngle}
            tiltMaxAngleY={profile.effects.tiltMaxAngle}
            perspective={1000}
            scale={1.03}
            transitionSpeed={2000}
            gyroscope={true}
            className="w-full"
          >
            <DiscordWidget config={profile.discord} spotifyConfig={profile.spotify} />
          </Tilt>
          <Tilt
            tiltMaxAngleX={profile.effects.tiltMaxAngle}
            tiltMaxAngleY={profile.effects.tiltMaxAngle}
            perspective={1000}
            scale={1.03}
            transitionSpeed={2000}
            gyroscope={true}
            className="w-full"
          >
            {/* Spotify Playlist Widget */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[1.25rem] overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <iframe 
                src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-[1.25rem] border-0"
                style={{ margin: 0, padding: 0 }}
              />
            </motion.div>
          </Tilt>
          <Tilt
            tiltMaxAngleX={profile.effects.tiltMaxAngle}
            tiltMaxAngleY={profile.effects.tiltMaxAngle}
            perspective={1000}
            scale={1.03}
            transitionSpeed={2000}
            gyroscope={true}
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
        </div>
      </div>
      </main>
    </>
  );
}
