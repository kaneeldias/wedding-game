import {NextRequest, NextResponse} from "next/server";
import {Task, TaskJson} from "@/types/task-types";
import {tasks as tasks_json} from "../../../data/tasks.json";
import {TASK_NOT_FOUND} from "@/constants/http-response-constants";

// type Params = {
//     challengeId: string;
// }
//
export async function GET(request: NextRequest, {params}: { params: { challengeId: string } }) {
    console.log(params.challengeId);
    const tasksJson: TaskJson[] = tasks_json as TaskJson[];
    const challengeId = params.challengeId;
    
    const task = tasksJson.find(task => task.id === challengeId);
    if (task === undefined) return TASK_NOT_FOUND;
    const taskAmended: Task = {
        ...task,
        bonus: false,
        completed: false
    }
    
    return NextResponse.json(taskAmended);
}
