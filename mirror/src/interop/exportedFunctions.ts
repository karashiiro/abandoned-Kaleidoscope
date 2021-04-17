import { Rect } from "../hooks";

interface Point {
	x: number;
	y: number;
}

declare function _predictEyeCenter(imageAndBounds: string): Promise<Point>;

export function predictEyeCenter(image: string, bounds: Rect): Promise<Point> {
	if (_predictEyeCenter != null) {
		return _predictEyeCenter(JSON.stringify({ image, bounds }));
	}
	return (async () => {
		return {
			x: 0,
			y: 0,
		};
	})();
}
