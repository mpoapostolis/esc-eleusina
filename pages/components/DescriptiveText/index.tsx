import clsx from "clsx";
import { useStore } from "../../../store";

export const descriptiveText = {
  intro1: `Ώρα να περιπλανηθείς στο φως και να βυθιστείς στο σκοτάδι. Μάζεψε αντικείμενα-κλειδιά  και με αυτά ξεκλείδωσε τις σκοτεινές και φωτεινές εσοχές του δωματίου. 
    Για να δούμε.... Θα αντέξουν τα μάτια σου το φως; Θα προσαρμοστούν στο σκοτάδι; Θα καταφέρεις να ξεκλειδώσεις το δωμάτιο; `,
};

export default function DescriptiveText() {
  const store = useStore();
  return (
    <div
      onClick={() => {
        store.setDescriptiveText(undefined);
      }}
      className={clsx(
        "fixed  h-screen w-screen flex  pointer-events-auto  items-center  justify-center z-50",
        {
          hidden: !store.descriptiveText,
        }
      )}
    >
      <div
        className={clsx(
          "w-full bg-black relative   max-w-xl border border-opacity-20 border-red-100 m-auto px-20 py-10 text-4xl font-bold bg-opacity-70 text-white text-center"
        )}
      >
        <img
          src="https://s2.svgbox.net/materialui.svg?ic=close&color=ddd"
          role="button"
          className=" w-10 m-3 h-10 z-50 pointer-events-auto absolute right-0 top-0"
          alt=""
        />
        {descriptiveText.intro1}
      </div>
    </div>
  );
}
