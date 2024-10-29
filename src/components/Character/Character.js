import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { AnimationMixer, MathUtils } from "three";

const Character = ({
  deckViewState,
  position,
  moveCount,
  direction,
  selectedAnimation,
}) => {
  const gltf = useLoader(GLTFLoader, "/Soldier.glb");
  const runFbx = useLoader(FBXLoader, "/Jog.fbx"); // Load the run animation
  const mixerRef = useRef();
  const modelRef = useRef();
  const [actions, setActions] = useState({});

  useEffect(() => {
    if (gltf.animations.length) {
      const mixer = new AnimationMixer(gltf.scene);
      const initialAction = mixer.clipAction(gltf.animations[0]);
      initialAction.play();
      mixerRef.current = mixer;

      const runAction = mixer.clipAction(runFbx.animations[0]);

      setActions({ runAction });
    }
  }, [gltf, runFbx, position]);

  useEffect(() => {
    if (actions[selectedAnimation]) {
      Object.values(actions).forEach((action) => action.stop());
      actions[selectedAnimation].reset().fadeIn(0.5).play();
    }
  }, [selectedAnimation, actions]);

  useEffect(() => {
    console.log("ViewState changed:", deckViewState);
  }, [deckViewState]);

  useEffect(() => {
    if (modelRef.current) {
      // Rotate the model in the opposite direction of the pitch
      modelRef.current.rotation.x =
        Math.PI / 2 - MathUtils.degToRad(deckViewState.pitch);
    }
  }, [deckViewState.pitch]);

  useEffect(() => {
    if (modelRef.current) {
      // Scale the model based on the zoom level
      const scale = Math.pow(2, deckViewState.zoom - 20); // Adjust the base zoom level as needed
      modelRef.current.scale.set(scale, scale, scale);
    }
  }, [deckViewState.zoom]);

  useEffect(() => {
    if (modelRef.current) {
      // Rotate the model to face the direction of movement
      if (direction === -1) {
        modelRef.current.rotation.y = 0; // Facing forward
      } else if (direction === 1) {
        modelRef.current.rotation.y = Math.PI; // Facing backward
      }
    }
  }, [direction]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <primitive ref={modelRef} object={gltf.scene} scale={[0.1, 0.1, 0.1]} />
  );
};

export default Character;
