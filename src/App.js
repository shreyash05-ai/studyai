import { useState } from "react";
import Landing from "./Landing";
import AuthPage from "./AuthPage";
import Dashboard from "./Dashboard";
import StudyTracker from "./StudyTracker";
import SettingsTab from "./Settings";
import Goals from "./Goals";
import Concepts from "./Concepts";
import MockTest from "./MockTest";
import AIMentor from "./AIMentor";
import Habits from "./Habits";
import Leaderboard from "./Leaderboard";
import InterviewResources from "./InterviewResources";
import Sidebar from "./components/Sidebar";
import PaymentModal from "./components/PaymentModal";
import { createFreshUserData, getUserData, setUserData } from "./utils/storage";
import "./index.css";

function App() {
  const [screen, setScreen] = useState("landing"); // "landing" | "auth" | "app"
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [userData, setUserDataState] = useState(null);
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null);

  const updateUserData = (data) => {
    setUserDataState(data);
    if (user) setUserData(user.email, data);
  };

  const handleAuth = (loggedInUser) => {
    setUser(loggedInUser);
    const data = getUserData(loggedInUser.email) || createFreshUserData(loggedInUser.studyMode);
    setUserDataState(data);
    setScreen("app");
  };

  const handleLogout = () => {
    setUser(null);
    setUserDataState(null);
    setTab("dashboard");
    setScreen("landing");
  };

  const handleUpgrade = (plan = "monthly") => setPaymentPlan(plan);

  const handlePaymentSuccess = () => {
    setUser((u) => ({ ...u, isPremium: true, plan: paymentPlan }));
    setPaymentPlan(null);
  };

  // ── LANDING ──────────────────────────────────────────
  if (screen === "landing") {
    return (
      <Landing
        onStart={(mode) => {
          setAuthMode(mode);
          setScreen("auth");
        }}
      />
    );
  }

  // ── AUTH ─────────────────────────────────────────────
  if (screen === "auth") {
    return (
      <AuthPage
        mode={authMode}
        onAuth={handleAuth}
        onSwitch={(mode) => setAuthMode(mode)}
        onBack={() => setScreen("landing")}
      />
    );
  }

  // ── MAIN APP ─────────────────────────────────────────
  const renderTab = () => {
    switch (tab) {
      case "study":
        return <StudyTracker user={user} userData={userData} updateUserData={updateUserData} />;
      case "settings":
        return <SettingsTab user={user} userData={userData} updateUserData={updateUserData} onUpgrade={handleUpgrade} onLogout={handleLogout} setUser={setUser} />;
      case "goals":
        return <Goals user={user} userData={userData} updateUserData={updateUserData} setUser={setUser} />;
      case "concepts":
        return <Concepts user={user} userData={userData} updateUserData={updateUserData} />;
      case "test":
        return <MockTest user={user} userData={userData} updateUserData={updateUserData} isPremium={user.isPremium} onUpgrade={handleUpgrade} />;
      case "chat":
        return <AIMentor user={user} userData={userData} />;
      case "habits":
        return <Habits userData={userData} updateUserData={updateUserData} />;
      case "leaderboard":
        return <Leaderboard user={user} userData={userData} />;
      case "interview":
        return <InterviewResources user={user} />;
      default:
        return <Dashboard user={user} userData={userData} onUpgrade={handleUpgrade} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#04091a" }}>
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
        style={{ position: "fixed", top: 16, left: 16, zIndex: 20, background: "#0d1629", border: "1px solid #1e2d4a", borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: "white", display: "none" }}
      >
        ☰
      </button>

      <Sidebar tab={tab} setTab={setTab} user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onUpgrade={handleUpgrade} />

      <div className="main-content" style={{ marginLeft: 240, flex: 1, padding: 24, minHeight: "100vh" }}>
        {renderTab()}
      </div>

      {paymentPlan && (
        <PaymentModal plan={paymentPlan} onClose={() => setPaymentPlan(null)} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
}

export default App;