import type {Metadata} from "next";
import "./globals.css";
import Image from "next/image";
import {roboto} from "@/fonts";

export const metadata: Metadata = {
    title: "Rasika & Savidu",
    description: "The Wedding Game",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`flex w-full ${roboto.className} bg-gradient-to-bl from-emerald-200 to-rose-200`}
        >
        <Image src={'/rb_24436.png'} alt={"Flowers"} width={200} height={200}
               className={`fixed w-[500px] -bottom-16 -left-20 -rotate-8`}
        />
        
        <Image src={'/rb_24436.png'} alt={"Flowers"} width={200} height={200}
               className={`fixed w-[250px] top-10 -right-28 hue-rotate-90 rotate-[80deg]`}
        />
        <div className={`flex flex-col w-full h-screen text-black ${roboto.className} mb-64`}>
            {children}
        </div>
        </body>
        </html>
    );
}
