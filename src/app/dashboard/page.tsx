"use client"

import NameModal from "@/app/components/NameModal";
import {useEffect, useState} from "react";
import {Task} from "@/types/task-types";
import TaskCard from "@/app/components/TaskCard";
import PointsBar from "@/app/components/PointsBar";

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
        fetch("/api/get-tasks?username=" + localStorage.getItem("name"))
        .then((res) => res.json())
        .then((data) => {
            const sorted = data.sort((a: Task, b: Task) => {
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                return 0;
            });
            setTasks(sorted)
        });
    }, []);
    
    return (
        <>
            <div className={`flex flex-col p-5 w-full`}>
                <div className={`mb-10`}>
                    <PointsBar/>
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
