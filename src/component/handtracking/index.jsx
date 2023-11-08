import "./script/interaction"
export const Handtracking = () => {
    return (
        <>
            <a-entity id="leftHand" hand-tracking-controls="hand: left;"></a-entity>
            <a-entity id="rightHand" hand-tracking-controls="hand: right;"></a-entity>
        </>
    )
}

