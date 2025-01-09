import {promises as fs} from 'fs';
import {NextResponse} from "next/server";
import {Task} from "@/types/task-types";

export async function GET() {
    const file = await fs.readFile('src/app/data/tasks.json', 'utf8');
    const data = JSON.parse(file);
    const tasks: Task[] = data.tasks;
    
    for (const task of tasks) {
        task.completed = false;
        task.bonus = true;
    }
    
    return NextResponse.json(tasks);
}
