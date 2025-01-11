"use client"

import {Button, TextInput} from "@mantine/core";
import {useState} from "react";
import AnswerCorrectModal from "@/app/components/AnswerCorrectModal";
import AnswerIncorrectModal from "@/app/components/AnswerIncorrectModal";
import ErrorModal from "@/app/components/ErrorModal";
import {redirect} from "next/navigation";

type Props = {
    challengeId: string
}

export default function ChallengeSubmissionText(props: Props) {
    const challengeId = props.challengeId;
    const [answer, setAnswer] = useState("");
    const [answerStatus, setAnswerStatus] = useState("");
    const [loading, setLoading] = useState(false);
    
    return (
        <>
            <div className={`flex flex-col space-y-5`}>
                <TextInput placeholder={`Take a guess`} onChange={(e) => setAnswer(e.target.value)}/>
                <Button onClick={submitChallenge} loading={loading}>Submit</Button>
            </div>
            
            <AnswerCorrectModal opened={answerStatus == "true"} close={() => correctAnswerSubmitted()}/>
            <AnswerIncorrectModal opened={answerStatus == "false"} close={() => setAnswerStatus("")}/>
            <ErrorModal opened={answerStatus == "error"} close={() => setAnswerStatus("")}/>
        </>
    );
    
    function submitChallenge() {
        setLoading(true);
        fetch(`/api/submit-challenge/${challengeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answer: answer,
                username: localStorage.getItem("name")
            })
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.correct) {
                setAnswerStatus("true");
            } else {
                setAnswerStatus("false");
            }
        })
        .catch(() => {
            setAnswerStatus("error");
        }).finally(() => {
            setLoading(false);
        });
    }
    
    function correctAnswerSubmitted() {
        setAnswerStatus("");
        redirect("/dashboard");
    }
}