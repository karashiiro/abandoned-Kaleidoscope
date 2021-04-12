import styles from "./App.module.scss";
import { FaceMeshHost } from "./components/FaceMeshHost";

function App() {
	return (
		<div className={styles.app}>
			<FaceMeshHost />
		</div>
	);
}

export default App;
