import { UserProvider } from '@/globalState/userState';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';


export default function App({ Component, pageProps }: AppProps) {
  return (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
  )
}
