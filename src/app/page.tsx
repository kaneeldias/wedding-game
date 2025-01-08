"use client"

import {alexBrush} from "@/fonts";
import Button from "@/components/Button";

export default function Home() {
    return (
        <div className={`flex h-full w-full flex-col items-center justify-center`}>
            <div className={`${alexBrush.className} text-black text-3xl opacity-45`}>
                Welcome to the wedding of
            </div>
            <div className={`${alexBrush.className} text-black text-6xl opacity-60`}>
                Rasika & Savidu
            </div>
            <a href={"/instructions"}>
                <Button>play the wedding game</Button>
            </a>
        </div>
    );
}
