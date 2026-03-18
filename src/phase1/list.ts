import {getPhase1Prompts} from "./load";

const main = () => {
  const prompts = Array.from(getPhase1Prompts().values()).sort((a, b) => a.number.localeCompare(b.number));
  for (const p of prompts) {
    console.log(`${p.number}: ${p.title}`);
  }
};

main();

