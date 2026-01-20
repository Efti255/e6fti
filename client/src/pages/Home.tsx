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
        <div className="w-full max-w-[700px] sm:max-w-[900px] space-y-8">
          <Tilt tiltMaxAngleX={profile.effects.tiltMaxAngle} tiltMaxAngleY={profile.effects.tiltMaxAngle} perspective={1000} scale={1.01} transitionSpeed={2000} gyroscope={true} className="w-full">
            <DiscordWidget config={profile.discord} spotifyConfig={profile.spotify} />
          </Tilt>
          {/* Spotify Playlist Widget */}
          <Tilt tiltMaxAngleX={profile.effects.tiltMaxAngle} tiltMaxAngleY={profile.effects.tiltMaxAngle} perspective={1000} scale={1.01} transitionSpeed={2000} gyroscope={true} className="w-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[3rem] overflow-hidden bg-black/30 backdrop-blur-2xl border border-white/10 shadow-xl"
            >
              <iframe 
                src="https://open.spotify.com/embed/playlist/7tiPEUSHxjSiJ2C5H5UFEn" 
                width="100%" 
                height="160" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-[2rem] border-0"
                style={{ margin: 0, padding: 0 }}
              />
            </motion.div>
          </Tilt>
          {/* Server Widget Mockup */}
          <Tilt tiltMaxAngleX={profile.effects.tiltMaxAngle} tiltMaxAngleY={profile.effects.tiltMaxAngle} perspective={1000} scale={1.01} transitionSpeed={2000} gyroscope={true} className="w-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[3rem] p-16 flex items-center justify-between bg-[#1a1a1a]/30 backdrop-blur-2xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-10">
                <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg bg-[#2b2d31] flex items-center justify-center">
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
                      <span className="font-black text-[16px] text-center leading-tight text-white/50 uppercase px-1">No Server</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-2xl">BeyondTheBanters</h3>
                  <div className="flex items-center gap-4 mt-0.5">
                    <span className="flex items-center gap-1 text-[18px] font-bold text-white/40">
                      <div className="w-1 h-1 rounded-full bg-[#23a55a]" /> 1.4k Online
                    </span>
                    <span className="flex items-center gap-1 text-[18px] font-bold text-white/40">
                      <div className="w-1 h-1 rounded-full bg-white/10" /> 16.41k Members
                    </span>
                  </div>
                </div>
              </div>
              <a 
                href="https://discord.gg/banters"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 rounded-full bg-[#5865f2] hover:bg-[#4752c4] text-[22px] font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-500/10 flex items-center justify-center"
              >
                Join Server
              </a>
            </motion.div>
          </Tilt>
        </div>
              >
                {/* Banner */}
                <div className="h-28 w-full relative">
                  <img 
                    src={profile.banner || "/assets/banner.jpg"} 
                    className="w-full h-full object-cover brightness-75" 
                    alt="Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1a1a]" />
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

        {/* Stacked Widgets */}
        <div className="w-full max-w-[420px] sm:max-w-[480px] space-y-4">
          <DiscordWidget config={profile.discord} spotifyConfig={profile.spotify} />
          
          {/* Spotify Playlist Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[1.5rem] overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/10 shadow-xl"
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
          
          {/* Server Widget Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[1.5rem] p-6 flex items-center justify-between bg-[#1a1a1a]/40 backdrop-blur-2xl border border-white/10 shadow-xl"
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
        </div>
      </div>
      </main>
    </>
  );
}
