import {CompletedTask} from "@/types/task-types";
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";

const dynamoDBClientConfigs = {
    region: process.env.AMAZON_REGION!,
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    }
}

const dynamoDBClient = new DynamoDBClient(dynamoDBClientConfigs);

export async function getCompletedTasks(): Promise<CompletedTask[]> {
    const command = new ScanCommand({
        TableName: process.env.COMPLETED_CHALLENGES_TABLE
    });
    
    try {
        const data = await dynamoDBClient.send(command);
        
        const completedTasks: CompletedTask[] = [];
        data.Items!.forEach(function (item) {
            completedTasks.push({
                "user-challenge-id": item["user-challenge-id"].S || "",
                user: item.user.S || "",
                challenge: item.challenge.S || "",
                timestamp: (item.timestamp.N || 0) as number
            });
        });
        return completedTasks;
    } catch (error) {
        console.error("Error fetching items from DynamoDB table:", error);
        throw error;
    }
}