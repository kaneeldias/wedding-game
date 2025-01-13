import {NextRequest, NextResponse} from "next/server";
import {TaskJson} from "@/types/task-types";
import tasks from "@/data/tasks.json";
import {Points} from "@/types/points-types";
import {getCompletedTasks} from "@/utils/task-utils";

export async function GET(request: NextRequest, {params}: { params: Promise<{ username: string }> }) {
    const username = (await params).username;
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const completedTasks = await getCompletedTasks();
    
    let points = 0;
    let bonusPoints = 0;
    for (const completedTask of completedTasks) {
        if (completedTask.challenge.includes("photo-gallery")) continue;
        
        if (completedTask.user != username) continue;
        
        const task = tasksJson.find(task => task.id === completedTask.challenge);
        if (task == undefined) continue;
        points += task.points;
        
        const firstThree = completedTasks.filter(task => task.challenge === completedTask.challenge).sort((a, b) => a.timestamp - b.timestamp).slice(0, 3);
        if (firstThree.find(task => task.user === username)) {
            bonusPoints += task.points / 2
        }
    }
    
    const result: Points = {
        username: username,
        points: points,
        bonusPoints: bonusPoints
    }
    return NextResponse.json(result);
}