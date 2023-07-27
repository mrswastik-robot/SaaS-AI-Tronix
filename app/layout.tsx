import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

import { ModalProvider } from '@/components/modal-provider'

export const metadata: Metadata = {
  title: 'AI Tronix.',
  description: 'An AI SaaS Platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <ClerkProvider>

        <html lang="en">
              <body className={inter.className}>
                <ModalProvider />
                {children}
              </body>
          </html>

    </ClerkProvider>
    
  )
}
