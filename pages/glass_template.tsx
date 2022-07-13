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

    const [overAllRotation, setOverAllRotation] = useState<vect3>({x: 0, y: 0, z: 0});
    const [frontRotation, setFrontRotation] = useState<vect3>({x: 0, y: 0, z: 0});
    const [rightRotation, setRightRotation] = useState<vect3>({x: 0, y: 0, z: 0});
    const [leftRotation, setLeftRotation] = useState<vect3>({x: 0, y: 0, z: 0});

    const [overAllScale, setOverAllScale] = useState<vect3>({x: 0, y: 0, z: 0});
    const [frontScale, setFrontScale] = useState<vect3>({x: 0, y: 0, z: 0});
    const [rightScale, setRightScale] = useState<vect3>({x: 0, y: 0, z: 0});
    const [leftScale, setLeftScale] = useState<vect3>({x: 0, y: 0, z: 0});

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
        template?.setOverAllPosition({x:overAllPosition.x, y:overAllPosition.y, z:overAllPosition.z},
            {x:overAllRotation.x, y:overAllRotation.y, z:overAllRotation.z}, {x:overAllScale.x, y:overAllScale.y, z:overAllScale.z})
        template?.setFrontPosition({x:frontPosition.x, y:frontPosition.y, z:frontPosition.z},
            {x:frontRotation.x, y:frontRotation.y, z:frontRotation.z}, {x:frontScale.x, y:frontScale.y, z:frontScale.z})
        template?.setRightPosition({x:rightPosition.x, y:rightPosition.y, z:rightPosition.z},
            {x:rightRotation.x, y:rightRotation.y, z:rightRotation.z}, {x:rightScale.x, y:rightScale.y, z:rightScale.z})
        template?.setLeftPosition({x:leftPosition.x, y:leftPosition.y, z:leftPosition.z},
            {x:leftRotation.x, y:leftRotation.y, z:leftRotation.z}, {x:leftScale.x, y:leftScale.y, z:leftScale.z})
    }, [overAllPosition,overAllRotation, overAllScale, frontPosition, frontRotation, frontScale,
        leftPosition, leftRotation, leftScale,
        rightPosition, rightRotation, rightScale])


    function onOverAllChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.dataset.pos) {
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
        else if(evt.target.dataset.rot) {
            let {x, y, z} = overAllRotation;
            if (evt.target.dataset.rot === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "z") {
                z = Number(evt.target.value);
            }

            setOverAllRotation({x, y, z});
        }
        else if(evt.target.dataset.scale) {
            let {x, y, z} = overAllScale;
            if (evt.target.dataset.scale === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "z") {
                z = Number(evt.target.value);
            }

            setOverAllScale({x, y, z});
        }
    }

    function onFrontChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.dataset.pos) {
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
        else if(evt.target.dataset.rot) {
            let {x, y, z} = frontRotation;
            if (evt.target.dataset.rot === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "z") {
                z = Number(evt.target.value);
            }

            setFrontRotation({x, y, z});
        }
        else if(evt.target.dataset.scale) {
            let {x, y, z} = frontScale;
            if (evt.target.dataset.scale === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "z") {
                z = Number(evt.target.value);
            }

            setFrontScale({x, y, z});
        }
    }

    function onRightChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.dataset.pos) {
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
        else if(evt.target.dataset.rot) {
            let {x, y, z} = rightRotation;
            if (evt.target.dataset.rot === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "z") {
                z = Number(evt.target.value);
            }

            setRightRotation({x, y, z});
        }
        else if(evt.target.dataset.scale) {
            let {x, y, z} = rightScale;
            if (evt.target.dataset.scale === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "z") {
                z = Number(evt.target.value);
            }

            setRightScale({x, y, z});
        }
    }

    function onLeftChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.dataset.pos) {
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
        else if(evt.target.dataset.rot) {
            let {x, y, z} = leftRotation;
            if (evt.target.dataset.rot === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.rot === "z") {
                z = Number(evt.target.value);
            }

            setLeftRotation({x, y, z});
        }
        else if(evt.target.dataset.scale) {
            let {x, y, z} = leftScale;
            if (evt.target.dataset.scale === "x") {
                x = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "y") {
                y = Number(evt.target.value);
            } else if (evt.target.dataset.scale === "z") {
                z = Number(evt.target.value);
            }

            setLeftScale({x, y, z});
        }

    }

    function onChangeUpload(evt: React.ChangeEvent<HTMLInputElement>) {
        console.log(evt.target.files);
        if (evt.target.files!.length > 0) {
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
            <div className={"row"}>
                <div className={"col-6"}>
                    <div style={{width: 500, height: 500}} ref={modelViewDom}/>
                </div>
                <div className={"col-6"}>
                    <div className={"row"}>
                        <div className={"col-12"}>
                            <div>
                                <span style={{marginRight: 10}}>front</span>
                                <input type={"file"} data-part={"front"} onChange={onChangeUpload}/>
                            </div>
                            <div>
                                <span style={{marginRight: 10}}>right</span>
                                <input type={"file"} data-part={"right"} onChange={onChangeUpload}/>
                            </div>
                            <div>
                                <span style={{marginRight: 10}}>left</span>
                                <input type={"file"} data-part={"left"} onChange={onChangeUpload}/>
                            </div>
                        </div>
                        {/*over all*/}
                        <div className={"col-12"}>
                            <p>Over All</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Position</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Rotation</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Scale</p>
                        </div>

                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={overAllPosition.x} data-pos={"x"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={overAllPosition.y} data-pos={"y"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={overAllPosition.z} data-pos={"z"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={overAllRotation.x} data-rot={"x"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={overAllRotation.y} data-rot={"y"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={overAllRotation.z} data-rot={"z"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={overAllScale.x} data-scale={"x"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={overAllScale.y} data-scale={"y"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={overAllScale.z} data-scale={"z"}
                                       style={{width: "100%"}} onChange={onOverAllChange}/>
                            </p>
                        </div>

                        {/*front*/}
                        <div className={"col-12"}>
                            <p>Front</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Position</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Rotation</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Scale</p>
                        </div>

                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={frontPosition.x} data-pos={"x"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={frontPosition.y} data-pos={"y"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={frontPosition.z} data-pos={"z"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={frontRotation.x} data-rot={"x"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={frontRotation.y} data-rot={"y"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={frontRotation.z} data-rot={"z"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={frontScale.x} data-scale={"x"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={frontScale.y} data-scale={"y"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={frontScale.z} data-scale={"z"}
                                       style={{width: "100%"}} onChange={onFrontChange}/>
                            </p>
                        </div>

                        {/*right*/}
                        <div className={"col-12"}>
                            <p>Right</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Position</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Rotation</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Scale</p>
                        </div>

                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={rightPosition.x} data-pos={"x"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={rightPosition.y} data-pos={"y"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={rightPosition.z} data-pos={"z"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={rightRotation.x} data-rot={"x"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={rightRotation.y} data-rot={"y"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={rightRotation.z} data-rot={"z"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={rightScale.x} data-scale={"x"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={rightScale.y} data-scale={"y"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={rightScale.z} data-scale={"z"}
                                       style={{width: "100%"}} onChange={onRightChange}/>
                            </p>
                        </div>

                        {/*left*/}
                        <div className={"col-12"}>
                            <p>Left</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Position</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Rotation</p>
                        </div>
                        <div className={"col-4"}>
                            <p>Scale</p>
                        </div>

                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={leftPosition.x} data-pos={"x"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={leftPosition.y} data-pos={"y"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={leftPosition.z} data-pos={"z"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={leftRotation.x} data-rot={"x"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={leftRotation.y} data-rot={"y"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={leftRotation.z} data-rot={"z"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                        </div>
                        <div className={"col-4"} >
                            <p> X:
                                <input type={"number"} step={0.1} value={leftScale.x} data-scale={"x"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                            <p> Y:
                                <input type={"number"} step={0.1} value={leftScale.y} data-scale={"y"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                            <p> Z:
                                <input type={"number"} step={0.1} value={leftScale.z} data-scale={"z"}
                                       style={{width: "100%"}} onChange={onLeftChange}/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlassTemplateView;
