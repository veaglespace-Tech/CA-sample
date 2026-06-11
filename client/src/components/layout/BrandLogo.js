import Image from "next/image";
import Link from "next/link";
import { democaAssets } from "../../lib/navigation-data";

export default function BrandLogo({
  href = "/",
  className = "",
  imageClassName = "",
  width = 240,
  height = 72,
  priority = false,
  alt = "Your Company Name logo",
}) {
  return (
    <Link href={href} className={`${className} flex items-center`}>
      <div className={`text-2xl font-bold tracking-wide flex items-center gap-2 ${imageClassName}`}>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-md shadow-sm">Demo</span>
        <span className="text-slate-800 dark:text-white">CA</span>
      </div>
    </Link>
  );
}
