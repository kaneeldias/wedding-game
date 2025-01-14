import {alexBrush} from "@/fonts";
import {Button} from "@mantine/core";

export default function Home() {
    return (
        <div className={`flex min-h-screen w-full flex-col items-center justify-center`}>
            <div className={`${alexBrush.className} text-black text-2xl opacity-45`}>
                Welcome to the wedding of
            </div>
            <div className={`${alexBrush.className} text-black text-5xl opacity-60 mb-5`}>
                Rasika & Savidu
            </div>
            
            <div className={`flex flex-row space-x-5`}>
                <a href={"/instructions"}>
                    <Button>play the wedding game</Button>
                </a>
                <a href={"/gallery"}>
                    <Button>view photo gallery</Button>
                </a>
            </div>
        </div>
    );
}
