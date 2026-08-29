import {ArrowRight} from "lucide-react";

import {Link} from "@/i18n/navigation";

type EditorialLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: "/" | "/house" | "/guide" | "/contact";
  tone?: "light" | "dark";
};

const toneClasses = {
  light: "text-page-text",
  dark: "text-[var(--trb-sand)]",
} as const;

export function EditorialLink({
  children,
  className = "",
  href,
  tone = "light",
}: EditorialLinkProps) {
  return (
    <Link
      className={`group inline-flex items-center gap-3 pb-2 font-medium transition-colors ${toneClasses[tone]} ${className}`}
      href={href}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
      >
        <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
      </span>
    </Link>
  );
}
