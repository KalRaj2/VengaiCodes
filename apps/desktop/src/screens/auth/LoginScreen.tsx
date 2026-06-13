import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/store";
import { loginUser, clearError } from "@/store/slices/authSlice";
import { setTigerExpression } from "@/store/slices/uiSlice";
import BabyTiger from "@/components/baby-tiger/BabyTiger";
import ThemeToggle from "@/components/ui/ThemeToggle";

// ─── Validation Schema ───
const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Please enter your username or email"),
  password: z
    .string()
    .min(1, "Please enter your password"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  });

  // Focus first field on mount + Tiger waves hello 🐯
  useEffect(() => {
    setFocus("usernameOrEmail");
    dispatch(setTigerExpression("waving"));
  }, [setFocus, dispatch]);

  // Redirect on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(setTigerExpression("sad"));
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    dispatch(setTigerExpression("thinking"));
    const result = await dispatch(
      loginUser({
        usernameOrEmail: data.usernameOrEmail,
        password: data.password,
        rememberMe: data.rememberMe,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      dispatch(setTigerExpression("celebrating"));
      toast.success("Welcome back! Baby Tiger missed you! 🐯");
    }
  };

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* ═══════════════════════════════════ */}
      {/* Left Panel — Animated Brand Section */}
      {/* ═══════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-1/2 animated-bg relative items-center justify-center overflow-hidden">
        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={
              {
                width: `${20 + Math.random() * 60}px`,
                height: `${20 + Math.random() * 60}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                "--duration": `${4 + Math.random() * 6}s`,
                "--delay": `${Math.random() * 4}s`,
              } as React.CSSProperties
            }
          />
        ))}

        <div className="relative z-10 text-center px-12">
          {/* Baby Tiger */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
            className="mb-8 flex justify-center"
          >
            <BabyTiger size={180} expression="waving" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-5xl font-extrabold text-white mb-3 tracking-tight"
          >
            VengaiCode
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-white/90 text-lg mb-2"
          >
            வேங்கை கோட் — Build any app in 30 minutes
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-white/70 text-sm max-w-md mx-auto"
          >
            Zero coding. 100% open-source. Baby Tiger asks, you answer,
            VengaiCode builds — Web, Mobile, Desktop, iOS, Android, all at once.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mt-8"
          >
            {["🤖 AI-Powered", "🔒 Privacy First", "🆓 ₹0 to Start", "🐯 Baby Tiger Approved"].map(
              (item) => (
                <span
                  key={item}
                  className="px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium backdrop-blur-sm border border-white/20"
                >
                  {item}
                </span>
              )
            )}
          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════ */}
      {/* Right Panel — Login Form */}
      {/* ═══════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-[var(--color-background)] relative">
        {/* Top bar with theme toggle */}
        <div className="flex justify-end p-6">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Mobile-only Tiger */}
            <div className="lg:hidden flex justify-center mb-6">
              <BabyTiger size={80} expression="waving" />
            </div>

            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                Welcome back!
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                Sign in to continue building with Baby Tiger 🐯
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username/Email */}
              <div>
                <label
                  htmlFor="usernameOrEmail"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5"
                >
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                  <input
                    {...register("usernameOrEmail")}
                    type="text"
                    id="usernameOrEmail"
                    autoComplete="username"
                    placeholder="kalki_builds or kalki@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all ${
                      errors.usernameOrEmail
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                </div>
                {errors.usernameOrEmail && (
                  <p className="mt-1.5 text-xs text-[var(--color-error)]">
                    {errors.usernameOrEmail.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[var(--color-text-primary)]"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl border bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all ${
                      errors.password
                        ? "border-[var(--color-error)]"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-[var(--color-error)]">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  id="rememberMe"
                  className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-[var(--color-text-secondary)] cursor-pointer"
                >
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[var(--color-border)]" />
              <span className="text-xs text-[var(--color-text-tertiary)]">
                New to VengaiCode?
              </span>
              <div className="flex-1 h-px bg-[var(--color-border)]" />
            </div>

            {/* Signup link */}
            <Link
              to="/signup"
              className="w-full block text-center py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-text-primary)] font-medium transition-all hover:bg-[var(--color-primary-light)]"
            >
              Create your account — it's free 🐯
            </Link>

            <p className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">
              By signing in, you agree to VengaiCode's{" "}
              <a href="#" className="underline hover:text-[var(--color-primary)]">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-[var(--color-primary)]">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
