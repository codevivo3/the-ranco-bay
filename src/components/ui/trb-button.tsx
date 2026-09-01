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
  | {
      disabled?: boolean;
      external?: never;
      href?: never;
      type: 'button' | 'submit';
    }
);

const buttonClasses =
  'group relative isolate inline-flex items-center justify-center gap-3 ' +
  'overflow-hidden rounded-lg ' +
  'border border-[rgba(134,221,227,0.34)] ' +
  'bg-[linear-gradient(180deg,rgba(19,120,138,0.78)_0%,rgba(23,106,131,0.72)_34%,rgba(36,75,116,0.67)_100%)] ' +
  'backdrop-blur-[14px] backdrop-saturate-[1.3] ' +
  'px-6 py-3.5 font-medium tracking-[0.01em] text-[var(--trb-sand)] ' +
  // Glass depth: restrained Lagoon glow plus internal reflected edge.
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(36,75,116,0.16),0_5px_16px_rgba(20,58,82,0.18),0_0_18px_rgba(19,120,138,0.10)] ' +
  // Tactile movement.
  'transition-[transform,box-shadow,filter,border-color,background-color] duration-200 ease-out ' +
  // Hover: tiny lift, brighter glass edge, slightly stronger aura.
  'hover:-translate-y-[2px] ' +
  'hover:border-[rgba(154,232,236,0.50)] ' +
  'hover:brightness-[1.08] ' +
  'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.30),inset_0_-1px_0_rgba(36,75,116,0.14),0_8px_22px_rgba(20,58,82,0.20),0_0_24px_rgba(19,120,138,0.16)] ' +
  // Press: move toward the surface and compress the shadow.
  'active:translate-y-[1px] active:scale-[0.985] ' +
  'active:brightness-[0.98] ' +
  'active:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_6px_rgba(20,58,82,0.18),0_0_10px_rgba(19,120,138,0.10)] ' +
  // Keyboard accessibility.
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ' +
  'focus-visible:outline-[var(--trb-lagoon)] ' +
  // Respect reduced-motion preference.
  'motion-reduce:transform-none motion-reduce:transition-none ' +
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:transform-none';

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

  if ('type' in props) {
    return (
      <button
        type={props.type}
        disabled={props.disabled}
        className={classes}
      >
        <ButtonContent>{children}</ButtonContent>
      </button>
    );
  }

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
