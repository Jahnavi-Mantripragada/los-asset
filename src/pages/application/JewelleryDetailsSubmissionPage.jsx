import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "./JewelleryDetailsSubmissionPage.css";

const LEAD_DETAILS_API =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";

const CheckIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
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

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
  </svg>
);

const UserSwitchIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M17 8h5m-2.5-2.5V11" />
  </svg>
);

const ORNAMENTS = [
  "Gold Necklace",
  "Gold Chain",
  "Gold Bangles",
  "Gold Earrings",
  "Gold Ring",
  "Gold Coin",
  "Other Gold Ornament",
];

const APPRAISERS = [
  {
    id: "APP-0413",
    name: "Rajesh Jewellers & Valuers",
    type: "External Empanelled Appraiser",
    gstType: "GST Registered",
    branchCode: "YESB0000123",
  },
  {
    id: "APP-0417",
    name: "Shree Ganesh Gold Valuers",
    type: "External Empanelled Appraiser",
    gstType: "Composition GST",
    branchCode: "YESB0000123",
  },
  {
    id: "APP-0209",
    name: "YES BANK Panel Appraiser - West",
    type: "Bank Panel Appraiser",
    gstType: "Not Applicable",
    branchCode: "ALL",
  },
];

const DECLARATION_OPTIONS = [
  {
    key: "customerInformationVerified",
    title: "Customer information verified",
    description: "Customer identity, borrower details and selected servicing branch have been reviewed.",
  },
  {
    key: "consentObtained",
    title: "Required customer consent obtained",
    description: "Application-processing and CIC consent evidence captured in Step 1 has been verified.",
  },
  {
    key: "jewelleryDetailsMatch",
    title: "Jewellery details match the items presented",
    description: "Every ornament presented at the branch is listed with quantity and ownership evidence.",
  },
  {
    key: "mandatoryChecksComplete",
    title: "Mandatory checks and documents complete",
    description: "CIBIL and land records, where applicable, have been completed and reviewed.",
  },
  {
    key: "readyForAppraisal",
    title: "Application is ready for appraisal",
    description: "The application can be created and assigned to the selected jewellery appraiser.",
  },
];

const EMPTY_DECLARATIONS = DECLARATION_OPTIONS.reduce(
  (result, declaration) => ({ ...result, [declaration.key]: false }),
  {}
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatCurrencyForPdf = (value) =>
  `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value || 0))}`;

const formatDateTime = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const createJewelleryItem = (sequence = 1) => ({
  id: `JWL-${Date.now()}-${sequence}`,
  serialNumber: sequence,
  description: "Gold Necklace",
  numberOfItems: 1,
  customerDeclaredOwnership: "Yes",
  ownershipProof: null,
  remarks: "",
});

const createApplicationNumber = () => {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const randomPart = String(Date.now()).slice(-6);
  return `YBGL-${datePart}-${randomPart}`;
};

const getCustomerName = (lead, identityData) => {
  const borrower = identityData?.borrowerInformation || identityData?.borrower || {};
  return (
    borrower.fullName ||
    [borrower.firstName, borrower.middleName, borrower.lastName].filter(Boolean).join(" ") ||
    [lead?.firstName, lead?.middleName, lead?.lastName].filter(Boolean).join(" ") ||
    "Customer"
  );
};

const getFirstAppraiserForBranch = (branchCode) =>
  APPRAISERS.find((appraiser) => appraiser.branchCode === branchCode) ||
  APPRAISERS.find((appraiser) => appraiser.branchCode === "ALL") ||
  APPRAISERS[0];

const createDefaultSection = (branchCode, branchName) => {
  const appraiser = getFirstAppraiserForBranch(branchCode);
  return {
    schemaVersion: 1,
    status: "In Progress",
    items: [createJewelleryItem(1)],
    appraiser: { ...appraiser, branchName },
    declarations: { ...EMPTY_DECLARATIONS },
    totalJewelleryItems: 1,
    readyForSubmission: false,
    application: null,
    lastUpdatedAt: new Date().toISOString(),
  };
};

const normalizeSection = (section, branchCode, branchName) => {
  const defaults = createDefaultSection(branchCode, branchName);
  if (!section || typeof section !== "object") return defaults;

  const items = Array.isArray(section.items) && section.items.length
    ? section.items.map((item, index) => ({
        ...createJewelleryItem(index + 1),
        ...item,
        serialNumber: index + 1,
        ownershipProof:
          typeof item.ownershipProof === "string"
            ? { fileName: item.ownershipProof }
            : item.ownershipProof || null,
      }))
    : defaults.items;

  return {
    ...defaults,
    ...section,
    items,
    appraiser: { ...defaults.appraiser, ...(section.appraiser || {}) },
    declarations: { ...EMPTY_DECLARATIONS, ...(section.declarations || {}) },
  };
};

const isItemComplete = (item) =>
  Boolean(
    item.description &&
      Number(item.numberOfItems) > 0 &&
      item.customerDeclaredOwnership === "Yes" &&
      item.ownershipProof?.fileName
  );

const isSectionReady = (section) =>
  section.items.length > 0 &&
  section.items.every(isItemComplete) &&
  Boolean(section.appraiser?.id) &&
  DECLARATION_OPTIONS.every(({ key }) => section.declarations?.[key]);

const fileToDataUrl = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

async function generateApplicationPdf({
  lead,
  section,
  customerIdentity,
  loanData,
  eligibilityData,
  review,
}) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const blue = [0, 81, 143];
  const darkBlue = [0, 47, 84];
  const red = [196, 38, 29];
  const gold = [215, 162, 30];
  const text = [23, 40, 59];
  const muted = [96, 114, 135];
  const border = [213, 222, 234];
  const paleBlue = [239, 246, 251];
  const generatedAt = new Date();
  let y = 18;

  const setFont = (size, style = "normal", color = text) => {
    pdf.setFont("helvetica", style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
  };

  const footer = () => {
    const pageNumber = pdf.internal.getNumberOfPages();
    pdf.setDrawColor(...border);
    pdf.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
    setFont(7, "normal", muted);
    pdf.text("YES BANK Gold Loan - Application generated from the Loan Origination System", margin, pageHeight - 8);
    pdf.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  };

  const addPage = () => {
    footer();
    pdf.addPage();
    y = 17;
  };

  const ensureSpace = (height) => {
    if (y + height > pageHeight - 20) addPage();
  };

  const sectionTitle = (number, title) => {
    ensureSpace(13);
    pdf.setFillColor(...paleBlue);
    pdf.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    pdf.setFillColor(...blue);
    pdf.roundedRect(margin + 2, y + 2, 6, 6, 1.2, 1.2, "F");
    setFont(7, "bold", [255, 255, 255]);
    pdf.text(String(number), margin + 5, y + 6.2, { align: "center" });
    setFont(9.5, "bold", darkBlue);
    pdf.text(title, margin + 11, y + 6.5);
    y += 13;
  };

  const detailGrid = (fields, columns = 2) => {
    const gap = 4;
    const cellWidth = (contentWidth - gap * (columns - 1)) / columns;
    const rows = Math.ceil(fields.length / columns);
    for (let row = 0; row < rows; row += 1) {
      ensureSpace(16);
      const rowFields = fields.slice(row * columns, row * columns + columns);
      rowFields.forEach((field, column) => {
        const x = margin + column * (cellWidth + gap);
        pdf.setDrawColor(...border);
        pdf.setFillColor(250, 252, 254);
        pdf.roundedRect(x, y, cellWidth, 13, 1.5, 1.5, "FD");
        setFont(6.7, "normal", muted);
        pdf.text(field.label, x + 3, y + 4.3);
        setFont(8.4, "bold", darkBlue);
        const valueLines = pdf.splitTextToSize(String(field.value ?? "-"), cellWidth - 6);
        pdf.text(valueLines.slice(0, 1), x + 3, y + 9.2);
      });
      y += 16;
    }
  };

  const logo = await fileToDataUrl("/images/yes-bank-logo-light-bg.png");

  pdf.setFillColor(...darkBlue);
  pdf.rect(0, 0, pageWidth, 42, "F");
  pdf.setFillColor(...gold);
  pdf.rect(0, 42, pageWidth, 1.5, "F");
  if (logo) {
    try {
      pdf.addImage(logo, "PNG", margin, 10, 31, 12, undefined, "FAST");
    } catch {
      setFont(16, "bold", [255, 255, 255]);
      pdf.text("YES BANK", margin, 18);
    }
  } else {
    setFont(16, "bold", [255, 255, 255]);
    pdf.text("YES BANK", margin, 18);
  }
  setFont(7, "bold", [255, 238, 189]);
  pdf.text("GOLD LOAN ORIGINATION", margin, 31);
  setFont(15, "bold", [255, 255, 255]);
  pdf.text("Application & Appraisal Handoff Form", pageWidth - margin, 16, { align: "right" });
  setFont(8, "normal", [223, 233, 242]);
  pdf.text(`Application: ${section.application.applicationNumber}`, pageWidth - margin, 24, { align: "right" });
  pdf.text(`Generated: ${formatDateTime(generatedAt)}`, pageWidth - margin, 30, { align: "right" });
  pdf.text(`Lead: ${lead?.id || "-"}`, pageWidth - margin, 36, { align: "right" });
  y = 51;

  pdf.setFillColor(255, 249, 233);
  pdf.setDrawColor(236, 211, 143);
  pdf.roundedRect(margin, y, contentWidth, 13, 2, 2, "FD");
  setFont(7, "bold", [122, 85, 8]);
  pdf.text("APPLICATION STATUS", margin + 4, y + 4.5);
  setFont(9.5, "bold", [81, 59, 16]);
  pdf.text("Awaiting Jewellery Appraisal", margin + 4, y + 9.6);
  setFont(7.5, "normal", [120, 100, 59]);
  pdf.text(`Assigned to ${section.appraiser.name} (${section.appraiser.id})`, pageWidth - margin - 4, y + 8, { align: "right" });
  y += 18;

  sectionTitle(1, "Customer & Consent");
  detailGrid([
    { label: "Customer name", value: review.customerName },
    { label: "Relationship", value: review.relationshipType },
    { label: "CBS customer ID", value: review.customerId },
    { label: "Registered mobile", value: review.mobile },
    { label: "KYC / CBS eligibility", value: review.cbsEligibility },
    { label: "Consent status", value: review.consentStatus },
  ]);

  sectionTitle(2, "Facility, Branch & Loan Details");
  detailGrid([
    { label: "Facility", value: review.facility },
    { label: "Scheme", value: review.scheme },
    { label: "Purpose", value: review.purpose },
    { label: "Requested loan amount", value: formatCurrencyForPdf(review.requestedLoanAmount) },
    { label: "Tenure", value: review.tenure },
    { label: "Repayment type", value: review.repaymentType },
    { label: "CASA account for charges", value: review.casaAccount },
    { label: "Disbursement account", value: review.disbursementAccount },
    { label: "Selected branch", value: `${review.branchName} (${review.branchCode})` },
    { label: "Existing Gold Loan exposure", value: formatCurrencyForPdf(review.existingExposure) },
  ]);

  sectionTitle(3, "Eligibility & Supporting Details");
  detailGrid([
    { label: "CIBIL requirement", value: review.cibilRequired ? "Required" : "Not required" },
    { label: "CIBIL status / score", value: review.cibilRequired ? `${review.cibilStatus} / ${review.cibilScore || "-"}` : "Not applicable" },
    { label: "Land details requirement", value: review.landDetailsRequired ? "Required" : "Not required" },
    { label: "Land details status", value: review.landDetailsStatus },
  ]);

  sectionTitle(4, "Jewellery Offered by Customer");
  const tableColumns = [
    { title: "#", width: 9 },
    { title: "Ornament", width: 47 },
    { title: "Qty", width: 14 },
    { title: "Ownership", width: 25 },
    { title: "Proof", width: 45 },
    { title: "Maker remarks", width: contentWidth - 140 },
  ];
  const drawTableHeader = () => {
    pdf.setFillColor(...blue);
    pdf.rect(margin, y, contentWidth, 9, "F");
    let x = margin;
    tableColumns.forEach((column) => {
      setFont(7, "bold", [255, 255, 255]);
      pdf.text(column.title, x + 2, y + 5.8);
      x += column.width;
    });
    y += 9;
  };
  drawTableHeader();
  section.items.forEach((item, index) => {
    if (y + 12 > pageHeight - 20) {
      addPage();
      drawTableHeader();
    }
    const rowHeight = 12;
    pdf.setFillColor(index % 2 === 0 ? 250 : 245, 248, 251);
    pdf.setDrawColor(...border);
    pdf.rect(margin, y, contentWidth, rowHeight, "FD");
    let x = margin;
    const values = [
      String(index + 1),
      item.description,
      String(item.numberOfItems),
      item.customerDeclaredOwnership,
      item.ownershipProof?.fileName || "-",
      item.remarks || "-",
    ];
    values.forEach((value, columnIndex) => {
      setFont(6.8, columnIndex === 1 ? "bold" : "normal", columnIndex === 1 ? darkBlue : text);
      const lines = pdf.splitTextToSize(value, tableColumns[columnIndex].width - 4);
      pdf.text(lines.slice(0, 2), x + 2, y + 4.5);
      x += tableColumns[columnIndex].width;
    });
    y += rowHeight;
  });
  y += 5;

  sectionTitle(5, "Appraiser Assignment");
  detailGrid([
    { label: "Appraiser name", value: section.appraiser.name },
    { label: "Appraiser ID", value: section.appraiser.id },
    { label: "Appraiser type", value: section.appraiser.type },
    { label: "GST type", value: section.appraiser.gstType },
    { label: "Assigned branch", value: section.appraiser.branchName || review.branchName },
    { label: "Appraisal task", value: section.application.appraiserTaskId },
  ]);

  sectionTitle(6, "Maker Declarations");
  DECLARATION_OPTIONS.forEach((declaration) => {
    ensureSpace(10);
    pdf.setFillColor(234, 247, 240);
    pdf.setDrawColor(198, 231, 212);
    pdf.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "FD");
    pdf.setFillColor(22, 121, 74);
    pdf.circle(margin + 4.5, y + 4, 2.1, "F");
    setFont(6.5, "bold", [255, 255, 255]);
    pdf.text("OK", margin + 4.5, y + 4.8, { align: "center" });
    setFont(7.5, "bold", [22, 121, 74]);
    pdf.text(declaration.title, margin + 9, y + 5.1);
    y += 10;
  });

  ensureSpace(29);
  y += 3;
  pdf.setDrawColor(...border);
  pdf.line(margin, y + 14, margin + 55, y + 14);
  pdf.line(pageWidth - margin - 55, y + 14, pageWidth - margin, y + 14);
  setFont(7, "normal", muted);
  pdf.text("Branch Maker signature / employee ID", margin, y + 19);
  pdf.text("Customer acknowledgement", pageWidth - margin, y + 19, { align: "right" });
  setFont(6.8, "normal", muted);
  pdf.text("System-generated application form. Purity, weight and eligible value will be recorded by the assigned appraiser.", margin, y + 26);

  footer();
  return pdf;
}

function JewelleryDetailsSubmissionPage({
  lead = {},
  setLead,
  leadId,
  stepData = {},
  applicationData = {},
  sectionKey = "jewelleryDetailsSubmission",
  stepId = "jewellery-submission",
  updateApplicationData,
  updateStepStatus,
  onApplicationCreated,
}) {
  const leadDetails = lead?.leadDetails || applicationData || {};
  const customerIdentity = leadDetails.customerIdentity || leadDetails.customerAuthenticationConsent || {};
  const loanData = leadDetails.facilityBranchLoanDetails || leadDetails.schemeLoanDetails || {};
  const eligibilityData = leadDetails.eligibilitySupportingDetails || leadDetails.eligibilityChecks || {};
  const selectedBranch = loanData.selectedBranch || loanData.branch || {};
  const branchCode = selectedBranch.code || selectedBranch.branchCode || "YESB0000123";
  const branchName = selectedBranch.name || selectedBranch.branchName || "Pune - Hadapsar";
  const storedSection = leadDetails[sectionKey] || stepData;

  const [section, setSection] = useState(() =>
    normalizeSection(storedSection, branchCode, branchName)
  );
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [saveError, setSaveError] = useState("");
  const [showAppraiserPicker, setShowAppraiserPicker] = useState(false);
  const [submission, setSubmission] = useState({
    open: false,
    stage: 0,
    error: "",
  });
  const patchQueueRef = useRef(Promise.resolve());
  const leadDetailsRef = useRef(leadDetails);
  const sectionRef = useRef(section);
  const hydratedLeadRef = useRef("");

  const relationshipType =
    lead.relationshipType ||
    customerIdentity.relationshipType ||
    customerIdentity.customerType ||
    "ETB";
  const customerName = getCustomerName(lead, customerIdentity);
  const requestedLoanAmount = Number(
    loanData.requestedLoanAmount || loanData.loanDetails?.requestedLoanAmount || 0
  );
  const exposure = loanData.exposure || {};
  const cibilRequired = Boolean(exposure.cibilRequired);
  const landDetailsRequired = Boolean(exposure.landDetailsRequired);
  const cibilData = eligibilityData.cibil || eligibilityData.cibilDetails || {};
  const landData = eligibilityData.landDetails || {};

  const review = useMemo(
    () => ({
      customerName,
      relationshipType,
      customerId:
        customerIdentity.customerId ||
        customerIdentity.cbsCustomerId ||
        lead.cbsCustomerId ||
        "-",
      mobile: lead.mobile || customerIdentity.mobile || "-",
      consentStatus:
        customerIdentity.consent?.status ||
        customerIdentity.consentStatus ||
        (customerIdentity.consentCaptured ? "Consent captured" : "Completed in Step 1"),
      cbsEligibility:
        customerIdentity.eligibility?.status ||
        customerIdentity.cbsEligibilityStatus ||
        "Eligible",
      facility: loanData.facilityType || loanData.productType || "Gold Loan",
      scheme: loanData.schemeName || loanData.selectedScheme?.name || "-",
      purpose: loanData.purpose || loanData.loanPurpose || "-",
      requestedLoanAmount,
      tenure: loanData.tenure ? `${loanData.tenure} months` : "-",
      repaymentType: loanData.repaymentType || "-",
      casaAccount:
        loanData.casaAccount?.maskedAccountNumber ||
        loanData.casaAccount ||
        loanData.chargesAccount ||
        "-",
      disbursementAccount:
        loanData.disbursementAccount?.maskedAccountNumber ||
        loanData.disbursementAccount ||
        "Not applicable",
      branchName,
      branchCode,
      existingExposure: Number(exposure.existingGoldLoanExposure || exposure.existingExposure || 0),
      cibilRequired,
      cibilStatus: cibilRequired
        ? cibilData.status || eligibilityData.cibilStatus || "Pending"
        : "Not Required",
      cibilScore: cibilData.score || eligibilityData.cibilScore || "",
      landDetailsRequired,
      landDetailsStatus: landDetailsRequired
        ? landData.status || eligibilityData.landDetailsStatus || "Completed"
        : "Not Required",
    }),
    [
      branchCode,
      branchName,
      cibilData.score,
      cibilData.status,
      cibilRequired,
      customerIdentity,
      customerName,
      eligibilityData.cibilScore,
      eligibilityData.cibilStatus,
      eligibilityData.landDetailsStatus,
      exposure.existingExposure,
      exposure.existingGoldLoanExposure,
      landData.status,
      landDetailsRequired,
      lead.cbsCustomerId,
      lead.mobile,
      loanData,
      relationshipType,
      requestedLoanAmount,
    ]
  );

  const readyForSubmission = isSectionReady(section);
  const isSubmitted = section.status === "Submitted";
  const availableAppraisers = APPRAISERS.filter(
    (appraiser) => appraiser.branchCode === branchCode || appraiser.branchCode === "ALL"
  );

  const patchLeadDetails = (nextLeadDetails, throwOnError = false) => {
    setSaveStatus("Saving");
    setSaveError("");
    const recordLeadId = lead?.id || leadId;

    if (!recordLeadId) {
      const error = new Error("Lead ID is not available. The application could not be saved.");
      setSaveStatus("Error");
      setSaveError(error.message);
      return throwOnError ? Promise.reject(error) : Promise.resolve(false);
    }

    const request = async () => {
      const response = await fetch(
        `${LEAD_DETAILS_API}/${encodeURIComponent(recordLeadId)}/details`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: recordLeadId,
            leadDetailsPatch: nextLeadDetails,
          }),
        }
      );

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(body || `Unable to save application details (${response.status}).`);
      }

      setSaveStatus("Saved");
      return true;
    };

    const queuedRequest = patchQueueRef.current.catch(() => undefined).then(request);
    patchQueueRef.current = queuedRequest.catch((error) => {
      setSaveStatus("Error");
      setSaveError(error.message || "Unable to save application details.");
      if (!throwOnError) return false;
      throw error;
    });
    return throwOnError ? queuedRequest : patchQueueRef.current;
  };

  const commitSection = (nextValue, options = {}) => {
    const calculated = typeof nextValue === "function" ? nextValue(sectionRef.current) : nextValue;
    const nextSection = {
      ...calculated,
      totalJewelleryItems: calculated.items.reduce(
        (total, item) => total + Number(item.numberOfItems || 0),
        0
      ),
      readyForSubmission: isSectionReady(calculated),
      lastUpdatedAt: new Date().toISOString(),
    };
    const nextLeadDetails = {
      ...leadDetailsRef.current,
      [sectionKey]: nextSection,
    };

    sectionRef.current = nextSection;
    leadDetailsRef.current = nextLeadDetails;
    setSection(nextSection);
    setLead?.((previous) => ({
      ...previous,
      leadDetails: {
        ...(previous?.leadDetails || {}),
        [sectionKey]: nextSection,
      },
    }));
    updateApplicationData?.(sectionKey, nextSection);
    updateStepStatus?.(
      stepId,
      nextSection.status === "Submitted"
        ? "Completed"
        : nextSection.readyForSubmission
          ? "Ready"
          : "In Progress"
    );

    return patchLeadDetails(nextLeadDetails, options.throwOnError);
  };

  useEffect(() => {
    leadDetailsRef.current = lead?.leadDetails || applicationData || {};
  }, [applicationData, lead?.leadDetails]);

  useEffect(() => {
    if (!lead?.id) return;

    const hydrationKey = `${lead.id}:${sectionKey}`;
    if (hydratedLeadRef.current === hydrationKey) return;
    hydratedLeadRef.current = hydrationKey;

    const persistedSection = lead.leadDetails?.[sectionKey];
    if (persistedSection) {
      const normalized = normalizeSection(persistedSection, branchCode, branchName);
      sectionRef.current = normalized;
      setSection(normalized);
      updateApplicationData?.(sectionKey, normalized);
      updateStepStatus?.(
        stepId,
        normalized.status === "Submitted"
          ? "Completed"
          : isSectionReady(normalized)
            ? "Ready"
            : "In Progress"
      );
      return;
    }

    commitSection(sectionRef.current);
    // This effect intentionally hydrates once for each lead and section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id, sectionKey]);

  const updateItem = (id, field, value) => {
    if (isSubmitted) return;
    commitSection((previous) => ({
      ...previous,
      items: previous.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const uploadProof = (id, file) => {
    if (!file || isSubmitted) return;
    updateItem(id, "ownershipProof", {
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      documentStatus: "Captured",
    });
  };

  const addItem = () => {
    if (isSubmitted) return;
    commitSection((previous) => ({
      ...previous,
      items: [...previous.items, createJewelleryItem(previous.items.length + 1)],
    }));
  };

  const removeItem = (id) => {
    if (isSubmitted || section.items.length === 1) return;
    commitSection((previous) => ({
      ...previous,
      items: previous.items
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, serialNumber: index + 1 })),
    }));
  };

  const selectAppraiser = (appraiserId) => {
    const appraiser = APPRAISERS.find((candidate) => candidate.id === appraiserId);
    if (!appraiser || isSubmitted) return;
    commitSection((previous) => ({
      ...previous,
      appraiser: { ...appraiser, branchName },
    }));
    setShowAppraiserPicker(false);
  };

  const toggleDeclaration = (key, checked) => {
    if (isSubmitted) return;
    commitSection((previous) => ({
      ...previous,
      declarations: { ...previous.declarations, [key]: checked },
    }));
  };

  const downloadPdf = async (sectionToUse = sectionRef.current) => {
    const pdf = await generateApplicationPdf({
      lead,
      section: sectionToUse,
      customerIdentity,
      loanData,
      eligibilityData,
      review,
    });
    const fileName = `${sectionToUse.application.applicationNumber}-Gold-Loan-Application.pdf`;
    pdf.save(fileName);
    return fileName;
  };

  const handleCreateApplication = async () => {
    if (!readyForSubmission || isSubmitted) return;

    const applicationNumber = section.application?.applicationNumber || createApplicationNumber();
    const createdAt = new Date().toISOString();
    const appraiserTaskId = `APT-${String(Date.now()).slice(-8)}`;
    const submissionReference = `SUB-${String(Date.now()).slice(-10)}`;
    const finalSection = {
      ...section,
      status: "Submitted",
      readyForSubmission: true,
      reviewSnapshot: review,
      application: {
        applicationNumber,
        status: "Awaiting Jewellery Appraisal",
        createdAt,
        submittedAt: createdAt,
        submissionReference,
        appraiserTaskId,
        appraiserAssignmentStatus: "Assigned",
        pdfFileName: `${applicationNumber}-Gold-Loan-Application.pdf`,
        pdfGeneratedAt: createdAt,
      },
    };

    setSubmission({ open: true, stage: 0, error: "" });

    try {
      setSubmission({ open: true, stage: 1, error: "" });
      await patchQueueRef.current.catch(() => undefined);

      setSubmission({ open: true, stage: 2, error: "" });
      await commitSection(finalSection, { throwOnError: true });

      setSubmission({ open: true, stage: 3, error: "" });
      await downloadPdf(finalSection);

      setSubmission({ open: true, stage: 4, error: "" });
      await new Promise((resolve) => window.setTimeout(resolve, 550));

      setSubmission({ open: true, stage: 5, error: "" });
      onApplicationCreated?.({
        applicationNumber,
        status: "Awaiting Jewellery Appraisal",
        appraiser: finalSection.appraiser,
        appraiserTaskId,
      });

      await new Promise((resolve) => window.setTimeout(resolve, 700));
      setSubmission({ open: false, stage: 5, error: "" });
    } catch (error) {
      setSubmission({
        open: true,
        stage: 0,
        error: error.message || "The application could not be created. Please try again.",
      });
    }
  };

  const loaderStages = [
    "Validating application and jewellery evidence",
    "Saving the final application record",
    "Generating the signed application PDF",
    "Assigning the jewellery appraisal task",
    "Application created successfully",
  ];

  return (
    <div className="jds-page">
      <div className="jds-hero">
        <div>
          <span>STEP 04 · COLLATERAL & SUBMISSION</span>
          <h2>Jewellery Details &amp; Submission</h2>
          <p>
            Record the jewellery offered by the customer, confirm the assigned appraiser,
            review the complete application and submit it for appraisal.
          </p>
        </div>
        <div className="jds-hero-actions">
          <span className={`jds-save-state ${saveStatus.toLowerCase()}`}>
            {saveStatus === "Saving" ? <span className="jds-mini-spinner" /> : <CheckIcon />}
            {saveStatus === "Error" ? "Save failed" : saveStatus}
          </span>
          <span className="jds-product-badge"><JewelleryIcon /> YES BANK Gold Loan</span>
        </div>
      </div>

      {saveError && (
        <div className="jds-error-banner" role="alert">
          <strong>Unable to save the latest change.</strong>
          <span>{saveError}</span>
        </div>
      )}

      {isSubmitted && (
        <div className="jds-submission-success" role="status">
          <span className="jds-success-icon"><CheckIcon size={18} /></span>
          <div>
            <span>APPLICATION CREATED</span>
            <strong>{section.application.applicationNumber}</strong>
            <p>
              Assigned to {section.appraiser.name}. Status: {section.application.status}.
            </p>
          </div>
          <button type="button" className="jds-download-button" onClick={() => downloadPdf()}>
            <DownloadIcon /> Download application PDF
          </button>
        </div>
      )}

      <section className="jds-section">
        <div className="jds-section-heading">
          <span className="jds-section-icon"><CheckIcon /></span>
          <div>
            <span>01 · FINAL APPLICATION REVIEW</span>
            <h3>Confirm the information carried forward</h3>
            <p>Customer, facility and eligibility information from Steps 1 to 3.</p>
          </div>
          <span className="jds-status success">Ready for review</span>
        </div>

        <div className="jds-review-groups">
          <div className="jds-review-group">
            <div className="jds-review-group-title"><span>Customer &amp; consent</span><strong>{review.relationshipType}</strong></div>
            <div className="jds-summary-grid two-columns">
              <div><span>Customer</span><strong>{review.customerName}</strong><small>{review.customerId}</small></div>
              <div><span>Consent status</span><strong>{review.consentStatus}</strong><small>CBS eligibility: {review.cbsEligibility}</small></div>
            </div>
          </div>

          <div className="jds-review-group">
            <div className="jds-review-group-title"><span>Facility &amp; branch</span><strong>{review.branchCode}</strong></div>
            <div className="jds-summary-grid three-columns">
              <div><span>Facility / scheme</span><strong>{review.facility}</strong><small>{review.scheme}</small></div>
              <div><span>Purpose</span><strong>{review.purpose}</strong><small>{review.tenure} · {review.repaymentType}</small></div>
              <div><span>Servicing branch</span><strong>{review.branchName}</strong><small>{review.branchCode}</small></div>
            </div>
          </div>

          <div className="jds-review-group">
            <div className="jds-review-group-title"><span>Loan &amp; eligibility</span><strong>{formatCurrency(review.requestedLoanAmount)}</strong></div>
            <div className="jds-summary-grid three-columns">
              <div><span>Existing Gold Loan exposure</span><strong>{formatCurrency(review.existingExposure)}</strong><small>Aggregate exposure considered</small></div>
              <div>
                <span>CIBIL assessment</span>
                <strong>{review.cibilStatus}</strong>
                <small>{review.cibilRequired ? `Score ${review.cibilScore || "Pending"}` : "Threshold not met"}</small>
              </div>
              <div>
                <span>Land details</span>
                <strong>{review.landDetailsStatus}</strong>
                <small>{review.landDetailsRequired ? "Supporting records captured" : "Not applicable"}</small>
              </div>
            </div>
          </div>

          <details className="jds-account-details">
            <summary>View account details</summary>
            <div>
              <span>Charges CASA <strong>{review.casaAccount}</strong></span>
              <span>Disbursement account <strong>{review.disbursementAccount}</strong></span>
            </div>
          </details>
        </div>
      </section>

      <section className="jds-section">
        <div className="jds-section-heading">
          <span className="jds-section-icon"><JewelleryIcon /></span>
          <div>
            <span>02 · JEWELLERY OFFERED</span>
            <h3>Record the jewellery items presented</h3>
            <p>Purity, weight, deductions and valuation will be completed by the appraiser.</p>
          </div>
          <button className="jds-add-button" type="button" onClick={addItem} disabled={isSubmitted}>
            <PlusIcon /> Add ornament
          </button>
        </div>

        <div className="jds-items">
          {section.items.map((item, index) => (
            <div className={`jds-item ${isItemComplete(item) ? "complete" : ""}`} key={item.id}>
              <div className="jds-item-number"><span>ITEM</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
              <div className="jds-item-fields">
                <label>
                  <span>Ornament description *</span>
                  <select
                    value={item.description}
                    disabled={isSubmitted}
                    onChange={(event) => updateItem(item.id, "description", event.target.value)}
                  >
                    {ORNAMENTS.map((ornament) => <option key={ornament}>{ornament}</option>)}
                  </select>
                </label>
                <label>
                  <span>Number of items *</span>
                  <input
                    type="number"
                    min="1"
                    value={item.numberOfItems}
                    disabled={isSubmitted}
                    onChange={(event) => updateItem(item.id, "numberOfItems", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>Customer-declared ownership *</span>
                  <select
                    value={item.customerDeclaredOwnership}
                    disabled={isSubmitted}
                    onChange={(event) => updateItem(item.id, "customerDeclaredOwnership", event.target.value)}
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
                    disabled={isSubmitted}
                    onChange={(event) => uploadProof(item.id, event.target.files?.[0])}
                  />
                </label>
                <label className="jds-remarks-field">
                  <span>Maker remarks</span>
                  <input
                    value={item.remarks}
                    placeholder="Optional remarks about the item"
                    disabled={isSubmitted}
                    onChange={(event) => updateItem(item.id, "remarks", event.target.value)}
                  />
                </label>
              </div>
              <button
                className="jds-remove-button"
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={section.items.length === 1 || isSubmitted}
                aria-label={`Remove jewellery item ${index + 1}`}
              >
                <TrashIcon />
              </button>
              {isItemComplete(item) && <span className="jds-item-complete"><CheckIcon /> Complete</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="jds-section">
        <div className="jds-section-heading">
          <span className="jds-section-icon"><UserSwitchIcon /></span>
          <div>
            <span>03 · APPRAISER ASSIGNMENT</span>
            <h3>Confirm the appraiser receiving this application</h3>
            <p>An empanelled appraiser is automatically selected for the servicing branch.</p>
          </div>
          {!isSubmitted && (
            <button className="jds-change-button" type="button" onClick={() => setShowAppraiserPicker((value) => !value)}>
              <UserSwitchIcon /> {showAppraiserPicker ? "Cancel" : "Change appraiser"}
            </button>
          )}
        </div>

        {showAppraiserPicker && !isSubmitted && (
          <div className="jds-appraiser-picker">
            <label htmlFor="jds-appraiser-select">Available for {branchName}</label>
            <select
              id="jds-appraiser-select"
              value={section.appraiser.id}
              onChange={(event) => selectAppraiser(event.target.value)}
            >
              {availableAppraisers.map((appraiser) => (
                <option value={appraiser.id} key={appraiser.id}>
                  {appraiser.name} · {appraiser.id}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="jds-appraiser-card">
          <span className="jds-appraiser-icon"><JewelleryIcon /></span>
          <div>
            <span>ASSIGNED APPRAISER</span>
            <strong>{section.appraiser.name}</strong>
            <p>{section.appraiser.type} · {section.appraiser.gstType}</p>
          </div>
          <div className="jds-appraiser-meta">
            <span>Appraiser ID</span><strong>{section.appraiser.id}</strong>
            <small>{branchName} · {branchCode}</small>
          </div>
        </div>
      </section>

      <section className="jds-section">
        <div className="jds-section-heading">
          <span className="jds-section-icon"><CheckIcon /></span>
          <div>
            <span>04 · MAKER CONFIRMATIONS</span>
            <h3>Confirm application readiness</h3>
            <p>All confirmations are mandatory before the application can be submitted.</p>
          </div>
          <span className={`jds-status ${readyForSubmission ? "success" : "pending"}`}>
            {DECLARATION_OPTIONS.filter(({ key }) => section.declarations[key]).length}/{DECLARATION_OPTIONS.length} confirmed
          </span>
        </div>

        <div className="jds-declarations">
          {DECLARATION_OPTIONS.map((declaration) => {
            const checked = Boolean(section.declarations[declaration.key]);
            return (
              <label className={checked ? "checked" : ""} key={declaration.key}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={isSubmitted}
                  onChange={(event) => toggleDeclaration(declaration.key, event.target.checked)}
                />
                <span className="jds-checkbox">{checked && <CheckIcon />}</span>
                <div><strong>{declaration.title}</strong><p>{declaration.description}</p></div>
              </label>
            );
          })}
        </div>
      </section>

      <div className={`jds-readiness ${readyForSubmission ? "ready" : "pending"}`}>
        <span>{readyForSubmission ? <CheckIcon /> : "!"}</span>
        <div>
          <strong>{readyForSubmission ? "Application is ready for submission" : "Complete the remaining submission requirements"}</strong>
          <p>
            {readyForSubmission
              ? "The application form will be generated as a PDF and an appraisal task will be assigned."
              : "Each jewellery row needs declared ownership and proof. Select an appraiser and complete all five confirmations."}
          </p>
        </div>
        {!isSubmitted && (
          <button
            type="button"
            className="jds-primary-action"
            disabled={!readyForSubmission || saveStatus === "Saving"}
            onClick={handleCreateApplication}
          >
            <JewelleryIcon /> Create Application &amp; Submit to Appraiser
          </button>
        )}
      </div>

      {submission.open && (
        <div className="jds-loader-overlay" role="dialog" aria-modal="true" aria-labelledby="jds-loader-title">
          <div className="jds-loader-card">
            {submission.error ? (
              <>
                <span className="jds-loader-error-icon">!</span>
                <span className="jds-loader-eyebrow">SUBMISSION INTERRUPTED</span>
                <h3 id="jds-loader-title">Application could not be created</h3>
                <p>{submission.error}</p>
                <button type="button" className="jds-primary-action" onClick={() => setSubmission({ open: false, stage: 0, error: "" })}>
                  Close and review
                </button>
              </>
            ) : (
              <>
                <div className="jds-loader-mark">
                  <span className="jds-loader-ring" />
                  <JewelleryIcon />
                </div>
                <span className="jds-loader-eyebrow">YES BANK GOLD LOAN</span>
                <h3 id="jds-loader-title">
                  {submission.stage >= 5 ? "Application created" : "Creating your application"}
                </h3>
                <p>{loaderStages[Math.max(0, submission.stage - 1)]}</p>
                <div className="jds-loader-progress" aria-hidden="true">
                  <span style={{ width: `${Math.max(8, submission.stage * 20)}%` }} />
                </div>
                <div className="jds-loader-steps">
                  {loaderStages.map((stage, index) => (
                    <span className={submission.stage > index ? "complete" : submission.stage === index ? "active" : ""} key={stage}>
                      {submission.stage > index ? <CheckIcon /> : index + 1}
                    </span>
                  ))}
                </div>
                <small>Please keep this window open while we complete the handoff.</small>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JewelleryDetailsSubmissionPage;
