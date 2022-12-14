
import { useCallback, useEffect, useRef, useState } from 'react'
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Camera } from '@mediapipe/camera_utils'
export default function Home() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
 const [contador,setContador] = useState(0)
  
  useEffect(()=>{
    const onResults = (result)=>{
      contextRef.current?.save()
      contextRef.current.clearRect(0,0,canvasRef.current?.width, canvasRef.current?.height)
      contextRef.current.drawImage(result.image,0,0,canvasRef.current.width,canvasRef.current.height)
     //multiHandWorldLandmarks console.log(result)
    var pontos = []
    var dedos =[8,12,16,20]
     if(result.multiHandLandmarks){
      var cont = []
          for(const ladmarks of result.multiHandLandmarks) {
            const width = contextRef.current.canvas.width
            const height = contextRef.current.canvas.height
  
            ladmarks.map((cord,i)=>{
              var cx = parseInt(cord.x*width)
              var cy = parseInt(cord.y*height)
              pontos.push([cx,cy])
              
            //  console.log(pontos)
            // console.log(i,cx,cy)
       
  
            })         
            drawConnectors(contextRef.current,ladmarks,HAND_CONNECTIONS,{color:`#00FF00`,lineWidth:5})
            drawLandmarks(contextRef.current,ladmarks,{color:`#FF0000`,lineWidth:2})
          } 
      }
      if(!pontos.length == 0){
        if(result.multiHandLandmarks){
        if(pontos[4][0] > pontos[2][0]) {
          cont++
        }
        dedos.map((x,i)=>{
          if(pontos[x][1]<pontos[x-2][1]){
            cont++
          }
        })
        setContador(cont)
      }
      }
    
        contextRef.current.restore()
    }
    contextRef.current= canvasRef.current.getContext(`2d`)
  
    const hands = new Hands({locateFile:((file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    })})
    hands.setOptions({
      maxNumHands:1,
      modelComplexity:1,
      minDetectionConfidence:0.5,
      minTrackingConfidence:0.5
    })
    hands.onResults(onResults)

    const camera  = new Camera(videoRef.current,{
      onFrame:async()=>{
          await hands.send({image:videoRef.current})
      },
      width:1280,
      height:720
    })
    camera.start()
  },[])
  
  return (
    <div className=' w-screen h-screen bg-gray-800 text-cyan-50 flex justify-center items-center flex-col'  >
      <video   className='input_video' ref={videoRef} style={{display:`none`}}></video>
      <canvas ref={canvasRef} width="1280px" height="720px"></canvas>
      <h1>dedos levantados: {contador || 0}</h1>
    </div>
  )
}
