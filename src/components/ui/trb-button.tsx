import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation';

type InternalHref = '/' | '/house' | '/guide' | '/contact';

type TrbButtonProps = {
  children: ReactNode;
  className?: string;
} & (
  | {
      href: InternalHref;
      external?: false;
    }
  | {
      href: string;
      external: true;
    }
);

const buttonClasses =
  'group relative isolate inline-flex items-center justify-center gap-3 ' +
  'overflow-hidden rounded-lg ' +
  'border border-[rgba(80,205,215,0.32)] ' +
  'bg-[linear-gradient(180deg,#13788A_0%,#176A83_30%,#244B74_100%)] ' +
  'px-6 py-3.5 font-medium tracking-[0.01em] text-[var(--trb-sand)] ' +
  // Resting depth + very restrained Lagoon glow.
  'shadow-[0_4px_10px_rgba(20,58,82,0.22),0_0_0_1px_rgba(19,120,138,0.08),0_0_18px_rgba(19,120,138,0.10)] ' +
  // Tactile movement.
  'transition-[transform,box-shadow,filter,border-color] duration-200 ease-out ' +
  // Hover: tiny lift, brighter reflection, slightly stronger aura.
  'hover:-translate-y-[2px] ' +
  'hover:border-[rgba(104,224,229,0.48)] ' +
  'hover:brightness-[1.06] ' +
  'hover:shadow-[0_7px_16px_rgba(20,58,82,0.26),0_0_0_1px_rgba(19,120,138,0.12),0_0_24px_rgba(19,120,138,0.18)] ' +
  // Press: move toward the surface and compress the shadow.
  'active:translate-y-[1px] active:scale-[0.985] ' +
  'active:brightness-[0.97] ' +
  'active:shadow-[0_2px_5px_rgba(20,58,82,0.22),0_0_10px_rgba(19,120,138,0.10)] ' +
  // Keyboard accessibility.
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ' +
  'focus-visible:outline-[var(--trb-lagoon)] ' +
  // Respect reduced-motion preference.
  'motion-reduce:transform-none motion-reduce:transition-none';

function ButtonContent({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Quiet reflected-light layer */}
      <span
        aria-hidden='true'
        className='
          pointer-events-none
          absolute inset-x-[8%] top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/55
          to-transparent
          opacity-60
          transition-opacity duration-200
          group-hover:opacity-90
        '
      />

      {/* Soft Lagoon reflection travelling across the surface */}
      <span
        aria-hidden='true'
        className='
          pointer-events-none
          absolute -left-[45%] top-[-100%]
          h-[300%] w-[35%]
          rotate-[18deg]
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          opacity-0
          blur-sm
          transition-[left,opacity] duration-500 ease-out
          group-hover:left-[115%]
          group-hover:opacity-100
          motion-reduce:hidden
        '
      />

      <span className='relative z-10'>{children}</span>

      <span
        aria-hidden='true'
        className='
          relative z-10
          transition-transform duration-200 ease-out
          group-hover:translate-x-1
          group-active:translate-x-0.5
          motion-reduce:transform-none
          motion-reduce:transition-none
        '
      >
        <ArrowRight aria-hidden='true' size={18} strokeWidth={1.5} />
      </span>
    </>
  );
}

export function TrbButton({
  children,
  className = '',
  ...props
}: TrbButtonProps) {
  const classes = `${buttonClasses} ${className}`;

  if (props.external) {
    return (
      <a
        href={props.href}
        target='_blank'
        rel='noopener noreferrer'
        className={classes}
      >
        <ButtonContent>{children}</ButtonContent>
      </a>
    );
  }

  return (
    <Link href={props.href} className={classes}>
      <ButtonContent>{children}</ButtonContent>
    </Link>
  );
}
