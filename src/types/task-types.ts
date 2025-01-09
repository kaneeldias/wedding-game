export type TaskJson = {
    id: string;
    title: string;
    description: string;
    photo: string;
    points: number;
}

export type Task = TaskJson & {
    bonus: boolean;
    completed: boolean;
}

