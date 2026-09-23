import Image from "next/image";
import { dashboard } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#forecast", label: "Forecast" },
  { href: "#implementation", label: "Implementation" },
  { href: "#pipeline", label: "Pipeline" },
];

export function BrandNav() {
  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-5">
        <a href="#overview" className="flex shrink-0 items-center">
          <Image
            src="/redowl-logo.svg"
            alt="RedOwl"
            width={130}
            height={30}
            priority
            unoptimized
            className="h-[28px] w-auto"
          />
        </a>
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-ink/80 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-muted-foreground lg:inline">
            {dashboard.meta.fiscalYear}
          </span>
          <span className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
            Live {formatDate(dashboard.meta.asAt)}
          </span>
        </div>
      </div>
    </header>
  );
}
