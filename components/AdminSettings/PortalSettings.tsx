import { useRouter } from "next/router";
import { Img } from "../../pages/admin";
import { Item, Scene, scenes } from "../../store";
import Select from "../Select";

export default function PortalSettings(props: {
  getItems: () => void;
  items: Item[];
  imgs: Img[];
  update: (p: Partial<Item>) => void;
}) {
  const router = useRouter();
  const id = router.query.id;
  const idx = props.items.findIndex((e) => e._id === id);
  const selectedItem = { ...props.items[idx] };

  return (
    <Select
      onChange={(v) => {
        props.update({
          goToScene: v.value as Scene,
        });
      }}
      value={selectedItem.goToScene}
      label="onClick go to scene (360)"
      options={[undefined, ...scenes].map((o) => ({
        label: o === undefined ? "-" : o,
        value: o,
      }))}
    ></Select>
  );
}
