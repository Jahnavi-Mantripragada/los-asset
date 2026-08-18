import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./ConsentLandingPage.css";
import {
  normaliseIndianWhatsAppNumber,
  sendWhatsAppMessage,
} from "../services/whatsAppService";

const OTP_LENGTH = 6;
const OTP_STORAGE_PREFIX = "yesbank-gold-loan-consent";
const OTP_VALIDITY_MINUTES = 10;

const Icon = ({ children, size = 18, className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const CheckIcon = ({ size = 16 }) => (
  <Icon size={size}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

const ShieldIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-5" />
  </Icon>
);

const MessageIcon = ({ size = 18 }) => (
  <Icon size={size}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
  </Icon>
);

const Spinner = ({ size = 16 }) => (
  <Icon className="consent-page-spinner" size={size}>
    <path d="M21 12a9 9 0 1 1-6.22-8.56" />
  </Icon>
);

const digitsOnly = (value) => String(value || "").replace(/\D/g, "");

const maskMobile = (mobile) => {
  const digits = digitsOnly(mobile).slice(-10);
  return digits ? `+91 XXXXX ${digits.slice(-5)}` : "Not available";
};

const maskEmail = (email) => {
  const trimmed = String(email || "").trim();
  if (!trimmed || !trimmed.includes("@")) return "Not available";

  const [name, domain] = trimmed.split("@");
  return `${name.slice(0, 2)}${"•".repeat(Math.max(name.length - 2, 3))}@${domain}`;
};

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const formatTimestamp = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const buildOtpMessage = ({ customerName, otp }) => {
  const salutation = customerName ? `Dear ${customerName},` : "Dear Customer,";
  return `${salutation}

Your YES BANK Gold Loan consent verification code is ${otp}.

Please enter this 6-digit OTP to confirm your consent. This code is valid for ${OTP_VALIDITY_MINUTES} minutes.

Do not share this code with anyone.`;
};

const getInitialOtpSessionState = (storageKey) => {
  const defaultState = {
    currentStep: "terms",
    otpMetadata: {
      sentAt: "",
      expiresAt: "",
      verifiedAt: "",
    },
  };

  if (typeof window === "undefined") return defaultState;

  const savedValue = window.sessionStorage.getItem(storageKey);
  if (!savedValue) return defaultState;

  try {
    const saved = JSON.parse(savedValue);

    if (saved.verifiedAt) {
      return {
        currentStep: "success",
        otpMetadata: {
          sentAt: saved.sentAt || "",
          expiresAt: saved.expiresAt || "",
          verifiedAt: saved.verifiedAt || "",
        },
      };
    }

    if (saved.expiresAt && new Date(saved.expiresAt).getTime() > Date.now()) {
      return {
        currentStep: "otp",
        otpMetadata: {
          sentAt: saved.sentAt || "",
          expiresAt: saved.expiresAt || "",
          verifiedAt: "",
        },
      };
    }

    window.sessionStorage.removeItem(storageKey);
    return defaultState;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return defaultState;
  }
};

function ConsentLandingPage() {
  const [searchParams] = useSearchParams();
  const otpInputsRef = useRef([]);

  const leadId = searchParams.get("leadId") || "";
  const applicationId = searchParams.get("applicationId") || "";
  const customerName = searchParams.get("name") || "Gold Loan Customer";
  const mobile = searchParams.get("mobile") || "";
  const email = searchParams.get("email") || "";
  const requestReference = searchParams.get("requestReference") || "";
  const targetPhoneNumber = normaliseIndianWhatsAppNumber(mobile);

  const otpStorageKey = `${OTP_STORAGE_PREFIX}:${leadId || applicationId || digitsOnly(mobile) || "guest"}`;
  const [initialOtpState] = useState(() =>
    getInitialOtpSessionState(otpStorageKey),
  );

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPii, setAgreedPii] = useState(false);
  const [agreedCibil, setAgreedCibil] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(
    initialOtpState.currentStep,
  );
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpMetadata, setOtpMetadata] = useState(
    initialOtpState.otpMetadata,
  );
  const activeStepNumber =
    currentStep === "terms" ? "STEP 1" : currentStep === "otp" ? "STEP 2" : "STEP 3";
  const activeStepTitle =
    currentStep === "terms"
      ? "Terms and declarations"
      : currentStep === "otp"
        ? "OTP verification"
        : "Consent recorded";
  const activeStepPill =
    currentStep === "terms"
      ? "In progress"
      : currentStep === "otp"
        ? "Verification pending"
        : "Completed";

  const leadSummary = [
    { label: "Lead ID", value: leadId || "Not available" },
    {
      label: "Application",
      value: applicationId || "Will be linked after capture",
    },
    { label: "Customer", value: customerName },
    { label: "Mobile", value: maskMobile(mobile) },
    { label: "Email", value: maskEmail(email) },
    {
      label: "Reference",
      value: requestReference || "Generated from consent request",
    },
  ];

  const persistOtpSession = ({ otp, sentAt, expiresAt, verifiedAt = "" }) => {
    window.sessionStorage.setItem(
      otpStorageKey,
      JSON.stringify({
        otp,
        sentAt,
        expiresAt,
        verifiedAt,
      }),
    );
  };

  const readOtpSession = () => {
    const raw = window.sessionStorage.getItem(otpStorageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const sendOtp = async () => {
    if (!targetPhoneNumber) {
      setValidationError(
        "A valid mobile number is required to send the consent verification code.",
      );
      return;
    }

    try {
      setOtpSending(true);
      setValidationError("");
      setOtpError("");
      setOtpSuccess("");

      const otp = generateOtp();
      const now = new Date();
      const sentAtIso = now.toISOString();
      const expiresAtIso = new Date(
        now.getTime() + OTP_VALIDITY_MINUTES * 60 * 1000,
      ).toISOString();

      await sendWhatsAppMessage({
        targetPhoneNumber,
        messageBody: buildOtpMessage({ customerName, otp }),
      });

      persistOtpSession({
        otp,
        sentAt: sentAtIso,
        expiresAt: expiresAtIso,
      });
      setOtpMetadata({
        sentAt: sentAtIso,
        expiresAt: expiresAtIso,
        verifiedAt: "",
      });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setCurrentStep("otp");
      setOtpSuccess(
        `A 6-digit verification code has been sent to ${maskMobile(mobile)} on WhatsApp.`,
      );
      window.setTimeout(() => otpInputsRef.current[0]?.focus(), 50);
    } catch (error) {
      setValidationError(
        error.message || "Unable to send the consent verification code.",
      );
    } finally {
      setOtpSending(false);
    }
  };

  const handleContinue = async () => {
    if (!agreedTerms || !agreedPii || !agreedCibil) {
      setValidationError(
        "Please review the consent statements and select all required checkboxes before continuing.",
      );
      return;
    }

    await sendOtp();
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpError("");
    setOtpSuccess("");
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    const pastedDigits = digitsOnly(event.clipboardData.getData("text")).slice(
      0,
      OTP_LENGTH,
    );
    if (!pastedDigits) return;

    event.preventDefault();
    const nextDigits = Array(OTP_LENGTH)
      .fill("")
      .map((_, index) => pastedDigits[index] || "");
    setOtpDigits(nextDigits);
    const nextFocusIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);
    otpInputsRef.current[nextFocusIndex]?.focus();
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otpDigits.join("");
    const saved = readOtpSession();

    setOtpVerifying(true);
    setOtpError("");
    setOtpSuccess("");

    window.setTimeout(() => {
      if (!saved?.otp || !saved?.expiresAt) {
        setOtpError("Verification session not found. Please request a new OTP.");
        setOtpVerifying(false);
        return;
      }

      if (new Date(saved.expiresAt).getTime() <= Date.now()) {
        window.sessionStorage.removeItem(otpStorageKey);
        setOtpError("This OTP has expired. Please request a new verification code.");
        setOtpVerifying(false);
        return;
      }

      if (!/^\d{6}$/.test(enteredOtp)) {
        setOtpError("Enter the complete 6-digit verification code.");
        setOtpVerifying(false);
        return;
      }

      if (enteredOtp !== saved.otp) {
        setOtpError("The verification code is incorrect. Please try again.");
        setOtpVerifying(false);
        return;
      }

      const verifiedAt = new Date().toISOString();
      persistOtpSession({
        otp: saved.otp,
        sentAt: saved.sentAt,
        expiresAt: saved.expiresAt,
        verifiedAt,
      });
      setOtpMetadata({
        sentAt: saved.sentAt,
        expiresAt: saved.expiresAt,
        verifiedAt,
      });
      setCurrentStep("success");
      setOtpSuccess("Consent captured successfully.");
      setOtpVerifying(false);
    }, 500);
  };

  return (
    <div className="consent-page">
      <header className="consent-page__topbar">
        <div className="consent-page__topbar-left">
          <img
            className="consent-page__logo"
            src="/images/yes-bank-logo-dark-bg.png"
            alt="YES BANK"
          />
          <span className="consent-page__divider" />
          <div>
            <h1>Gold Loan Consent Verification</h1>
            <p>Secure customer approval and OTP confirmation</p>
          </div>
        </div>
        <span className="consent-page__product-pill">
          <ShieldIcon size={15} /> Gold Loan
        </span>
      </header>

      <section className="consent-page__summary-strip">
        {leadSummary.map((item) => (
          <div className="consent-page__summary-item" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </section>

      <main className="consent-page__shell">
        <section className="consent-page__hero">
          <div className="consent-page__hero-copy">
            <span className="consent-page__eyebrow">
              YES BANK GOLD LOAN
            </span>
            <h2>Review the consent summary and verify your approval securely.</h2>
            <p>
              This consent allows YES BANK to proceed with your gold loan
              application, use the details required for KYC and eligibility
              checks, and contact you for updates on this request.
            </p>

            <div className="consent-page__hero-badges">
              <span>
                <CheckIcon size={13} /> Secure WhatsApp verification
              </span>
              <span>
                <CheckIcon size={13} /> OTP-based customer confirmation
              </span>
              <span>
                <CheckIcon size={13} /> YES BANK branding and policy alignment
              </span>
            </div>
          </div>

          <aside className="consent-page__status-card">
            <span className="consent-page__status-label">Journey status</span>
            <strong>
              {currentStep === "terms"
                ? "Awaiting consent review"
                : currentStep === "otp"
                  ? "OTP verification pending"
                  : "Consent completed"}
            </strong>
            <p>
              {currentStep === "success"
                ? `Verified on ${formatTimestamp(otpMetadata.verifiedAt)}`
                : "This step must be completed before the maker proceeds with the application."}
            </p>
          </aside>
        </section>

        <section className="consent-page__content-grid">
          <div className="consent-page__main-card">
            <div className="consent-page__card-head">
              <div>
                <span>{activeStepNumber}</span>
                <h3>{activeStepTitle}</h3>
              </div>
              <span className="consent-page__step-pill">
                {activeStepPill}
              </span>
            </div>

            {currentStep === "terms" ? (
              <>
                <div className="consent-page__terms-block">
                  <h4>What this consent covers</h4>
                  <ul>
                    <li>Processing your YES BANK Gold Loan request and servicing updates.</li>
                    <li>Retrieving KYC and relationship information needed for verification.</li>
                    <li>Running internal eligibility and fraud-prevention checks.</li>
                    <li>Pulling bureau data where the product policy requires a CIC/CIBIL check.</li>
                    <li>Contacting you through phone, SMS, email or WhatsApp for this application.</li>
                  </ul>
                </div>

                <div className="consent-page__checkbox-stack">
                  <label className="consent-page__checkbox-row">
                    <input
                      checked={agreedTerms}
                      onChange={(event) => setAgreedTerms(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      I have read and agree to the Terms & Conditions for the YES BANK
                      Gold Loan application journey.
                    </span>
                  </label>

                  <label className="consent-page__checkbox-row">
                    <input
                      checked={agreedPii}
                      onChange={(event) => setAgreedPii(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      I consent to YES BANK collecting, using and storing my personal
                      and KYC-related information for this application.
                    </span>
                  </label>

                  <label className="consent-page__checkbox-row">
                    <input
                      checked={agreedCibil}
                      onChange={(event) => setAgreedCibil(event.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      I authorize YES BANK to obtain my bureau report and score if a
                      CIC/CIBIL check is applicable to this request.
                    </span>
                  </label>
                </div>

                {validationError && (
                  <div className="consent-page__inline-alert error" role="alert">
                    {validationError}
                  </div>
                )}

                <div className="consent-page__actions">
                  <button
                    className="consent-page__primary-button"
                    disabled={otpSending || currentStep === "success"}
                    onClick={handleContinue}
                    type="button"
                  >
                    {otpSending ? (
                      <>
                        <Spinner /> Sending verification code...
                      </>
                    ) : (
                      <>
                        <MessageIcon size={16} /> Agree and continue
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : currentStep === "otp" ? (
              <>
                <p className="consent-page__otp-copy">
                  Enter the verification code sent to <strong>{maskMobile(mobile)}</strong>.
                  The code is valid until{" "}
                  <strong>{otpMetadata.expiresAt ? formatTimestamp(otpMetadata.expiresAt) : "the session expires"}</strong>.
                </p>

                {otpSuccess && (
                  <div className="consent-page__inline-alert success" role="status">
                    {otpSuccess}
                  </div>
                )}

                {otpError && (
                  <div className="consent-page__inline-alert error" role="alert">
                    {otpError}
                  </div>
                )}

                <div className="consent-page__otp-inputs" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        otpInputsRef.current[index] = node;
                      }}
                      className="consent-page__otp-box"
                      inputMode="numeric"
                      maxLength={1}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      type="text"
                      value={digit}
                    />
                  ))}
                </div>

                <div className="consent-page__otp-actions">
                  <button
                    className="consent-page__secondary-button"
                    disabled={otpSending}
                    onClick={sendOtp}
                    type="button"
                  >
                    {otpSending ? (
                      <>
                        <Spinner /> Resending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                  <button
                    className="consent-page__primary-button"
                    disabled={otpVerifying}
                    onClick={handleVerifyOtp}
                    type="button"
                  >
                    {otpVerifying ? (
                      <>
                        <Spinner /> Verifying...
                      </>
                    ) : (
                      "Verify and capture consent"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="consent-page__success-panel consent-page__success-panel--full">
                <span className="consent-page__success-mark">
                  <CheckIcon size={20} />
                </span>
                <div>
                  <strong>Consent captured successfully</strong>
                  <p>
                    YES BANK has recorded the customer approval for the Gold Loan
                    application journey.
                  </p>
                  <small>
                    Verified on{" "}
                    {otpMetadata.verifiedAt
                      ? formatTimestamp(otpMetadata.verifiedAt)
                      : "today"}
                  </small>
                </div>
              </div>
            )}
          </div>

          <aside className="consent-page__side-card">
            <div className="consent-page__card-head compact">
              <div>
                <span>REFERENCE</span>
                <h3>Verification checkpoints</h3>
              </div>
            </div>

            <div className="consent-page__checkpoint-list">
              <div className={currentStep !== "terms" ? "complete" : "active"}>
                <span>01</span>
                <div>
                  <strong>Review declarations</strong>
                  <small>All required consent statements must be accepted.</small>
                </div>
              </div>
              <div className={currentStep === "success" ? "complete" : currentStep === "otp" ? "active" : ""}>
                <span>02</span>
                <div>
                  <strong>Verify OTP</strong>
                  <small>Enter the 6-digit code delivered on WhatsApp.</small>
                </div>
              </div>
              <div className={currentStep === "success" ? "complete" : ""}>
                <span>03</span>
                <div>
                  <strong>Consent recorded</strong>
                  <small>Customer approval is confirmed for the gold loan journey.</small>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default ConsentLandingPage;
