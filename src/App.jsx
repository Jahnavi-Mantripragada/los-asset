import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import ApplicationOnboardingPage from "./pages/application/ApplicationOnboardingPage";
import "./styles/theme.css";
import "./index.css";

const initialLeads = [
  {
    id: "LD-10021",
    firstName: "Rahul",
    lastName: "Sharma",
    mobile: "9876543210",
    product: "Home Loan",
    source: "Website",
    status: "New",
    owner: "Amit Singh",
    createdDate: "04 May 2026",
  },
  {
    id: "LD-10022",
    firstName: "Priya",
    lastName: "Mehta",
    mobile: "9876501234",
    product: "Loan Against Property",
    source: "Mobile App",
    status: "In Progress",
    owner: "Neha Jain",
    createdDate: "04 May 2026",
  },
  {
    id: "LD-10023",
    firstName: "Amit",
    lastName: "Verma",
    mobile: "9988776655",
    product: "Working Capital",
    source: "Branch Walk-in",
    status: "Converted",
    owner: "Rohan Mehta",
    createdDate: "03 May 2026",
  },
  {
    id: "LD-10024",
    firstName: "Sneha",
    lastName: "Iyer",
    mobile: "9123456780",
    product: "Home Loan",
    source: "Digital Aggregator",
    status: "Disqualified",
    owner: "Contact Center",
    createdDate: "03 May 2026",
  },
  {
    id: "LD-10025",
    firstName: "Vikram",
    lastName: "Rao",
    mobile: "9090909090",
    product: "Business Loan",
    source: "Outbound Call",
    status: "New",
    owner: "Contact Center",
    createdDate: "02 May 2026",
  },
];

function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leads, setLeads] = useState(initialLeads);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleCreateLead = (newLead) => {
    setLeads((previousLeads) => [newLead, ...previousLeads]);
    return newLead.id;
  };

  const handleConvertLead = (lead) => {
    setLeads((previousLeads) =>
      previousLeads.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              status: "Converted",
            }
          : item
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <DashboardPage
                leads={leads}
                onCreateLead={handleCreateLead}
                onLogout={handleLogout}
              />
            </PrivateRoute>
          }
        />

        {/* Lead Detail */}
        <Route
          path="/leads/:leadId"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <LeadDetailPage
                leads={leads}
                onLogout={handleLogout}
                onConvertLead={handleConvertLead}
              />
            </PrivateRoute>
          }
        />

        {/* Application Onboarding */}
        <Route
          path="/applications/:leadId/onboarding"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ApplicationOnboardingPage
                leads={leads}
                onLogout={handleLogout}
              />
            </PrivateRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
