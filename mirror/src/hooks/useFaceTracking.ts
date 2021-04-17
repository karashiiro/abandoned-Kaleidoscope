import { useEffect } from "react";
import { predictEyeCenter } from "../interop";

const { Camera } = require("@mediapipe/camera_utils/camera_utils");
const { FaceMesh, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYE } = require("@mediapipe/face_mesh/face_mesh");

export type FaceLandmarks = { x: number; y: number; z: number }[];

export interface FaceTrackingResults {
	image: CanvasImageSource;
	landmarks: FaceLandmarks;
	eyeCenters: {
		right: { x: number; y: number };
		left: { x: number; y: number };
	};
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

		const dims = {
			width: 1280,
			height: 720,
		};

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
			if (!results.multiFaceLandmarks?.length) {
				return;
			}

			const rightEyeBounds = getEyeBounds(results.multiFaceLandmarks[0], FACEMESH_RIGHT_EYE, dims);
			const leftEyeBounds = getEyeBounds(results.multiFaceLandmarks[0], FACEMESH_LEFT_EYE, dims);
			const eyeCenters = {
				right: await predictEyeCenter(results.image, rightEyeBounds),
				left: await predictEyeCenter(results.image, leftEyeBounds),
			};

			onResults(canvasCtx!, {
				image: results.image,
				landmarks: results.multiFaceLandmarks[0],
				eyeCenters,
			});
		});

		const camera = new Camera(videoElement, {
			onFrame: async () => {
				await faceMesh.send({ image: videoElement });
			},
			...dims,
		});
		camera.start();
	}, [videoElement, canvasElement, onResults]);
}

interface Dimensions {
	width: number;
	height: number;
}

export interface Rect {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

function getEyeBounds(faceMesh: FaceLandmarks, eyeConnectors: [number, number][], dims: Dimensions): Rect {
	const bounds: Rect = {
		left: 1.0,
		top: 1.0,
		right: 0.0,
		bottom: 0.0,
	};

	const eyeMarkers = new Set(eyeConnectors.flat());
	eyeMarkers.forEach((n) => {
		const x = faceMesh[n].x;
		const y = faceMesh[n].y;

		if (x < bounds.left) {
			bounds.left = x;
		} else if (x > bounds.right) {
			bounds.right = x;
		}

		if (y < bounds.top) {
			bounds.top = y;
		} else if (y > bounds.bottom) {
			bounds.bottom = y;
		}
	});

	bounds.left = Math.floor(bounds.left * dims.width);
	bounds.top = Math.floor(bounds.top * dims.height);
	bounds.right = Math.floor(bounds.right * dims.width);
	bounds.bottom = Math.floor(bounds.bottom * dims.height);

	return bounds;
}
