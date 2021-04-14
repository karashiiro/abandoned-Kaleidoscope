declare function _predictEyeCenter(image: string): Promise<string>;

export function predictEyeCenter(image: string): Promise<string> {
	if (_predictEyeCenter != null) {
		return _predictEyeCenter(image);
	}
	return (async () => {
		return "";
	})();
}
