"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Mascot } from "@/components/Mascot";

const SESSION_KEY = "flippie-splash-shown";
const SPLASH_DURATION_MS = 850;

function subscribe(): () => void {
  return () => {};
}

/** Pure read — never writes, so repeated calls stay consistent for useSyncExternalStore. */
function getShouldShowSnapshot(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  } catch {
    return false; // storage unavailable (private mode etc.) — never show, never block the site
  }
}

/** True only on the first client render of a session, before hydration decides otherwise. */
function useShouldShowSplash(): boolean {
  return useSyncExternalStore(subscribe, getShouldShowSnapshot, () => false);
}

/**
 * A brief, branded intro overlay shown once per browser session before the
 * site's real content is visible. The real page always renders underneath
 * in parallel — this never gates or delays actual content paint, so it
 * doesn't cost anything on Core Web Vitals. Skipped entirely for
 * reduced-motion users and whenever sessionStorage isn't available.
 */
export function SplashIntro() {
  const reduceMotion = useReducedMotion();
  const shouldShow = useShouldShowSplash();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!shouldShow || reduceMotion) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Nothing to clean up — getShouldShowSnapshot() already returned false if storage is blocked.
    }
    const timer = setTimeout(() => setDismissed(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [shouldShow, reduceMotion]);

  const visible = shouldShow && !reduceMotion && !dismissed;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-surface"
          aria-hidden="true"
        >
          <Mascot size={96} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
