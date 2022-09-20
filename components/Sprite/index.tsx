import { Item, useStore } from "../../store";
import { useSpring, animated, config } from "@react-spring/three";
import { DoubleSide, Sprite as SpriteType } from "three";
import useSound from "use-sound";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import {
  addItem,
  addReward,
  useAchievements,
  useInventory,
  useItem,
} from "../../lib/inventory";
import useMutation from "../../Hooks/useMutation";

export default function Sprite(props: Item & { doIHaveReward: boolean }) {
  const texture = useLoader(THREE.TextureLoader, props.src);
  const store = useStore();
  const [_addItem, { loading }] = useMutation(addItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);
  const [_useItem] = useMutation(useItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);

  const texture1 = useLoader(
    THREE.TextureLoader,
    props?.replaceImg ?? "/images/empty.png"
  );
  const { data: inventory } = useInventory();
  const { data: achievements } = useAchievements();
  const invIds = inventory.map((e) => e._id);
  const achIds = achievements.map((e) => e._id);
  const invHas = (id?: string) => [...invIds, ...achIds].includes(id);
  const [_texture, setTexture] = useState(false);
  const ref = useRef<SpriteType>();
  const [hovered, setHovered] = useState(false);
  const [insideBox, setInsideBox] = useState<string[]>([]);
  const isUsed = store.usedItems[`${props._id}`];
  if (props.requiredItems) console.log(props.name, props);
  const show = props?.requiredItems
    ? props?.requiredItems
        ?.map((v) => {
          return invHas(v) || store.usedItems[v];
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
  const collected = props.collectable && invHas(props._id);
  const { scale } = useSpring({
    scale: isUsed || collected ? 0 : s,
    config: config.wobbly,
  });
  const isSame = props.orderInsideTheBox
    ?.map((x, idx) => {
      return x === insideBox[idx];
    })
    .every(Boolean);
  const [_addReward] = useMutation(addReward, [
    `/api/inventory?epic=true`,
    `/api/items?scene=${store.scene}`,
  ]);

  useEffect(() => {
    if (props.orderInsideTheBox && !props.replaceImg) {
      const isSame = props.orderInsideTheBox
        .map((x, idx) => {
          return x === insideBox[idx];
        })
        .every(Boolean);
      if (isSame && props.reward) {
        _addReward({
          ...props.reward,
          description: props.reward?.description,
        });
        store.setReward({
          ...props.reward,
          description: props.reward?.description,
        });
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
        if (props.doIHaveReward) return;
        if (
          props.type === "box" &&
          store.hand &&
          store.hand === props.requiredToolToReplace?._id &&
          isSame
        ) {
          setTexture(true);
          if (props.reward) store.setReward(props.reward);
          _useItem(store.hand);
          store.setHand(undefined);
        }

        if (props.type === "box" && props.orderInsideTheBox) {
          if (store.hand === props.orderInsideTheBox[insideBox.length]) {
            const str = store.hand;
            setInsideBox((s) => [...s, str]);
            _useItem(store.hand);
            store.setHand(undefined);
            store.setIsHintVisible(false, `09_add_to_target_OK`);
          } else {
            store.setHint(props.orderBoxError);
            store.setIsHintVisible(true, `10_add_to_target_WRONG`);
          }
          return;
        }

        if (
          store.hand &&
          !props.collectableIfHandHas &&
          props.type !== "box" &&
          !props.replaceImg
        ) {
          store.setHint(
            "Δεν μπορείς να μαζέψεις αυτό το αντικείμενο. Έλεγξε τι εργαλείο κρατάς"
          );

          store.setIsHintVisible(true, `07_add_to_inventory_WRONG`);
          return;
        }

        if (
          props.type !== "box" &&
          store.hand &&
          store.hand === props.requiredToolToReplace?._id
        ) {
          setTexture(true);
          if (props.reward) store.setReward(props.reward);
          _useItem(store.hand);
          store.setHand(undefined);
        }

        if (props.collectableIfHandHas) {
          if (store.hand === props.collectableIfHandHas) {
            store.setIsHintVisible(false);
          } else {
            store.setHint(props.onCollectFail);
            store.setIsHintVisible(true, `07_add_to_inventory_WRONG`);
            return;
          }
        }

        if (props.collectable && !loading) {
          if (
            !(
              props.onClickOpenModal === "ancientText" &&
              props.clickableWords &&
              props.clickableWords.length > 0
            )
          ) {
            store.setSound(`06_add_to_inventory_OK`);
            _addItem(props._id);
          }
        }
        if (props.setHint) store.setHint(props.setHint);

        if (props.setGuidelines) store.setguideLines(props.setGuidelines);

        if (props.onClickOpenModal === "hint") store.setIsHintVisible(true);
        if (props.onClickOpenModal === "ancientText") {
          if (props.ancientText && props.author)
            store.setAncientText({
              item: props,
              text: props.ancientText,
              keys: props.clickableWords?.split(",") ?? [],
              author: props.author,
            });
        }
        if (props.onClickOpenModal === "guidelines")
          store.setguideLinesVissible(true);
        if (props.onCollectError) {
          props.onCollectError();
        }
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
        map={_texture ? texture1 : texture}
      />
    </animated.mesh>
  );
}
