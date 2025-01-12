import {TaskJson} from "@/types/task-types";
import tasks from "@/data/tasks.json";
import {getCompletedTasks} from "@/utils/task-utils";

export async function getPoints(): Promise<Record<string, number>> {
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const completedTasks = await getCompletedTasks();
    
    const pointsMap: Record<string, number> = {};
    for (const completedTask of completedTasks) {
        const user = completedTask.user;
        const currentUserPoints = pointsMap[user] || 0;
        
        const points = tasksJson.find(task => task.id === completedTask.challenge)?.points || 0;
        
        let bonusPoints = 0;
        const firstThree = completedTasks.filter(task => task.user === user).slice(0, 3);
        const userInFirstThree = firstThree.find(task => task.user === user) !== undefined;
        if (userInFirstThree) {
            bonusPoints += points / 2;
        }
        
        pointsMap[user] = currentUserPoints + points + bonusPoints;
    }
    return pointsMap;
}