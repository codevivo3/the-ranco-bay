import type {Metadata} from "next";
import Image from "next/image";
import {getTranslations, setRequestLocale} from "next-intl/server";

import {Container} from "@/components/layout/container";
import {PageIntro} from "@/components/layout/page-intro";
import {SectionHeading} from "@/components/ui/section-heading";
import {getLocalizedPageMetadata} from "@/lib/seo/localized-page-metadata";
import { TrbButton } from '@/components/ui/trb-button';

type ContactPageProps = {
  params: Promise<{locale: string}>;
};

const mapsUrl = 'https://maps.app.goo.gl/s9u8tAaH742owAHB8';

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const {locale} = await params;
  return getLocalizedPageMetadata(locale, "contact");
}

export default async function ContactPage({params}: ContactPageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <main id='main-content'>
      <PageIntro
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        titleLines={[t('hero.titleLineOne'), t('hero.titleLineTwo')]}
        titleLinesFromDesktop
        body={t('hero.body')}
        image='/images/property/image1.jpg'
        alt={t('hero.imageAlt')}
        fullViewport
        titleRole='editorial'
        wideEditorial
      />

      <section className='flex min-h-[100svh] items-center bg-[var(--trb-lake)] py-[var(--space-section)] text-[var(--trb-sand)]'>
        <Container className='!max-w-[110rem]'>
          <div className='grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20'>
            <div className='relative aspect-[4/5] overflow-hidden'>
              <Image
                src='/images/property/image2-d.jpg'
                alt={t('hospitality.imageAlt')}
                fill
                sizes='(min-width: 1024px) 40vw, 100vw'
                className='object-cover'
              />
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--trb-sand)_72%,transparent)]'>
                {t('hospitality.eyebrow')}
              </p>
              <h2 className='editorial-statement mt-5'>
                <span className='lg:block'>
                  {t('hospitality.titleLineOne')}{' '}
                </span>
                <span className='lg:block'>
                  {t('hospitality.titleLineTwo')}
                </span>
              </h2>
              <p className='mt-7 max-w-xl text-base leading-7 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)] sm:text-lg sm:leading-8'>
                {t('hospitality.body')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className='flex min-h-[100svh] items-center bg-page-surface py-[var(--space-section)]'>
        <Container className='!max-w-[110rem]'>
          <div className='grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20'>
            <SectionHeading
              eyebrow={t('enquiry.eyebrow')}
              title={t('enquiry.title')}
              titleLines={[
                t('enquiry.titleLineOne'),
                t('enquiry.titleLineTwo'),
              ]}
              titleRole='editorial'
              body={t('enquiry.body')}
            />
            <form aria-describedby='enquiry-form-status'>
              <p
                id='enquiry-form-status'
                className='mb-8 border-l-2 border-[var(--trb-lagoon)] pl-4 text-sm leading-6 text-page-muted'
              >
                {t('enquiry.formStatus')}
              </p>
              <fieldset disabled className='grid gap-6 sm:grid-cols-2'>
                <label className='text-sm text-page-text'>
                  <span>{t('enquiry.fields.name')}</span>
                  <input
                    name='name'
                    className='mt-3 block w-full border-b border-page-border bg-transparent px-0 py-3'
                  />
                </label>
                <label className='text-sm text-page-text'>
                  <span>{t('enquiry.fields.email')}</span>
                  <input
                    name='email'
                    type='email'
                    className='mt-3 block w-full border-b border-page-border bg-transparent px-0 py-3'
                  />
                </label>
                <label className='text-sm text-page-text sm:col-span-2'>
                  <span>{t('enquiry.fields.dates')}</span>
                  <input
                    name='dates'
                    className='mt-3 block w-full border-b border-page-border bg-transparent px-0 py-3'
                  />
                </label>
                <label className='text-sm text-page-text sm:col-span-2'>
                  <span>{t('enquiry.fields.message')}</span>
                  <textarea
                    name='message'
                    rows={4}
                    className='mt-3 block w-full resize-none border-b border-page-border bg-transparent px-0 py-3'
                  />
                </label>
              </fieldset>
            </form>
          </div>
        </Container>
      </section>

      <section className='flex min-h-[100svh] items-center bg-page-background py-[var(--space-section)]'>
        <Container>
          <div className='grid gap-14 lg:grid-cols-2 lg:gap-20'>
            <div>
              <SectionHeading
                eyebrow={t('details.eyebrow')}
                title={t('details.title')}
                body={t('details.body')}
              />
              <dl className='mt-10 divide-y divide-page-border border-y border-page-border'>
                <div className='py-5'>
                  <dt className='text-sm text-page-muted'>
                    {t('details.addressLabel')}
                  </dt>
                  <dd className='mt-2 text-page-text'>
                    {t('details.addressValue')}
                  </dd>
                </div>
                <div className='py-5'>
                  <dt className='text-sm text-page-muted'>
                    {t('details.contactLabel')}
                  </dt>
                  <dd className='mt-2 text-page-text'>
                    {t('details.contactValue')}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <div className='relative aspect-square overflow-hidden'>
                <Image
                  src='/images/placeholders/map.jpg'
                  alt={t('location.imageAlt')}
                  fill
                  sizes='(min-width: 1024px) 50vw, 100vw'
                  className='object-cover'
                />
              </div>
              <h2 className='mt-7 font-display text-3xl text-page-text-strong'>
                {t('location.title')}
              </h2>
              <p className='mt-4 text-page-muted'>{t('location.body')}</p>
              <TrbButton href={mapsUrl} external className='mt-6'>
                {t('location.mapsLink')}
              </TrbButton>
              <h3 className='mt-10 font-display text-2xl text-page-text-strong'>
                {t('location.arrivalTitle')}
              </h3>
              <p className='mt-4 text-page-muted'>
                {t('location.arrivalBody')}
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
