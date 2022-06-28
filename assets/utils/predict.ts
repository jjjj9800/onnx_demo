import * as ort from "onnxruntime-web";

let session: ort.InferenceSession|null = null;

export async function initOnnx() {
    session = await ort.InferenceSession.create("/_next/static/chunks/pages/fused_bisenet4_model_simplified_HWC.onnx",
        {executionProviders: ["wasm"]});
    console.log(session)
}

export async function predict(data: ort.Tensor) {
    const feeds: Record<string, ort.Tensor> = {};
    if(!session){
        return false;
    }
    feeds[session.inputNames[0]] = data;

    return await session.run(feeds);
}
