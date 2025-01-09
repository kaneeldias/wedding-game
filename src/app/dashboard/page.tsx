"use client"

import NameModal from "@/components/NameModal";
import {useState} from "react";

export default function Dashboard() {
    const [name, setName] = useState<string | null>(localStorage.getItem("name"));
    
    return (
        <>
            <div>
                Welcome {name}!
            </div>
            <NameModal setName={setName}/>
        </>
    );
}
