import {NextResponse} from "next/server";

export const TASK_NOT_FOUND = NextResponse.json(
    {
        error: "Task does not exist"
    },
    {
        status: 404
    }
)

export const ANSWER_CORRECT = () => NextResponse.json(
    {
        correct: true
    }
)

export const ANSWER_INCORRECT = () => NextResponse.json(
    {
        correct: false
    }
)