import React, { useEffect, useRef, useState } from "react";
import { initOnnx, predict } from "../utils/predict";
import * as ort from "onnxruntime-web";
import cv, { Mat } from "opencv-ts";
import * as numjs from "numjs";
import { round } from "lodash";
import { setup_camera } from "../utils/setup_camera";

let ctx:CanvasRenderingContext2D|null = null;
let ctxHair:CanvasRenderingContext2D|null = null;

let updateId:any = null;
export function CameraView() {
    const webCam = useRef<HTMLVideoElement|null>(null);
    const canvasVideo = useRef<HTMLCanvasElement|null>(null);
    const hairView = useRef<HTMLCanvasElement|null>(null);
    const [isPredict, setIsPredict] = useState<boolean>(false);
    let isLoad = false;
    let {h, s, l, a} = {h:127.5, s:127.5, l:127.5, a: 0.8};
    useEffect(() => {
        setup_camera(webCam.current!).then(async ()=>{
            console.log("camera start")
            ctx = canvasVideo.current!.getContext("2d");
            let src = new cv.Mat(webCam.current!.height, webCam.current!.width, cv.CV_8UC4);
            let dst = new cv.Mat(webCam.current!.height, webCam.current!.width, cv.CV_8UC4);
            let cap = new cv.VideoCapture(webCam.current!);

            const showVideo = () => {
                function levelAdjust(img:Mat, sin:number=0, hin:number=255, mt:number=1.0, sout:number=0, hout:number=255){
                    const Sin = Math.min(Math.max(sin, 0),hin-2);
                    const Hin = Math.min(hin, 255);
                    const Mt = Math.min(Math.max(mt, 0.01), 9.99);
                    const Sout = Math.min(Math.max(sout, 0), hout-2);
                    const Hout = Math.min(hout, 255);

                    const difIn = Hin - Sin;
                    const difOut = Hout - Sout;
                    let table = new Uint8Array(256*256);
                    const a = new cv.Mat(img.cols, img.rows, cv.CV_8UC1);
                    // console.log(table.length)
                    table.forEach((item:number, idx:number, array:Uint8Array) => {
                        const v1 = Math.min(Math.max(255 * (idx - Sin)/difIn, 0), 255);
                        const v2 = 255 * Math.pow(v1 / 255, 1 / Mt);
                        // console.log(Math.min(Math.max(Sout + difOut * v2 / 255, 0), 255))
                        a.data[idx] = Math.min(Math.max(Sout + difOut * v2 / 255, 0), 255);
                    })

                    //cv.applyColorMap(img, img, cv.COLORMAP_PINK);
                }

                cap.read(src);
                levelAdjust(src)
                cv.imshow(canvasVideo.current!, src);
                cv.imshow("cv_view", src);
                updateId = requestAnimationFrame(showVideo);
            }

            //showVideo();
            initOnnx();
            getFrameFromVideo();
        });

        return function cleanUp() {
            console.log(`clean up`)
            cancelAnimationFrame(updateId);
        }
    }, []);

    async function getFrameFromVideo () {
        ctx!.clearRect(0, 0, canvasVideo.current!.width, canvasVideo.current!.height);
        ctx!.save();
        ctx!.translate(webCam.current!.width, 0);
        ctx!.scale(-1, 1);
        ctx!.drawImage(webCam.current!, 0, 0, webCam.current!.width, webCam.current!.height);
        ctx!.restore();

        const imageData = ctx!.getImageData(0, 0, webCam.current!.width, webCam.current!.height);
        const colorData = new Array<number>();
        for (let i = 0; i < imageData.data.length; i += 4) {
            colorData.push((imageData.data[i]-127.5)/127.5);
            colorData.push((imageData.data[i + 1]-127.5)/127.5);
            colorData.push((imageData.data[i + 2]-127.5)/127.5);
            // skip data[i + 3] to filter out the alpha channel
        }

        if(isLoad){
            const result = await predict(new ort.Tensor("float32", colorData, [1, 256, 256, 3]));
            console.log(result);
            // if(result){
            //     const masksAns: ort.Tensor = result["masks"];
            //     const alphaAns: ort.Tensor = result["alpha"];
            //     const hair_color = [164, 73, 163];
            //     const [b, g, r] = hair_color;
            //
            //     let x = 0;
            //     let y = 0;
            //     let aCount = 0;
            //     for (let i = 0; i < masksAns.size; i++) {
            //         if (ctx) {
            //             x++;
            //             if (i % 256 === 0) {
            //                 y++;
            //                 x = 0;
            //             }
            //             const a = alphaAns.data[i] as number;
            //             //console.log(a)
            //             aCount++;
            //             if (masksAns.data[i] > 0.4) {
            //                 // console.log(a)
            //                 ctx.fillStyle = `rgba(${r},${g},${b}, ${a})`;
            //                 ctx.fillRect(x, y, 1, 1);
            //                 ctx.save();
            //             }
            //
            //         }
            //     }
            //     ctx!.restore();
            // }

        }

        updateId = requestAnimationFrame(() => getFrameFromVideo());
    }

    function onChangeHSL(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.dataset.hsl === "h"){
            h = +e.target.value;
        }
        else if(e.target.dataset.hsl === "s"){
            s = +e.target.value;
        }
        else if(e.target.dataset.hsl === "l"){
            l = +e.target.value;
        }
        else if(e.target.dataset.hsl === "a"){
            a = +e.target.value;
        }
    }

    return (
        <div>
            <video autoPlay playsInline muted ref={webCam} style={{marginLeft: 10, transform: "rotateY(180deg)"}}
                   id="webcam" width="256" height="256"/>
            <canvas width={256} height={256} ref={canvasVideo} style={{marginLeft: 10, transform: "rotateY(180deg)"}} />
            <canvas id={"cv_view"} width={256} height={256} ref={hairView} style={{marginLeft: 10, transform: "rotateY(180deg)"}} />

            <br />
            <input type="range" data-hsl="h" min={0} max={255} defaultValue={127.5} step={0.01} onChange={onChangeHSL} />
            <input type="range" data-hsl="s" min={0} max={255} defaultValue={127.5} step={0.01} onChange={onChangeHSL} />
            <input type="range" data-hsl="l" min={0} max={255} defaultValue={127.5} step={0.01} onChange={onChangeHSL} />
            <input type="range" data-hsl="a" min={0} max={1} defaultValue={0.8} step={0.01} onChange={onChangeHSL} />
            <button onClick={()=>{setIsPredict(!isPredict); isLoad=true}}>
                {
                    isPredict?"停止偵測":"開始偵測"
                }
            </button>
        </div>
    )
}
