import PointsBar from "../components/PointsBar";
import {Card, Table, TableData} from "@mantine/core";

export default async function Leaderboard() {
    const points = await getPoints();
    const sortedPoints = Object.entries(points).sort((a, b) => b[1] - a[1]);
    const head = ["Rank", "Name", "Points"];
    const body = sortedPoints.map((entry, index) => [index + 1, entry[0], entry[1]]);
    const tableData: TableData = {head, body};
    
    return (
        <div className={`flex flex-col p-5 w-full space-y-5 items-start h-full`}>
            <PointsBar/>
            <Card shadow="sm" padding="xs" radius="md" withBorder className={`w-full flex flex-row`}>
                <div className={`font-bold px-2 text-lg`}>Leaderboard</div>
                <Table data={tableData}/>
            </Card>
        </div>
    )
}

async function getPoints(): Promise<Record<string, number>> {
    const pointsJson = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-points`);
    return JSON.parse(await pointsJson.json());
}