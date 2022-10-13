import { Item, useStore } from "../../store";
import { useSpring, animated, config } from "@react-spring/three";
import { DoubleSide, Sprite as SpriteType } from "three";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import {
  addItem,
  addReward,
  useInventory,
  updateInv,
  useAchievements,
} from "../../lib/inventory";
import useMutation from "../../Hooks/useMutation";
import { updateItem } from "../../lib/items";

export default function Sprite(props: Item) {
  const texture = useLoader(THREE.TextureLoader, props.src);
  const store = useStore();
  const [_addItem, { loading }] = useMutation(addItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);
  const [_updateInv] = useMutation<string | any>(updateInv, [
    `/api/inventory?scene=${store.scene}`,
    `/api/used?scene=${store.scene}`,
  ]);

  const texture1 = useLoader(
    THREE.TextureLoader,
    props?.replaceImg ?? "/images/empty.png"
  );

  const { data: inventory } = useInventory();

  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);

  const ref = useRef<SpriteType>();
  const [hovered, setHovered] = useState(false);
  const [insideBox, setInsideBox] = useState<string[]>([]);
  const isUsed = store.usedItems[`${props._id}`];
  const { data: achievements, isLoading } = useAchievements();
  const achIds = achievements.map((e) => e.rewardId);
  const notInInventory = (a: boolean) => (props.notInInventory ? !a : a);

  const show = notInInventory(
    props?.requiredItems
      ? props?.requiredItems
          ?.map((v) => {
            return invHas(v) || store.usedItems[v] || achIds.includes(v);
          })
          .every((e) => e)
      : true
  );

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

  const [_addReward] = useMutation(addReward, [
    `/api/inventory?epic=true`,
    `/api/items?scene=${store.scene}`,
  ]);

  const [_updateItem] = useMutation(updateItem, [
    `/api/items?scene=${store.scene}`,
  ]);

  if (props.type === "help" && !store.hint) return null;
  if (props.type === "guidelines" && !store.guideLines) return null;

  const giveReward = () => {
    if (!props.reward) return;
    store.setReward(props.reward);
    _addReward({
      ...props.reward,
      description: props.reward?.description,
    });
    _updateInv(store.hand, { used: true });
    store.setHand(undefined);
  };

  return (
    <animated.mesh
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(evt) => {
        if (props.setStatus) store.setStatus(props.setStatus);
        if (props.doIHaveReward) return;
        if (props.type === "box") {
          const isFull =
            props.orderInsideTheBox?.length === insideBox.length &&
            insideBox.length > 0;

          const requiredItem = props.orderInsideTheBox?.at(insideBox.length);
          const isLastItem =
            props.orderInsideTheBox?.length === insideBox.length + 1;
          const isHandRequired = requiredItem === store.hand;

          if (isFull && props.requiredToolToReplace?._id === store.hand) {
            return giveReward();
          }

          if (
            isHandRequired &&
            isLastItem &&
            props.reward &&
            !props.requiredToolToReplace
          ) {
            return giveReward();
          } else if (isHandRequired) {
            const str = store.hand ?? "";
            setInsideBox((s) => [...s, str]);
            _updateInv(store.hand, { used: true });
            store.setIsHintVisible(false, `09_add_to_target_OK`);
            store.setHand(undefined);
          } else {
            store.setHint(props.orderBoxError);
            store.setIsHintVisible(true, `10_add_to_target_WRONG`);
          }
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
          _updateInv(`${props.requiredToolToReplace._id}`, {
            used: true,
          });
          if (props.reward) {
            giveReward();
            store.setReward(props.reward);
          }

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
        map={props.isReplaced ? texture1 : texture}
      />
    </animated.mesh>
  );
}
