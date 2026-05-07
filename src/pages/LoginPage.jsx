import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "aws-amplify/auth";
import "./LoginPage.css";

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = formData.username.trim();
    const password = formData.password;

    if (!username || !password) {
      setErrorMessage("Please enter both user ID/email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const result = await signIn({
        username,
        password,
      });

      if (result.isSignedIn) {
        await onLoginSuccess();
        navigate("/dashboard", { replace: true });
        return;
      }

      if (result.nextStep?.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED") {
        setErrorMessage(
          "This user requires a new password setup. Set a permanent password in Cognito or implement the new-password flow."
        );
        return;
      }

      setErrorMessage(
        `Additional sign-in step required: ${result.nextStep?.signInStep || "Unknown step"}`
      );
    } catch (error) {
      console.error("Cognito login failed:", error);
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      {/* ── LEFT BRAND PANEL ── */}
      <section className="login-brand-panel">
        <div className="brand-grid-overlay" />
        <div className="background-orb orb-one" />
        <div className="background-orb orb-two" />
        <div className="background-orb orb-three" />

        <div className="brand-header">
          <div className="brand-logo">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="1" y="7" width="24" height="15" rx="3" stroke="white" strokeWidth="1.8" />
              <path d="M1 11h24" stroke="white" strokeWidth="1.8" />
              <path d="M5 15h4M5 18h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 7V5a6 6 0 0 1 12 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1>Digital Lending Platform</h1>
            <p>Loan Origination System</p>
          </div>
        </div>

        <div className="brand-hero">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Secure Digital Lending Workspace
          </span>
          <h2>
            Built for faster, smarter, and more controlled loan origination.
          </h2>
          <p>
            Manage leads, applicants, documents, verifications, approvals, and
            loan applications through a unified workspace designed for modern
            lending teams.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Role-based secure access across business teams</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Unified view of leads, applications, customers, and documents</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p>Designed for sales, contact center, credit, and operations</p>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <div className="brand-footer-item">
            <span className="footer-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <strong>Enterprise-grade</strong>
              <span>Access, auditability, and workflow control</span>
            </div>
          </div>
          <div className="brand-footer-item">
            <span className="footer-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 8.5 7 10l3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <strong>AI-ready</strong>
              <span>Prepared for intelligent lending assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RIGHT FORM PANEL ── */}
      <section className="login-form-panel">
        <div className="form-background-ring" />
        <div className="form-background-ring-2" />

        <div className="login-card">
          <div className="login-card-header">
            <span className="login-badge">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1" y="4.5" width="9" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                <path d="M3.5 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Secure Login
            </span>
            <h2>Welcome back</h2>
            <p>Sign in to continue to your Digital Lending workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="login-error-message" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">User ID / Email</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M2 13.5c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your user ID or email"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <button type="button" className="link-button">
                  Forgot password?
                </button>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" disabled={isSubmitting} />
                <span>Remember me</span>
              </label>
              <span className="secure-note">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1 L9.5 2.5 V5.5 C9.5 7.8 7.5 9.8 5.5 10.5 C3.5 9.8 1.5 7.8 1.5 5.5 V2.5 Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                </svg>
                Protected workspace
              </span>
            </div>

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
              {!isSubmitting && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              By signing in, you agree to follow your organization's security
              and data access policies.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;