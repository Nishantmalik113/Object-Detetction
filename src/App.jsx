import { useEffect, useState } from 'react'
import ObjectDetection from './components/ObjectDetection'
import { playAudio } from './utils/renderPredictions';

function App() {
  const [selectOption, setSelectOption] = useState("home")

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

  useEffect(() => {
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
  }, [isSpeakingAllowed]); // Runs when `isSpeakingAllowed` changes
  return (
    <>
    {selectOption==="home" && (
        <section className='flex flex-col gap-10 bg-gradient-to-l from-purple-900 to-zinc-900 min-h-screen items-center 
      p-10'>
          <h1 className='font-extrabold text-3xl md:text-6xl 
      lg:text-7xl tracking-tighter md:px-6 text-center 
      bg-gradient-to-b from-white via-white-300 to-zinc-600
      bg-clip-text text-transparent' >
        Welcome To Our Website
      </h1>
      <p className='text-3xl font-semibold text-white'>Choose From Below :</p>
      <button onClick={()=>{
        if(isSpeakingAllowed){
          setIsSpeakingAllowed(false)
        }else{
          setIsSpeakingAllowed(true)
        }
      }} className={(isSpeakingAllowed) ? 'bg-green-500 text-white':'bg-red-500 text-white'}>{!isSpeakingAllowed? 'Enable Voice Assistant':'Listening...'}</button>
      <div className='grid sm:grid-cols-2 md:gap-50 gap-10 justify-center items-center'>
        <button onClick={()=>{setSelectOption('OBJ')}} className='max-w-[300px] bg-white flex flex-col gap-5 items-center'>
          <img src="/OBJ.png" className='rounded-xl' alt="" />
          <p className='text-2xl font-semibold'>Object Identification</p>
        </button>
        <a href='https://vision-scribe.netlify.app/' className='max-w-[300px] bg-white flex flex-col gap-5 items-center'>
          <img src="translate.png" alt="" />
          <p className='text-2xl font-semibold'>Audio Translation</p>
        </a>
      </div>
        </section>
      )}
      {(selectOption==='OBJ')?(<section className='flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-screen items-center 
      p-10'>
        <h1 className='font-extrabold text-3xl md:text-6xl 
        lg:text-8xl tracking-tighter md:px-6 text-center 
        bg-gradient-to-b from-white via-gray-300 to-gray-600
        bg-clip-text text-transparent' >
          Object Detection Model
        </h1>
        <ObjectDetection setSelectOption={setSelectOption}/>
      </section>):''}
    </>
  )
}

export default App
