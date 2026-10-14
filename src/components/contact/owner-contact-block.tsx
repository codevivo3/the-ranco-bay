import { MessageCircle } from 'lucide-react';

import { trbBusiness } from '@/lib/constants/business';

type OwnerContactBlockProps = {
  label: string;
  qrLabel: string;
  whatsappLabel: string;
};

const contactLinkClass =
  'transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus';

export function OwnerContactBlock({
  label,
  qrLabel,
  whatsappLabel,
}: OwnerContactBlockProps) {
  return (
    <div className='flex items-center justify-between gap-8'>
      <div>
        <p className='text-sm text-page-muted'>{label}</p>
        <address className='mt-2 flex flex-col items-start gap-1 not-italic text-page-text'>
          <span>{trbBusiness.owner.name}</span>
          <a href={trbBusiness.links.phone} className={contactLinkClass}>
            {trbBusiness.contact.phone.display}
          </a>
          <a href={trbBusiness.links.email} className={contactLinkClass}>
            {trbBusiness.contact.email}
          </a>
          <a
            href={trbBusiness.links.whatsapp}
            target='_blank'
            rel='noopener noreferrer'
            className={`${contactLinkClass} mt-2 inline-flex min-h-11 items-center gap-2`}
          >
            <MessageCircle aria-hidden='true' size={18} strokeWidth={1.5} />
            {whatsappLabel}
          </a>
        </address>
      </div>

      <a
        href='/contact/the-ranco-bay.vcf'
        download
        className='hidden shrink-0 flex-col items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus lg:flex'
      >
        <span className='qr-scan-cue w-[8rem] whitespace-nowrap text-center text-[0.625rem] uppercase tracking-[0.18em] text-[var(--trb-lagoon)]'>
          {qrLabel}
        </span>
        <span
          aria-hidden='true'
          className='relative size-[8rem] shrink-0 bg-[url("/contact/trb-contact-qr-dots.svg")] bg-[length:100%_100%] bg-no-repeat'
        />
      </a>
    </div>
  );
}
