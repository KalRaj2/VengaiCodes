import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { AppDispatch, RootState } from "@/store";
import { fetchProjects, deleteProject } from "@/store/slices/projectSlice";
import ProjectCard from "@/components/project/ProjectCard";
import BabyTiger from "@/components/baby-tiger/BabyTiger";

export default function PendingTab() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, isLoading } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const pendingProjects = projects.filter(
    (p) => p.status === "draft" || p.status === "in_progress"
  );

  const handleDelete = (id: string) => {
    dispatch(deleteProject(id));
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {isLoading && pendingProjects.length === 0 ? (
          <div className="flex justify-center py-20">
            <BabyTiger size={80} expression="thinking" />
          </div>
        ) : pendingProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <BabyTiger size={100} expression="idle" className="mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              No projects in progress
            </h3>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Start building something new from the Create tab! 🐯
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {pendingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
