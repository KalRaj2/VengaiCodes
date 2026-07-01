import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Palette, Type, Layout, Puzzle,
  Navigation, Loader2, ThumbsUp
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import BabyTiger from "@/components/baby-tiger/BabyTiger";

interface ScreenDefinition {
  name: string;
  purpose: string;
  key_elements: string[];
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface UIUXDesign {
  design_style: string;
  color_palette: ColorPalette;
  typography: string;
  screens: ScreenDefinition[];
  components: string[];
  navigation_pattern: string;
}

export default function UIUXScreen() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [design, setDesign] = useState<UIUXDesign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    loadOrGenerate();
  }, [projectId]);

  const loadOrGenerate = async () => {
    try {
      const { data } = await apiClient.get(`/uiux/${projectId}`);
      setDesign(data.design);
      setIsLoading(false);
    } catch {
      await generate();
    }
  };

  const generate = async () => {
    setIsGenerating(true);
    setIsLoading(false);
    try {
      const { data } = await apiClient.post("/uiux/generate", {
        project_id: projectId,
      });
      setDesign(data.design);
      toast.success("Your design system is ready! 🎨🐯");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate design.");
      navigate(`/project/${projectId}/requirements`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await apiClient.post("/uiux/approve", {
        project_id: projectId,
        approved: true,
      });
      toast.success("Design approved! Next: Architecture 🐯");
      navigate(`/project/${projectId}/architecture`);
    } catch (error: any) {
      toast.error(error.message || "Failed to approve.");
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading || isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]">
        <BabyTiger size={100} expression="thinking" />
        <p className="text-[var(--color-text-secondary)] text-sm">
          {isGenerating
            ? "Baby Tiger is designing your app... 🎨🐯"
            : "Loading..."}
        </p>
      </div>
    );
  }

  if (!design) return null;

  const colorEntries = Object.entries(design.color_palette) as [keyof ColorPalette, string][];

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--color-background)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
        <button
          onClick={() => navigate("/home")}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-raised)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </button>
        <BabyTiger size={36} expression="happy" />
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">
            UI/UX Design
          </h1>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Phase 2 of 7 — Review and approve to continue
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Design Style */}
          <Section icon={Palette} title="Design Style">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {design.design_style}
            </p>
          </Section>

          {/* Color Palette */}
          <Section icon={Palette} title="Color Palette">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {colorEntries.map(([key, hex]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="w-full aspect-square rounded-xl border border-[var(--color-border)] shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                  <div className="text-center">
                    <p className="text-xs font-medium text-[var(--color-text-primary)] capitalize">
                      {key}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
                      {hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Typography */}
          <Section icon={Type} title="Typography">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {design.typography}
            </p>
          </Section>

          {/* Screens */}
          <Section icon={Layout} title={`Screens (${design.screens.length})`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {design.screens.map((screen, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: design.color_palette.primary }}
                    />
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {screen.name}
                    </h4>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-3 leading-relaxed">
                    {screen.purpose}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {screen.key_elements.map((el, j) => (
                      <span
                        key={j}
                        className="px-2 py-1 rounded-md bg-[var(--color-surface)] text-[var(--color-text-tertiary)] text-xs border border-[var(--color-border)]"
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Components */}
          <Section icon={Puzzle} title="Reusable Components">
            <div className="flex flex-wrap gap-2">
              {design.components.map((component, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-medium capitalize"
                >
                  {component}
                </span>
              ))}
            </div>
          </Section>

          {/* Navigation Pattern */}
          <Section icon={Navigation} title="Navigation Pattern">
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {design.navigation_pattern}
            </p>
          </Section>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            Review the design above. Once approved, Baby Tiger moves to Architecture 🏗️
          </p>
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 flex items-center gap-2 flex-shrink-0"
          >
            {isApproving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            Approve & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-[var(--color-primary)]" />
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}
