import {NextResponse} from "next/server";
import {Task, TaskJson} from "@/types/task-types";
import {tasks as tasks_json} from "../../data/tasks.json";


export async function GET() {
    // const file = await fs.readFile(process.cwd() + "app/data/tasks.json", 'utf8');
    const tasksJson: TaskJson[] = tasks_json;
    const tasks: Task[] = tasksJson.map((task) => {
        return {
            ...task,
            bonus: false,
            completed: false
        };
    });
    
    return NextResponse.json(tasks);
}
