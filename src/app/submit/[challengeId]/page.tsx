"use client"

import {alexBrush} from "@/fonts";
import {Task} from "@/types/task-types";
import {Badge, Card, Loader} from "@mantine/core";
import ChallengeSubmissionText from "@/app/components/ChallengeSubmissionText";
import Image from "next/image";
import NameModal from "@/app/components/NameModal";
import {useEffect, useRef, useState} from "react";
import {useParams} from "next/navigation";
import ChallengeSubmissionUpload from "@/app/components/ChallengeSubmissionUpload";
import {Carousel} from "@mantine/carousel";
import AutoScroll from "@/lib/embla-auto-scroll";

export default function SubmitChallengePage() {
    const params = useParams<({ challengeId: string })>();
    const [task, setTask] = useState<Task | null>(null);
    const [submissions, setSubmissions] = useState([]);
    const autoScroll = useRef(AutoScroll({
        speed: 2, playOnInit: true, stopOnInteraction: true
    }));
    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-task/${params.challengeId}?username=${localStorage.getItem("name")}`)
        .then(res => res.json())
        .then(setTask);
    }, [params.challengeId]);
    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-task/${params.challengeId}/submissions`)
        .then(res => res.json())
        .then(setSubmissions);
    }, [params.challengeId]);
    
    return (
        <div className={`flex h-full w-full flex-col items-center justify-center p-5 space-y-5`}>
            
            {task && <>
                <div className={`${alexBrush.className} text-emerald-700 text-4xl text-left w-full`}>
                    Submit challenge
                </div>

                <Card shadow="sm" padding="lg" radius="md" withBorder className={`w-full flex flex-row space-y-5`}>
                    <div className={`text-xl text-emerald-800 text-left w-full font-bold`}>
                        {task.title}
                    </div>
                    <div className={`flex flex-row space-y-5`}>
                        <div className={`flex flex-col space-y-5`}>
                            <div className={`text-sm`}>
                                {task.description}
                            </div>

                            <div className={`flex flex-row space-x-5`}>
                                <div className={`text-xs bg-gray-100 p-2 rounded-md`}>
                                    Points: <Badge color="green">{task.points}</Badge>
                                </div>
                                
                                {task.bonus &&
                                    <div className={`text-xs bg-gray-100 p-2 rounded-md`}>
                                        Bonus: <Badge color="orange">{task.points / 2}</Badge>
                                    </div>
                                }

                            </div>
                            
                            {task.type == "text" && <ChallengeSubmissionText challengeId={task.id}/>}
                            {task.type == "upload" && <ChallengeSubmissionUpload challengeId={task.id}/>}
                        </div>
                    </div>


                </Card>

                <Image src={`/${task.photo}`} height={16} width={50} alt="Task photo" className={`rounded-md w-full`}/>
            </>}
            
            {task && submissions &&
                <Card shadow="sm" padding="lg" radius="md" withBorder className={`w-full flex flex-row space-y-5`}>
                    <div className={`text-xl text-emerald-800 text-left w-full font-bold`}>
                        Other submissions
                    </div>

                    <Carousel
                        // withIndicators
                        height={200}
                        slideSize={submissions.length > 2 ? "50%" : "100%"}
                        slideGap="md"
                        loop
                        align="start"
                        plugins={[autoScroll.current]}
                    >
                        {submissions.map((submission, index) => {
                            return (
                                <Carousel.Slide key={index}>
                                    <div
                                        className={`flex flex-row h-full items-center justify-center`}>
                                        <Image src={submission} alt={"Submitted photo"}
                                               width={0}
                                               height={0}
                                               sizes="100vw"
                                               style={{width: 'auto', height: '100%'}} // optional
                                        />
                                    </div>
                                </Carousel.Slide>
                            )
                        })}
                    </Carousel>
                </Card>
            }
            
            
            {!task && <Loader/>}
            <NameModal/>
        </div>
    );
}
