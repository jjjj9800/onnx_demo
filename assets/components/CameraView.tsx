import React, { useEffect, useRef, useState } from "react";
import { initOnnx, predict } from "../utils/predict";
import * as ort from "onnxruntime-web";

let ctx:CanvasRenderingContext2D|null = null;
let ctxHair:CanvasRenderingContext2D|null = null;

let updateId:any = null;
export function CameraView() {
    const webCam = useRef<HTMLVideoElement|null>(null);
    const canvasVideo = useRef<HTMLCanvasElement|null>(null);
    const hairView = useRef<HTMLCanvasElement|null>(null);
    const [isPredict, setIsPredict] = useState<boolean>(false);
    let isLoad = false;
    useEffect(() => {
        setupWebcam().then(async ()=>{
            console.log("camera start")
            initOnnx();
        });

        return function cleanUp() {
            console.log(`clean up`)
            cancelAnimationFrame(updateId);
        }
    }, []);

    function setupWebcam() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({video: {width: 256, height: 256}})
                .then(steam => {
                        if(!ctx){
                            ctx = canvasVideo.current!.getContext("2d");
                        }
                        if(ctxHair) {
                            ctxHair = hairView.current!.getContext("2d");
                        }
                        webCam.current!.srcObject = steam;
                        getFrameFromVideo()
                        resolve("");
                    },
                    error => reject())
        })
    }

    async function getFrameFromVideo () {
        ctx!.clearRect(0, 0, canvasVideo.current!.width, canvasVideo.current!.height);
        ctx!.save();
        ctx!.translate(webCam.current!.width, 0);
        ctx!.scale(-1, 1);
        ctx!.drawImage(webCam.current!, 0, 0, webCam.current!.width, webCam.current!.height);
        ctx!.restore();

        const imageData = ctx!.getImageData(0, 0, webCam.current!.width, webCam.current!.height);
        const [redArray, greenArray, blueArray] = new Array(new Array<number>(), new Array<number>(), new Array<number>());
        for (let i = 0; i < imageData.data.length; i += 4) {
            redArray.push(imageData.data[i] /255.0);
            greenArray.push(imageData.data[i + 1] /255.0);
            blueArray.push(imageData.data[i + 2]/255.0);
            // skip data[i + 3] to filter out the alpha channel
        }
        const transposedData = redArray.concat(greenArray).concat(blueArray);
        //console.log(transposedData.length)

        //console.log(imageData);
        if(isLoad){
            const result = await predict(new ort.Tensor("float32", transposedData, [1, 3, 256, 256]));
            // console.log(result);
            if(result){
                const masksAns: ort.Tensor = result["masks"];
                const alphaAns: ort.Tensor = result["alpha"];
                const hair_color = [164, 73, 163];
                const [b, g, r] = hair_color;

                const unit = masksAns.size / 11;
                let x = 0;
                let y = 0;
                let aCount = 0;
                for (let i = unit * 10; i < masksAns.size; i++) {
                    if (ctx) {
                        x++;
                        if (i % 256 === 0) {
                            y++;
                            x = 0;
                        }
                        const a = alphaAns.data[aCount] as number;
                        aCount++;
                        if (masksAns.data[i] > 0.4) {
                            ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
                            ctx.fillRect(x, y, 1, 1);
                        }

                    }
                }
            }

        }

        updateId = requestAnimationFrame(() => getFrameFromVideo());
    }

    return (
        <div>
            <video autoPlay playsInline muted ref={webCam}
                   id="webcam" width="256" height="256"/>
            <canvas width={256} height={256} ref={canvasVideo} />
            <canvas width={256} height={256} ref={hairView} />

            <br />
            <button onClick={()=>{setIsPredict(!isPredict); isLoad=true}}>
                {
                    isPredict?"停止偵測":"開始偵測"
                }
            </button>
        </div>
    )
}