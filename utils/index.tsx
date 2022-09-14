export const randomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const loremIpsum = `Με τον όρο Lorem ipsum αναφέρονται τα κείμενα εκείνα τα οποία είναι ακατάληπτα, δεν μπορεί δηλαδή κάποιος να βγάλει κάποιο λογικό νόημα από αυτά, και έχουν δημιουργηθεί με σκοπό να παρουσιάσουν στον αναγνώστη μόνο τα γραφιστικά χαρακτηριστικά, αυτά καθ' εαυτά, ενός κειμένου`;

export const getOnlyItems = (arr: any[]) =>
  arr?.filter((e) => !["hint", "portal", "guidelines"].includes(`${e.type}`));

export const intersection = (arr1: unknown[], arr2: unknown[]) =>
  arr1.filter((x) => arr2.includes(x));
