import type { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { GlassTemplate } from "../assets/meta_components/GlassTemplate";

let template: GlassTemplate|undefined = undefined

function GlassTemplateView() {
    const modelViewDom = useRef<HTMLDivElement>(null);
    const [overAllPosition, setOverAllPosition] = useState<{x:number, y: number, z: number}>({x:0, y:0, z:0});

    useEffect(() => {
        if(modelViewDom.current !== null && !template){
            const modeView = modelViewDom.current;
            template = new GlassTemplate(modeView, {width: modeView.clientWidth, height: modeView.clientHeight});
            template.loadScene("/template_glass_01.json", undefined, () => {
                console.log(`load done`)
            })
        }

    }, [])

    useEffect(() => {
        template?.setOverAllPosition(overAllPosition.x, overAllPosition.y, overAllPosition.z)
    }, [overAllPosition])

    function onOverAllPosChange(evt: React.ChangeEvent<HTMLInputElement>){
        console.log(evt)
        let {x, y, z} = overAllPosition;
        if(evt.target.dataset.pos === "y"){
            y = Number(evt.target.value);
        }
        setOverAllPosition({x, y, z});
    }

    return (
        <div>
            <div style={{width: 500, height: 500}} ref={modelViewDom} />
            <input type={"number"} value={overAllPosition.y} data-pos={"y"} onChange={onOverAllPosChange}/>
        </div>
    )
}

export default GlassTemplateView;
