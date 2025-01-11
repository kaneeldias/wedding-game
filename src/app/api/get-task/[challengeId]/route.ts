import {NextRequest, NextResponse} from "next/server";
import {Task, TaskJson} from "@/types/task-types";
import tasks from "@/data/tasks.json";
import {TASK_NOT_FOUND} from "@/constants/http-response-constants";
import {getCompletedTasks} from "@/utils/task-utils";

export async function GET(request: NextRequest, {params}: { params: Promise<{ challengeId: string }> }) {
    const username = request.nextUrl.searchParams.get("username");
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const challengeId = (await params).challengeId;
    
    const task = tasksJson.find(task => task.id === challengeId);
    if (task === undefined) return TASK_NOT_FOUND;
    
    const completedTasks = await getCompletedTasks();
    const completed = (completedTasks.find(completedTask => completedTask.challenge === task.id && completedTask.user === username)) != undefined;
    
    let bonus;
    const firstThree = completedTasks.filter(completedTask => completedTask.challenge === task.id).sort((a, b) => a.timestamp - b.timestamp).slice(0, 3);
    if (completed) {
        bonus = firstThree.find(task => task.user === username) != undefined;
    } else {
        bonus = firstThree.length < 3;
    }
    
    const taskAmended: Task = {
        ...task,
        bonus: bonus,
        completed: completed
    }
    
    return NextResponse.json(taskAmended);
}
