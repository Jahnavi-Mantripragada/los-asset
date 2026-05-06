import { useState } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [leads, setLeads] = useState(initialLeads);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
    setSelectedLead(null);
    setSelectedApplication(null);
  };

  const handleOpenLeadDetails = (lead) => {
    setSelectedLead(lead);
    setSelectedApplication(null);
    setCurrentPage("leadDetail");
  };

  const handleBackToDashboard = () => {
    setCurrentPage("dashboard");
    setSelectedLead(null);
    setSelectedApplication(null);
  };

  const handleCreateLead = (newLead) => {
    setLeads((previousLeads) => [newLead, ...previousLeads]);
    setSelectedLead(newLead);
    setSelectedApplication(null);
    setCurrentPage("leadDetail");
  };

  const handleConvertLead = (lead) => {
    const application = {
      id: `APP-${lead.id.replace("LD-", "")}`,
      leadId: lead.id,
      applicantName: `${lead.firstName} ${lead.lastName}`,
      mobile: lead.mobile,
      product: lead.product,
      source: lead.source,
      owner: lead.owner,
      requestedAmount: "₹42,00,000",
      status: "Application In Progress",
      createdDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

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

    setSelectedLead({
      ...lead,
      status: "Converted",
    });

    setSelectedApplication(application);
    setCurrentPage("applicationOnboarding");
  };

  const handleBackToLeadDetail = () => {
    setCurrentPage("leadDetail");
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === "applicationOnboarding" && selectedApplication) {
    return (
      <ApplicationOnboardingPage
        application={selectedApplication}
        lead={selectedLead}
        onBack={handleBackToLeadDetail}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "leadDetail" && selectedLead) {
    return (
      <LeadDetailPage
        key={selectedLead.id}
        lead={selectedLead}
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
        onConvertLead={handleConvertLead}
      />
    );
  }

  return (
    <DashboardPage
      leads={leads}
      onCreateLead={handleCreateLead}
      onLogout={handleLogout}
      onOpenLeadDetails={handleOpenLeadDetails}
    />
  );
}

export default App;
