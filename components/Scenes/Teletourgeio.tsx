import { descriptiveText } from "../../store";

import useDescriptiveText from "../../Hooks/useDescriptiveText";

function Teletourgeio() {
  useDescriptiveText(
    `Ακούς και τ’ άλογα στο στάβλο, και το νερό που πέφτει
  καθώς υψώνουν οι προσκυνητές δυο πήλινα δοχεία,
  το ’να προς την ανατολή και τ’ άλλο προς τη δύση, χύνοντας υδρομέλι
  ή κριθαρόνερο ανακατεμένο με άγρια μέντα
  πάνω στο λάκκο με τις δάφνες, ενώ μουρμουρίζουν
  διφορούμενα λόγια, παρακλήσεις και ξόρκια.
  Περσεφόνη, Γ. Ρίτσος`,
    1000
  );
  return <></>;
}

Teletourgeio.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Teletourgeio;
