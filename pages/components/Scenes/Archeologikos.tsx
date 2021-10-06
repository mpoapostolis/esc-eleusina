import { useStore } from "../../../store";
import Img from "../Img";
function Archeologikos() {
  const store = useStore();

  return (
    <group>
      <Img
        hideWhen={store.invHas("stone")}
        src={`/images/stone.png`}
        onClick={() => {
          store.setInventoryNotf("stone");
          store.setIntentory({
            name: "stone",
            src: "/images/stone.png",
            description: `Φως που σε λάτρεψα, όπως κάθε θνητός
              και συ τ’ ουρανού κλέος,
              γιατί μ’ αφήσατε; Τί σας έκανε
              να τραβηχτείτε από πάνω μου,
              για να παραδοθώ στου σκοταδιού την αφή;`,
          });
        }}
        position={[2, -15, -20]}
      />
      <Img
        hideWhen={store.invHas("alpha")}
        src={`/images/alpha.png`}
        onClick={() => {
          store.setInventoryNotf("alpha");
          store.setIntentory({
            name: "alpha",
            src: "/images/alpha.png",
            description: `Φως που σε λάτρεψα, όπως κάθε θνητός
              και συ τ’ ουρανού κλέος,
              γιατί μ’ αφήσατε; Τί σας έκανε
              να τραβηχτείτε από πάνω μου,
              για να παραδοθώ στου σκοταδιού την αφή;`,
          });
        }}
        position={[-10, -15, 100]}
      />
      <Img
        hideWhen={store.invHas("emoji")}
        src={`/images/emoji.png`}
        onClick={() => {
          store.setInventoryNotf("emoji");
          store.setIntentory({
            name: "emoji",
            src: "/images/emoji.png",
            description: `Φως που σε λάτρεψα, όπως κάθε θνητός
              και συ τ’ ουρανού κλέος,
              γιατί μ’ αφήσατε; Τί σας έκανε
              να τραβηχτείτε από πάνω μου,
              για να παραδοθώ στου σκοταδιού την αφή;`,
          });
        }}
        rotate
        position={[-100, -15, 10]}
      />
      <Img
        hideWhen={store.invHas("istos")}
        src={`/images/istos.png`}
        onClick={() => {
          store.setInventoryNotf("istos");
          store.setIntentory({
            name: "istos",
            src: "/images/istos.png",
            description: `Φως που σε λάτρεψα, όπως κάθε θνητός
              και συ τ’ ουρανού κλέος,
              γιατί μ’ αφήσατε; Τί σας έκανε
              να τραβηχτείτε από πάνω μου,
              για να παραδοθώ στου σκοταδιού την αφή;`,
          });
        }}
        position={[-10, -0, 10]}
      />
    </group>
  );
}

Archeologikos.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Archeologikos;
