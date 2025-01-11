export type TaskBase = {
    id: string;
    title: string;
    description: string;
    photo: string;
    points: number;
}

export type Task = TaskWithoutAnswerJson & {
    bonus: boolean;
    completed: boolean;
}

export type TextTaskJson = TextTaskWithoutAnswerJson & {
    answer: string;
}

export type TextTaskWithoutAnswerJson = TaskBase & {
    type: "text"
}

export type UploadTaskJson = TaskBase & {
    type: "upload"
}

export type TaskJson = TextTaskJson | UploadTaskJson

export type TaskWithoutAnswerJson = TextTaskWithoutAnswerJson | UploadTaskJson

export type CompletedTask = {
    "user-challenge-id": string,
    user: string,
    challenge: string,
    timestamp: number
}