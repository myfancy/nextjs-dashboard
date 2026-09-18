import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Link href='/dashboard'>/dashboard</Link>
        {children}
        </body>
    </html>
  );
}
