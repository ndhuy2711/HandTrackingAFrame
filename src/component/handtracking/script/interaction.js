
import { Interaction } from "../const";
import { modelLoaded } from "./model-loaded"
const AFRAME = window.AFRAME;
const THREE = window.THREE;
AFRAME.registerComponent('hand-tracking', {
    schema: {
        interactionDistance: { type: 'number', default: Interaction.INTERACTION_DISTANCE }
    },

    init: function () {
        const ultrasound = document.querySelector('#ultrasound')
        const interactionDistance = this.nextData.interactionDistance;
        let distance = this.nextData.interactionDistance;
        let pointHandRightTo3D = { x: 0, y: 0, z: 0 }
        let pointLeftRightTo3D = { x: 0, y: 0, z: 0 }
        let arrHand = []
        let minMoveDistance = 0
        modelLoaded(ultrasound);
        this.el.addEventListener('pinchstarted', function (evt) {
            const handPosition = evt.detail.position;
            const ultrasoundPos = ultrasound.object3D.position.clone();
            const ultrasoundPosition = new THREE.Vector3();
            ultrasound.object3D.getWorldPosition(ultrasoundPosition);
            distance = handPosition.distanceTo(ultrasoundPosition); // Tính khoảng cách
            if (distance < interactionDistance) {
                if (!arrHand.some(item => item.target.getAttribute('hand-tracking-controls')["hand"] === evt.target.getAttribute('hand-tracking-controls')["hand"])) {
                    arrHand.push(evt); // Thêm phần tử vào mảng nếu nó chưa tồn tại
                }
                arrHand.forEach(element => {
                    if (element.target.getAttribute('hand-tracking-controls')["hand"] === "right") {
                        pointHandRightTo3D = { x: element.detail.position.x - ultrasoundPos.x, y: element.detail.position.y - ultrasoundPos.y, z: element.detail.position.z - ultrasoundPos.z }
                    } else if (element.target.getAttribute('hand-tracking-controls')["hand"] === "left") {
                        pointLeftRightTo3D = { x: element.detail.position.x - ultrasoundPos.x, y: element.detail.position.y - ultrasoundPos.y, z: element.detail.position.z - ultrasoundPos.z }
                    }
                });
                if (arrHand.length > 1) {
                    minMoveDistance = arrHand[0].detail.position.distanceTo(arrHand[1].detail.position);
                }
            }
        })
        this.el.addEventListener('pinchmoved', function (evt) {
            if (distance < interactionDistance) {
                const getHand = arrHand[0].target.getAttribute('hand-tracking-controls')["hand"]
                const handPosition = new THREE.Vector3(); // Vị trí tay ảo position
                handPosition.copy(evt.detail.position);
                switch (true) {
                    case getHand === "right" && arrHand.length === 1: ultrasound.setAttribute('position', { x: handPosition.x - pointHandRightTo3D.x, y: handPosition.y - pointHandRightTo3D.y, z: handPosition.z - pointHandRightTo3D.z }); break;
                    case getHand === "left" && arrHand.length === 1: ultrasound.setAttribute('position', { x: handPosition.x - pointLeftRightTo3D.x, y: handPosition.y - pointLeftRightTo3D.y, z: handPosition.z - pointLeftRightTo3D.z }); break;
                    case arrHand.length > 1:
                        let distanceTwoHand1 = arrHand[0].detail.position.distanceTo(arrHand[1].detail.position);
                        let distanceTwoHand2 = arrHand[1].detail.position.distanceTo(arrHand[0].detail.position);
                        // const minMoveDistance = 0.01;
                        if ((distanceTwoHand1 > minMoveDistance || distanceTwoHand2 > minMoveDistance) && minMoveDistance !== 0) {
                            const scaleFactor = 0.2;
                            const currentScale = ultrasound.getAttribute('scale');
                            const newScale = {
                                x: currentScale.x + (distanceTwoHand1 + distanceTwoHand2) * scaleFactor,
                                y: currentScale.y + (distanceTwoHand1 + distanceTwoHand2) * scaleFactor,
                                z: currentScale.z + (distanceTwoHand1 + distanceTwoHand2) * scaleFactor
                            };
                            ultrasound.setAttribute('scale', newScale);
                            // Cập nhật vị trí ban đầu của hai tay
                            minMoveDistance = arrHand[0].detail.position.distanceTo(arrHand[1].detail.position);
                        } else if ((distanceTwoHand1 < minMoveDistance || distanceTwoHand2 < minMoveDistance) && minMoveDistance !== 0) {
                            const scaleFactor = 0.2;
                            const currentScale = ultrasound.getAttribute('scale');
                            const newScale = {
                                x: currentScale.x - minMoveDistance * scaleFactor,
                                y: currentScale.y - minMoveDistance * scaleFactor,
                                z: currentScale.z - minMoveDistance * scaleFactor
                            };
                            ultrasound.setAttribute('scale', newScale);
                            // Cập nhật vị trí ban đầu của hai tay
                            minMoveDistance = arrHand[0].detail.position.distanceTo(arrHand[1].detail.position);
                        }
                        break;
                    default: break;
                }
            }
        });
        this.el.addEventListener('pinchended', function (evt) {
            if (distance < interactionDistance) {
                const getHand = arrHand[0].target.getAttribute('hand-tracking-controls')["hand"]
                const handPosition = new THREE.Vector3(); // Vị trí tay ảo position
                handPosition.copy(evt.detail.position);
                switch (true) {
                    case getHand === "right" && arrHand.length === 1: ultrasound.setAttribute('position', { x: handPosition.x - pointHandRightTo3D.x, y: 0, z: handPosition.z - pointHandRightTo3D.z }); break;
                    case getHand === "left" && arrHand.length === 1: ultrasound.setAttribute('position', { x: handPosition.x - pointLeftRightTo3D.x, y: 0, z: handPosition.z - pointLeftRightTo3D.z }); break;
                    default: break;
                }
            }
            arrHand = arrHand.filter((item) => item.target.getAttribute('hand-tracking-controls')["hand"] !== evt.target.getAttribute('hand-tracking-controls')["hand"])
            minMoveDistance = 0
        });
    },

})
