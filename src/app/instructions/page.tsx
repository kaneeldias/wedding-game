"use client"

import {alexBrush} from "@/fonts";
import Button from "@/app/components/Button";
import {Badge} from "@mantine/core";

export default function Home() {
    return (
        <div className={`flex h-full w-full flex-col items-center justify-center m-5`}>
            <div className={`bg-white shadow-md p-10 mx-10 rounded-sm`}>
                <div className={`${alexBrush.className} text-emerald-700 text-6xl`}>
                    Instructions
                </div>
                <div className={`font-light text-lg mt-5`}>
                    <ul className={`flex flex-col space-y-3 pl-5`}>
                        <li className={`list-disc`}>You will be provided with a list of tasks to complete</li>
                        <li className={`list-disc`}>You need to complete each task and take a picture as proof (or
                            answer the question)
                        </li>
                        <li className={`list-disc`}>Upload the photo as proof to complete each task</li>
                        <li className={`list-disc`}>Each task will be worth a certain amount of points, which will be
                            shown in the task
                            description
                            <div className={`flex flex-row space-x-2`}>
                                <Badge color={"green"}>Normal points</Badge>
                            </div>
                        
                        </li>
                        <li className={`list-disc`}>The first 3 people to complete a task will be awarded bonus points
                            <div className={`flex flex-row space-x-2`}>
                                <Badge color={"orange"}>Bonus points</Badge>
                            </div>
                        </li>
                        <li className={`list-disc`}>For each photo you upload to the wedding gallery, you will receive
                            100 points (upto a maximum of 500 points)
                            <div className={`flex flex-row space-x-2`}>
                                <Badge color={"indigo"}>Gallery points</Badge>
                            </div>
                        </li>
                        <li className={`list-disc`}>Whoever has most points by 2pm will win a special prize 😉
                            <div className={`flex flex-row space-x-2`}>
                                <Badge color={"blue"}>Total points</Badge>
                            </div>
                        
                        </li>
                    </ul>
                </div>
            </div>
            
            <a href={"/dashboard"}><Button>let&#39;s play</Button></a>
        </div>
    );
}
