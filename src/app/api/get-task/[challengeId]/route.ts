import {NextRequest, NextResponse} from "next/server";
import {Task, TaskJson} from "@/types/task-types";
import tasks from "../../../data/tasks.json";
import {TASK_NOT_FOUND} from "@/constants/http-response-constants";

export async function GET(request: NextRequest, {params}: { params: Promise<{ challengeId: string }> }) {
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const challengeId = (await params).challengeId;
    
    const task = tasksJson.find(task => task.id === challengeId);
    if (task === undefined) return TASK_NOT_FOUND;
    const taskAmended: Task = {
        ...task,
        bonus: false,
        completed: false
    }
    
    return NextResponse.json(taskAmended);
}
