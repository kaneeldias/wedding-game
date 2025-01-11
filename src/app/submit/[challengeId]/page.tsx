import {alexBrush} from "@/fonts";
import {Task} from "@/types/task-types";
import {Badge, Card} from "@mantine/core";
import ChallengeSubmissionText from "@/app/components/ChallengeSubmissionText";
import Image from "next/image";
import NameModal from "@/app/components/NameModal";

export default async function SubmitChallengePage({params}: { params: Promise<{ challengeId: string }> }) {
    const task: Task = await getTask((await params).challengeId);
    
    return (
        <div className={`flex h-full w-full flex-col items-center justify-center p-5 space-y-5`}>
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
                                    Bonus: <Badge color="orange">{task.points}</Badge>
                                </div>
                            }
                        
                        </div>
                        
                        <ChallengeSubmissionText challengeId={task.id}/>
                    </div>
                </div>
            
            
            </Card>
            
            <Image src={`/${task.photo}`} height={16} width={50} alt="Task photo" className={`rounded-md w-full`}/>
            <NameModal/>
        </div>
    );
}

async function getTask(challengeId: string): Promise<Task> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-task/${challengeId}`);
    return await res.json();
}