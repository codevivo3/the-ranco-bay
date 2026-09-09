const phoneE164 = "+393494125299";
const phoneDigits = phoneE164.slice(1);
const email = "therancobay@gmail.com";
const website = "https://therancobay.com";

export const trbBusiness = {
  name: "The Ranco Bay",
  owner: {
    name: "Emanuela",
  },
  businessType: "vacation-rental",
  contact: {
    email,
    phone: {
      display: "+39 349 412 5299",
      e164: phoneE164,
    },
    messaging: {
      telegram: {phoneE164},
      whatsapp: {phoneE164},
    },
  },
  address: {
    street: "Via Lungolago Dino Ciani, 27",
    locality: "Ranco",
    administrativeArea: "VA",
    countryCode: "IT",
    countryName: "Italy",
    displayLines: ["Via Lungolago Dino Ciani, 27", "Ranco (VA), Italy"],
  },
  registrations: {
    cin: "IT012116C2DHWHCB24",
    propertyCode: "T01909",
  },
  stay: {
    minimumNights: 2,
  },
  amenities: ["parking", "private-beach"],
  directBooking: {
    promotionalRatesAvailable: true,
  },
  presence: {
    bookingCom: true,
    instagram: true,
  },
  website,
  links: {
    email: `mailto:${email}`,
    maps: "https://maps.app.goo.gl/s9u8tAaH742owAHB8",
    mapsEmbed:
      "https://www.google.com/maps?cid=17678086622697744297&output=embed",
    phone: `tel:${phoneE164}`,
    whatsapp: `https://wa.me/${phoneDigits}`,
  },
} as const;
