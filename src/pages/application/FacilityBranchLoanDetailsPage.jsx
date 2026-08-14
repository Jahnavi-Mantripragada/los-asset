import { useEffect, useMemo, useRef, useState } from "react";
import "./FacilityBranchLoanDetailsPage.css";

const LEAD_DETAILS_API_BASE =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const LoanIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </svg>
);

const JewelleryIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
    <path d="m4 8 4-5h8l4 5-8 13Z" />
    <path d="M4 8h16M8 3l4 5 4-5M8 8l4 13 4-13" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" />
  </svg>
);

const BRANCHES = [
  {
    code: "YESB0000123",
    name: "Pune - Deccan Gymkhana",
    address: "Bhandarkar Road, Deccan Gymkhana, Pune, Maharashtra 411004",
    pinCode: "411004",
    dpCode: "DP-0123",
  },
  {
    code: "YESB0000226",
    name: "Pune - Camp",
    address: "Moledina Road, Camp, Pune, Maharashtra 411001",
    pinCode: "411001",
    dpCode: "DP-0226",
  },
  {
    code: "YESB0000187",
    name: "Pune - Baner",
    address: "Baner Road, Pune, Maharashtra 411045",
    pinCode: "411045",
    dpCode: "DP-0187",
  },
  {
    code: "YESB0000418",
    name: "Pune - Hadapsar",
    address: "Solapur Road, Hadapsar, Pune, Maharashtra 411028",
    pinCode: "411028",
    dpCode: "DP-0418",
  },
  {
    code: "YESB0000472",
    name: "Pune - Magarpatta",
    address: "Magarpatta Road, Hadapsar, Pune, Maharashtra 411028",
    pinCode: "411028",
    dpCode: "DP-0472",
  },
  {
    code: "YESB0000314",
    name: "Mumbai - Andheri East",
    address: "Mahakali Caves Road, Mumbai, Maharashtra 400093",
    pinCode: "400093",
    dpCode: "DP-0314",
  },
];

const FACILITY_OPTIONS = {
  Retail: {
    label: "Retail Gold Loan",
    purposes: ["Marriage", "Medical", "Personal Needs", "Others"],
    schemes: [
      { name: "YES Gold Loan - Regular", tenureOptions: ["12 Months"] },
      { name: "YES Gold Loan - Bullet", tenureOptions: ["6 Months", "12 Months"] },
    ],
  },
  Agri: {
    label: "Agri Gold Loan",
    purposes: ["Land Development", "Cultivation Requirement"],
    schemes: [
      { name: "YES Agri Gold - Crop", tenureOptions: ["6 Months", "12 Months"] },
      { name: "YES Agri Gold - Development", tenureOptions: ["18 Months"] },
    ],
  },
};

const ORNAMENTS = [
  "Gold Necklace",
  "Gold Chain",
  "Gold Bangles",
  "Gold Earrings",
  "Gold Ring",
  "Gold Coin",
  "Other Gold Ornament",
];

const createJewelleryItem = (sequence = 1) => ({
  id: `JWL-${Date.now()}-${sequence}`,
  serialNumber: sequence,
  description: "Gold Necklace",
  numberOfItems: 1,
  customerDeclaredOwnership: "Yes",
  ownershipProof: null,
  remarks: "",
});

const isItemComplete = (item) =>
  Boolean(
    item.description &&
      Number(item.numberOfItems) > 0 &&
      item.customerDeclaredOwnership === "Yes" &&
      item.ownershipProof?.fileName
  );

const parseLeadDetails = (leadDetails) => {
  if (!leadDetails) return {};
  if (typeof leadDetails === "object") return leadDetails;

  try {
    return JSON.parse(leadDetails);
  } catch {
    return {};
  }
};

const normalizeBranch = (branch, fallback) => ({
  code: branch?.code || fallback.code,
  name: branch?.name || fallback.name,
  address: branch?.address || fallback.address,
  pinCode: branch?.pinCode || fallback.pinCode,
  dpCode: branch?.dpCode || fallback.dpCode,
});

const getStoredStepNode = (lead, stepData, sectionKey) => {
  const leadDetails = parseLeadDetails(lead?.leadDetails ?? lead?.lead_details);
  return leadDetails?.[sectionKey] || stepData?.[sectionKey] || stepData || {};
};

const buildInitialForm = ({ lead, stepData, sectionKey, homeBranch }) => {
  const stored = getStoredStepNode(lead, stepData, sectionKey);
  const storedBranch = stored.branchSelection || {};
  const storedLoan = stored.productFacilityAndScheme || {};

  const productType = storedLoan.productType || stored.facilityType || "Retail";
  const facility = FACILITY_OPTIONS[productType] || FACILITY_OPTIONS.Retail;
  const schemeName =
    storedLoan.schemeName || stored.schemeName || facility.schemes[0].name;
  const scheme =
    facility.schemes.find((item) => item.name === schemeName) ||
    facility.schemes[0];

  const branchType = storedBranch.type || stored.branchType || "Home";
  const storedSelectedBranch =
    storedBranch.selectedBranch || stored.selectedBranch || null;

  const storedItems = Array.isArray(stored.jewelleryItems) && stored.jewelleryItems.length > 0
    ? stored.jewelleryItems
    : [createJewelleryItem(1)];

  return {
    branchType,
    pinCode:
      branchType === "Other"
        ? storedBranch.pinCode || stored.pinCode || ""
        : homeBranch.pinCode,
    selectedBranchCode:
      branchType === "Home"
        ? homeBranch.code
        : storedBranch.selectedBranchCode ||
          stored.selectedBranchCode ||
          storedSelectedBranch?.code ||
          "",
    productType,
    schemeName: scheme.name,
    purpose: storedLoan.purpose || stored.purpose || facility.purposes[0],
    requestedLoanAmount: Number(
      storedLoan.requestedLoanAmount ?? stored.requestedLoanAmount ?? 0
    ),
    tenure: storedLoan.tenure || stored.tenure || scheme.tenureOptions[0] || "",
    jewelleryItems: storedItems,
  };
};

function SectionHeading({ icon, eyebrow, title, description, badge }) {
  return (
    <div className="fbl-section-heading">
      <span className="fbl-section-icon">{icon}</span>
      <div>
        <span className="fbl-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {badge}
    </div>
  );
}

function FacilityBranchLoanDetailsPage({
  lead = {},
  setLead,
  stepData = {},
  sectionKey = "facilityBranchLoanDetails",
  stepId = "facility-branch-loan",
  updateApplicationData,
  updateStepStatus,
}) {
  const leadIdentity =
    lead.id || lead.leadNumber || lead.leadnumber || "unresolved-lead";
  const fallbackHomeBranch = normalizeBranch(lead.homeBranch, BRANCHES[0]);

  const [form, setForm] = useState(() =>
    buildInitialForm({
      lead,
      stepData,
      sectionKey,
      homeBranch: fallbackHomeBranch,
    })
  );
  const hydratedLeadRef = useRef(leadIdentity);
  const latestLeadRef = useRef(lead);
  const lastPersistedNodeRef = useRef("");
  const persistQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    latestLeadRef.current = lead;
  }, [lead]);

  useEffect(() => {
    if (hydratedLeadRef.current === leadIdentity) return;

    lastPersistedNodeRef.current = "";
    setForm(
      buildInitialForm({
        lead,
        stepData,
        sectionKey,
        homeBranch: normalizeBranch(lead.homeBranch, BRANCHES[0]),
      })
    );
    hydratedLeadRef.current = leadIdentity;
  }, [lead, leadIdentity, sectionKey, stepData]);

  const homeBranch = useMemo(
    () => normalizeBranch(lead.homeBranch, BRANCHES[0]),
    [lead.homeBranch]
  );

  const availableBranches = useMemo(
    () =>
      form.pinCode.length === 6
        ? BRANCHES.filter((branch) => branch.pinCode === form.pinCode)
        : [],
    [form.pinCode]
  );

  const selectedBranch = useMemo(() => {
    if (form.branchType === "Home") return homeBranch;
    return (
      availableBranches.find(
        (branch) => branch.code === form.selectedBranchCode
      ) || null
    );
  }, [availableBranches, form.branchType, form.selectedBranchCode, homeBranch]);

  const facility = FACILITY_OPTIONS[form.productType] || FACILITY_OPTIONS.Retail;
  const selectedScheme =
    facility.schemes.find((scheme) => scheme.name === form.schemeName) ||
    facility.schemes[0];

  const existingOutstanding = 0;
  const requestedLoanAmount = Number(form.requestedLoanAmount || 0);
  const aggregateLoanAmount = existingOutstanding + requestedLoanAmount;
  const relationshipType = lead?.relationship?.type || lead?.customerIdentity?.type || "";
  const isNTB = relationshipType === "NTB" || leadIdentity.startsWith("LD-");
  const cibilRequired = isNTB ? true : requestedLoanAmount > 100000;
  const landDetailsRequired =
    form.productType === "Agri" && aggregateLoanAmount >= 100000;

  const branchComplete = Boolean(
    selectedBranch?.code &&
      (form.branchType === "Home" || form.pinCode.length === 6)
  );

  const jewelleryComplete =
    form.jewelleryItems.length > 0 &&
    form.jewelleryItems.every(isItemComplete);

  const stepComplete = Boolean(
    branchComplete &&
      form.productType &&
      selectedScheme?.name &&
      form.purpose &&
      requestedLoanAmount > 0 &&
      form.tenure &&
      jewelleryComplete
  );

  const stepNode = useMemo(
    () => ({
      schemaVersion: 1,
      branchSelection: {
        type: form.branchType,
        pinCode:
          form.branchType === "Other" ? form.pinCode : homeBranch.pinCode,
        selectedBranchCode: selectedBranch?.code || "",
        selectedBranch: selectedBranch
          ? {
              code: selectedBranch.code,
              name: selectedBranch.name,
              address: selectedBranch.address,
              pinCode: selectedBranch.pinCode,
              dpCode: selectedBranch.dpCode,
            }
          : null,
      },
      productFacilityAndScheme: {
        productType: form.productType,
        productLabel: facility.label,
        schemeName: selectedScheme?.name || "",
        purpose: form.purpose,
        requestedLoanAmount,
        tenure: form.tenure,
      },
      jewelleryItems: form.jewelleryItems,
      existingGoldLoans: [],
      exposure: {
        existingOutstandingAmount: existingOutstanding,
        requestedLoanAmount,
        aggregateLoanAmount,
        cibilRequired,
        landDetailsRequired,
      },
      stepMeta: {
        status: stepComplete ? "Completed" : "In Progress",
        isComplete: stepComplete,
      },
    }),
    [
      aggregateLoanAmount,
      cibilRequired,
      existingOutstanding,
      facility.label,
      form,
      homeBranch.pinCode,
      landDetailsRequired,
      requestedLoanAmount,
      selectedBranch,
      selectedScheme,
      stepComplete,
    ]
  );

  const serializedStepNode = JSON.stringify(stepNode);

  useEffect(() => {
    if (leadIdentity === "unresolved-lead") return;
    if (lastPersistedNodeRef.current === serializedStepNode) return;

    lastPersistedNodeRef.current = serializedStepNode;

    setLead?.((currentLead) => {
      const sourceLead = currentLead || latestLeadRef.current || {};
      const currentLeadDetails = parseLeadDetails(
        sourceLead.leadDetails ?? sourceLead.lead_details
      );
      const mergedLeadDetails = {
        ...currentLeadDetails,
        [sectionKey]: stepNode,
      };
      const nextLead = {
        ...sourceLead,
        leadDetails: mergedLeadDetails,
      };

      if (Object.prototype.hasOwnProperty.call(sourceLead, "lead_details")) {
        nextLead.lead_details = mergedLeadDetails;
      }

      latestLeadRef.current = nextLead;
      return nextLead;
    });

    updateApplicationData?.(sectionKey, stepNode);
    updateStepStatus?.(stepId, stepNode.stepMeta.status);

    const leadDetailsPatch = {
      [sectionKey]: stepNode,
    };

    persistQueueRef.current = persistQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        const response = await fetch(
          `${LEAD_DETAILS_API_BASE}/${encodeURIComponent(leadIdentity)}/details`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              leadId: leadIdentity,
              leadDetailsPatch,
            }),
          }
        );
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message ||
              `Unable to save lead details (${response.status}).`
          );
        }

        return result;
      })
      .catch((error) => {
        console.error("Failed to persist lead details:", error);
      });
  }, [
    leadIdentity,
    sectionKey,
    serializedStepNode,
    setLead,
    stepId,
    stepNode,
    updateApplicationData,
    updateStepStatus,
  ]);

  const handleCombinedConfigChange = (event) => {
    const value = event.target.value;
    if (!value || value === "||") return;

    const [productType, schemeName, purpose] = value.split("|");
    const targetFacility = FACILITY_OPTIONS[productType] || FACILITY_OPTIONS.Retail;
    const targetScheme =
      targetFacility.schemes.find((scheme) => scheme.name === schemeName) ||
      targetFacility.schemes[0];

    setForm((current) => ({
      ...current,
      productType,
      schemeName: targetScheme.name,
      purpose,
      tenure: targetScheme.tenureOptions[0] || "",
    }));
  };

  /* Jewellery Items Handlers */
  const addJewelleryItem = () => {
    setForm((current) => ({
      ...current,
      jewelleryItems: [
        ...current.jewelleryItems,
        createJewelleryItem(current.jewelleryItems.length + 1),
      ],
    }));
  };

  const removeJewelleryItem = (id) => {
    if (form.jewelleryItems.length === 1) return;
    setForm((current) => ({
      ...current,
      jewelleryItems: current.jewelleryItems
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, serialNumber: index + 1 })),
    }));
  };

  const updateJewelleryItem = (id, field, value) => {
    setForm((current) => ({
      ...current,
      jewelleryItems: current.jewelleryItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const uploadJewelleryProof = (id, file) => {
    if (!file) return;
    updateJewelleryItem(id, "ownershipProof", {
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      documentStatus: "Captured",
    });
  };

  return (
    <div className="fbl-page">
      <section className="fbl-section fbl-card">
        <SectionHeading
          icon={<LoanIcon />}
          eyebrow="01 · PRODUCT, FACILITY & SCHEME"
          title="Configure the requested Gold Loan"
          description="The selected product controls the available schemes and permitted loan purpose."
          badge={<span className="fbl-badge gold">Gold Loan</span>}
        />

        <div className="fbl-form-grid">
          <label>
            <span>Product, Scheme & Purpose *</span>
            <select
              value={
                form.productType && form.schemeName && form.purpose
                  ? `${form.productType}|${form.schemeName}|${form.purpose}`
                  : "||"
              }
              onChange={handleCombinedConfigChange}
            >
              <option value="||">Select Configuration</option>

              {Object.entries(FACILITY_OPTIONS).map(([productKey, facilityConfig]) => (
                <optgroup label={facilityConfig.label} key={productKey}>
                  {facilityConfig.schemes.flatMap((scheme) =>
                    facilityConfig.purposes.map((purpose) => (
                      <option
                        value={`${productKey}|${scheme.name}|${purpose}`}
                        key={`${productKey}-${scheme.name}-${purpose}`}
                      >
                        {facilityConfig.label} - {scheme.name} ({purpose})
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
          </label>
          <label>
            <span>Requested loan amount *</span>
            <input
              type="number"
              min="10000"
              step="1000"
              value={form.requestedLoanAmount || ""}
              placeholder="Enter requested amount"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  requestedLoanAmount: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            <span>Tenure *</span>
            {selectedScheme.tenureOptions.length === 1 ? (
              <>
                <input value={form.tenure} readOnly />
                <small>Auto-populated for the selected scheme</small>
              </>
            ) : (
              <select
                value={form.tenure}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tenure: event.target.value,
                  }))
                }
              >
                {selectedScheme.tenureOptions.map((tenure) => (
                  <option value={tenure} key={tenure}>
                    {tenure}
                  </option>
                ))}
              </select>
            )}
          </label>
        </div>

        <div className="fbl-selection-note">
          <span><CheckIcon /></span>
          <div>
            <strong>{selectedScheme.name}</strong>
            <p>{facility.label} · {form.tenure} </p>
          </div>
        </div>
      </section>

      {/* NEW JEWELLERY OFFERED SECTION */}
      <section className="fbl-section fbl-card">
        <SectionHeading
          icon={<JewelleryIcon />}
          eyebrow="02 · JEWELLERY OFFERED"
          title="Record the jewellery items presented"
          description="Upload ownership proof and ornament details. Appraisal and valuation will happen later."
          badge={
            <button className="jds-add-button" type="button" onClick={addJewelleryItem}>
              <PlusIcon /> Add ornament
            </button>
          }
        />

        <div className="jds-items">
          {form.jewelleryItems.map((item, index) => (
            <div className={`jds-item ${isItemComplete(item) ? "complete" : ""}`} key={item.id}>
              <div className="jds-item-number">
                <span>ITEM</span>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
              </div>
              <div className="jds-item-fields">
                <label>
                  <span>Ornament description *</span>
                  <select
                    value={item.description}
                    onChange={(event) => updateJewelleryItem(item.id, "description", event.target.value)}
                  >
                    {ORNAMENTS.map((ornament) => (
                      <option key={ornament}>{ornament}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Number of items *</span>
                  <input
                    type="number"
                    min="1"
                    value={item.numberOfItems}
                    onChange={(event) => updateJewelleryItem(item.id, "numberOfItems", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Customer-declared ownership *</span>
                  <select
                    value={item.customerDeclaredOwnership}
                    onChange={(event) => updateJewelleryItem(item.id, "customerDeclaredOwnership", event.target.value)}
                  >
                    <option value="Yes">Yes - Owned by customer</option>
                    <option value="No">No</option>
                  </select>
                </label>
                <label className="jds-proof-upload">
                  <span>Proof of ownership *</span>
                  <span className={`jds-upload-box ${item.ownershipProof?.fileName ? "complete" : ""}`}>
                    {item.ownershipProof?.fileName ? <CheckIcon /> : <UploadIcon />}
                    <strong>{item.ownershipProof?.fileName || "Upload proof"}</strong>
                    <small>{item.ownershipProof?.fileName ? "Click to replace" : "PDF, JPG or PNG"}</small>
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    hidden
                    onChange={(event) => uploadJewelleryProof(item.id, event.target.files?.[0])}
                  />
                </label>
                <label className="jds-remarks-field">
                  <span>Maker remarks</span>
                  <input
                    value={item.remarks}
                    placeholder="Optional remarks about the item"
                    onChange={(event) => updateJewelleryItem(item.id, "remarks", event.target.value)}
                  />
                </label>
              </div>
              <button
                className="jds-remove-button"
                type="button"
                onClick={() => removeJewelleryItem(item.id)}
                disabled={form.jewelleryItems.length === 1}
                aria-label={`Remove jewellery item ${index + 1}`}
              >
                <TrashIcon />
              </button>
              {isItemComplete(item) && <span className="jds-item-complete"><CheckIcon /> Complete</span>}
            </div>
          ))}
        </div>
      </section>

      <div className={`fbl-readiness ${stepComplete ? "ready" : "pending"}`}>
        <span>{stepComplete ? <CheckIcon /> : "!"}</span>
        <div>
          <strong>
            {stepComplete
              ? "Facility, branch, loan and jewellery details are complete"
              : "Complete the mandatory Step 2 details"}
          </strong>
          <p>
            {stepComplete
              ? `${cibilRequired ? "CIBIL is required" : "CIBIL is not required"}; ${
                  landDetailsRequired
                    ? "Agri land details are required"
                    : "land details are not required"
                } in Step 3.`
              : "Select scheme, purpose, requested amount, tenure, and upload jewellery details."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FacilityBranchLoanDetailsPage;
