import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export interface ISceneCanvasSize {
    width: number;
    height: number;
}

export interface IModelLoaderManager {
    onLoad?: () => void;
    onProgress?: (url: string, loaded: number, total: number) => void;
    onError?: (url: string) => void;
}

export class GlassTemplate {
    canvasDomElement: HTMLDivElement | undefined;
    scene: THREE.Scene | undefined;
    camera: THREE.PerspectiveCamera | undefined;
    controller: OrbitControls | undefined;
    clock: THREE.Clock | undefined;
    renderer: THREE.WebGLRenderer | undefined;
    ambientLight: THREE.AmbientLight | undefined;
    directionalLight: THREE.DirectionalLight | undefined;
    background: THREE.Texture | undefined;

    imageLoader: THREE.TextureLoader | undefined;
    private frameId: number | undefined;
    private startTouchPosition: { x: number, y: number } | undefined;
    mixer: any = {};
    animationList: any = [];
    modelObject: THREE.Object3D | undefined;
    touchItem = false;

    needUpdateScript = false;
    time: number = 0.0;
    startTime: number = 0.0;
    prevTime: number = 0.0;

    events: any = {
        init: [],
        start: [],
        stop: [],
        keydown: [],
        keyup: [],
        pointerdown: [],
        pointerup: [],
        pointermove: [],
        update: []
    };

    private templateObject = {
        overAll: new THREE.Group(),
        overAllTransform: {
            position: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            scale: new THREE.Vector3()
        },
        front: new THREE.Object3D(),
        frontTransform: {
            position: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            scale: new THREE.Vector3()
        },
        right: new THREE.Object3D(),
        rightTransform: {
            position: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            scale: new THREE.Vector3()
        },
        left: new THREE.Object3D(),
        leftTransform: {
            position: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            scale: new THREE.Vector3()
        },
    }

    constructor(domElement: HTMLDivElement, canvasSize: ISceneCanvasSize, modelLoaderManager?: IModelLoaderManager) {
        this.canvasDomElement = domElement;
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, (canvasSize.width / canvasSize.height), 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasSize.width, canvasSize.height, true);
        this.clock = new THREE.Clock();

        this.camera.position.set(335.8340992396647, 37.94222150574684, 209.2003723730526);
        this.imageLoader = new THREE.TextureLoader();

        this.renderer.setClearColor("#FFFFFF", 0);
        this.canvasDomElement.appendChild(this.renderer.domElement);

        this.start = this.start.bind(this);
        this.renderScene = this.renderScene.bind(this);
        this.animate = this.animate.bind(this);

        this.start();
    }

    loadScene(sceneUrl: string, backgroundUrl?: string, callback?: () => void) {
        this.downloadScene(sceneUrl, (result: any) => {
            let loader = new THREE.ObjectLoader();
            loader.parse<THREE.Scene>(result.scene, async (obj: any) => {
                if (obj.environment !== null) {
                    this.scene!.environment = obj.environment;
                }

                this.modelObject = new THREE.Object3D();
                this.modelObject.add(obj);
                this.scene!.add(this.modelObject);
                //@ts-ignore
                window.modelObject = this.modelObject;
                this.modelObject.traverse((item: any) => {
                    if (item.isLight) {
                        item.parent = this.scene!;
                    }

                    if (item.isMesh && item.userData.isOccluder) {
                        let mat = new THREE.ShaderMaterial({
                            vertexShader: THREE.ShaderLib.basic.vertexShader,
                            fragmentShader: "precision lowp float;\n void main(void){\n gl_FragColor = vec4(1.,0.,0.,1.);\n }",
                            uniforms: THREE.ShaderLib.basic.uniforms,
                            side: THREE.DoubleSide,
                            colorWrite: false
                        });
                        item.renderOrder = -1e12; // render first
                        //item.material = mat;
                    }

                    if(item.isGroup){
                        this.templateObject.overAll = item;
                        this.templateObject.overAllTransform.position = item.position.clone();
                        this.templateObject.overAllTransform.scale = item.scale.clone();
                        this.templateObject.overAllTransform.rotation = item.rotation.clone();
                    }

                    if (item.isMesh) {
                        if (item.name === "LEFT") {
                            const tex = this.imageLoader!.load("/Glasses_Right.png");
                            tex!.flipY = false;
                            tex!.encoding = THREE.sRGBEncoding;
                            item.material.map = tex;
                            item.scale.y *= (1024/3029);
                            item.position.y = -0.001;
                            this.templateObject.left = item;
                            this.templateObject.leftTransform.position = item.position.clone();
                            this.templateObject.leftTransform.scale = item.scale.clone();
                            this.templateObject.leftTransform.rotation = item.rotation.clone();

                            console.log(item)
                        } else if (item.name === "RIGHT") {
                            const tex = this.imageLoader?.load("/Glasses_Left.png");
                            tex!.flipY = false;
                            tex!.encoding = THREE.sRGBEncoding;
                            item.material.map = tex;
                            item.scale.y *= (1024/2758);
                            item.position.y = -0.0047;
                            this.templateObject.right = item;
                            this.templateObject.rightTransform.position = item.position.clone();
                            this.templateObject.rightTransform.scale = item.scale.clone();
                            this.templateObject.rightTransform.rotation = item.rotation.clone();
                        } else if (item.name === "FRONT") {
                            const tex = this.imageLoader?.load("/Glasses_Front.png");
                            tex!.flipY = false;
                            tex!.encoding = THREE.sRGBEncoding;
                            item.material.map = tex;
                            item.scale.y *= (1024/3143);
                            item.position.y = 0;
                            this.templateObject.front = item;
                            this.templateObject.frontTransform.position = item.position.clone();
                            this.templateObject.frontTransform.scale = item.scale.clone();
                            this.templateObject.frontTransform.rotation = item.rotation.clone();
                        }
                    }
                })

                this.controller = new OrbitControls(this.camera!, this.canvasDomElement);
                // this.controller.enablePan = false;
                // this.controller.enableRotate = false;
                // this.controller.enableZoom = false;
                if (callback) {
                    callback();
                }
            })

        });
    }

    downloadScene(url: string, callback: any) {
        fetch(url).then(response => {
            return response.json();
        }).then(data => {
            callback(data)
        }).catch(err => {
            console.log(`Error reading data ${err.toString()}`)
        })
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }

        this.startTime = this.prevTime = performance.now();
    }

    animate() {
        this.renderScene();
        const mixerUpdateDelta = this.clock?.getDelta();

        this.frameId = requestAnimationFrame(this.animate);
        if (this.controller) {
            //this.controller.update();
        }
    }

    renderScene() {
        if (this.scene && this.camera && this.renderer) {
            this.renderer.setClearColor(0x000000, 0);
            this.renderer.render(this.scene, this.camera);
            // console.log(this)
            // console.log(`render scene`)
        }
    }

    changeTexture(part: string, url:string, size: {width: number, height: number}) {
        const tex = this.imageLoader?.load(url);
        tex!.flipY = false;
        tex!.encoding = THREE.sRGBEncoding;
        if(part === "front"){
            this.templateObject.front.scale.y =  this.templateObject.frontTransform.scale.y*(size.height/size.width);
            //@ts-ignore
            this.templateObject.front.material.map = tex;
        }
        else if(part === "right"){
            this.templateObject.right.scale.y =  this.templateObject.rightTransform.scale.y*(size.height/size.width);
            //@ts-ignore
            this.templateObject.right.material.map = tex
        }
        else if(part === "left"){
            this.templateObject.left.scale.y =  this.templateObject.leftTransform.scale.y*(size.height/size.width);
            //@ts-ignore
            this.templateObject.left.material.map = tex;
        }
    }

    setOverAllPosition(pos:{x:number, y: number, z: number}, rot:{x:number, y: number, z: number}, scale:{x:number, y: number, z: number}) {
        const _pos = this.templateObject.overAllTransform.position.clone().add(new THREE.Vector3(pos.x, pos.y, pos.z));
        const _rot = this.templateObject.overAllTransform.rotation.clone();
        const _scale = this.templateObject.overAllTransform.scale.clone().add(new THREE.Vector3(scale.x, scale.y, scale.z))
        this.templateObject.overAll.position.set(_pos.x, _pos.y, _pos.z)
        this.templateObject.overAll.rotation.set(_rot.x+rot.x, _rot.y+rot.y, _rot.z+rot.z)
        this.templateObject.overAll.scale.set(_scale.x, _scale.y, _scale.z)
    }

    setFrontPosition(pos:{x:number, y: number, z: number}, rot:{x:number, y: number, z: number}, scale:{x:number, y: number, z: number}) {
        const _pos = this.templateObject.frontTransform.position.clone().add(new THREE.Vector3(pos.x/100, pos.y/100, pos.z/100));
        const _rot = this.templateObject.frontTransform.rotation.clone();
        const _scale = this.templateObject.frontTransform.scale.clone().add(new THREE.Vector3(scale.x/100, scale.y/100, scale.z/100))
        this.templateObject.front.position.set(_pos.x, _pos.y, _pos.z)
        this.templateObject.front.rotation.set(_rot.x+rot.x, _rot.y+rot.y, _rot.z+rot.z)
        this.templateObject.front.scale.set(_scale.x, _scale.y, _scale.z)
    }

    setLeftPosition(pos:{x:number, y: number, z: number}, rot:{x:number, y: number, z: number}, scale:{x:number, y: number, z: number}) {
        const _pos = this.templateObject.leftTransform.position.clone().add(new THREE.Vector3(pos.x/100, pos.y/100, pos.z/100));
        const _rot = this.templateObject.leftTransform.rotation.clone();
        const _scale = this.templateObject.leftTransform.scale.clone().add(new THREE.Vector3(scale.x/100, scale.y/100, scale.z/100))
        this.templateObject.left.position.set(_pos.x, _pos.y, _pos.z)
        this.templateObject.left.rotation.set(_rot.x+rot.x, _rot.y+rot.y, _rot.z+rot.z)
        this.templateObject.left.scale.set(_scale.x, _scale.y, _scale.z)
    }

    setRightPosition(pos:{x:number, y: number, z: number}, rot:{x:number, y: number, z: number}, scale:{x:number, y: number, z: number}) {
        const _pos = this.templateObject.rightTransform.position.clone().add(new THREE.Vector3(pos.x/100, pos.y/100, pos.z/100));
        const _rot = this.templateObject.rightTransform.rotation.clone();
        const _scale = this.templateObject.rightTransform.scale.clone().add(new THREE.Vector3(scale.x/100, scale.y/100, scale.z/100))
        this.templateObject.right.position.set(_pos.x, _pos.y, _pos.z)
        this.templateObject.right.rotation.set(_rot.x+rot.x, _rot.y+rot.y, _rot.z+rot.z)
        this.templateObject.right.scale.set(_scale.x, _scale.y, _scale.z)
    }
}
