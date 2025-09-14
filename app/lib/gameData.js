export const SYMBOLS = [
  {
    key: "JHANDI",
    emoji: "🚩",
    img: require("../../assets/images/cards/JHANDI.png"),
  },
  {
    key: "MUNDA",
    emoji: "👑",
    img: require("../../assets/images/cards/MUNDA.png"),
  },
  {
    key: "PAAN",
    emoji: "♥️",
    img: require("../../assets/images/cards/PAAN.png"),
  },
  {
    key: "EENT",
    emoji: "♦️",
    img: require("../../assets/images/cards/EENT.png"),
  },
  {
    key: "CHIRI",
    emoji: "♣️",
    img: require("../../assets/images/cards/CHIRI.png"),
  },
  {
    key: "HUKUM",
    emoji: "♠️",
    img: require("../../assets/images/cards/HUKUM.png"),
  },
];

export const DICE_SOUNDS = [
  require("../../assets/sounds/dice1.mp3"),
  require("../../assets/sounds/dice2.mp3"),
  require("../../assets/sounds/dice3.mp3"),
];

export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pickRandom = () => SYMBOLS[randInt(0, SYMBOLS.length - 1)];
