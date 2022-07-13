import * as ort from "onnxruntime-web";

let session: ort.InferenceSession|null = null;

export async function initOnnx() {
    // const modelPath = "/_next/static/chunks/pages/fused_bisenet4_model_simplified_HWC.onnx";
    // const modelPath = "/_next/static/chunks/pages/fused_bisenet4s2_model_simplified_HWC.onnx";
    //
    // const modelPath = "/_next/static/chunks/pages/bisenet4_model_simplified_HWC.onnx";
    // const modelPath = "/_next/static/chunks/pages/bisenet4s2_model_simplified_HWC.onnx";
    const modelPath = "/_next/static/chunks/pages/0712/optimized_bisenet4_model_HWC.onnx"

    session = await ort.InferenceSession.create(modelPath,
        {executionProviders: ["webgl"], enableMemPattern: true, enableProfiling: true, interOpNumThreads: 4});
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
