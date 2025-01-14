import type {Metadata} from "next";
import "./globals.css";
import Image from "next/image";
import {roboto} from "@/fonts";
import '@mantine/core/styles.css';
import {ColorSchemeScript, createTheme, mantineHtmlProps, MantineProvider} from "@mantine/core";
import {Suspense} from "react";
import '@mantine/carousel/styles.css';

export const metadata: Metadata = {
    title: "Rasika & Savidu's Wedding",
    description: "The Wedding Game",
};

const theme = createTheme({
    fontFamily: 'Open Sans, sans-serif',
    primaryColor: 'teal',
});


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>
            <Suspense>
                <ColorSchemeScript/>
            </Suspense>
        </head>
        <body
            className={`w-full ${roboto.className} bg-gradient-to-bl from-emerald-200 to-rose-200`}
        >
        <Image src={'/rb_24436.png'} alt={"Flowers"} width={200} height={200}
               className={`fixed w-[500px] -bottom-16 -left-20 -rotate-8 -z-50`}
               priority={true}
        />
        
        <Image src={'/rb_24436.png'} alt={"Flowers"} width={200} height={200}
               className={`fixed w-[250px] top-10 -right-28 hue-rotate-90 rotate-[80deg] z-50`}
               priority={true}
        />
        <div
            className={`flex flex-col min-h-screen w-full text-black ${roboto.className} items-center justify-start`}>
            <MantineProvider theme={theme}>
                {children}
            </MantineProvider>
        </div>
        </body>
        </html>
    );
}
