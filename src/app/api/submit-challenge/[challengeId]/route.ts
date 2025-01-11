import {NextRequest} from "next/server";
import {TaskJson, TextTaskJson} from "@/types/task-types";
import tasks from "@/data/tasks.json";
import {SubmissionType, TextSubmissionType} from "@/types/submission-types";
import {ANSWER_CORRECT, ANSWER_INCORRECT, TASK_NOT_FOUND} from "@/constants/http-response-constants";
import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";

const dynamoDBClientConfigs = {
    region: process.env.AMAZON_REGION!,
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    }
}

const dynamoDBClient = new DynamoDBClient(dynamoDBClientConfigs);

export async function POST(request: NextRequest, {params}: { params: Promise<{ challengeId: string }> }) {
    const tasksJson: TaskJson[] = tasks.tasks as TaskJson[];
    const challengeId = (await params).challengeId;
    const data: SubmissionType = await request.json();
    const username = data.username;
    
    const task = tasksJson.find(task => task.id === challengeId);
    if (task === undefined) return TASK_NOT_FOUND;
    
    if (task.type == "text") {
        const expectedAnswer = (task as TextTaskJson).answer;
        const answer = (data as TextSubmissionType).answer;
        if (expectedAnswer === answer) {
            await updateAnswersTable(username, challengeId);
            return ANSWER_CORRECT();
        }
        return ANSWER_INCORRECT();
    }
    
    return TASK_NOT_FOUND;
    
}

async function updateAnswersTable(username: string, challengeId: string) {
    const input = {
        Item: {
            "user-challenge-id": {
                "S": `${username}-${challengeId}`
            },
            "user": {
                "S": username
            },
            "challenge": {
                "S": challengeId
            },
            "timestamp": {
                "N": `${Date.now()}`
            }
        },
        "TableName": process.env.COMPLETED_CHALLENGES_TABLE
    };
    const command = new PutItemCommand(input);
    await dynamoDBClient.send(command);
}