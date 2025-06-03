import { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import AwardsPage from "./components/AwardsPage";
import VotingPage from "./components/VotingPage";

type PageState = "landing" | "login" | "awards" | "voting";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>("landing");
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const handleNavigateToLogin = () => {
    setCurrentPage("login");
  };

  const handleNavigateToVoting = () => {
    if (userAddress) {
      setCurrentPage("voting");
    } else {
      setCurrentPage("login");
    }
  };

  const handleLogin = (address: string) => {
    setUserAddress(address);
    setCurrentPage("awards");
  };

  const handleLogout = () => {
    setUserAddress(null);
    setCurrentPage("landing");
  };

  const handleBackToLanding = () => {
    setCurrentPage("landing");
  };

  const handleBackToAwards = () => {
    setCurrentPage("awards");
  };

  // Render current page
  switch (currentPage) {
    case "login":
      return (
        <LoginPage 
          onLogin={handleLogin}
          onBack={handleBackToLanding}
        />
      );
    
    case "awards":
      return userAddress ? (
        <AwardsPage 
          userAddress={userAddress}
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage 
          onLogin={handleLogin}
          onBack={handleBackToLanding}
        />
      );
    
    case "voting":
      return userAddress ? (
        <VotingPage 
          onNavigateToLanding={handleBackToAwards}
        />
      ) : (
        <LoginPage 
          onLogin={handleLogin}
          onBack={handleBackToLanding}
        />
      );
    
    default:
      return (
        <LandingPage 
          onNavigateToVoting={handleNavigateToLogin}
        />
      );
  }
}
