import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check } from "lucide-react";

import { AppDispatch, RootState } from "@/store";
import {
  fetchNotifications,
  markNotificationRead,
} from "@/store/slices/notificationSlice";
import ThemeToggle from "@/components/ui/ThemeToggle";
import BabyTiger from "@/components/baby-tiger/BabyTiger";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title = "Dashboard" }: TopBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, unreadCount } = useSelector((state: RootState) => state.notifications);
  const tigerExpression = useSelector((state: RootState) => state.ui.tigerExpression);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
      <div className="flex items-center gap-3">
        <BabyTiger size={32} expression={tigerExpression} />
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowPanel((p) => !p)}
            className="relative w-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:border-[var(--color-primary)] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-error)] text-white text-xs font-semibold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification panel */}
          <AnimatePresence>
            {showPanel && (
              <>
                {/* Backdrop to close on outside click */}
                <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl z-50"
                >
                  <div className="p-3 border-b border-[var(--color-border)]">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                      Notifications
                    </h3>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-6 text-center">
                      <BabyTiger size={48} expression="idle" className="mx-auto mb-2" />
                      <p className="text-sm text-[var(--color-text-tertiary)]">
                        No notifications yet 🐯
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-[var(--color-border-subtle)]">
                      {items.map((notif) => (
                        <li
                          key={notif.id}
                          onClick={() => {
                            if (!notif.is_read) dispatch(markNotificationRead(notif.id));
                          }}
                          className={`p-3 cursor-pointer transition-colors hover:bg-[var(--color-surface-raised)] ${
                            !notif.is_read ? "bg-[var(--color-primary-light)]" : ""
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.is_read && (
                              <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                {notif.title}
                              </p>
                              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                            {notif.is_read && (
                              <Check className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] flex-shrink-0 mt-0.5" />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
