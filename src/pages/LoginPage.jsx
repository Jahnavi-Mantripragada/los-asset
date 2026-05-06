import { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    console.log("Login submitted", formData);

    onLoginSuccess();
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="background-orb orb-one"></div>
        <div className="background-orb orb-two"></div>
        <div className="background-orb orb-three"></div>

        <div className="brand-header">
          <div className="brand-logo">
            <span>LOS</span>
          </div>

          <div>
            <h1>Loan Origination System</h1>
            <p>Enterprise lending platform</p>
          </div>
        </div>

        <div className="brand-hero">
          <span className="eyebrow">Secure Digital Lending Workspace</span>

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
              <span className="feature-icon">✓</span>
              <p>Role-based secure access across business teams</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>Unified view of leads, applications, customers, and documents</p>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <p>Designed for sales, contact center, credit, and operations</p>
            </div>
          </div>
        </div>

        <div className="brand-footer">
          <div>
            <strong>Enterprise-grade</strong>
            <span>Access, auditability, and workflow control</span>
          </div>

          <div>
            <strong>AI-ready</strong>
            <span>Prepared for intelligent lending assistance</span>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="form-background-ring"></div>

        <div className="login-card">
          <div className="login-card-header">
            <span className="login-badge">Secure Login</span>

            <h2>Welcome back</h2>

            <p>Sign in to continue to your LOS workspace.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">User ID / Email</label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your user ID or email"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>

                <button type="button" className="link-button">
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <span className="secure-note">Protected workspace</span>
            </div>

            <button type="submit" className="login-button">
              Sign In
              <span>→</span>
            </button>
          </form>

          <div className="login-footer">
            <p>
              By signing in, you agree to follow your organization&apos;s
              security and data access policies.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;