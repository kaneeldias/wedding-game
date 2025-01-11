import {NextResponse} from "next/server";
import {Task, TaskJson} from "@/types/task-types";
import tasks from "../../data/tasks.json";
import {getCompletedTasks} from "@/utils/task-utils";


export async function GET() {
    const username = "Kaneel";
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const completedTasks = await getCompletedTasks();
    
    const processedTasks: Task[] = tasksJson.map((task) => {
        const completed = (completedTasks.find(completedTask => completedTask.challenge === task.id && completedTask.user === username)) != undefined;
        const firstThree = completedTasks.filter(completedTask => completedTask.challenge === task.id).sort((a, b) => a.timestamp - b.timestamp).slice(0, 3);
        
        let bonus = false;
        if (completed) {
            bonus = firstThree.find(task => task.user === username) != undefined;
        } else {
            bonus = firstThree.length < 3;
        }
        
        return {
            ...task,
            bonus: bonus,
            completed: completed
        };
    });
    return NextResponse.json(processedTasks);
}
