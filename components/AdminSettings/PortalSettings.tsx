import { useRouter } from "next/router";
import { updateItem } from "../../lib/items";
import { Img } from "../../pages/admin";
import { Item, Scene, scenes } from "../../store";
import Select from "../Select";

export default function PortalSettings(props: { items: Item[]; imgs: Img[] }) {
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };
  return (
    <Select
      onChange={(v) => {
        updateItem(`${id}`, {
          goToScene: v.value as Scene,
        });
      }}
      value={selectedItem.goToScene}
      label="onClick go to scene (360)"
      options={[null, ...scenes].map((o) => ({
        label: o === null ? "-" : o,
        value: o,
      }))}
    ></Select>
  );
}
