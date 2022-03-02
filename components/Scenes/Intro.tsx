import { descriptiveText, useStore } from "../../store";

import useDescriptiveText from "../../Hooks/useDescriptiveText";
import { useEffect } from "react";

function Intro() {
  const store = useStore();
  useDescriptiveText(descriptiveText.intro, 1000);

  useEffect(() => {
    store.setHint(
      `Ψάξε και βρες την πέτρινη πλάκα με τον Όρκο του Μύστη. Στο κείμενο, δείξε το ζευγάρι των αντίθετων λέξεων που θα φωτίσει τις πύλες μύησης στο σκοτεινό δωμάτιο.`
    );
  }, []);

  return <></>;
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
