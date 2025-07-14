import { nanoid } from "@reduxjs/toolkit";

const adjectives = [
  "brave",
  "silent",
  "mighty",
  "clever",
  "fuzzy",
  "rapid",
  "lucky",
  "fierce",
  "wild",
  "crazy",
  "powerful",
  "slow",
  "tired",
  "energized",
  "sleepery",
  "little",
  "bighead",
  "smolhead",
  "destined",
];

const nouns = [
  "lion",
  "otter",
  "wolf",
  "eagle",
  "comet",
  "panther",
  "raven",
  "gecko",
  "bekko",
  "dekko",
  "mikko",
  "cikko",
  "freshavocado",
  "underthewater",
  "quikmafs",
  "whyyoublee",
  "fivep",
  "sleekypit",
  "rondorobin",
];

export const generateUsername = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective}${noun}-${nanoid(5)}`;
};
