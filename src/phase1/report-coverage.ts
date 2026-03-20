import {summarizePhase1Coverage} from "./coverage";

const labelBucket = (bucket: string) => {
  switch (bucket) {
    case "core-icon-loop":
      return "Core icon loops";
    case "icon-sequence":
      return "Icon sequences";
    case "data-device-utility":
      return "Data / device / utility";
    case "hero-scene":
      return "Hero scenes";
    case "human-environment-scene":
      return "Human / environment scenes";
    case "editorial-cultural-scene":
      return "Editorial / cultural scenes";
    default:
      return bucket;
  }
};

const main = () => {
  const {rows, totals, bucketSummary} = summarizePhase1Coverage();

  console.log("Phase 1 Coverage Summary");
  console.log("========================");
  console.log(`Covered: ${totals.covered}`);
  console.log(`Partial: ${totals.partial}`);
  console.log(`Missing: ${totals.missing}`);
  console.log("");

  console.log("Bucket Summary");
  console.log("--------------");
  for (const [bucket, summary] of Object.entries(bucketSummary)) {
    console.log(
      `${labelBucket(bucket)}: covered ${summary.covered}, partial ${summary.partial}, missing ${summary.missing}`,
    );
  }
  console.log("");

  console.log("Top Missing / Partial Prompts");
  console.log("-----------------------------");
  for (const row of rows.filter((entry) => entry.status !== "covered")) {
    console.log(`${row.number} | ${row.status.toUpperCase()} | ${labelBucket(row.bucket)} | ${row.title}`);
    console.log(`  ${row.note}`);
  }
};

main();
