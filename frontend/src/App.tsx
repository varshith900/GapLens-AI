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

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    if (param !== undefined) {
      setCurrentParam(param);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onAuthChange={setUser}
      />

      <main className="flex-1">
        {currentView === "landing" && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentView === "login" && (
          <LoginPage
            onNavigate={handleNavigate}
            onAuthSuccess={(u) => {
              setUser(u);
              handleNavigate("research");
            }}
          />
        )}

        {currentView === "signup" && (
          <SignupPage
            onNavigate={handleNavigate}
            onAuthSuccess={(u) => {
              setUser(u);
              handleNavigate("research");
            }}
          />
        )}

        {currentView === "research" && (
          <ResearchPage
            user={user}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "results" && (
          <ResultsPage
            researchId={currentParam}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === "history" && (
          <HistoryPage
            user={user}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
