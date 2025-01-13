import {TaskJson} from "@/types/task-types";
import tasks from "@/data/tasks.json";
import {getCompletedTasks} from "@/utils/task-utils";

export async function getPoints(): Promise<Record<string, number>> {
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const completedTasks = await getCompletedTasks();
    
    const pointsMap: Record<string, number> = {};
    const galleryPointsMap: Record<string, number> = {};
    
    for (const completedTask of completedTasks) {
        const user = completedTask.user;
        if (!user) continue;
        
        const currentUserPoints = pointsMap[user] || 0;
        
        const task = tasksJson.find(task => task.id === completedTask.challenge);
        if (task === undefined) {
            if (completedTask.challenge.includes("photo-gallery")) {
                const currentGalleryPoints = galleryPointsMap[user] || 0;
                if (currentGalleryPoints >= 500) continue;
                galleryPointsMap[user] = currentGalleryPoints + 100;
                pointsMap[user] = currentUserPoints + 100;
            }
            
        } else {
            const points = task.points;
            
            let bonusPoints = 0;
            const firstThree = completedTasks.filter(task => task.challenge === completedTask.challenge).sort((a, b) => a.timestamp - b.timestamp).slice(0, 3);
            const userInFirstThree = firstThree.find(task => task.user === user) !== undefined;
            if (userInFirstThree) {
                bonusPoints += points / 2;
            }
            
            pointsMap[user] = currentUserPoints + points + bonusPoints;
        }
        
    }
    return pointsMap;
}