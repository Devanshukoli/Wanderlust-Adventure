import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wanderlust Adventures',
  description: 'Discover your next adventure with us',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}