"use client"

import {Button, Modal, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";

type Props = {
    setName?: (name: string) => void;
}

export default function NameModal(props: Props) {
    const [opened, {open, close}] = useDisclosure(false);
    const [nameInput, setNameInput] = useState("");
    const [error, setError] = useState("");
    
    useEffect(() => {
        const name = localStorage.getItem("name");
        if (name) {
            close();
        } else {
            open()
        }
    }, []);
    
    function updateName(name: string) {
        setNameInput(name);
        setError("");
        
        if (name.length < 3) {
            setError("Name must be at least 3 characters long");
        }
    }
    
    function submitName() {
        localStorage.setItem("name", nameInput);
        if (props.setName) props.setName(nameInput);
        close();
    }
    
    return (
        <Modal opened={opened} onClose={close} closeOnClickOutside={false} withCloseButton={false} centered>
            <div className={`flex flex-col space-y-5`}>
                <div className={`text-emerald-800 font-bold`}>We need to know who you are :)</div>
                <div>
                    <TextInput
                        data-autofocus
                        placeholder="Your name"
                        value={nameInput}
                        onChange={(e) => updateName(e.currentTarget.value)}
                        error={error}
                    />
                </div>
                
                <Button variant="filled" onClick={submitName} disabled={error != "" || nameInput == ""}>Submit</Button>
            </div>
        </Modal>
    );
}