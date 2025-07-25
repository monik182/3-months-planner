import type { Metadata } from 'next'
import { Geist_Mono, Outfit } from 'next/font/google'
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

const outfitSans = Outfit({
  variable: '--font-outfit-sans',
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
  title: 'The Planner - Plan Your Next Quarter',
  description:
    'The Planner helps you map out quarterly goals, track progress, and stay focused for the next 12 weeks.',
  keywords: [
    '12-week-year planner',
    'plan',
    'planner',
    'quarter planner',
    '3 months planner',
    'simple planner',
  ],
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
        className={`${outfitSans.variable} ${geistMono.variable} antialiased`}
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
