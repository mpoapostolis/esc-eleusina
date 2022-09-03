import { useRouter } from "next/router";
import { useItems, updateItem } from "../../lib/items";
import { Scene, scenes } from "../../store";
import Select from "../Select";

export default function PortalSettings() {
  const router = useRouter();
  const { data: items } = useItems();
  const id = router.query.id;
  const idx = items.findIndex((e) => e._id === id);
  const selectedItem = { ...items[idx] };
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
