'use client';
import * as tf from "@tensorflow/tfjs"
import { load as cocoSSDLoad } from '@tensorflow-models/coco-ssd';
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { renderPredictions } from "../utils/renderPredictions";

export default function ObjectDetection(props) {
    const [isSpeakingAllowed, setIsSpeakingAllowed] = useState(false);

  // Function to enable speech synthesis after user interaction
  const enableSpeaking = () => {
    setIsSpeakingAllowed(true);
  };

  // Function to speak with a small delay to ensure it works
  const speak = (message) => {
    if (isSpeakingAllowed) {
      setTimeout(() => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = "en-US";
        synth.speak(utterance);
      }, 200); // Delay helps with browser restrictions
    }
  };

    const {setSelectOption} = props
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
        
    if (!isSpeakingAllowed) return; // Don't start recognition until enabled
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("Recognized:", transcript);

      if ( ["what is in front of me","open object detection", "can you tell me what you see", "mere samne kya hai"].includes(transcript)) {
        speak("Okay, let me load my a i models")
        setSelectOption("OBJ");
      } else if (transcript === "stop") {
        setSelectOption("home");
      } else if (["hello", "hey", "hi"].includes(transcript)) {
        speak("hello, what can I do for you today?");
      }
      else if (transcript === "translate something for me") {
        window.location.href="https://vision-scribe.netlify.app/";
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => recognition.stop(); // Cleanup when component unmounts
  }, [isSpeakingAllowed])

  return (
    <div className='mt-10'>
        <button onClick={()=>{
        if(isSpeakingAllowed){
          setIsSpeakingAllowed(false)
        }else{
          setIsSpeakingAllowed(true)
        }
      }} className={(isSpeakingAllowed) ? 'bg-green-500 absolute left-5':'bg-red-500 absolute left-5'}>{!isSpeakingAllowed? 'Enable Voice Assistant':'Listening...'}</button>
        {isLoading ? 
            ( <div className='bg-gradient-to-b 
            from-white via-gray-300 to-gray-600
            bg-clip-text text-transparent'>
                Loading AI MODELS
            </div> ) :
            (<div className='relative flex flex-col justify-center
            items-center bg-gradient-to-b from-white to-slate-700 
            p-1.5 rounded-md max-w-[900px]'>
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
