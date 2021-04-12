import { useEffect, useState } from "react";
import styles from "./FaceMeshHost.module.scss";

const { Camera } = require("@mediapipe/camera_utils/camera_utils");
const { drawConnectors } = require("@mediapipe/drawing_utils/drawing_utils");
const {
	FaceMesh,
	FACEMESH_FACE_OVAL,
	FACEMESH_LEFT_EYE,
	FACEMESH_LEFT_EYEBROW,
	FACEMESH_LIPS,
	FACEMESH_RIGHT_EYE,
	FACEMESH_RIGHT_EYEBROW,
	FACEMESH_TESSELATION,
} = require("@mediapipe/face_mesh/face_mesh");

export function FaceMeshHost() {
	const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>();
	const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>();

	useEffect(() => {
		if (canvasElement == null) {
			return;
		}

		const canvasCtx = canvasElement.getContext("2d")!;
		const onResults = (results: any) => {
			canvasCtx.save();
			canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
			canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
			if (results.multiFaceLandmarks) {
				for (const landmarks of results.multiFaceLandmarks) {
					drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
					drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: "#FF3030" });
					drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" });
					drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: "#30FF30" });
					drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: "#30FF30" });
					drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: "#E0E0E0" });
					drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
				}
			}
			canvasCtx.restore();
		};

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
		faceMesh.onResults(onResults);

		const camera = new Camera(videoElement!, {
			onFrame: async () => {
				await faceMesh.send({ image: videoElement! });
			},
			width: 1280,
			height: 720,
		});
		camera.start();
	});

	return (
		<div>
			<video className={styles.inputVideo} ref={(el) => setVideoElement(el)}></video>
			<canvas className={styles.outputCanvas} width="1280px" height="720px" ref={(el) => setCanvasElement(el)}></canvas>
		</div>
	);
}
