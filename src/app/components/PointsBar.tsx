"use client"

import {Badge, Button, Progress} from "@mantine/core";
import {Points} from "@/types/points-types";
import {useEffect, useState} from "react";
import {alexBrush} from "@/fonts";

export default function PointsBar() {
    const [points, setPoints] = useState<Points | null>(null);
    const [currentUrl, setCurrentUrl] = useState("");
    const [name, setName] = useState("");
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUrl(window.location.href);
        }
        
        if (typeof localStorage !== "undefined") {
            setName(localStorage.getItem("name") || "");
        }
    }, []);
    
    useEffect(() => {
        const username = localStorage.getItem("name");
        if (!username) return;
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
        <div className={`flex flex-col w-full space-y-2`}>
            <div
                className={`bg-white bg-opacity-100 flex flex-row space-x-3 p-2 rounded-md w-full justify-start z-50`}>
                
                {points && <a href={"/instructions"}><Button size={"xs"} color={"dark"}>Instructions</Button></a>}
                
                {points && !currentUrl.includes("dashboard") &&
                    <a href={"/dashboard"}><Button size={"xs"} color={"dark"}>Challenges</Button></a>}
                
                {points && !currentUrl.includes("leaderboard") &&
                    <a href={"/leaderboard"}><Button size={"xs"} color={"dark"}>Leaderboard</Button></a>}
                
                {!points && <a href={"/instructions"}><Button size={"xs"} color={"dark"}>Play the game</Button></a>}
                
                {!currentUrl.includes("gallery") &&
                    <a href={"/gallery"}><Button size={"xs"} color={"dark"}>Photo Gallery</Button></a>}
            
            </div>
            
            <div
                className={`flex flex-col p-2 bg-white rounded-md items-start w-full z-50 space-y-2 pb-3 shadow-md`}>
                <div className={`${alexBrush.className} text-emerald-700 text-4xl`}>
                    Welcome {name}!
                
                </div>
                
                {points && <>
                    <div>
                        <div className={`text-emerald-700 font-bold flex items-center space-x-2`}>
                            <div className={`text-gray-700`}>Points:</div>
                            <Badge size={"md"}
                                   color={"blue"}>{points.points + points.bonusPoints + points.galleryPoints}</Badge>
                        </div>
                    </div>
                    <Progress.Root size="xl" className={`w-full`}>
                        <Progress.Section value={points.points} color="teal">
                            <Progress.Label>{points.points}</Progress.Label>
                        </Progress.Section>
                        <Progress.Section value={points.bonusPoints} color="orange">
                            <Progress.Label>{points.bonusPoints}</Progress.Label>
                        </Progress.Section>
                        <Progress.Section value={points.galleryPoints} color="indigo">
                            <Progress.Label>{points.galleryPoints}</Progress.Label>
                        </Progress.Section>
                    </Progress.Root>

                    <div className={`flex flex-row space-x-2`}>
                        <Badge size={"xs"} color={"teal"} className={`py-1`}>Normal points</Badge>
                        <Badge size={"xs"} color={"orange"} className={`py-1`}>Bonus points</Badge>
                        <Badge size={"xs"} color={"indigo"} className={`py-1`}>Gallery points</Badge>
                    </div>
                </>}
            </div>
        
        </div>
    
    )
}