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
          src={democaAssets.logo || "/veagle-logo.webp"}
          alt={alt}
          fill
          priority={priority}
          sizes={`${resolvedWidth}px`}
          className={`${imageClassName} object-contain animate-[float_4s_ease-in-out_infinite]`}
        />
      </span>
      {showText && (
        <span className={`flex flex-col leading-none ${wordmarkClassName}`}>
          <span className="text-[1.05rem] font-black tracking-[-0.04em] text-slate-900 sm:text-[1.2rem]">
            Veagle <span className="text-sky-500">Space</span>
          </span>
        </span>
      )}
    </Link>
  );
}
