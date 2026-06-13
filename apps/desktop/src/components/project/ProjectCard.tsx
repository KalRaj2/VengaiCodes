import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Smartphone, Monitor, Trash2 } from "lucide-react";

import { Project, SDLCPhase } from "@/store/slices/projectSlice";

const PHASE_LABELS: Record<SDLCPhase, string> = {
  requirements: "Requirements",
  uiux: "UI/UX Design",
  architecture: "Architecture",
  api_builder: "API Builder",
  code_generation: "Code Generation",
  testing: "Testing",
  export: "Export",
  completed: "Completed",
};

const PHASE_ROUTES: Record<SDLCPhase, string> = {
  requirements: "wizard",
  uiux: "uiux",
  architecture: "architecture",
  api_builder: "architecture",
  code_generation: "codegen",
  testing: "testing",
  export: "export",
  completed: "export",
};

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  web: Globe,
  mobile_ios: Smartphone,
  mobile_android: Smartphone,
  desktop_windows: Monitor,
  desktop_mac: Monitor,
  desktop_linux: Monitor,
};

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleOpen = () => {
    const route = PHASE_ROUTES[project.current_phase] || "wizard";
    navigate(`/project/${project.id}/${route}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={handleOpen}
      className="group cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:border-[var(--color-primary)] hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-light)] transition-all flex-shrink-0"
            aria-label="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Platform icons */}
      {project.platforms?.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          {project.platforms.map((platform) => {
            const Icon = PLATFORM_ICONS[platform] || Globe;
            return (
              <span
                key={platform}
                className="w-6 h-6 rounded-md bg-[var(--color-surface-raised)] flex items-center justify-center"
                title={platform}
              >
                <Icon className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              </span>
            );
          })}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {PHASE_LABELS[project.current_phase]}
          </span>
          <span className="text-xs font-semibold text-[var(--color-primary)]">
            {Math.round(project.progress_percent)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--color-surface-raised)] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--color-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${project.progress_percent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Status badge */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            project.status === "completed"
              ? "bg-[var(--color-success-light)] text-[var(--color-success)]"
              : project.status === "in_progress"
              ? "bg-[var(--color-info-light)] text-[var(--color-info)]"
              : "bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)]"
          }`}
        >
          {project.status === "in_progress" ? "In Progress" : project.status === "completed" ? "Completed" : "Draft"}
        </span>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {new Date(project.updated_at).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}
