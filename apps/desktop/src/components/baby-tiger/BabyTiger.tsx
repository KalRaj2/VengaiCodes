import { motion, AnimatePresence } from "framer-motion";

// ─── Expression Types ───
export type TigerExpression =
  | "idle"
  | "happy"
  | "sad"
  | "thinking"
  | "excited"
  | "coding"
  | "celebrating"
  | "investigating"
  | "serious"
  | "concerned"
  | "waving";

interface BabyTigerProps {
  size?: number;
  expression?: TigerExpression;
  className?: string;
}

/**
 * Baby Tiger 🐯 — VengaiCode's mascot
 * Vengai (வேங்கை) = Tiger in Tamil
 *
 * This is a lightweight CSS/SVG-based placeholder version.
 * In later sprints this will be replaced/extended with full
 * Lottie animation files (see animations/ folder) for richer
 * phase-specific expressions.
 */
export default function BabyTiger({
  size = 100,
  expression = "idle",
  className = "",
}: BabyTigerProps) {
  // Eye state per expression
  const eyeShape = (() => {
    switch (expression) {
      case "happy":
      case "celebrating":
      case "excited":
        return "happy"; // curved closed-happy eyes
      case "sad":
      case "concerned":
        return "sad"; // downturned eyes
      case "thinking":
      case "investigating":
        return "side"; // looking to the side
      default:
        return "normal";
    }
  })();

  // Animation per expression
  const containerAnimation = (() => {
    switch (expression) {
      case "celebrating":
        return {
          rotate: [0, -8, 8, -8, 0],
          y: [0, -10, 0, -10, 0],
          transition: { duration: 1, repeat: Infinity, repeatDelay: 0.5 },
        };
      case "waving":
        return {
          rotate: [0, -3, 3, -3, 0],
          transition: { duration: 1.2, repeat: Infinity, repeatDelay: 0.8 },
        };
      case "thinking":
        return {
          rotate: [0, 3, 0],
          transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const },
        };
      case "excited":
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 0.6, repeat: Infinity },
        };
      case "sad":
        return {
          y: [0, 2, 0],
          transition: { duration: 2.5, repeat: Infinity },
        };
      default:
        return {
          y: [0, -4, 0],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        };
    }
  })();

  const renderEyes = () => {
    switch (eyeShape) {
      case "happy":
        return (
          <>
            <path d="M40 62 Q46 56 52 62" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M76 62 Q82 56 88 62" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        );
      case "sad":
        return (
          <>
            <circle cx="46" cy="64" r="6" fill="#1A1A1A" />
            <circle cx="82" cy="64" r="6" fill="#1A1A1A" />
            <path d="M38 56 Q46 52 54 56" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M74 56 Q82 52 90 56" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case "side":
        return (
          <>
            <circle cx="49" cy="64" r="6" fill="#1A1A1A" />
            <circle cx="85" cy="64" r="6" fill="#1A1A1A" />
            <circle cx="51" cy="62" r="2" fill="#FFFFFF" />
            <circle cx="87" cy="62" r="2" fill="#FFFFFF" />
          </>
        );
      default:
        return (
          <>
            <circle cx="46" cy="64" r="6" fill="#1A1A1A" />
            <circle cx="82" cy="64" r="6" fill="#1A1A1A" />
            <circle cx="48" cy="62" r="2" fill="#FFFFFF" />
            <circle cx="84" cy="62" r="2" fill="#FFFFFF" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case "happy":
      case "celebrating":
      case "excited":
      case "waving":
        return <path d="M64 82 Q64 92 50 90 M64 82 Q64 92 78 90" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case "sad":
      case "concerned":
        return <path d="M52 90 Q64 82 76 90" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />;
      default:
        return <path d="M64 84 Q64 90 56 90 M64 84 Q64 90 72 90" stroke="#1A1A1A" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
  };

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      animate={containerAnimation}
      role="img"
      aria-label={`Baby Tiger — ${expression}`}
    >
      <svg viewBox="0 0 128 128" width={size} height={size}>
        {/* Ears */}
        <circle cx="38" cy="34" r="14" fill="#FF8C00" />
        <circle cx="90" cy="34" r="14" fill="#FF8C00" />
        <circle cx="38" cy="36" r="7" fill="#1A1A1A" />
        <circle cx="90" cy="36" r="7" fill="#1A1A1A" />

        {/* Head */}
        <ellipse cx="64" cy="68" rx="38" ry="34" fill="#FF8C00" />

        {/* Face mask */}
        <ellipse cx="64" cy="76" rx="26" ry="20" fill="#FFF8F0" />

        {/* Stripes */}
        <path d="M30 50 Q34 44 40 48" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M98 50 Q94 44 88 48" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M26 64 Q32 60 38 64" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M102 64 Q96 60 90 64" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M64 36 L64 46" stroke="#1A1A1A" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Eyes — animated based on expression */}
        <AnimatePresence mode="wait">
          <motion.g
            key={eyeShape}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderEyes()}
          </motion.g>
        </AnimatePresence>

        {/* Nose */}
        <ellipse cx="64" cy="80" rx="6" ry="4" fill="#1A1A1A" />

        {/* Mouth */}
        {renderMouth()}

        {/* Whiskers */}
        <path d="M44 78 L28 76" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M44 84 L28 86" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M84 78 L100 76" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
        <path d="M84 84 L100 86" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Waving paw — only for 'waving' expression */}
      {expression === "waving" && (
        <motion.div
          className="absolute -right-1 top-1/3 text-2xl"
          style={{ fontSize: size * 0.25 }}
          animate={{ rotate: [0, 20, -10, 20, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
        >
          🐾
        </motion.div>
      )}

      {/* Celebration confetti */}
      {expression === "celebrating" && (
        <motion.div
          className="absolute -top-2 -right-2 text-xl"
          animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🎉
        </motion.div>
      )}

      {/* Thought bubble for thinking */}
      {expression === "thinking" && (
        <motion.div
          className="absolute -top-3 -right-3 text-lg"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💭
        </motion.div>
      )}
    </motion.div>
  );
}
