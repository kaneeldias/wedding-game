"use client"

import {Button, Modal} from "@mantine/core";

type Props = {
    opened: boolean;
    close: () => void;
}

export default function AnswerIncorrectModal(props: Props) {
    return (
        <Modal opened={props.opened} closeOnClickOutside={true} withCloseButton={false} centered
               onClose={props.close}
        >
            <div className={`flex flex-col space-y-5`}>
                <div className={`text-emerald-800 font-bold`}>Aww that answer is wrong :(
                </div>
                <Button variant="filled" onClick={props.close}>I&#39;m so sad</Button>
            </div>
        </Modal>
    );
}