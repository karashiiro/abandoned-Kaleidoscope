import { useState } from "react";
import { useFaceTracking } from "../../hooks";
import styles from "./FaceMeshHost.module.scss";

const { drawConnectors } = require("@mediapipe/drawing_utils/drawing_utils");
const {
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

	useFaceTracking(videoElement, canvasElement, (canvasCtx, { image, landmarks, eyeCenters }) => {
		if (canvasElement == null) {
			return;
		}

		canvasCtx.save();
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
		drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
		drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: "#FF3030" });
		drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: "#FF3030" });
		drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: "#30FF30" });
		drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: "#30FF30" });
		drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: "#E0E0E0" });
		drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
		canvasCtx.fillRect(eyeCenters.left.x, eyeCenters.left.y, 1, 1);
		canvasCtx.fillRect(eyeCenters.right.x, eyeCenters.right.y, 1, 1);
		canvasCtx.restore();
	});

	return (
		<div>
			<video className={styles.inputVideo} ref={(el) => setVideoElement(el)}></video>
			<canvas className={styles.outputCanvas} width="1280px" height="720px" ref={(el) => setCanvasElement(el)}></canvas>
		</div>
	);
}
