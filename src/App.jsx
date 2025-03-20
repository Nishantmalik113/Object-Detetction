import { useState } from 'react'
import ObjectDetection from './components/ObjectDetection'

function App() {
  const [selectOption, setSelectOption] = useState(null)

  return (
    <>
    {!selectOption && (
        <section className='flex flex-col gap-10 bg-gradient-to-l from-purple-900 to-zinc-900 min-h-screen items-center 
      p-10'>
          <h1 className='font-extrabold text-3xl md:text-6xl 
      lg:text-9xl tracking-tighter md:px-6 text-center 
      bg-gradient-to-b from-white via-white-300 to-zinc-600
      bg-clip-text text-transparent' >
        Welcome To Our Website
      </h1>
      <p className='text-3xl font-semibold text-white'>Choose From Below :</p>
      <div className='grid sm:grid-cols-2 md:gap-50 gap-10 justify-center items-center'>
        <button onClick={()=>{setSelectOption('OBJ')}} className='max-w-[500px] flex flex-col gap-5 items-center'>
          <img src="/OBJ.png" className='rounded-xl' alt="" />
          <p className='text-2xl font-semibold'>Object Identification</p>
        </button>
        <a href='https://vision-scribe.netlify.app/' className='max-w-[500px] flex flex-col gap-5 items-center'>
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
        <ObjectDetection/>
      </section>):''}
    </>
  )
}

export default App
