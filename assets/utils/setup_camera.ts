
export function setup_camera(webCam: HTMLVideoElement) {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({video: {width: 256, height: 256}})
            .then(steam => {
                    webCam!.srcObject = steam;
                    resolve("");
                },
                error => reject())
    })
}