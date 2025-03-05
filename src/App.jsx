import { useState } from 'react'
import ObjectDetection from './components/ObjectDetection'

function App() {

  return (
    <section className='flex flex-col bg-gradient-to-b from-zinc-900 to-zinc-800 min-h-screen items-center 
    p-10'>
      <h1 className='font-extrabold text-3xl md:text-6xl 
      lg:text-8xl tracking-tighter md:px-6 text-center 
      bg-gradient-to-b from-white via-gray-300 to-gray-600
      bg-clip-text text-transparent' >
        Object Detection Model
      </h1>
      <ObjectDetection/>
    </section>
  )
}

export default App
