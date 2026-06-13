import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

import { AppDispatch, RootState } from "@/store";
import { toggleTheme } from "@/store/slices/uiSlice";

/**
 * ThemeToggle — switch between light and dark mode.
 * Persists choice via uiSlice (localStorage-backed).
 */
export default function ThemeToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:border-[var(--color-primary)] transition-colors"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-[var(--color-primary)]" />
        ) : (
          <Sun className="w-5 h-5 text-[var(--color-accent)]" />
        )}
      </motion.div>
    </button>
  );
}
