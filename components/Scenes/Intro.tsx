import { descriptiveText } from "../../store";

import useDescriptiveText from "../../Hooks/useDescriptiveText";

function Intro() {
  useDescriptiveText(descriptiveText.intro, 1000);
  return <></>;
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
