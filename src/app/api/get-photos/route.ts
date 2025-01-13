import {NextResponse} from "next/server";
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";

const dynamoDBClientConfigs = {
    region: process.env.AMAZON_REGION!,
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    }
}

const dynamoDBClient = new DynamoDBClient(dynamoDBClientConfigs);

export async function GET() {
    const photoLinks = await getPhotos();
    return NextResponse.json(photoLinks);
}

async function getPhotos() {
    const command = new ScanCommand({
        TableName: process.env.COMPLETED_CHALLENGES_TABLE,
    });
    
    try {
        const data = await dynamoDBClient.send(command);
        const photoLinks: string[][] = [];
        data.Items!.forEach(function (item) {
            if (!item.value) return;
            const value = item.value.S || "";
            const timestamp = item.timestamp.N || "";
            if (isURL(value)) photoLinks.push([value, timestamp]);
        });
        
        photoLinks.sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
        return photoLinks.map(link => link[0]);
    } catch (error) {
        console.error("Error fetching items from DynamoDB table:", error);
        throw error;
    }
    
}

function isURL(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}