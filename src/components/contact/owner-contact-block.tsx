import { Download, MessageCircle } from 'lucide-react';

import { trbBusiness } from '@/lib/constants/business';

type OwnerContactBlockProps = {
  label: string;
  qrLabel: string;
  saveContactLabel: string;
  whatsappLabel: string;
};

const contactLinkClass =
  'transition-colors hover:text-page-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-page-focus';

export function OwnerContactBlock({
  label,
  qrLabel,
  saveContactLabel,
  whatsappLabel,
}: OwnerContactBlockProps) {
  return (
    <div className='flex flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-between lg:gap-8'>
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
        aria-label={saveContactLabel}
        className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-[rgba(134,221,227,0.34)] bg-[linear-gradient(180deg,rgba(19,120,138,0.78)_0%,rgba(23,106,131,0.72)_34%,rgba(36,75,116,0.67)_100%)] px-5 py-3 font-medium tracking-[0.01em] text-[var(--trb-sand)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(36,75,116,0.16),0_5px_16px_rgba(20,58,82,0.18)] transition-[transform,box-shadow,filter,border-color,background-color] duration-200 ease-out hover:-translate-y-[2px] hover:border-[rgba(154,232,236,0.50)] hover:brightness-[1.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--trb-lagoon)] active:translate-y-[1px] active:scale-[0.985] motion-reduce:transform-none motion-reduce:transition-none sm:w-auto lg:hidden'
      >
        <Download aria-hidden='true' size={17} strokeWidth={1.5} />
        {saveContactLabel}
      </a>

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
