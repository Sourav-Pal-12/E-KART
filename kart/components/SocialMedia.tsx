import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}
const socialLink = [
  {
    title: "Youtube",
    href: "https://www.youtube.com",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  {
    title: "Twitter",
    href: "https://www.twitter.com",
    icon: <FaTwitter className="w-5 h-5" />,
  },
  {
    title: "Linkedin",
    href: "https://www.linkedin.com",
    icon: <FaLinkedin className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com",
    icon: <FaFacebook className="w-5 h-5" />,
  },
  {
    title: "Instagram",
    href: "https://www.instagram.com",
    icon: <FaInstagram className="w-5 h-5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLink?.map((item) => (
          <Tooltip key={item?.title}>
            <TooltipTrigger asChild>
              <Link
                key={item?.title}
                target="_blank"
                rel="noopener noreferrer"
                href={item?.href}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect",
                  iconClassName
                )}
              >
                {item?.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item?.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
