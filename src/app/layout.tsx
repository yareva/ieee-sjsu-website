import type { Metadata, Viewport } from 'next'
import { Inter, Chakra_Petch, Bebas_Neue, Space_Grotesk, VT323, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// Turns on the scroll-reveal styles before first paint (no flash of content
// that then hides itself). Falls back to showing everything if the reveal
// script never starts.
const SCROLL_REVEAL_BOOT = `document.documentElement.classList.add('sr-on');setTimeout(function(){if(!window.__srReady)document.documentElement.classList.remove('sr-on')},3000);`

// Sets the light/dark theme before first paint so there's no flash. Dark is
// the default; the theme switch saves the visitor's choice.
const THEME_BOOT = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: '--font-chakra-petch',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-bebas',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-space',
  display: 'swap',
});

// Retro terminal fonts for the home page's 3D lab (also drawn onto the
// terminal screen's canvas, so they're read from these CSS variables)
const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-vt323',
  display: 'swap',
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IEEE San José State University',
  description: 'IEEE SJSU Student Chapter - Technical Projects, Events, and Membership',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${chakraPetch.variable} ${bebasNeue.variable} ${spaceGrotesk.variable} ${vt323.variable} ${pressStart.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <script dangerouslySetInnerHTML={{ __html: SCROLL_REVEAL_BOOT }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
