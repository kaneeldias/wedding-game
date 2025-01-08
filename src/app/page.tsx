"use client"

import {alexBrush} from "@/fonts";

export default function Home() {
    return (
        <div className={`flex h-full w-full flex-col items-center justify-center`}>
            <div className={`${alexBrush.className} text-black text-3xl opacity-45`}>
                Welcome to the wedding of
            </div>
            <div className={`${alexBrush.className} text-black text-6xl opacity-60`}>
                Rasika & Savidu
            </div>
            <button onClick={() => {
                alert("The wedding game is not ready yet!")
            }}
                    className={`mt-10 flex bg-white bg-opacity-50 rounded-md p-2 px-4 text-emerald-800 font-bold hover:text-white hover:bg-emerald-800 transition-all`}>
                PLAY THE WEDDING GAME
            </button>
        </div>
    );
}
