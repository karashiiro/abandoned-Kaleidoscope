import { Rect } from "../hooks";

declare function _predictEyeCenter(imageAndBounds: string): Promise<string>;

export function predictEyeCenter(image: string, bounds: Rect): Promise<string> {
	if (_predictEyeCenter != null) {
		return _predictEyeCenter(JSON.stringify({ image, bounds }));
	}
	return (async () => {
		return JSON.stringify({});
	})();
}
