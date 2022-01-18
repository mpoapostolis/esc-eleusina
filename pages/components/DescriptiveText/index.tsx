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
        "fixed  bg-black bg-opacity-90 h-screen w-screen flex  pointer-events-auto  justify-center z-50",
        {
          hidden: !store.descriptiveText,
        }
      )}
    >
      <div
        className={clsx(
          "w-full  max-w-xl m-auto px-20 py-10 text-4xl font-bold bg-opacity-70 text-white text-center"
        )}
      >
        {descriptiveText.intro1}
      </div>
      <img
        src="https://s2.svgbox.net/materialui.svg?ic=close&color=ddd"
        role="button"
        className=" w-20 h-20 z-50 pointer-events-auto fixed right-5 top-5"
        alt=""
      />
    </div>
  );
}
