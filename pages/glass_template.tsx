import type { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { GlassTemplate } from "../assets/meta_components/GlassTemplate";

interface vect3 {
    x: number;
    y: number;
    z: number;
}

let template: GlassTemplate | undefined = undefined

function GlassTemplateView() {
    const modelViewDom = useRef<HTMLDivElement>(null);
    const [overAllPosition, setOverAllPosition] = useState<vect3>({x: 0, y: 0, z: 0});
    const [frontPosition, setFrontPosition] = useState<vect3>({x: 0, y: 0, z: 0});
    const [rightPosition, setRightPosition] = useState<vect3>({x: 0, y: 0, z: 0});
    const [leftPosition, setLeftPosition] = useState<vect3>({x: 0, y: 0, z: 0});

    useEffect(() => {
        if (modelViewDom.current !== null && !template) {
            const modeView = modelViewDom.current;
            template = new GlassTemplate(modeView, {width: modeView.clientWidth, height: modeView.clientHeight});
            template.loadScene("/template_glass_01.json", () => {
                console.log(`load done`)
            })
        }

    }, [])

    useEffect(() => {
        template?.setOverAllPosition(overAllPosition.x, overAllPosition.y, overAllPosition.z)
        template?.setFrontPosition(frontPosition.x, frontPosition.y, frontPosition.z)
        template?.setRightPosition(rightPosition.x, rightPosition.y, rightPosition.z)
        template?.setLeftPosition(leftPosition.x, leftPosition.y, leftPosition.z)
    }, [overAllPosition, frontPosition, leftPosition, rightPosition])

    function onOverAllPosChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let {x, y, z} = overAllPosition;
        if (evt.target.dataset.pos === "x") {
            x = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "y") {
            y = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "z") {
            z = Number(evt.target.value);
        }

        setOverAllPosition({x, y, z});
    }

    function onFrontPosChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let {x, y, z} = frontPosition;
        if (evt.target.dataset.pos === "x") {
            x = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "y") {
            y = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "z") {
            z = Number(evt.target.value);
        }

        setFrontPosition({x, y, z});
    }

    function onRightPosChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let {x, y, z} = rightPosition;
        if (evt.target.dataset.pos === "x") {
            x = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "y") {
            y = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "z") {
            z = Number(evt.target.value);
        }

        setRightPosition({x, y, z});
    }

    function onLeftPosChange(evt: React.ChangeEvent<HTMLInputElement>) {
        let {x, y, z} = leftPosition;
        if (evt.target.dataset.pos === "x") {
            x = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "y") {
            y = Number(evt.target.value);
        } else if (evt.target.dataset.pos === "z") {
            z = Number(evt.target.value);
        }

        setLeftPosition({x, y, z});
    }

    function onChangeUpload(evt: React.ChangeEvent<HTMLInputElement>) {
        console.log(evt.target.files);
        if(evt.target.files!.length > 0){
            const url = URL.createObjectURL(evt.target.files![0])
            const img = new Image();
            img.onload = () => {
                template?.changeTexture(evt.target.dataset.part!, url, {width: img.width, height: img.height});
            }
            img.src = url;
        }
    }

    return (
        <div>
            <div style={{width: 500, height: 500}} ref={modelViewDom}/>
            <div>
                <span style={{marginRight: 10}}>front</span>
                <input type={"file"} data-part={"front"} onChange={onChangeUpload} />
            </div>
            <div>
                <span style={{marginRight: 10}}>right</span>
                <input type={"file"} data-part={"right"} onChange={onChangeUpload} />
            </div>
            <div>
                <span style={{marginRight: 10}}>left</span>
                <input type={"file"} data-part={"left"} onChange={onChangeUpload} />
            </div>

            <div><p style={{margin:0}}>Over All</p>
                <span> X:
                    <input type={"number"} step={0.1} value={overAllPosition.x} data-pos={"x"} onChange={onOverAllPosChange}/>
                </span>
                <span> Y:
                    <input type={"number"} step={0.1} value={overAllPosition.y} data-pos={"y"} onChange={onOverAllPosChange}/>
                </span>
                <span> Z:
                    <input type={"number"} step={0.1} value={overAllPosition.z} data-pos={"z"} onChange={onOverAllPosChange}/>
                </span>
            </div>

            <div><p style={{margin:0}}>Front</p>
                <span> X:
                    <input type={"number"} step={0.1} value={frontPosition.x} data-pos={"x"} onChange={onFrontPosChange}/>
                </span>
                <span> Y:
                    <input type={"number"} step={0.1} value={frontPosition.y} data-pos={"y"} onChange={onFrontPosChange}/>
                </span>
                <span> Z:
                    <input type={"number"} step={0.1} value={frontPosition.z} data-pos={"z"} onChange={onFrontPosChange}/>
                </span>
            </div>

            <div><p style={{margin:0}}>Right</p>
                <span> X:
                    <input type={"number"} step={0.1} value={rightPosition.x} data-pos={"x"} onChange={onRightPosChange}/>
                </span>
                <span> Y:
                    <input type={"number"} step={0.1} value={rightPosition.y} data-pos={"y"} onChange={onRightPosChange}/>
                </span>
                <span> Z:
                    <input type={"number"} step={0.1} value={rightPosition.z} data-pos={"z"} onChange={onRightPosChange}/>
                </span>
            </div>

            <div><p style={{margin:0}}>Left</p>
                <span> X:
                    <input type={"number"} step={0.1} value={leftPosition.x} data-pos={"x"} onChange={onLeftPosChange}/>
                </span>
                <span> Y:
                    <input type={"number"} step={0.1} value={leftPosition.y} data-pos={"y"} onChange={onLeftPosChange}/>
                </span>
                <span> Z:
                    <input type={"number"} step={0.1} value={leftPosition.z} data-pos={"z"} onChange={onLeftPosChange}/>
                </span>
            </div>

            <br/>
            <br/>
        </div>
    )
}

export default GlassTemplateView;
