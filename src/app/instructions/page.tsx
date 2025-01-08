"use client"

import {alexBrush} from "@/fonts";
import Button from "@/components/Button";

export default function Home() {
    return (
        <div className={`flex flex-col items-center justify-center m-5`}>
            <div className={`bg-white shadow-md p-10 mx-10 rounded-sm`}>
                <div className={`${alexBrush.className} text-emerald-700 text-6xl`}>
                    Instructions
                </div>
                <div className={`font-light text-lg mt-5`}>
                    <ul className={`flex flex-col space-y-3 pl-5`}>
                        <li className={`list-disc`}>You will be provided with a list of tasks to complete</li>
                        <li className={`list-disc`}>You need to complete each task and take a picture as proof</li>
                        <li className={`list-disc`}>Upload the photo as proof to complete each task</li>
                        <li className={`list-disc`}>Each task will be worth a certain amount of points, which will be
                            shown in the task
                            description
                        </li>
                        <li className={`list-disc`}>The first 3 people to complete a task will be awarded bonus points
                        </li>
                        <li className={`list-disc`}>Whoever has most points by 2pm will win a special prize 😉</li>
                    </ul>
                </div>
            </div>
            
            <Button>let&#39;s play</Button>
        </div>
    );
}
