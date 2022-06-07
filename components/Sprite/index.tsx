import { Item, useStore } from "../../store";
import { useSpring, animated, config } from "@react-spring/three";
import { DoubleSide, Sprite as SpriteType } from "three";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

export default function Sprite(
  props: Item & {
    giveReward: (s: string) => void;
  }
) {
  const texture = useLoader(THREE.TextureLoader, props.src);
  const ref = useRef<SpriteType>();
  const [hovered, setHovered] = useState(false);
  const [insideBox, setInsideBox] = useState<string[]>([]);
  const store = useStore();
  const isUsed = store.usedItems[`${props._id}`];
  const show = props?.requiredItems
    ? props?.requiredItems
        ?.map((v) => {
          return store.invHas(v) || store.epicInvHas(v) || store.usedItems[v];
        })
        .every((e) => e)
    : true;

  useEffect(() => {
    if (typeof document !== "undefined")
      document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);
  useEffect(() => {
    if (!ref.current || !props.position || !props.rotation) return;
    ref.current.position.copy(props.position);
    ref.current.rotation.copy(props.rotation);
  }, [props.position, ref.current]);
  let s = show ? props.scale ?? 0.2 : 0;
  if (hovered) s += 0.01;
  const collected = props.collectable && store.invHas(props._id);
  const { scale } = useSpring({
    scale: isUsed || collected ? 0 : s,
    config: config.wobbly,
  });

  useEffect(() => {
    if (props.orderInsideTheBox) {
      const isSame = props.orderInsideTheBox
        .map((x, idx) => {
          return x === insideBox[idx];
        })
        .every(Boolean);
      if (isSame && props.reward) {
        props.giveReward(`${props.reward._id}`);
      }
    }
  }, [insideBox, props.orderInsideTheBox]);

  if (props.type === "help" && !store.hint) return null;
  if (props.type === "guidelines" && !store.guideLines) return null;
  return (
    <animated.mesh
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(evt) => {
        if (props.type === "box" && props.orderInsideTheBox) {
          if (store.hand === props.orderInsideTheBox[insideBox.length]) {
            const str = store.hand;
            setInsideBox((s) => [...s, str]);
            store.removeInvItem(store.hand);
            store.setHand(undefined);
            store.setIsHintVisible(false);
            store.setUsedItem(store.hand);
          } else {
            store.setHint(props.orderBoxError);
            store.setIsHintVisible(true);
          }
          return;
        }

        if (props.type === "lexigram" && props.lexigram) {
          store.setLexigram(props.lexigram.split(","), props.reward);
        }

        if (props.type === "compass") {
          store.setCompass(true, props.reward);
        }

        if (props.type === "jigsaw" && props.jigSawUrl) {
          store.setJigSaw(props.jigSawUrl, props.reward);
        }

        if (store.hand && !props.collectableIfHandHas && props.type !== "box") {
          store.setHint("Nothing happened...");
          store.setIsHintVisible(true);
          return;
        }

        if (props.collectableIfHandHas) {
          if (store.hand === props.collectableIfHandHas) {
            store.setUsedItem(store.hand);
            store.removeInvItem(store.hand);
            store.setHand(undefined);
            store.setIsHintVisible(false);
          } else {
            store.setHint(props.onCollectFail);
            store.setIsHintVisible(true);
            return;
          }
        }

        if (props.collectable) {
          store.setInventory(props);
        }

        if (props.setHint) store.setHint(props.setHint);

        if (props.setGuidelines) store.setguideLines(props.setGuidelines);

        if (props.onClickOpenModal === "hint") store.setIsHintVisible(true);
        if (props.onClickOpenModal === "ancientText") {
          if (props.ancientText && props.author)
            store.setAncientText({
              text: props.ancientText,
              keys: props.clickableWords?.split(",") ?? [],
              author: props.author,
            });
        }
        if (props.onClickOpenModal === "guidelines")
          store.setguideLinesVissible(true);
        if (props.onCollectError) props.onCollectError();
        if (props.onClick) props?.onClick(evt);
      }}
      scale={scale}
      ref={ref}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        side={DoubleSide}
        attach="material"
        map={texture}
      />
    </animated.mesh>
  );
}
