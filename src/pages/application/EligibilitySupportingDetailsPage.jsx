import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./EligibilitySupportingDetailsPage.css";

const LEAD_DETAILS_API_BASE =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";
const SECTION_KEY = "eligibilitySupportingDetails";
const CIBIL_SCORE = 725;
const CIBIL_REPORT_PATH = "/docs/cibil-report.pdf";
const CIBIL_REPORT_NAME = "cibil-report.pdf";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-5" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const INITIAL_LAND_DETAILS = {
  state: "Maharashtra",
  district: "Pune",
  village: "Mulshi",
  surveyNumber: "114/2A",
  season: "Kharif",
  crop: "Soybean",
  extentAcres: "2.4",
  estimatedCostPerAcre: "38000",
  isLandOwner: "Yes",
  recordType: "Record of Rights",
};

const emptyDocument = () => ({
  name: "",
  type: "",
  size: 0,
  uploadedAt: "",
});

const getLeadDetails = (lead) => {
  if (!lead?.leadDetails) return {};
  if (typeof lead.leadDetails === "object") return lead.leadDetails;

  try {
    return JSON.parse(lead.leadDetails);
  } catch {
    return {};
  }
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDateTime = () =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

const maskAccountNumber = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "XXXX XXXX 4821";
  if (/x|\*/i.test(raw)) return raw;

  const digits = raw.replace(/\D/g, "");
  return digits.length >= 4 ? `XXXX XXXX ${digits.slice(-4)}` : "XXXX XXXX 4821";
};

const isConsentCaptured = (status) =>
  /captured|verified|completed|accepted/i.test(String(status || ""));

const hasRequiredLandData = (land) => {
  const requiredFields = [
    "state",
    "district",
    "village",
    "surveyNumber",
    "season",
    "crop",
    "extentAcres",
    "estimatedCostPerAcre",
    "isLandOwner",
    "recordType",
  ];

  return (
    requiredFields.every((field) => String(land?.[field] || "").trim()) &&
    Number(land?.extentAcres) > 0 &&
    Number(land?.estimatedCostPerAcre) > 0
  );
};

const getStepCompletion = (step) => {
  const cibilComplete =
    !step.cibil.required || step.cibil.status === "Completed";
  const landComplete =
    !step.land.required ||
    (hasRequiredLandData(step.land.details) &&
      Boolean(step.land.documents.landRecord?.name));

  return cibilComplete && landComplete;
};

const normalizeStep = ({ existing = {}, cibilRequired, landRequired, leadDetails }) => {
  const identity = leadDetails.customerIdentity || {};
  const facility = leadDetails.facilityBranchLoanDetails || {};
  const consentStatus =
    identity.consentStatus || existing.cibil?.consentStatus || "Not Captured";
  const accountValue =
    facility.accountDetails?.chargesDeductionAccountMasked ||
    facility.accountDetails?.casaAccountMasked ||
    facility.accounts?.chargesDeductionAccount?.maskedAccountNumber ||
    facility.chargesDeductionAccount?.accountNumber ||
    facility.casaAccount?.accountNumber ||
    identity.chargesAccountMasked;

  const cibil = {
    required: cibilRequired,
    triggerSource:
      "facilityBranchLoanDetails.exposure.cibilRequired",
    consentStatus,
    consentReference:
      identity.consentReferenceNumber ||
      identity.consentReference ||
      existing.cibil?.consentReference ||
      "",
    consentCapturedAt:
      identity.consentCapturedAt || existing.cibil?.consentCapturedAt || "",
    chargesAccountMasked:
      existing.cibil?.chargesAccountMasked || maskAccountNumber(accountValue),
    chargeAmount: Number(existing.cibil?.chargeAmount ?? 35),
    chargeConfirmationStatus:
      existing.cibil?.chargeConfirmationStatus || "Not Confirmed",
    status: cibilRequired
      ? existing.cibil?.status === "Not Required"
        ? isConsentCaptured(consentStatus)
          ? "Consent Available"
          : "Consent Required"
        : existing.cibil?.status ||
          (isConsentCaptured(consentStatus) ? "Consent Available" : "Consent Required")
      : "Not Required",
    score: existing.cibil?.score || "",
    reportName: existing.cibil?.reportName || "",
    reportPath: existing.cibil?.reportPath || "",
    fetchedAt: existing.cibil?.fetchedAt || "",
    assessmentOutcome: existing.cibil?.assessmentOutcome || "",
    errorMessage: existing.cibil?.errorMessage || "",
  };

  const land = {
    required: landRequired,
    triggerSource:
      "facilityBranchLoanDetails.exposure.landDetailsRequired",
    status: landRequired ? existing.land?.status || "Pending" : "Not Required",
    details: {
      ...INITIAL_LAND_DETAILS,
      ...(existing.land?.details || {}),
    },
    documents: {
      landRecord: {
        ...emptyDocument(),
        ...(existing.land?.documents?.landRecord || {}),
      },
      additionalDocument: {
        ...emptyDocument(),
        ...(existing.land?.documents?.additionalDocument || {}),
      },
    },
  };

  const normalized = {
    version: 1,
    cibil,
    land,
    stepStatus: "In Progress",
    initializedAt: existing.initializedAt || formatDateTime(),
    lastUpdatedAt: existing.lastUpdatedAt || formatDateTime(),
  };

  normalized.stepStatus = getStepCompletion(normalized)
    ? "Completed"
    : "In Progress";
  return normalized;
};

function DocumentUpload({ label, description, document, onChange, required = true }) {
  const complete = Boolean(document?.name);

  return (
    <label className={`esd-document ${complete ? "complete" : ""}`}>
      <span className="esd-document-icon">
        {complete ? <CheckIcon /> : <FileIcon />}
      </span>
      <span className="esd-document-copy">
        <strong>
          {label}
          {required && <em>*</em>}
        </strong>
        <small>{complete ? document.name : description}</small>
      </span>
      <span className="esd-upload">
        <UploadIcon /> {complete ? "Replace" : "Upload"}
      </span>
      <input
        className="esd-file-input"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
    </label>
  );
}

function EligibilitySupportingDetailsPage({
  lead,
  setLead,
  stepId = "eligibility-supporting",
  updateStepStatus,
}) {
  const leadDetails = useMemo(() => getLeadDetails(lead), [lead]);
  const facilityData = leadDetails.facilityBranchLoanDetails || {};
  const exposure = facilityData.exposure || {};

  // These two stored flags are the only source of truth for conditional sections.
  // BEFORE:
  // const cibilRequired = exposure.cibilRequired === true;
  const landDetailsRequired = exposure.landDetailsRequired === true;
  const requestedLoanAmount = Number(
    exposure.requestedLoanAmount ?? facilityData.requestedLoanAmount ?? 0
  );
  const aggregateExposure = Number(
    exposure.aggregateExposure ?? exposure.totalExposure ?? 0
  );
  const facilityType =
    facilityData.facilityType || facilityData.productType || "Gold Loan";
  const leadIdentity = lead?.id || lead?.leadId || lead?.leadNumber || "";

  const customerIdentity = leadDetails.customerIdentity || {};
  const relationship = customerIdentity.relationship || leadDetails.relationship || "";

  const relationshipType = relationship.type || customerIdentity.type || leadDetails.customerType || "";

  const isNTB = relationshipType === "NTB";

  // AFTER: 
  // NTB = Always required, ETB = Required if exposure.cibilRequired is true (> ₹1L / ₹2.5L)
  const cibilRequired = isNTB ? true : exposure.cibilRequired === true;

  const initialStep = normalizeStep({
    existing: leadDetails[SECTION_KEY],
    cibilRequired,
    landRequired: landDetailsRequired,
    leadDetails,
  });

  const [stepData, setStepData] = useState(initialStep);
  const [pullingCibil, setPullingCibil] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [saveState, setSaveState] = useState("Saved");
  const stepDataRef = useRef(initialStep);
  const saveTimerRef = useRef(null);
  const hydratedLeadRef = useRef("");

  const persistStep = useCallback(
    async (nextStep) => {
      if (!leadIdentity) return;

      setSaveState("Saving");
      try {
        const response = await fetch(
          `${LEAD_DETAILS_API_BASE}/${encodeURIComponent(leadIdentity)}/details`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leadId: leadIdentity,
              leadDetailsPatch: { [SECTION_KEY]: nextStep },
            }),
          }
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `Unable to save Step 3 (${response.status})`);
        }

        setSaveState("Saved");
      } catch (error) {
        console.error("Failed to save eligibility and supporting details", error);
        setSaveState("Save failed");
        window.alert(
          "We could not save the eligibility and supporting details. Please check your connection and try again."
        );
      }
    },
    [leadIdentity]
  );

  const commitStep = useCallback(
    (updater, { immediate = false } = {}) => {
      const draft =
        typeof updater === "function"
          ? updater(stepDataRef.current)
          : updater;
      const next = {
        ...draft,
        stepStatus: getStepCompletion(draft) ? "Completed" : "In Progress",
        lastUpdatedAt: formatDateTime(),
      };

      stepDataRef.current = next;
      setStepData(next);
      setLead?.((currentLead) => ({
        ...currentLead,
        leadDetails: {
          ...getLeadDetails(currentLead),
          [SECTION_KEY]: next,
        },
      }));

      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      if (immediate) {
        void persistStep(next);
      } else {
        setSaveState("Saving");
        saveTimerRef.current = window.setTimeout(() => {
          void persistStep(stepDataRef.current);
        }, 450);
      }
    },
    [persistStep, setLead]
  );

  useEffect(() => {
    if (!leadIdentity || hydratedLeadRef.current === leadIdentity) return;
    hydratedLeadRef.current = leadIdentity;

    const existing = leadDetails[SECTION_KEY];
    const normalized = normalizeStep({
      existing,
      cibilRequired,
      landRequired: landDetailsRequired,
      leadDetails,
    });
    stepDataRef.current = normalized;
    setStepData(normalized);

    if (!existing) {
      setLead?.((currentLead) => ({
        ...currentLead,
        leadDetails: {
          ...getLeadDetails(currentLead),
          [SECTION_KEY]: normalized,
        },
      }));
      void persistStep(normalized);
    }
  }, [
    cibilRequired,
    landDetailsRequired,
    leadDetails,
    leadIdentity,
    persistStep,
    setLead,
  ]);

  useEffect(() => {
    const flagsChanged =
      stepDataRef.current.cibil.required !== cibilRequired ||
      stepDataRef.current.land.required !== landDetailsRequired;
    if (!leadIdentity || !flagsChanged) return;

    commitStep(
      normalizeStep({
        existing: stepDataRef.current,
        cibilRequired,
        landRequired: landDetailsRequired,
        leadDetails,
      }),
      { immediate: true }
    );
  }, [
    cibilRequired,
    commitStep,
    landDetailsRequired,
    leadDetails,
    leadIdentity,
  ]);

  useEffect(() => {
    if (!leadIdentity) return;
    const identity = leadDetails.customerIdentity || {};
    const nextConsentStatus = identity.consentStatus || "Not Captured";
    const nextConsentReference =
      identity.consentReferenceNumber || identity.consentReference || "";
    const nextConsentCapturedAt = identity.consentCapturedAt || "";
    const currentCibil = stepDataRef.current.cibil;

    if (
      currentCibil.consentStatus === nextConsentStatus &&
      currentCibil.consentReference === nextConsentReference &&
      currentCibil.consentCapturedAt === nextConsentCapturedAt
    ) {
      return;
    }

    commitStep(
      (previous) => ({
        ...previous,
        cibil: {
          ...previous.cibil,
          consentStatus: nextConsentStatus,
          consentReference: nextConsentReference,
          consentCapturedAt: nextConsentCapturedAt,
          status:
            previous.cibil.status === "Completed"
              ? "Completed"
              : isConsentCaptured(nextConsentStatus)
                ? "Consent Available"
                : "Consent Required",
        },
      }),
      { immediate: true }
    );
  }, [commitStep, leadDetails.customerIdentity, leadIdentity]);

  useEffect(() => {
    updateStepStatus?.(stepId, stepData.stepStatus);
  }, [stepData.stepStatus, stepId, updateStepStatus]);

  useEffect(
    () => () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    },
    []
  );

  const consentAvailable = isConsentCaptured(stepData.cibil.consentStatus);
  const stepComplete = stepData.stepStatus === "Completed";

  const updateLandField = (field, value) => {
    commitStep((previous) => ({
      ...previous,
      land: {
        ...previous.land,
        status:
          hasRequiredLandData({ ...previous.land.details, [field]: value }) &&
          Boolean(previous.land.documents.landRecord?.name)
            ? "Completed"
            : "In Progress",
        details: { ...previous.land.details, [field]: value },
      },
    }));
  };

  const updateLandDocument = (key, file) => {
    if (!file) return;
    const document = {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: formatDateTime(),
    };

    commitStep(
      (previous) => {
        const documents = { ...previous.land.documents, [key]: document };
        const status =
          hasRequiredLandData(previous.land.details) &&
          Boolean(documents.landRecord?.name)
            ? "Completed"
            : "In Progress";

        return {
          ...previous,
          land: { ...previous.land, documents, status },
        };
      },
      { immediate: true }
    );
  };

  const openChargeConfirmation = () => {
    if (!consentAvailable || pullingCibil || stepData.cibil.status === "Completed") return;
    commitStep(
      (previous) => ({
        ...previous,
        cibil: {
          ...previous.cibil,
          status: "Charge Confirmation Pending",
          chargeConfirmationStatus: "Pending",
        },
      }),
      { immediate: true }
    );
    setShowChargeModal(true);
  };

  const cancelChargeConfirmation = () => {
    setShowChargeModal(false);
    commitStep(
      (previous) => ({
        ...previous,
        cibil: {
          ...previous.cibil,
          status: "Consent Available",
          chargeConfirmationStatus: "Cancelled",
        },
      }),
      { immediate: true }
    );
  };

  const confirmAndPullCibil = () => {
    setShowChargeModal(false);
    setPullingCibil(true);
    commitStep(
      (previous) => ({
        ...previous,
        cibil: {
          ...previous.cibil,
          status: "In Progress",
          chargeConfirmationStatus: "Confirmed",
          chargeConfirmedAt: formatDateTime(),
          errorMessage: "",
        },
      }),
      { immediate: true }
    );

    window.setTimeout(() => {
      setPullingCibil(false);
      commitStep(
        (previous) => ({
          ...previous,
          cibil: {
            ...previous.cibil,
            status: "Completed",
            score: CIBIL_SCORE,
            reportName: CIBIL_REPORT_NAME,
            reportPath: CIBIL_REPORT_PATH,
            fetchedAt: formatDateTime(),
            assessmentOutcome: "Passed",
          },
        }),
        { immediate: true }
      );
    }, 1400);
  };

  return (
    <div className="esd-page">
      <div className="esd-hero">
        <div>
          <span>STEP 03 · CONDITIONAL CONTROLS</span>
          <h2>Credit Check &amp; Supporting Details</h2>
          <p>CIBIL and land requirements are read directly from the exposure decision saved in Step 2.</p>
        </div>
        <div className="esd-trigger-summary">
          <div><span>Facility</span><strong>{facilityType}</strong></div>
          <div><span>Requested</span><strong>{formatCurrency(requestedLoanAmount)}</strong></div>
          <div><span>Aggregate exposure</span><strong>{formatCurrency(aggregateExposure)}</strong></div>
        </div>
      </div>

      <div className={`esd-save-status ${saveState.toLowerCase().replace(" ", "-")}`} aria-live="polite">
        <span /> {saveState === "Saving" ? "Saving changes…" : saveState === "Saved" ? "All changes saved" : "Changes could not be saved"}
      </div>

      <section className="esd-section">
        <div className="esd-section-heading">
          <span className="esd-section-icon"><ShieldIcon /></span>
          <div>
            <span>01 · CIC / CIBIL ASSESSMENT</span>
            <h3>Credit-bureau eligibility check</h3>
            <p>Requirement determined by the exposure decision completed in Facility, Branch &amp; Loan Details.</p>
          </div>
          <span className={`esd-status ${cibilRequired ? "required" : "not-required"}`}>
            {cibilRequired ? "Required" : "Not required"}
          </span>
        </div>

        {cibilRequired ? (
          <div className="esd-cibil-workspace">
            <div className={`esd-consent-summary ${consentAvailable ? "available" : "missing"}`}>
              <span className="esd-consent-icon">{consentAvailable ? <CheckIcon /> : "!"}</span>
              <div>
                <strong>CIC consent: {stepData.cibil.consentStatus}</strong>
                <p>
                  {consentAvailable
                    ? `Consent captured in Step 1${stepData.cibil.consentCapturedAt ? ` on ${stepData.cibil.consentCapturedAt}` : ""}${stepData.cibil.consentReference ? ` · Ref ${stepData.cibil.consentReference}` : ""}.`
                    : "CIC consent must be captured in Step 1 before the bureau pull can begin."}
                </p>
              </div>
            </div>

            <div className="esd-cibil-card">
              <span className="esd-shield"><ShieldIcon /></span>
              <div>
                <span>BUREAU STATUS</span>
                <strong>{stepData.cibil.status}</strong>
                <p>
                  {stepData.cibil.status === "Completed"
                    ? `Report fetched on ${stepData.cibil.fetchedAt}.`
                    : `Applicable bureau charges will be deducted from ${stepData.cibil.chargesAccountMasked}.`}
                </p>
              </div>
              <button
                type="button"
                disabled={!consentAvailable || pullingCibil || stepData.cibil.status === "Completed"}
                onClick={openChargeConfirmation}
              >
                {pullingCibil
                  ? "Generating report…"
                  : stepData.cibil.status === "Completed"
                    ? "Report generated"
                    : "Pull CIBIL report"}
              </button>
            </div>

            {stepData.cibil.status === "Completed" && (
              <>
              <div className="esd-result-grid">
                <div><span>CIBIL score</span><strong>{stepData.cibil.score}</strong><small>Good credit profile</small></div>
                <div>
                  <span>Credit report</span>
                  <strong>{stepData.cibil.reportName}</strong>
                  <a href={stepData.cibil.reportPath || CIBIL_REPORT_PATH} target="_blank" rel="noreferrer">View report</a>
                </div>
                <div><span>Assessment outcome</span><strong className="success-text">{stepData.cibil.assessmentOutcome}</strong><small>No blocking bureau rule</small></div>
              </div>
              {/* PRE-FILLED ELIGIBILITY BANNER */}
              <div className="esd-eligibility-banner" role="status">
                <span className="esd-eligibility-banner-icon">
                  <CheckIcon />
                </span>
                <div className="esd-eligibility-banner-text">
                  <strong>
                    You are eligible for loan amount of {formatCurrency(3500000)} (₹35 Lakhs)
                  </strong>
                  <p>
                    Based on CIBIL score ({stepData.cibil.score}) and CBS credit evaluation.
                  </p>
                </div>
              </div>
              </>
            )}
          </div>
        ) : (
          <div className="esd-not-required">
            <CheckIcon />
            <div>
              <strong>No bureau pull required</strong>
              <p>Step 2 saved <code>exposure.cibilRequired</code> as false. No charges will be deducted and this section is complete.</p>
            </div>
          </div>
        )}
      </section>

      <section className="esd-section">
        <div className="esd-section-heading">
          <span className="esd-section-icon"><FileIcon /></span>
          <div>
            <span>02 · AGRI SUPPORTING DETAILS</span>
            <h3>Land and crop information</h3>
            <p>Requirement determined by the land-details decision saved with Step 2 exposure.</p>
          </div>
          <span className={`esd-status ${landDetailsRequired ? "required" : "not-required"}`}>
            {landDetailsRequired ? "Required" : "Not required"}
          </span>
        </div>

        {landDetailsRequired ? (
          <div className="esd-land-workspace">
            <div className="esd-info-strip">
              <FileIcon />
              <div><strong>Agricultural evidence required</strong><p>Complete the land particulars and upload at least one qualifying land record.</p></div>
            </div>

            <div className="esd-form-grid">
              <label><span>State *</span><select value={stepData.land.details.state} onChange={(event) => updateLandField("state", event.target.value)}><option>Maharashtra</option><option>Gujarat</option><option>Rajasthan</option></select></label>
              <label><span>District *</span><input value={stepData.land.details.district} onChange={(event) => updateLandField("district", event.target.value)} /></label>
              <label><span>Village *</span><input value={stepData.land.details.village} onChange={(event) => updateLandField("village", event.target.value)} /></label>
              <label><span>Survey number *</span><input value={stepData.land.details.surveyNumber} onChange={(event) => updateLandField("surveyNumber", event.target.value)} /></label>
              <label><span>Season *</span><select value={stepData.land.details.season} onChange={(event) => updateLandField("season", event.target.value)}><option>Kharif</option><option>Rabi</option><option>Zaid</option></select></label>
              <label><span>Crop *</span><select value={stepData.land.details.crop} onChange={(event) => updateLandField("crop", event.target.value)}><option>Soybean</option><option>Rice</option><option>Cotton</option><option>Wheat</option><option>Sugarcane</option></select></label>
              <label><span>Extent in acres *</span><input min="0.01" step="0.01" type="number" value={stepData.land.details.extentAcres} onChange={(event) => updateLandField("extentAcres", event.target.value)} /></label>
              <label><span>Estimated cost per acre *</span><input min="1" type="number" value={stepData.land.details.estimatedCostPerAcre} onChange={(event) => updateLandField("estimatedCostPerAcre", event.target.value)} /></label>
              <label><span>Are you the owner of the land? *</span><select value={stepData.land.details.isLandOwner} onChange={(event) => updateLandField("isLandOwner", event.target.value)}><option>Yes</option><option>No</option></select></label>
              <label><span>Land record type *</span><select value={stepData.land.details.recordType} onChange={(event) => updateLandField("recordType", event.target.value)}><option>Record of Rights</option><option>Record of Tenancy</option><option>Crop Record</option><option>Mutation Record</option></select></label>
            </div>

            <div className="esd-document-grid">
              <DocumentUpload
                label="Land record"
                description="Record of Rights / Tenancy / Crop / Mutation · Max 5 MB"
                document={stepData.land.documents.landRecord}
                onChange={(file) => updateLandDocument("landRecord", file)}
              />
              <DocumentUpload
                label="Additional supporting document"
                description="Optional facility-specific evidence"
                document={stepData.land.documents.additionalDocument}
                onChange={(file) => updateLandDocument("additionalDocument", file)}
                required={false}
              />
            </div>
          </div>
        ) : (
          <div className="esd-not-required">
            <CheckIcon />
            <div>
              <strong>Land details are not applicable</strong>
              <p>Step 2 saved <code>exposure.landDetailsRequired</code> as false. No land fields or supporting records are needed.</p>
            </div>
          </div>
        )}
      </section>

      <div className={`esd-readiness ${stepComplete ? "ready" : "pending"}`}>
        <span>{stepComplete ? <CheckIcon /> : "!"}</span>
        <div>
          <strong>{stepComplete ? "Eligibility and supporting details are complete" : "Complete the applicable conditional requirements"}</strong>
          <p>{stepComplete ? "Proceed to Jewellery Details & Submission." : "Complete the required CIBIL assessment and/or land evidence before continuing."}</p>
        </div>
      </div>

      {showChargeModal && (
        <div
          className="esd-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && cancelChargeConfirmation()}
          onKeyDown={(event) => event.key === "Escape" && cancelChargeConfirmation()}
        >
          <div className="esd-modal" role="dialog" aria-modal="true" aria-labelledby="cibil-charge-title">
            <span className="esd-modal-icon"><ShieldIcon /></span>
            <div className="esd-modal-copy">
              <span>CIBIL REPORT CHARGE</span>
              <h3 id="cibil-charge-title">Confirm bureau report charge</h3>
              <p>A charge of <strong>{formatCurrency(stepData.cibil.chargeAmount)}</strong> will be deducted from the customer’s selected CASA account.</p>
              <div className="esd-account-row"><span>Debit account</span><strong>{stepData.cibil.chargesAccountMasked}</strong></div>
              <small>By continuing, the maker confirms that the customer has been informed of the applicable charge.</small>
            </div>
            <div className="esd-modal-actions">
              <button type="button" className="secondary" onClick={cancelChargeConfirmation}>Cancel</button>
              <button type="button" className="primary" onClick={confirmAndPullCibil} autoFocus>Confirm &amp; pull report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EligibilitySupportingDetailsPage;
