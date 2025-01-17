import React from "react";
import Image from "next/image";

interface LogoHeaderProps {
  logoSrc: string; // Path to the logo image
  altText: string; // Alt text for the logo
  className?: string; // Optional additional class names
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ logoSrc, altText, className }) => {
  return (
    <header className={`absolute top-0 left-0 ${className || ""}`}>
      <Image src={logoSrc} alt={altText} className="w-48 h-32" />
    </header>
  );
};

export default LogoHeader;
