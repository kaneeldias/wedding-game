import {NextRequest} from "next/server";
import {TaskJson, TextTaskJson} from "@/types/task-types";
import tasks from "@/data/tasks.json";
import {TextSubmissionType} from "@/types/submission-types";
import {ANSWER_CORRECT, ANSWER_INCORRECT, TASK_NOT_FOUND} from "@/constants/http-response-constants";
import {DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";
import {PutObjectCommand, PutObjectCommandInput, S3Client} from "@aws-sdk/client-s3";

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
    
    const task = tasksJson.find(task => task.id === challengeId);
    if (task === undefined) return TASK_NOT_FOUND;
    
    
    if (task.type == "text") {
        const data = await request.json();
        const username = (data as TextSubmissionType).username;
        
        const expectedAnswer = (task as TextTaskJson).answer;
        const answer = (data as TextSubmissionType).answer;
        if (expectedAnswer === answer) {
            await updateAnswersTable(username, challengeId, answer);
            return ANSWER_CORRECT();
        }
        return ANSWER_INCORRECT();
    }
    
    if (task.type == "upload") {
        const formData = await request.formData();
        const username = formData.get("username") as string;
        const file = formData.get("file") as File;
        
        const url = await uploadToS3Bucket(file, username, challengeId);
        await updateAnswersTable(username, challengeId, url);
        return ANSWER_CORRECT();
    }
    
    return TASK_NOT_FOUND;
    
}

async function updateAnswersTable(username: string, challengeId: string, value: string) {
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
            },
            "value": {
                "S": value
            }
        },
        "TableName": process.env.COMPLETED_CHALLENGES_TABLE
    };
    const command = new PutItemCommand(input);
    await dynamoDBClient.send(command);
}

async function uploadToS3Bucket(file: File, username: string, challengeId: string): Promise<string> {
    const s3Configs = {
        region: process.env.AMAZON_REGION!,
        credentials: {
            accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
        }
    }
    
    const input: PutObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${username}-${challengeId}-${file.name}`,
        Body: Buffer.from(await file.arrayBuffer()),
    }
    
    const s3Client = new S3Client(s3Configs);
    await s3Client.send(new PutObjectCommand(input));
    return `https://${process.env.S3_BUCKET_NAME}.s3.eu-west-1.amazonaws.com/${username}-${challengeId}-${file.name}`;
}