import type { Profile } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  Github, Twitter, Instagram, Youtube, Twitch, 
  Linkedin, Facebook, Mail, Globe, Disc
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Map platform names to Lucide icons
const iconMap: Record<string, React.ElementType> = {
  discord: Disc,
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  twitch: Twitch,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
  website: Globe,
};

interface SocialLinksProps {
  links: Profile["socialLinks"];
}

interface SocialIconImageProps {
  platform: string;
  fallback: React.ElementType;
}

function SocialIconImage({ platform, fallback: Fallback }: SocialIconImageProps) {
  // Always try to fetch from assets/platformname.png, fallback to .jpg
  const platformLower = platform.toLowerCase();
  const pngPath = `/assets/${platformLower}.png`;
  const jpgPath = `/assets/${platformLower}.jpg`;
  const [src, setSrc] = useState(pngPath);

  return (
    <img
      src={src}
      alt={platform}
      className="w-5 h-5 object-contain"
      onError={e => {
        if (src !== jpgPath) setSrc(jpgPath);
      }}
    />
  );
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (!links.length) return null;

  return (
    <div className="flex flex-row gap-3">
      {links.map((link, i) => {
        const Icon = iconMap[link.platform.toLowerCase()] || Globe;
        return (
          <motion.a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center",
              "transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-95"
            )}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center justify-center text-white/80 hover:text-white transition-colors text-[2.3rem]">
              <SocialIconImage platform={link.platform} fallback={Icon} />
            </span>
            <span className="sr-only">{link.platform}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
