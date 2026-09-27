import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm text-muted">
        <p>{siteConfig.name}</p>
        <p>
          © {new Date().getFullYear()} {siteConfig.shortName}
        </p>
      </div>
    </footer>
  );
}
