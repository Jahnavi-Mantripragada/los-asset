import { useEffect, useRef } from "react";
import "./CustomerDetailsPanel.css";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const firstPresent = (...values) => values.find(hasValue) || "";

const maskAccountNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : "";
};

const getInitials = (name) =>
  String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "C";

const formatINR = (value) =>
  hasValue(value) && Number.isFinite(Number(value))
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(value))
    : "—";

// CBS dates arrive as yyyymmdd; 1800/1950 dates are "not set" placeholders.
const formatCbsDate = (value) => {
  const text = String(value || "");
  if (!/^\d{8}$/.test(text) || text.startsWith("18") || text.startsWith("1950")) return "";
  const date = new Date(`${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const STANDING_FLAGS = [
  { key: "flgBlacklisted", label: "Blacklisted", risk: true },
  { key: "flgBlocked", label: "Blocked", risk: true },
  { key: "flgDeceased", label: "Deceased", risk: true },
  { key: "flgSuspended", label: "Suspended", risk: true },
  { key: "flgRestrictedCust", label: "Restricted customer", risk: true },
  { key: "flgROIConcession", label: "ROI concession", risk: false },
];

const buildCustomer360View = (customer360) => {
  if (!customer360) return null;
  const basic = customer360.customerResponse?.xfaceCustomerBasicInquiryDTO || {};
  const accounts = customer360.xfaceCustomerAccountDetailsDTO || {};

  return {
    basic,
    loans: accounts.xfaceAccountDetailsforCustomerDTO || [],
    casa: accounts.xfaceCasaAccountDTO || [],
    overdrafts: accounts.xfaceODDetailsDTO || [],
    gold: customer360.xfaceExtGoldAllCaratWiseDTO || [],
  };
};

const buildProfile = (lead, relationshipType) => {
  const details =
    lead?.leadDetails && typeof lead.leadDetails === "object" ? lead.leadDetails : {};
  const identity = details.customerIdentity || {};
  const matched = identity.matchedCustomer || {};
  const borrower = details.borrowerInformation || {};
  const borrowerDetails = borrower.details || {};
  const consent = details.customerConsent || details.customerIdentityStep?.consent || {};
  const customerType = firstPresent(identity.customerType, relationshipType);

  return {
    customerType,
    customerId: firstPresent(
      matched.customerId,
      customerType === "NTB" ? "Created during onboarding" : "",
    ),
    dateOfBirth: firstPresent(borrowerDetails.dateOfBirth, matched.dateOfBirth),
    gender: firstPresent(borrowerDetails.gender, matched.gender),
    mobile: firstPresent(borrowerDetails.mobile, matched.mobile, lead?.mobile),
    email: firstPresent(borrowerDetails.email, matched.email, lead?.email),
    pan: firstPresent(borrowerDetails.pan, matched.pan),
    aadhaarLast4: firstPresent(
      borrower.aadhaar?.last4,
      borrowerDetails.aadhaarLast4,
      matched.aadhaarLast4,
    ),
    casaNumber: matched.casaNumber || "",
    customer360: buildCustomer360View(matched.customer360),
    homeBranch: matched.homeBranch || "",
    kycStatus: firstPresent(matched.kycStatus, borrower.status),
    kycUpdatedAt: matched.kycUpdatedAt || "",
    ckycNumber: matched.ckycNumber || "",
    riskCategory: matched.riskCategory || "",
    consentStatus: consent.status || "",
    consentReference: consent.requestReference || "",
    address: [
      firstPresent(borrowerDetails.addressLine1, matched.addressLine1),
      firstPresent(borrowerDetails.addressLine2, matched.addressLine2),
      firstPresent(borrowerDetails.city, matched.city),
      firstPresent(borrowerDetails.state, matched.state),
      firstPresent(borrowerDetails.pincode, matched.pincode),
    ]
      .filter(hasValue)
      .join(", "),
  };
};

const Field = ({ label, value, full = false }) => (
  <div className={`cdp-field${full ? " is-full" : ""}`}>
    <span>{label}</span>
    <strong>{hasValue(value) ? value : "—"}</strong>
  </div>
);

const Card = ({ eyebrow, title, children, stack = false }) => (
  <section className="cdp-card">
    <header className="cdp-card-header">
      <span>{eyebrow}</span>
      <h3>{title}</h3>
    </header>
    <div className={stack ? "cdp-stack" : "cdp-fields"}>{children}</div>
  </section>
);

const AccountRow = ({ title, accountId, stats, meta }) => (
  <div className="cdp-account">
    <div className="cdp-account-main">
      <strong>{title}</strong>
      <span>{maskAccountNumber(accountId)}</span>
    </div>
    <div className="cdp-account-stats">
      {stats.map(([label, value]) => (
        <span key={label}>
          <small>{label}</small>
          <b>{value}</b>
        </span>
      ))}
    </div>
    {meta.length > 0 && <p className="cdp-account-meta">{meta.join(" · ")}</p>}
  </div>
);

const joinMeta = (entries) =>
  entries
    .filter(([, value]) => hasValue(value))
    .map(([label, value]) => `${label} ${value}`.trim());

export default function CustomerDetailsPanel({
  open,
  onClose,
  lead,
  customerName,
  relationshipType,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const profile = buildProfile(lead, relationshipType);
  const maskedCasa = maskAccountNumber(profile.casaNumber);
  const c360 = profile.customer360;

  return (
    <div className="cdp-backdrop" onClick={onClose}>
      <aside
        className="cdp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Customer details"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="cdp-header">
          <div>
            <span className="cdp-eyebrow">Customer profile</span>
            <h2>Customer details</h2>
            <p>Read-only view of the customer linked to this application.</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="cdp-close"
            onClick={onClose}
            aria-label="Close customer details"
          >
            ×
          </button>
        </header>

        <div className="cdp-body">
          <div className="cdp-hero">
            <span className="cdp-avatar" aria-hidden="true">{getInitials(customerName)}</span>
            <div className="cdp-hero-copy">
              <span>{profile.customerType || "Customer"}</span>
              <strong>{customerName}</strong>
              <p>CBS Customer ID · {profile.customerId || "—"}</p>
            </div>
            <div className="cdp-hero-pills">
              {profile.kycStatus && <span className="cdp-pill"><i /> KYC {profile.kycStatus}</span>}
              {profile.consentStatus && <span className="cdp-pill"><i /> Consent {profile.consentStatus}</span>}
            </div>
          </div>

          <Card eyebrow="PERSONAL" title="Personal details">
            <Field label="Full name" value={customerName} />
            <Field label="Date of birth" value={profile.dateOfBirth} />
            <Field label="Gender" value={profile.gender} />
            <Field label="Customer type" value={profile.customerType} />
          </Card>

          <Card eyebrow="CONTACT" title="Contact details">
            <Field label="Mobile" value={profile.mobile} />
            <Field label="Email" value={profile.email} />
            <Field label="Residential address" value={profile.address} full />
          </Card>

          <Card eyebrow="IDENTITY" title="Identity & KYC">
            <Field label="PAN" value={profile.pan} />
            <Field
              label="Aadhaar"
              value={profile.aadhaarLast4 ? `XXXX XXXX ${profile.aadhaarLast4}` : ""}
            />
            <Field label="KYC status" value={profile.kycStatus} />
            <Field label="KYC last updated" value={profile.kycUpdatedAt} />
            <Field label="CKYC number" value={profile.ckycNumber} />
            <Field label="Risk category" value={profile.riskCategory} />
            {profile.consentReference && (
              <Field label="Consent reference" value={profile.consentReference} full />
            )}
          </Card>

          <Card eyebrow="RELATIONSHIP" title="Bank relationship">
            <Field label="CBS Customer ID" value={profile.customerId} />
            <Field label="Home branch" value={profile.homeBranch} />
            <Field label="CASA account" value={maskedCasa} />
          </Card>

          {c360 && (
            <>
              <Card eyebrow="CUSTOMER 360" title="Relationship snapshot">
                <Field label="Customer category" value={c360.basic.categoryType} />
                <Field label="Customer class" value={c360.basic.custType} />
                <Field label="Combined withdrawable balance" value={formatINR(c360.basic.combWithdrawBal)} />
                <Field label="Sanctioned limit" value={formatINR(c360.basic.limitAmount)} />
                <Field label="Receivable amount" value={formatINR(c360.basic.receivableAmt)} />
                <Field label="NPA category" value={c360.basic.npaCategory} />
                <Field label="Mother's maiden name" value={c360.basic.motherMaidenName} />
              </Card>

              <Card eyebrow="CBS STATUS" title="Account standing" stack>
                <div className="cdp-flags">
                  {STANDING_FLAGS.map(({ key, label, risk }) => {
                    const active = c360.basic[key] === "Y";
                    const tone = active ? (risk ? "is-alert" : "is-info") : "is-clear";
                    return (
                      <span className={`cdp-flag ${tone}`} key={key}>
                        {label}
                        <b>{active ? "Yes" : "No"}</b>
                      </span>
                    );
                  })}
                </div>
              </Card>

              {c360.gold.length > 0 && (
                <Card eyebrow="GOLD HOLDINGS" title="Pledged gold by carat" stack>
                  <div className="cdp-table cdp-table-head" aria-hidden="true">
                    <span>Carat</span>
                    <span>Gross (g)</span>
                    <span>Deduction (g)</span>
                    <span>Net (g)</span>
                    <span>Value</span>
                  </div>
                  {c360.gold.map((row) => (
                    <div className="cdp-table" key={row.carat}>
                      <strong>{row.carat}K</strong>
                      <span>{row.grossWeight}</span>
                      <span>{row.deduction}</span>
                      <span>{row.netWeight}</span>
                      <strong>{formatINR(row.totalValue)}</strong>
                    </div>
                  ))}
                </Card>
              )}

              <Card eyebrow="ACCOUNTS" title="Existing accounts" stack>
                {c360.loans.map((loan) => (
                  <AccountRow
                    key={loan.accountId}
                    title={loan.productName}
                    accountId={loan.accountId}
                    stats={[
                      ["Outstanding", formatINR(loan.currentBalance)],
                      ["Sanctioned", formatINR(loan.amtSanction)],
                      ["Max DPD", loan.maxDPD ?? "—"],
                    ]}
                    meta={joinMeta([
                      ["", loan.currentStatusDescription],
                      ["Rate", hasValue(loan.ratInt) ? `${loan.ratInt}%` : ""],
                      ["Tenure", hasValue(loan.tenure) ? `${loan.tenure} months` : ""],
                      ["Opened", formatCbsDate(loan.datAcctOpen)],
                      ["Matures", formatCbsDate(loan.datMaturity)],
                    ])}
                  />
                ))}
                {c360.overdrafts.map((od) => (
                  <AccountRow
                    key={od.accountId}
                    title={od.productName}
                    accountId={od.accountId}
                    stats={[
                      ["Outstanding", formatINR(od.currentBalance)],
                      ["Limit", formatINR(od.limitAmount)],
                      ["Drawing power", formatINR(od.drawingPower)],
                    ]}
                    meta={joinMeta([
                      ["Rate", hasValue(od.ratInt) ? `${od.ratInt}%` : ""],
                      ["Limit expires", formatCbsDate(od.limitExpiryDate)],
                      ["Opened", formatCbsDate(od.datAcctOpen)],
                    ])}
                  />
                ))}
                {c360.casa.map((casa) => (
                  <AccountRow
                    key={casa.accountId}
                    title={casa.productName}
                    accountId={casa.accountId}
                    stats={[["Balance", formatINR(casa.currentBalance)]]}
                    meta={joinMeta([["Opened", formatCbsDate(casa.datAcctOpen)]])}
                  />
                ))}
              </Card>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
