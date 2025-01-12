import {Card, Table, TableData} from "@mantine/core";
import {getPoints} from "@/utils/points-utils";
import PointsBar from "@/app/components/PointsBar";

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