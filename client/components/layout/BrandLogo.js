"use client";

import Link from "next/link";
import Image from "next/image";
import { democaAssets } from "../../lib/navigation-data";

export default function BrandLogo({
  href = "/",
  className = "",
  imageClassName = "",
  wordmarkClassName = "",
  showText = true,
  width,
  height = 40,
  priority = false,
  alt = "Veagle Space Technology Pvt. Ltd. Logo",
}) {
  const resolvedHeight = typeof height === "number" ? height : Number.parseInt(height, 10) || 40;
  const resolvedWidth = width ? (typeof width === "number" ? width : Number.parseInt(width, 10) || resolvedHeight) : resolvedHeight;

  return (
    <Link
      href={href}
      className={`${className} inline-flex items-center gap-3 whitespace-nowrap`}
      aria-label="Veagle Space home"
    >
      <span
        className="relative block shrink-0"
        style={{
          width: `${resolvedWidth}px`,
          height: `${resolvedHeight}px`,
        }}
      >
        <Image
          src={democaAssets.logo || "/veaglespace-logo.png"}
          alt={alt}
          fill
          priority={priority}
          sizes={`${resolvedWidth}px`}
          className={`${imageClassName} object-contain filter drop-shadow-[0_0_15px_rgba(14,165,233,0.8)] drop-shadow-[0_0_30px_rgba(14,165,233,0.6)] animate-flip-y`}
        />
      </span>
      {showText && (
        <span className={`flex flex-col leading-none`}>
          <span className={`text-[1.05rem] font-black tracking-[-0.04em] sm:text-[1.2rem] ${wordmarkClassName || 'text-black'}`}>
            Veagle <span className="text-sky-500">Space</span>
          </span>
        </span>
      )}
      <style>{`
        @keyframes flipY {
          0% { transform: perspective(600px) rotateY(0deg); }
          100% { transform: perspective(600px) rotateY(360deg); }
        }
        .animate-flip-y {
          animation: flipY 6s linear infinite;
          transform-style: preserve-3d;
        }
      `}</style>
    </Link>
  );
}
