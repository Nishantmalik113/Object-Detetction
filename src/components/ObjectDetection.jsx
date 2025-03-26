'use client';
import * as tf from "@tensorflow/tfjs"
import { load as cocoSSDLoad } from '@tensorflow-models/coco-ssd';
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { renderPredictions } from "../utils/renderPredictions";

export default function ObjectDetection() {

    let detectInterval 
    const canvasRef = useRef(null)

    const webcamRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)

    async function runCoco(){
        setIsLoading(true)
        const net = await cocoSSDLoad()
        setIsLoading(false)

        detectInterval = setInterval(()=>{
            runObjectDetection(net)
        },3000)


    }

    async function  runObjectDetection(net) {
        if(canvasRef.current &&
            webcamRef.current!==null && 
            webcamRef.current.video?.readyState===4
        ){
            canvasRef.current.width = webcamRef.current.video.videoWidth
            canvasRef.current.height = webcamRef.current.video.videoHeight
            
            //find all the detected objects

            const detectedObjects = await net.detect(
                webcamRef.current.video, 
                undefined, 
                0.7
            )
            console.log(detectedObjects)

            const context  = canvasRef.current.getContext("2d")
            renderPredictions(detectedObjects, context)
        }
    }

    function showVideo(){
        if(webcamRef.current!==null && webcamRef.current.video?.readyState===4){
            const myVideoWidth = webcamRef.current.video.videoWidth
            const myVideoHeight = webcamRef.current.video.videoHeight
            
            webcamRef.current.video.width = myVideoWidth
            webcamRef.current.video.height = myVideoHeight
            
        }
    }

    useEffect(()=>{
        showVideo()
        runCoco()
    },[])

  return (
    <div className='mt-10'>
        {isLoading ? 
            ( <div className='bg-gradient-to-b 
            from-white via-gray-300 to-gray-600
            bg-clip-text text-transparent'>
                Loading AI MODELS
            </div> ) :
            (<div className='relative flex flex-col justify-center
            items-center bg-gradient-to-b from-white to-slate-700 
            p-1.5 rounded-md'>
                {/*Webcam*/}
                <Webcam ref={webcamRef} className='lg:h-[720px] rounded-md w-full' muted>

                </Webcam>

                {/*canvas */}
                <canvas 
                ref={canvasRef}
                className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
                >

                </canvas>
        </div>)}
    </div>
  )
}
