import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Provider } from '@/components/ui/provider'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { Header } from '@/components/Header'
import { ReactQueryProvider } from './providers/ReactQueryProvider'
import { PlanProvider } from '@/app/providers/usePlanContext'
import { Extra } from '@/components/Extra'
import { AccountProvider } from '@/app/providers/useAccountContext'
import { Toaster } from '@/components/ui/toaster'
import PlanLayout from '@/app/layout/PlanLayout'
import { MixpanelProvider } from '@/app/providers/MixpanelProvider'
import { AuthProvider } from '@/app/providers/AuthContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'The Planner',
  description: 'Achieve your goals faster with the 12-Week Year Plan Tracker. Create focused action plans, track progress weekly, and boost productivity—all in one place.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MixpanelProvider>
          <AuthProvider>
            <ReactQueryProvider>
              <Provider>
                <AccountProvider>
                  <PlanProvider>
                    <PlanLayout>
                      <Box margin="0 2rem 5rem">
                        <Grid templateRows="10% auto" height="100vh">
                          <GridItem><Header /></GridItem>
                          <GridItem overflow="auto">{children}</GridItem>
                        </Grid>
                      </Box>
                    </PlanLayout>
                  </PlanProvider>
                  <Extra />
                </AccountProvider>
                <Toaster />
              </Provider>
            </ReactQueryProvider>
          </AuthProvider>
        </MixpanelProvider>
      </body>
    </html>
  )
}
