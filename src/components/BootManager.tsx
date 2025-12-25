"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, ChevronUp, ArrowRight, Lock, Loader2 } from "lucide-react";

type UserType = "guest" | "admin";

const LOADING_MESSAGES = [
  "Initializing kernel...",
  "Loading React Modules...",
  "Optimizing portfolio assets...",
  "Establishing connection...",
  "Computing clouds...",
  "Warming up pixels...",
  "Painting wallpapers...",
  "Spinning up microservices...",
  "Calibrating color profiles...",
  "Indexing memories...",
  "Compiling user vibes...",
  "Aligning constellations...",
  "Polishing UI chrome...",
  "Running self-diagnostics...",
];

export default function BootManager() {
  const [view, setView] = useState<"lock" | "login" | "booted">("lock");
  const [time, setTime] = useState<Date | null>(null);

  // Auth States
  const [selectedUser, setSelectedUser] = useState<UserType>("guest");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Loading States
  const [isBooting, setIsBooting] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (sessionStorage.getItem("tingOS_unlocked")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView("booted");
    }

    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);

    const handleLockEvent = () => {
      setView("lock");
      setSelectedUser("guest");
      setPassword("");
      setIsBooting(false);
    };
    window.addEventListener("os-lock", handleLockEvent);

    return () => {
      clearInterval(timer);
      window.removeEventListener("os-lock", handleLockEvent);
    };
  }, []);

  const handleUnlock = () => {
    if (view === "lock") setView("login");
  };

  const playStartupSound = () => {
    try {
      const audio = new Audio("/startup.mp3");
      audio.volume = 0.4;
      audio
        .play()
        .catch(() =>
          console.log("Audio requires interaction first or file missing"),
        );
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const executeLogin = () => {
    setIsBooting(true);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * LOADING_MESSAGES.length);
      } while (
        LOADING_MESSAGES[nextIndex] === loadingMsg &&
        LOADING_MESSAGES.length > 1
      );
      msgIndex = nextIndex;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 800);
    setTimeout(() => playStartupSound(), 500);

    setTimeout(() => {
      clearInterval(msgInterval);
      sessionStorage.setItem("tingOS_unlocked", "true");
      setView("booted");
      setTimeout(() => setIsBooting(false), 500);
    }, 1600);
  };

  const handleLoginSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (selectedUser === "guest") {
      executeLogin();
    } else {
      const storedHash = process.env.NEXT_PUBLIC_PASSWORD_HASH;
      const inputHash = btoa(password);

      if (inputHash === storedHash) {
        executeLogin();
      } else {
        setLoginError(true);
        setPassword("");
        setTimeout(() => setLoginError(false), 2000);
      }
    }
  };

  if (view === "booted") return null;

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-black font-sans text-white"
        onClick={view === "lock" ? handleUnlock : undefined}
      >
        {/* BASE WALLPAPER */}
        <div
          className="absolute inset-0 -z-20 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=3000")',
          }}
        />

        {/* BLUR LAYER */}
        <motion.div
          initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
          animate={{
            backdropFilter: view === "login" ? "blur(30px)" : "blur(0px)",
            backgroundColor:
              view === "login" ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)",
            opacity: 1,
          }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 -z-10"
        />

        {/* --- LOCK SCREEN VIEW --- */}
        <AnimatePresence>
          {view === "lock" && time && (
            <motion.div
              key="lock-screen"
              drag="y"
              dragConstraints={{ top: -1000, bottom: 0 }}
              dragElastic={{ top: 0.2, bottom: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.y < -150 || info.velocity.y < -500)
                  setView("login");
              }}
              className="absolute inset-0 z-10 flex cursor-grab flex-col items-center justify-center active:cursor-grabbing"
              exit={{
                y: "-100%",
                opacity: 0,
                transition: { duration: 0.4, ease: "easeInOut" },
              }}
            >
              <div className="mb-20 flex flex-col items-center">
                <h1 className="text-9xl font-thin tracking-tighter drop-shadow-lg select-none">
                  {time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </h1>
                <p className="mt-2 text-3xl font-light drop-shadow-md select-none">
                  {time.toLocaleDateString([], {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Fixed Bouncing Hint */}
              <motion.div
                className="absolute bottom-12 flex flex-col items-center gap-2"
                initial={{ y: 0 }}
                animate={{ y: -10 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <ChevronUp size={24} className="opacity-80" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase opacity-60">
                  Swipe up to unlock
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- LOGIN VIEW --- */}
        {view === "login" && (
          <motion.div
            key="login-screen"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-20 flex w-full max-w-md flex-col items-center gap-8"
          >
            {/* Avatar & Name */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white/20 bg-gray-900/60 shadow-2xl backdrop-blur-sm">
                {selectedUser === "admin" ? (
                  <div className="flex h-full w-full items-center justify-center bg-blue-600/20">
                    <span className="text-5xl font-bold">TW</span>
                  </div>
                ) : (
                  <User
                    size={100}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
                  />
                )}
              </div>

              <div className="h-16 text-center">
                <h2 className="mb-1 text-4xl font-semibold tracking-tight">
                  {selectedUser === "admin" ? "Ting Wu" : "Guest"}
                </h2>
                {selectedUser === "admin" && loginError && !isBooting && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-400"
                  >
                    Incorrect password.
                  </motion.p>
                )}
              </div>
            </div>

            {/* Input / Loading Area */}
            <div className="relative flex h-16 w-4/5 justify-center px-8">
              <AnimatePresence mode="wait">
                {isBooting ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <Loader2 className="animate-spin text-white/80" size={32} />
                    <motion.span
                      key={loadingMsg}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-xs tracking-wider whitespace-nowrap text-white/60"
                    >
                      {loadingMsg}
                    </motion.span>
                  </motion.div>
                ) : (
                  // INPUT/BUTTON STATE
                  <motion.div
                    key="inputs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex w-full justify-center"
                  >
                    {selectedUser === "guest" ? (
                      <button
                        onClick={handleLoginSubmit}
                        className="m-2 w-1/2 rounded-md border border-white/10 bg-white/20 text-sm font-semibold backdrop-blur-md transition-all hover:cursor-pointer hover:bg-white/30 active:scale-95"
                      >
                        Sign In
                      </button>
                    ) : (
                      <form
                        onSubmit={handleLoginSubmit}
                        className="relative w-full"
                      >
                        <input
                          type="password"
                          placeholder="Password"
                          autoFocus
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setLoginError(false);
                          }}
                          className={`w-full rounded-md border bg-black/40 px-4 py-3 pr-12 text-white placeholder-gray-400 backdrop-blur-md transition-all outline-none focus:bg-black/60 ${loginError ? "border-red-500/80" : "border-white/10 focus:border-blue-500/50"} `}
                        />
                        <button
                          type="submit"
                          className="absolute top-1/2 right-2 -translate-y-3/4 rounded p-1.5 text-gray-300 transition-colors hover:cursor-pointer hover:bg-white/10 hover:text-white"
                        >
                          <ArrowRight size={20} />
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Switcher */}
            {!isBooting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-[15vh] flex flex-col items-start gap-4 md:fixed md:top-auto md:right-8 md:bottom-8 md:left-auto"
              >
                {selectedUser === "admin" && (
                  <div
                    onClick={() => setSelectedUser("guest")}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-3 opacity-60 transition-all hover:bg-white/10 hover:opacity-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gray-700">
                      <User size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Guest</p>
                      <p className="text-xs text-gray-400">Local Account</p>
                    </div>
                  </div>
                )}

                {selectedUser === "guest" && (
                  <div
                    onClick={() => {
                      setSelectedUser("admin");
                      setPassword("");
                      setLoginError(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg p-3 opacity-60 transition-all hover:bg-white/10 hover:opacity-100"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-blue-900/50">
                      <Lock size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Ting Wu</p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
