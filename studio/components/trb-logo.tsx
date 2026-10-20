import trbLogoUrl from '../../public/logo/trb-logo-image-plain.svg?url'

export function TrbLogo() {
  return (
    <img
      alt="The Ranco Bay"
      src={trbLogoUrl}
      style={{display: 'block', height: '100%', width: '100%', objectFit: 'contain'}}
    />
  )
}
