import {Badge, Button, Card, Group, Image, Text} from "@mantine/core";
import {Task} from "@/types/task-types";

type Props = {
    task: Task;
}

export default function TaskCard(props: Props) {
    const task = props.task;
    
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className={`w-full flex flex-row`}>
            <Card.Section>
                <Image
                    src={task.photo}
                    height={10}
                    alt="Task photo"
                />
            </Card.Section>
            
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={700}>{task.title}</Text>
                <div className={`flex flex-row space-x-2`}>
                    <Badge color="green">{task.points}</Badge>
                    {task.bonus && <Badge color="orange">Bonus</Badge>}
                </div>
            </Group>
            
            <Text size="sm" c="dimmed">
                {task.description}
            </Text>
            
            <a href={`/submit/${task.id}`} rel="noreferrer">
                <Button fullWidth mt="md" radius="md">
                    Submit challenge
                </Button>
            </a>
        
        
        </Card>
    
    );
}