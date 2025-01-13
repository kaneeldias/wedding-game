import {NextRequest} from "next/server";
import {ANSWER_CORRECT} from "@/constants/http-response-constants";
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

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const file = formData.get("file") as File;
    
    const url = await uploadToS3Bucket(file, username, `photo-gallery-${Date.now()}`);
    await updateAnswersTable(username, `photo-gallery-${Date.now()}`, url);
    return ANSWER_CORRECT();
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