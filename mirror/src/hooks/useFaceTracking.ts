import { useEffect } from "react";

const { Camera } = require("@mediapipe/camera_utils/camera_utils");
const { FaceMesh } = require("@mediapipe/face_mesh/face_mesh");

export interface FaceTrackingResults {
	image: CanvasImageSource;
	landmarks: any;
}

export function useFaceTracking(
	videoElement: HTMLVideoElement | null | undefined,
	canvasElement: HTMLCanvasElement | null | undefined,
	onResults: (canvasCtx: CanvasRenderingContext2D, results: FaceTrackingResults) => void,
) {
	useEffect(() => {
		if (videoElement == null || canvasElement == null) {
			return;
		}

		const canvasCtx = canvasElement.getContext("2d");

		const faceMesh = new FaceMesh({
			locateFile: (file: string) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
			},
		});
		faceMesh.setOptions({
			maxNumFaces: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});
		faceMesh.onResults(async (results: any) => {
			console.log(results);
			onResults(canvasCtx!, {
				image: results.image,
				landmarks: results.multiFaceLandmarks[0],
			});
		});

		const camera = new Camera(videoElement, {
			onFrame: async () => {
				await faceMesh.send({ image: videoElement });
			},
			width: 1280,
			height: 720,
		});
		camera.start();
	}, [videoElement, canvasElement, onResults]);
}
