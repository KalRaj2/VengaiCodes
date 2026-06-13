import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

/**
 * MainLayout — wraps all protected/authenticated routes.
 * Renders the persistent Sidebar + the active route via <Outlet />.
 * TopBar is rendered per-screen (not here) so each screen can set
 * its own title and contextual actions.
 */
export default function MainLayout() {
  return (
    <div className="h-full w-full flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
