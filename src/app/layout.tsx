import type { Metadata, Viewport } from 'next';
import { Inter, Lora, Source_Sans_3, Merriweather, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
  display: 'swap',
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://craftcv-studio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'CraftCV — Free ATS-Optimized Resume Builder & Vector PDF Export',
    template: '%s | CraftCV',
  },
  description:
    'Create ATS-optimized, job-ready resumes in under 5 minutes. 8 professional templates, live 0–100 ATS score checker, A4/Letter/Legal page sizes, and selectable-text vector PDF export — 100% free with no watermark.',
  keywords: [
    'Resume Builder',
    'ATS Resume',
    'CV Maker',
    'Free Resume Builder',
    'Executive Resume',
    'Tech CV',
    'Vector PDF Resume',
  ],
  authors: [{ name: 'CraftCV Studio' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'CraftCV',
    title: 'CraftCV — Free ATS-Optimized Resume Builder',
    description:
      'Pick a template, edit live on true A4/Letter paper, check your ATS score, and download a crisp selectable-text PDF in under 5 minutes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CraftCV — Free ATS-Optimized Resume Builder',
    description:
      '8 ATS-friendly templates, live ATS score checker, and selectable-text vector PDF export. 100% free, no watermark.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${sourceSans.variable} ${merriweather.variable} ${playfair.variable} light`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased selection:bg-[#2563EB] selection:text-white transition-colors duration-150">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
