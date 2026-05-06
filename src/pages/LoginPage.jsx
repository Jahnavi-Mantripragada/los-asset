import { useState } from "react";
import "./LoginPage.css";

function LoginPage({ onLoginSuccess }) {  const [formData, setFormData] = useState({
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
      <section className="login-left-panel">
        <div className="brand-block">
          <div className="brand-logo">LOS</div>
          <div>
            <h1>Loan Origination System</h1>
            <p>Enterprise lending platform for lead and loan application management</p>
          </div>
        </div>

        <div className="hero-content">
          <span className="eyebrow">Custom LOS Platform</span>

          <h2>
            Manage leads, applications, documents, and approvals from one secure workspace.
          </h2>

          <p>
            Designed for sales, contact center, credit, verification, and operations teams
            to work together across the loan origination lifecycle.
          </p>

          <div className="hero-metrics">
            <div>
              <strong>360°</strong>
              <span>Customer View</span>
            </div>

            <div>
              <strong>24x7</strong>
              <span>Digital Access</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Ready Platform</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-right-panel">
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
              />
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <p>
              By signing in, you agree to follow your organization&apos;s security
              and data access policies.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;