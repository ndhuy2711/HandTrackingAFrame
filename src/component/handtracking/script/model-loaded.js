import { Object3D } from "../const";
export function modelLoaded() {
    const ultrasound = document.getElementById("ultrasound")
    ultrasound.addEventListener("model-loaded", function (evt) {
        const getMesh = this.getObject3D("mesh")
        const getHightLight = getMesh.children.find((element) => element.name === Object3D.HIGHLIGHT)
        getHightLight.traverse((node) => {
            if (node.material) {
                node.material.opacity = 0;
                node.material.tranparent = true;
                node.material.needsUpdate = true;
            }
        })
    })
}