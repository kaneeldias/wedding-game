"use client"

import PointsBar from "@/app/components/PointsBar";
import {useEffect, useState} from "react";
import {Image, Loader} from '@mantine/core';
import {alexBrush} from "@/fonts";
import PhotoUpload from "@/app/components/PhotoUpload";

export default function Gallery() {
    const [photos, setPhotos] = useState([]);
    
    useEffect(() => {
        getPhotos().then((data) => {
            setPhotos(data);
        });
    }, []);
    
    return (
        <>
            <div className={`flex flex-col p-5 w-full space-y-5`}>
                <div className={`mb-10`}>
                    <PointsBar/>
                </div>
                
                <div className={`bg-white p-5 shadow-md rounded-md space-y-5`}>
                    <div className={`${alexBrush.className} text-emerald-700 text-4xl text-left w-full`}>
                        Photo gallery
                    </div>
                    <div className={`text-sm`}>
                        Contribute any photos you have taken today to this wedding photo gallery!
                    </div>
                    <PhotoUpload/>
                </div>
                
                {photos &&
                    <div className={`flex flex-wrap`}>
                        {photos.map((photo, index) => (
                            <div key={index}
                                 className={`flex w-1/2 items-center justify-center p-2 aspect-square`}>
                                <Image radius={"md"} src={photo} alt={"Photo"}
                                       className={`shadow-md aspect-square`}
                                       fit="cover"
                                />
                                {/*<Image src={photo} alt={"Photo"} objectFit={"cover"} width={200} height={200}*/}
                                {/*       className={`shadow-md aspect-square rounded-md`}/>*/}
                            </div>
                        ))}
                    </div>
                }
                
                {photos.length == 0 &&
                    <div className={`flex flex-row h-full w-full items-center justify-center`}>
                        <Loader/>
                    </div>
                }
            
            </div>
        </>
    );
}

function getPhotos() {
    return fetch("/api/get-photos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json());
}