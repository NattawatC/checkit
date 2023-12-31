import { EmailProvider } from '@/components/EmailContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DM_Sans } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const dm_sans = DM_Sans({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${dm_sans.style.fontFamily};
        }
      `}</style>
      <EmailProvider>
        <Component {...pageProps} />
        <Toaster />
      </EmailProvider>
    </>
  )
}
