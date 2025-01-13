"use client"

import {Button, FileInput, Image, rem} from "@mantine/core";
import {useState} from "react";
import AnswerCorrectModal from "@/app/components/AnswerCorrectModal";
import AnswerIncorrectModal from "@/app/components/AnswerIncorrectModal";
import ErrorModal from "@/app/components/ErrorModal";
import {redirect} from "next/navigation";
import {IconPhoto} from "@tabler/icons-react";
import {compressImage} from "@/utils/photo-utils";


type Props = {
    challengeId: string
}

export default function ChallengeSubmissionUpload(props: Props) {
    const challengeId = props.challengeId;
    const [answerStatus, setAnswerStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const icon = <IconPhoto style={{width: rem(18), height: rem(18)}} stroke={1.5}/>;
    const [file, setFile] = useState<File | null>(null);
    
    return (
        <>
            <div className={`flex flex-col space-y-5`}>
                <FileInput
                    leftSection={icon}
                    placeholder="Upload your proof (click here)"
                    accept="image/*"
                    onChange={setFile}
                    className={`w-64`}
                />
                {file &&
                    <>
                        <Image src={URL.createObjectURL(file)} alt="Uploaded file"
                               className={`max-h-64 border-2 border-gray-200 border-rounded-md`}/>
                        <Button onClick={submitChallenge} loading={loading}>Submit</Button>
                    </>
                }
            </div>
            
            <AnswerCorrectModal opened={answerStatus == "true"} close={() => correctAnswerSubmitted()}/>
            <AnswerIncorrectModal opened={answerStatus == "false"} close={() => setAnswerStatus("")}/>
            <ErrorModal opened={answerStatus == "error"} close={() => setAnswerStatus("")}/>
        </>
    );
    
    async function submitChallenge() {
        setLoading(true);
        const formData = new FormData();
        const compressedFile = await compressImage(file as File);
        const fileName = file?.name || "photo.jpg";
        formData.append("file", compressedFile as File, fileName);
        formData.append("username", localStorage.getItem("name") || "");
        
        fetch(`/api/submit-challenge/${challengeId}`, {
            method: "POST",
            body: formData
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