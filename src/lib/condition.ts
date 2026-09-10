import { ConditionAnswers } from "@/types/device";

export type ConditionGrade = "Excellent" | "Good" | "Fair" | "Poor";

const FUNCTIONAL_SCORE: Record<ConditionAnswers["functional"], number> = {
  "works-perfectly": 2,
  "minor-issues": 1,
  "does-not-turn-on": 0,
};

const SCREEN_SCORE: Record<ConditionAnswers["screen"], number> = {
  flawless: 2,
  "light-wear": 1,
  "cracked-or-damaged": 0,
};

const BODY_SCORE: Record<ConditionAnswers["body"], number> = {
  flawless: 2,
  "light-wear": 1,
  "heavy-wear": 0,
};

const BATTERY_SCORE: Record<ConditionAnswers["battery"], number> = {
  "90-100": 2,
  "80-89": 1,
  unknown: 1,
  "below-80": 0,
};

export function conditionScore(condition: ConditionAnswers): number {
  return (
    FUNCTIONAL_SCORE[condition.functional] +
    SCREEN_SCORE[condition.screen] +
    BODY_SCORE[condition.body] +
    BATTERY_SCORE[condition.battery]
  );
}

export function conditionGrade(condition: ConditionAnswers): ConditionGrade {
  const score = conditionScore(condition);
  if (score >= 7) return "Excellent";
  if (score >= 5) return "Good";
  if (score >= 3) return "Fair";
  return "Poor";
}

export const FUNCTIONAL_LABELS: Record<ConditionAnswers["functional"], string> = {
  "works-perfectly": "Works perfectly",
  "minor-issues": "Minor functional issues",
  "does-not-turn-on": "Does not turn on",
};

export const SCREEN_LABELS: Record<ConditionAnswers["screen"], string> = {
  flawless: "Flawless screen",
  "light-wear": "Light screen wear",
  "cracked-or-damaged": "Cracked or damaged screen",
};

export const BODY_LABELS: Record<ConditionAnswers["body"], string> = {
  flawless: "Flawless body",
  "light-wear": "Light body wear",
  "heavy-wear": "Heavy body wear",
};

export const BATTERY_LABELS: Record<ConditionAnswers["battery"], string> = {
  "90-100": "Battery health 90–100%",
  "80-89": "Battery health 80–89%",
  "below-80": "Battery health below 80%",
  unknown: "Battery health unknown",
};

export const GRADE_DESCRIPTIONS: Record<ConditionGrade, string> = {
  Excellent: "Looks and works like new, with a strong battery.",
  Good: "Light signs of use, fully functional.",
  Fair: "Noticeable wear but works reliably.",
  Poor: "Heavy wear or functional issues, priced accordingly.",
};
