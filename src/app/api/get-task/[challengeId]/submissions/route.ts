import {NextRequest, NextResponse} from "next/server";
import {DynamoDBClient, ScanCommand} from "@aws-sdk/client-dynamodb";

const dynamoDBClientConfigs = {
    region: process.env.AMAZON_REGION!,
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    }
}

const dynamoDBClient = new DynamoDBClient(dynamoDBClientConfigs);


export async function GET(request: NextRequest, {params}: { params: Promise<{ challengeId: string }> }) {
    const challengeId = (await params).challengeId;
    const submissionLinks = await getSubmissions(challengeId);
    return NextResponse.json(submissionLinks);
}

async function getSubmissions(challengeId: string) {
    const command = new ScanCommand({
        TableName: process.env.COMPLETED_CHALLENGES_TABLE,
        FilterExpression: "challenge = :challengeId",
        ExpressionAttributeValues: {
            ":challengeId": {S: challengeId}
        },
    });
    
    try {
        const data = await dynamoDBClient.send(command);
        const submissionLinks: string[] = [];
        data.Items!.forEach(function (item) {
            submissionLinks.push(item.value.S || "");
        });
        return submissionLinks;
    } catch (error) {
        console.error("Error fetching items from DynamoDB table:", error);
        throw error;
    }
    
}