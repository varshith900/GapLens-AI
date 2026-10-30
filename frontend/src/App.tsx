import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResearchPage } from "./pages/ResearchPage";
import { ResultsPage } from "./pages/ResultsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { subscribeAuth, getStoredUser } from "./services/firebase";
import type { UserProfile } from "./types";

export function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [currentParam, setCurrentParam] = useState<string>("");
  const [user, setUser] = useState<UserProfile | null>(getStoredUser());
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("app_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  // Synchronize theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Listen to Auth State
  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Synchronize with URL hash on load & browser back/forward
  useEffect(() => {
    const parseHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, "");
      if (!rawHash) {
        setCurrentView("landing");
        setCurrentParam("");
        return;
      }
      const [path, queryString] = rawHash.split("?");
      const params = new URLSearchParams(queryString || "");
      const id = params.get("id") || "";

      if (["landing", "research", "results", "history", "login", "signup"].includes(path)) {
        setCurrentView(path);
        if (id) setCurrentParam(id);
      }
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    if (param !== undefined) {
      setCurrentParam(param);
    }

    let targetHash = `#/${view}`;
    if (view === "landing") {
      targetHash = "#/";
    } else if (view === "results" && param) {
      targetHash = `#/results?id=${encodeURIComponent(param)}`;
    }

    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-500 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#07090e] text-slate-100"
          : "bg-[#f8fafc] text-slate-900"
      } bg-mesh-pattern`}
    >
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onAuthChange={setUser}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        {currentView === "landing" && (
          <LandingPage onNavigate={handleNavigate} theme={theme} />
        )}

        {currentView === "login" && (
          <LoginPage
            onNavigate={handleNavigate}
            onAuthSuccess={(u) => {
              setUser(u);
              handleNavigate("research");
            }}
            theme={theme}
          />
        )}

        {currentView === "signup" && (
          <SignupPage
            onNavigate={handleNavigate}
            onAuthSuccess={(u) => {
              setUser(u);
              handleNavigate("research");
            }}
            theme={theme}
          />
        )}

        {currentView === "research" && (
          <ResearchPage
            user={user}
            onNavigate={handleNavigate}
            theme={theme}
          />
        )}

        {currentView === "results" && (
          <ResultsPage
            researchId={currentParam}
            onNavigate={handleNavigate}
            theme={theme}
          />
        )}

        {currentView === "history" && (
          <HistoryPage
            user={user}
            onNavigate={handleNavigate}
            theme={theme}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} theme={theme} />
    </div>
  );
}

export default App;
