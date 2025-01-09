"use client"

import NameModal from "@/app/components/NameModal";
import {useEffect, useState} from "react";
import {alexBrush} from "@/fonts";
import {Task} from "@/types/task-types";
import TaskCard from "@/app/components/TaskCard";

export default function Dashboard() {
    const [name, setName] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    
    useEffect(() => {
        const name = localStorage.getItem("name");
        if (name) {
            setName(name);
        }
    }, []);
    
    useEffect(() => {
        console.log("Fetching tasks");
        fetch("/api/get-tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data));
    }, []);
    
    return (
        <>
            <div className={`flex flex-col p-5 w-full`}>
                <div className={`${alexBrush.className} text-emerald-700 text-4xl mb-10`}>
                    Welcome {name}!
                </div>
                
                <div className={`flex flex-col w-full justify-center`}>
                    
                    <div className={`flex flex-col w-full justify-center items-center space-y-10`}>
                        
                        {tasks.map((task, index) => (
                            <TaskCard task={task} key={index}/>
                        ))}
                    
                    </div>
                </div>
            </div>
            <NameModal setName={setName}/>
        </>
    );
}
