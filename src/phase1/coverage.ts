import {getPhase1Prompts} from "./load";

export type Phase1CoverageBucket =
  | "core-icon-loop"
  | "icon-sequence"
  | "data-device-utility"
  | "hero-scene"
  | "human-environment-scene"
  | "editorial-cultural-scene";

export type Phase1CoverageStatus = "covered" | "partial" | "missing";

type CoverageEntry = {
  bucket: Phase1CoverageBucket;
  status: Phase1CoverageStatus;
  note: string;
};

export type Phase1CoverageRow = CoverageEntry & {
  number: string;
  title: string;
};

const COVERAGE_BY_PROMPT: Record<string, CoverageEntry> = {
  "001": {bucket: "core-icon-loop", status: "covered", note: "Heart pulse/glow template already exists."},
  "003": {bucket: "core-icon-loop", status: "covered", note: "Bell swing loop is already implemented."},
  "004": {bucket: "core-icon-loop", status: "covered", note: "Arrow CTA loop exists in the icon engine."},
  "005": {bucket: "icon-sequence", status: "partial", note: "Single star exists, but the five-star burst row needs a cluster template."},
  "006": {bucket: "core-icon-loop", status: "covered", note: "Pin drop is supported by the current icon path."},
  "007": {bucket: "icon-sequence", status: "partial", note: "Play icon exists, but the video-intro composition needs a mixed scene family."},
  "008": {bucket: "core-icon-loop", status: "covered", note: "WiFi signal build-up is already in range."},
  "009": {bucket: "icon-sequence", status: "partial", note: "Lock choreography exists, but the unlock transition can be richer."},
  "010": {bucket: "icon-sequence", status: "partial", note: "Cart exists, but add-to-cart UI treatment is still basic."},
  "011": {bucket: "icon-sequence", status: "partial", note: "Coffee icon exists, but steam behavior wants a stronger scene wrapper."},
  "012": {bucket: "icon-sequence", status: "partial", note: "Search icon exists, but query-loading treatment is still minimal."},
  "013": {bucket: "core-icon-loop", status: "covered", note: "Home icon path is already available."},
  "014": {bucket: "icon-sequence", status: "partial", note: "Battery icon exists, but charging progression could be more specific."},
  "015": {bucket: "core-icon-loop", status: "covered", note: "Avatar reveal fits the current icon system."},
  "016": {bucket: "icon-sequence", status: "partial", note: "Gear exists, but loading/processing loops can be richer."},
  "017": {bucket: "core-icon-loop", status: "covered", note: "Paper plane send moment is already supported."},
  "018": {bucket: "core-icon-loop", status: "covered", note: "Microphone recording icon is already supported."},
  "019": {bucket: "icon-sequence", status: "covered", note: "Download/file saving now has a dedicated utility scene family with progress, save card, and receipt treatment."},
  "020": {bucket: "icon-sequence", status: "partial", note: "Calendar icon exists, but countdown behavior needs a card/number scene."},
  "021": {bucket: "data-device-utility", status: "covered", note: "Bar chart KPI snapshot now has a dedicated dashboard scene family."},
  "022": {bucket: "data-device-utility", status: "partial", note: "Trend arrow exists, but stock-growth line composition needs a stronger family."},
  "023": {bucket: "data-device-utility", status: "covered", note: "Wallet now has a dedicated cashflow scene family with payout and balance treatment."},
  "024": {bucket: "core-icon-loop", status: "covered", note: "Trophy icon is already supported."},
  "025": {bucket: "data-device-utility", status: "covered", note: "Pie chart now has a dedicated market-share scene family with donut-stage and legend treatment."},
  "026": {bucket: "data-device-utility", status: "covered", note: "Smartphone app-launch prompt now has a dedicated product UI scene family."},
  "027": {bucket: "data-device-utility", status: "covered", note: "Headphones now have a dedicated audio/podcast scene family with live-stage treatment."},
  "028": {bucket: "data-device-utility", status: "covered", note: "Laptop now has a dedicated productivity scene family with app-stage and focus UI treatment."},
  "029": {bucket: "data-device-utility", status: "covered", note: "Camera/brand icon prompt is already close to current coverage."},
  "030": {bucket: "data-device-utility", status: "covered", note: "Burger/food icon prompt is already close to current coverage."},
  "031": {bucket: "hero-scene", status: "covered", note: "Rocket launch scene exists and is one of the stronger scene paths."},
  "032": {bucket: "hero-scene", status: "covered", note: "Plant growth scene already exists."},
  "033": {bucket: "hero-scene", status: "covered", note: "Delivery truck scene already exists."},
  "034": {bucket: "human-environment-scene", status: "covered", note: "Doctor/medical scene already exists."},
  "035": {bucket: "hero-scene", status: "covered", note: "Solar panel scene already exists."},
  "037": {bucket: "hero-scene", status: "covered", note: "Globe network scene already exists."},
  "038": {bucket: "human-environment-scene", status: "covered", note: "Person-at-desk scene already exists."},
  "039": {bucket: "data-device-utility", status: "covered", note: "Rupee/financial badge scene already exists."},
  "040": {bucket: "editorial-cultural-scene", status: "covered", note: "Certificate scroll scene already exists."},
  "041": {bucket: "editorial-cultural-scene", status: "missing", note: "No airplane/travel scene family yet."},
  "042": {bucket: "editorial-cultural-scene", status: "missing", note: "No cricket/sports scene family yet."},
  "043": {bucket: "editorial-cultural-scene", status: "missing", note: "No menu-card / restaurant reveal family yet."},
  "044": {bucket: "human-environment-scene", status: "missing", note: "No yoga / wellness character scene yet."},
  "045": {bucket: "human-environment-scene", status: "missing", note: "No classroom / teacher scene yet."},
  "046": {bucket: "editorial-cultural-scene", status: "missing", note: "No city-skyline environment scene yet."},
  "047": {bucket: "human-environment-scene", status: "missing", note: "No startup-office team scene yet."},
  "048": {bucket: "human-environment-scene", status: "missing", note: "No gym / workout scene yet."},
  "049": {bucket: "editorial-cultural-scene", status: "missing", note: "No wedding invite / announcement card family yet."},
  "050": {bucket: "human-environment-scene", status: "missing", note: "No farmer / agriculture scene yet."},
  "051": {bucket: "editorial-cultural-scene", status: "partial", note: "Podcast scene direction is now much stronger, but the full studio setup still needs a richer environment family."},
  "052": {bucket: "data-device-utility", status: "missing", note: "No dashboard / EdTech UI scene family yet."},
  "053": {bucket: "human-environment-scene", status: "missing", note: "No family/life-moments scene yet."},
  "054": {bucket: "editorial-cultural-scene", status: "missing", note: "No Diwali / celebration scene family yet."},
  "055": {bucket: "human-environment-scene", status: "missing", note: "No hospital-room journey scene yet."},
};

export const getPhase1CoverageRows = (): Phase1CoverageRow[] => {
  const prompts = getPhase1Prompts();

  return Array.from(prompts.values())
    .map((prompt) => {
      const coverage = COVERAGE_BY_PROMPT[prompt.number] ?? {
        bucket: "editorial-cultural-scene" as const,
        status: "missing" as const,
        note: "Unclassified prompt; needs a dedicated family.",
      };

      return {
        number: prompt.number,
        title: prompt.title,
        ...coverage,
      };
    })
    .sort((a, b) => a.number.localeCompare(b.number));
};

export const summarizePhase1Coverage = () => {
  const rows = getPhase1CoverageRows();
  const totals = {
    covered: rows.filter((row) => row.status === "covered").length,
    partial: rows.filter((row) => row.status === "partial").length,
    missing: rows.filter((row) => row.status === "missing").length,
  };

  const bucketSummary = rows.reduce<Record<Phase1CoverageBucket, {covered: number; partial: number; missing: number}>>(
    (acc, row) => {
      acc[row.bucket][row.status] += 1;
      return acc;
    },
    {
      "core-icon-loop": {covered: 0, partial: 0, missing: 0},
      "icon-sequence": {covered: 0, partial: 0, missing: 0},
      "data-device-utility": {covered: 0, partial: 0, missing: 0},
      "hero-scene": {covered: 0, partial: 0, missing: 0},
      "human-environment-scene": {covered: 0, partial: 0, missing: 0},
      "editorial-cultural-scene": {covered: 0, partial: 0, missing: 0},
    },
  );

  return {rows, totals, bucketSummary};
};
