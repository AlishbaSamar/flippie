"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useTransition } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { submitPurchase } from "@/app/sell/actions";
import { CATEGORY_LABELS } from "@/lib/category-labels";
import { EU_COUNTRIES } from "@/data/countries";
import { estimateOffer } from "@/lib/valuation";
import type {
  BatteryHealth,
  BodyCondition,
  ConditionAnswers,
  DeviceCategory,
  DeviceModel,
  FunctionalStatus,
  ScreenCondition,
  StorageOption,
} from "@/types/device";

const CATEGORIES: DeviceCategory[] = ["iphone", "ipad", "galaxy-s"];
const STEP_LABELS = ["Device", "Model", "Storage", "Condition", "Your offer"];

const FUNCTIONAL_OPTIONS: { value: FunctionalStatus; label: string; hint: string }[] = [
  { value: "works-perfectly", label: "Works perfectly", hint: "No issues with calls, buttons, sensors, or cameras." },
  { value: "minor-issues", label: "Minor issues", hint: "Something works oddly, e.g. camera, Face ID, or a button." },
  { value: "does-not-turn-on", label: "Doesn't turn on", hint: "The device won't power on or won't stay on." },
];

const SCREEN_OPTIONS: { value: ScreenCondition; label: string; hint: string }[] = [
  { value: "flawless", label: "Flawless", hint: "No scratches or cracks." },
  { value: "light-wear", label: "Light wear", hint: "A few minor scratches, barely visible when on." },
  { value: "cracked-or-damaged", label: "Cracked or damaged", hint: "Visible cracks or a damaged display." },
];

const BODY_OPTIONS: { value: BodyCondition; label: string; hint: string }[] = [
  { value: "flawless", label: "Flawless", hint: "Looks like new." },
  { value: "light-wear", label: "Light wear", hint: "Minor scuffs on the edges or back." },
  { value: "heavy-wear", label: "Heavy wear", hint: "Dents, deep scratches, or a cracked back." },
];

const BATTERY_OPTIONS: { value: BatteryHealth; label: string }[] = [
  { value: "90-100", label: "90–100%" },
  { value: "80-89", label: "80–89%" },
  { value: "below-80", label: "Below 80%" },
  { value: "unknown", label: "Not sure" },
];

interface SellWizardProps {
  allModels: DeviceModel[];
  initialCategory?: DeviceCategory;
}

export function SellWizard({ allModels, initialCategory }: SellWizardProps) {
  const [step, setStep] = useState(initialCategory ? 1 : 0);
  const [category, setCategory] = useState<DeviceCategory | null>(initialCategory ?? null);
  const [model, setModel] = useState<DeviceModel | null>(null);
  const [storage, setStorage] = useState<StorageOption | null>(null);
  const [condition, setCondition] = useState<Partial<ConditionAnswers>>({});
  const [country, setCountry] = useState(EU_COUNTRIES[0].code);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [isSubmitting, startSubmit] = useTransition();

  const models = useMemo(
    () => (category ? allModels.filter((m) => m.category === category) : []),
    [allModels, category],
  );

  const conditionComplete =
    condition.functional && condition.screen && condition.body && condition.battery;

  const offer =
    model && storage && conditionComplete
      ? estimateOffer(model, storage, condition as ConditionAnswers)
      : null;

  function goTo(next: number) {
    setStep(Math.max(0, Math.min(STEP_LABELS.length - 1, next)));
  }

  function restart() {
    setStep(0);
    setCategory(null);
    setModel(null);
    setStorage(null);
    setCondition({});
    setSubmittedId(null);
  }

  function acceptOffer() {
    if (!model || !storage || !conditionComplete || offer === null) return;
    const countryName = EU_COUNTRIES.find((c) => c.code === country)?.name ?? country;
    startSubmit(async () => {
      const result = await submitPurchase({
        modelId: model.id,
        storageGb: storage.gb,
        storageLabel: storage.label,
        condition: condition as ConditionAnswers,
        offerEUR: offer,
        countryCode: country,
        countryName,
      });
      setSubmittedId(result.id);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <ol className="flex items-center gap-2 text-xs font-medium text-muted">
        {STEP_LABELS.map((label, index) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                index <= step ? "bg-primary text-white" : "bg-surface-alt text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span className={index <= step ? "text-ink" : ""}>{label}</span>
            {index < STEP_LABELS.length - 1 && (
              <span className="h-px flex-1 bg-border">
                <motion.span
                  className="block h-px bg-primary"
                  initial={false}
                  animate={{ width: index < step ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold text-ink">What are you selling?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {CATEGORIES.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setCategory(option);
                    setModel(null);
                    setStorage(null);
                    goTo(1);
                  }}
                  className={`rounded-xl border px-4 py-6 text-sm font-semibold transition ${
                    category === option
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {CATEGORY_LABELS[option]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && category && (
          <div>
            <h2 className="text-xl font-semibold text-ink">Which {CATEGORY_LABELS[category]}?</h2>
            <div className="mt-6 grid max-h-80 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {models.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setModel(option);
                    setStorage(null);
                    goTo(2);
                  }}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    model?.id === option.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {option.name}
                  <span className="mt-0.5 block text-xs font-normal text-muted">From €{option.basePriceEUR}</span>
                </button>
              ))}
            </div>
            <BackButton onClick={() => goTo(0)} />
          </div>
        )}

        {step === 2 && model && (
          <div>
            <h2 className="text-xl font-semibold text-ink">How much storage?</h2>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {model.storageOptions.map((option) => (
                <button
                  key={option.gb}
                  onClick={() => {
                    setStorage(option);
                    goTo(3);
                  }}
                  className={`rounded-xl border px-4 py-5 text-sm font-semibold transition ${
                    storage?.gb === option.gb
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <BackButton onClick={() => goTo(1)} />
          </div>
        )}

        {step === 3 && model && storage && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-ink">Tell us the condition</h2>

            <ConditionField
              label="Does it turn on and work normally?"
              options={FUNCTIONAL_OPTIONS}
              value={condition.functional}
              onChange={(value) => setCondition((c) => ({ ...c, functional: value }))}
            />
            <ConditionField
              label="Screen condition"
              options={SCREEN_OPTIONS}
              value={condition.screen}
              onChange={(value) => setCondition((c) => ({ ...c, screen: value }))}
            />
            <ConditionField
              label="Back and body condition"
              options={BODY_OPTIONS}
              value={condition.body}
              onChange={(value) => setCondition((c) => ({ ...c, body: value }))}
            />
            <div>
              <p className="text-sm font-semibold text-ink">Battery health</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BATTERY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCondition((c) => ({ ...c, battery: option.value }))}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      condition.battery === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-ink hover:border-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <BackButton onClick={() => goTo(2)} />
              <button
                disabled={!conditionComplete}
                onClick={() => goTo(4)}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                See my offer
              </button>
            </div>
          </div>
        )}

        {step === 4 && model && storage && offer !== null && submittedId && (
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">Submitted</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Thanks — we&apos;ve got your device</h2>
            <p className="mt-3 text-sm text-muted">
              Reference <span className="font-semibold text-ink">{submittedId.slice(0, 8).toUpperCase()}</span>.
              We&apos;ll email you a free shipping label — once it&apos;s checked, you&apos;ll be paid €{offer}.
            </p>
            <button
              onClick={restart}
              className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Sell another device
            </button>
          </div>
        )}

        {step === 4 && model && storage && offer !== null && !submittedId && (
          <div className="text-center">
            <p className="text-sm font-semibold text-muted">Your instant offer for</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">
              {model.name} · {storage.label}
            </h2>
            <motion.p
              className="mt-6 text-5xl font-bold text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            >
              €<AnimatedNumber value={offer} duration={0.8} />
            </motion.p>
            <p className="mt-3 text-sm text-muted">
              This offer is valid for 14 days. Ship it in with a free label and get paid within 2 business days
              of inspection.
            </p>

            <div className="mx-auto mt-6 max-w-xs text-left">
              <label className="text-xs font-semibold tracking-wide text-muted uppercase">
                Where are you shipping from?
              </label>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
              >
                {EU_COUNTRIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={acceptOffer}
                disabled={isSubmitting}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting…" : "Accept offer & continue"}
              </button>
              <button
                onClick={restart}
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                Sell another device
              </button>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-6 text-sm font-semibold text-muted transition hover:text-ink">
      ← Back
    </button>
  );
}

function ConditionField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; hint: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-3 grid gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
              value === option.value
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary"
            }`}
          >
            <span className={`font-semibold ${value === option.value ? "text-primary" : "text-ink"}`}>
              {option.label}
            </span>
            <span className="mt-0.5 block text-xs text-muted">{option.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
