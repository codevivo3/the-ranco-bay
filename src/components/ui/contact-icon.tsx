import Image from 'next/image';
import { Mail } from 'lucide-react';

export type ContactIconName = 'whatsapp' | 'facebook' | 'instagram' | 'mail';

type ContactIconProps = {
  name: ContactIconName;
  size?: number;
  label?: string;
  decorative?: boolean;
  variant?: 'default' | 'trb';
  className?: string;
};

const iconSources = {
  whatsapp: {
    default: '/icons/contact/whatsapp.svg',
    trb: '/icons/contact/whatsapp-trb.svg',
  },
  facebook: {
    default: '/icons/contact/facebook.svg',
  },
  instagram: {
    default: '/icons/contact/instagram.svg',
  },
} as const;

export function ContactIcon({
  name,
  size = 20,
  label,
  decorative = false,
  variant = 'default',
  className,
}: ContactIconProps) {
  const isDecorative = decorative || !label;

  if (name === 'mail') {
    return (
      <Mail
        aria-hidden={isDecorative || undefined}
        aria-label={isDecorative ? undefined : label}
        className={className}
        role={isDecorative ? undefined : 'img'}
        size={size}
        strokeWidth={1.5}
      />
    );
  }

  const source =
    name === 'whatsapp' && variant === 'trb'
      ? iconSources.whatsapp.trb
      : iconSources[name].default;

  return (
    <Image
      src={source}
      alt={isDecorative ? '' : label}
      aria-hidden={isDecorative || undefined}
      className={className}
      height={size}
      width={size}
    />
  );
}
