"use client"

import {Badge, Progress} from "@mantine/core";
import {Points} from "@/types/points-types";
import {useEffect, useState} from "react";

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
                <div className={`flex flex-col p-2 bg-white rounded-md items-start w-full z-50 space-y-2 pb-3`}>
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
                </div>
            }
        </>
    
    )
}