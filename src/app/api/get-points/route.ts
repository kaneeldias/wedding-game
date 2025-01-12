import {NextResponse} from "next/server";
import {getPoints} from "@/utils/points-utils";

export async function GET() {
    const pointsMap = await getPoints();
    return NextResponse.json(JSON.stringify(pointsMap));
}