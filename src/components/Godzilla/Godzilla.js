import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer, MathUtils } from "three";

const Godzilla = ({ deckViewState, scaleMultiplier = 0.1 }) => {
  const gltf = useLoader(GLTFLoader, "/godzilla.glb");
  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      // Set initial scale, position, or rotation if needed
      modelRef.current.position.set([0, 0, 0]);
      modelRef.current.rotation.set([0, 0, 0]);
      modelRef.current.scale.set(
        scaleMultiplier,
        scaleMultiplier,
        scaleMultiplier
      );
    }
  }, [gltf, scaleMultiplier]);

  useEffect(() => {
    if (modelRef.current) {
      // Rotate the model in the opposite direction of the pitch
      modelRef.current.rotation.x =
        Math.PI / 2 - MathUtils.degToRad(deckViewState.pitch);
    }
  }, [deckViewState.pitch]);

  return (
    <>
      <primitive ref={modelRef} object={gltf.scene} />
    </>
  );
};

export default Godzilla;
