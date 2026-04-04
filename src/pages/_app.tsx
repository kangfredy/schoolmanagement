import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// Screen-level styles (imported here per Next.js global CSS rule)
import "@/screens/DataSiswa/DataSiswa.style.css";
import "@/screens/DataJurusan/DataJurusan.style.css";
import "@/screens/DataKelas/DataKelas.style.css";
import "@/screens/UserMenu/UserMenu.style.css";
import "@/screens/ReminderSPP/ReminderSPP.style.css";
import "@/screens/PembayaranSpp/PembayaranSpp.style.css";
import "@/screens/PembayaranSeragam/PembayaranSeragam.style.css";
import "@/screens/DataAdministrasi/DataAdministrasi.style.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
        <SpeedInsights />
            <Component {...pageProps} />
            
        </>
    );
}
