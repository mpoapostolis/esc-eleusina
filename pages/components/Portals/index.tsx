import { Scene, useStore } from "../../../store";
import Exit from "../Exit";

const scenes = [
  {
    scene: "archeologikos",
    text: `Και συ, από κει αναδύθηκες, σκοτεινέ σύζυγε,
  με τη σιωπή γραμμένη στο πρόσωπο…`,
  },

  {
    scene: "elaioyrgeio",
    text: `Κει πέρα
    τίποτα δεν ταράζει τη σιωπή. Μονάχα ένας σκύλος (κι αυτός δε γαβγίζει),
    άσκημος σκύλος…`,
  },
  {
    scene: "karavi",
    text: `Γίνεται τότε μια μεγάλη ησυχία, μαλακή, ευγενική, νοτισμένη,
    ως πέρα απ’ τον κήπο, ως την άκρη της θύμησης, σα να ’χει μεμιάς φθινοπωριάσει.`,
  },
  {
    scene: "livadi",
    text: `Ακούς και τ’ άλογα στο στάβλο, και το νερό που πέφτει
    καθώς υψώνουν οι προσκυνητές δυο πήλινα δοχεία…`,
  },
];
function Portals() {
  const store = useStore();
  return (
    <group>
      {scenes.map((s, idx) => (
        <Exit
          hover={s.text}
          key={idx}
          scene={s.scene as Scene}
          position={[-20 + idx * 10, 0, -50]}
        />
      ))}
    </group>
  );
}

Portals.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Portals;
