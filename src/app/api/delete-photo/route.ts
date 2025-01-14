import {NextRequest, NextResponse} from "next/server";
import {DeleteItemCommand, DynamoDBClient} from "@aws-sdk/client-dynamodb";

const dynamoDBClientConfigs = {
    region: process.env.AMAZON_REGION!,
    credentials: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
    }
}

const dynamoDBClient = new DynamoDBClient(dynamoDBClientConfigs);

export async function POST(request: NextRequest) {
    const data = await request.json();
    
    if (!data.id || !data.username) {
        return NextResponse.json({success: false, message: "Invalid request"}, {status: 400});
    }
    
    const id = data.id;
    const username = data.username;
    
    if (username !== "kaneel-admin-1174") {
        return NextResponse.json({success: false, message: "Unauthorized"}, {status: 403});
    }
    
    await deleteFromAnswersTable(id);
    return NextResponse.json({success: true});
}

function deleteFromAnswersTable(id: string) {
    const deleteItemInput = {
        TableName: process.env.COMPLETED_CHALLENGES_TABLE,
        Key: {
            "user-challenge-id": {S: id}
        }
    };
    
    return dynamoDBClient.send(new DeleteItemCommand(deleteItemInput));
}
