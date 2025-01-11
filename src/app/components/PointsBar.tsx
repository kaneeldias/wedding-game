"use client"

import {Badge, Button, Progress} from "@mantine/core";
import {Points} from "@/types/points-types";
import {useEffect, useState} from "react";
import {alexBrush} from "@/fonts";

export default function PointsBar() {
    const [points, setPoints] = useState<Points | null>(null);
    
    useEffect(() => {
        const username = localStorage.getItem("name");
        fetch(`/api/get-points/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.json())
        .then((data: Points) => {
            setPoints(data);
        });
        
    }, []);
    
    return (
        <>
            {points &&
                <div
                    className={`flex flex-col p-2 bg-white rounded-md items-start w-full z-50 space-y-2 pb-3 shadow-md`}>
                    <div className={`${alexBrush.className} text-emerald-700 text-4xl`}>
                        Welcome {localStorage.getItem("name")}!

                    </div>

                    <div>
                        <div className={`text-emerald-700 font-bold flex items-center space-x-2`}>
                            <div className={`text-gray-700`}>Points:</div>
                            <Badge size={"md"} color={"blue"}>{points.points + points.bonusPoints}</Badge>
                        </div>
                    </div>
                    <Progress.Root size="xl" className={`w-full`}>
                        <Progress.Section value={points.points} color="teal">
                            <Progress.Label>{points.points}</Progress.Label>
                        </Progress.Section>
                        <Progress.Section value={points.bonusPoints} color="orange">
                            <Progress.Label>{points.bonusPoints}</Progress.Label>
                        </Progress.Section>
                    </Progress.Root>

                    <div className={`flex flex-row space-x-5 pt-2`}>
                        <a href={"/instructions"}><Button size={"xs"}>Instructions</Button></a>
                        <a href={"/leaderboard"}><Button size={"xs"}>Leaderboard</Button></a>
                    </div>
                </div>
            }
        </>
    
    )
}