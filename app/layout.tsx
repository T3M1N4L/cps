import type { Metadata } from 'next'
import './globals.css'
import { GeistMono, GeistSans } from "geist/font";

export const metadata: Metadata = {
  title: 'CPS test',
  description: 'An elegant cps test with top notch UI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en">
      <body>{children}</body>
    </html>
  )
}
