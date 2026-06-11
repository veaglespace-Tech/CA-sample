import Link from "next/link";
import { democaAssets } from "../../lib/navigation-data";

export default function BrandLogo({
  href = "/",
  className = "",
  imageClassName = "",
  width,
  height = 40,
  priority = false,
  alt = "Veagle Space Technology Pvt. Ltd. Logo",
}) {
  return (
    <Link href={href} className={`${className} flex items-center`}>
      <img
        src={democaAssets.logo || "/veagle-logo.webp"}
        alt={alt}
        className={`${imageClassName} object-contain`}
        style={{ 
          height: typeof height === "number" ? `${height}px` : height, 
          width: width ? (typeof width === "number" ? `${width}px` : width) : "auto" 
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://ui-avatars.com/api/?name=VS&background=0D8ABC&color=fff";
        }}
      />
    </Link>
  );
}
