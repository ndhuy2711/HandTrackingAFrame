import 'aframe'
import "./style.css"
import { Handtracking } from './component/handtracking';
import { Ultrasound } from './component/model3D/utrasound';
function App() {
  return (
    <a-scene hand-tracking>
      <Handtracking />
      <Ultrasound />
    </a-scene>
  );
}

export default App;
