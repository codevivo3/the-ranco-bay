import {buildTheme} from '@sanity/themer'

export const trbTheme = buildTheme({
  light: {
    accent: '#13788a',
    text: '#244b74',
    background: '#fffdf4',
    contrast: 90,
  },
  dark: {
    accent: '#13788a',
    text: '#f0edda',
    background: '#173654',
    contrast: 90,
  },
})
