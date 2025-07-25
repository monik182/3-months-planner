import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Provider } from '@/components/ui/provider'
import { Box, Grid, GridItem } from '@chakra-ui/react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ReactQueryProvider } from './providers/ReactQueryProvider'
import { PlanProvider } from '@/app/providers/usePlanContext'
import { Extra } from '@/components/Extra'
import { AccountProvider } from '@/app/providers/useAccountContext'
import { Toaster } from '@/components/ui/toaster'
import { MixpanelProvider } from '@/app/providers/MixpanelProvider'
import { getUser } from '@/app/util/auth'
import { AuthProvider } from '@/app/providers/AuthProvider'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const user = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MixpanelProvider>
          <AuthProvider initialUser={user}>
            <ReactQueryProvider>
              <Provider>
                <AccountProvider>
                  <PlanProvider>
                    <Box>
                      <Grid templateRows="6rem 1fr auto" minHeight="100vh">
                        <GridItem height="6rem">
                          <Header />
                        </GridItem>
                        <GridItem overflow="auto" paddingX="8" paddingBottom="8">
                          {children}
                        </GridItem>
                        <GridItem>
                          <Footer />
                        </GridItem>
                      </Grid>
                    </Box>
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
