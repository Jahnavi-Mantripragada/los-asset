import { useEffect, useMemo, useState } from "react";
import "./DocumentsPage.css";
import {
  DOCUMENT_UPLOAD_EVENT,
  getUploadedDocuments,
  saveUploadedDocument,
} from "../../utils/documentStore";

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1">
    <path d="M21 12a9 9 0 0 1-15.5 6.3" />
    <path d="M3 12A9 9 0 0 1 18.5 5.7" />
    <path d="M18 2v4h4" />
    <path d="M6 22v-4H2" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M18 6 6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

const applicants = [
  {
    key: "Primary Applicant",
    name: "Rahul Sharma",
    role: "Primary Applicant",
  },
  {
    key: "Priya Sharma",
    name: "Priya Sharma",
    role: "Co-Applicant",
  },
  {
    key: "Mahesh Sharma",
    name: "Mahesh Sharma",
    role: "Guarantor",
  },
];

const baseChecklist = [
  {
    type: "Identity Proof",
    subtype: "PAN Card",
    mandatory: true,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Photograph",
    subtype: "Applicant Photo",
    mandatory: true,
    ocrStatus: "Not Applicable",
    verificationStatus: "Pending",
  },
  {
    type: "Address Proof",
    subtype: "Aadhaar",
    mandatory: true,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Address Proof",
    subtype: "Driving License",
    mandatory: false,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Address Proof",
    subtype: "Voter ID",
    mandatory: false,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Income Proof",
    subtype: "Salary Slip - Latest Month",
    mandatory: true,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Income Proof",
    subtype: "Bank Statement - 6 Months",
    mandatory: true,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Income Proof",
    subtype: "Form 16",
    mandatory: false,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Application Document",
    subtype: "Generated Application Form",
    mandatory: true,
    ocrStatus: "Not Applicable",
    verificationStatus: "Pending",
  },
  {
    type: "Application Document",
    subtype: "Signed Application Form",
    mandatory: true,
    ocrStatus: "Not Applicable",
    verificationStatus: "Pending",
  },
];

const primaryOnlyChecklist = [
  {
    type: "Property Document",
    subtype: "Property Title / Chain Document",
    mandatory: false,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
  {
    type: "Property Document",
    subtype: "Agreement to Sale",
    mandatory: false,
    ocrStatus: "Pending",
    verificationStatus: "Pending",
  },
];

const filterOptions = ["All", "Pending", "Uploaded", "Verified", "Mandatory"];

function createDocumentKey(document) {
  return `${document.applicantKey || document.applicant || "Primary Applicant"}__${document.type}__${document.subtype}`;
}

function getChecklistForApplicant(applicant) {
  const checklist = applicant.key === "Primary Applicant"
    ? [...baseChecklist, ...primaryOnlyChecklist]
    : baseChecklist;

  return checklist.map((item, index) => ({
    ...item,
    id: `${applicant.key}-${item.type}-${item.subtype}-${index}`,
    applicantKey: applicant.key,
    applicantName: applicant.name,
    applicantRole: applicant.role,
    documentKey: `${applicant.key}__${item.type}__${item.subtype}`,
    status: "Pending",
    source: "",
    uploadedBy: "",
    uploadedOn: "",
    fileName: "",
    fileType: "",
    previewUrl: "",
  }));
}

function buildDocumentsFromChecklist() {
  const actualUploads = getUploadedDocuments();

  return applicants.flatMap((applicant) => {
    const checklist = getChecklistForApplicant(applicant);

    return checklist.map((checklistItem) => {
      const uploadedDocument = actualUploads.find(
        (item) => item.documentKey === checklistItem.documentKey
      );

      if (!uploadedDocument) {
        return checklistItem;
      }

      return {
        ...checklistItem,
        ...uploadedDocument,
        applicantKey: checklistItem.applicantKey,
        applicantName: checklistItem.applicantName,
        applicantRole: checklistItem.applicantRole,
        documentKey: checklistItem.documentKey,
        status: "Uploaded",
        source: uploadedDocument.source || "Internal Upload",
      };
    });
  });
}

function getStatusClass(status) {
  if (status === "Uploaded") return "uploaded";
  if (status === "Verified") return "verified";
  if (status === "Rejected") return "rejected";
  return "pending";
}

function DocumentsPage() {
  const [documents, setDocuments] = useState(buildDocumentsFromChecklist);
  const [selectedApplicantKey, setSelectedApplicantKey] = useState(applicants[0].key);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  const selectedApplicant = applicants.find(
    (applicant) => applicant.key === selectedApplicantKey
  );

  const refreshDocuments = () => {
    setDocuments(buildDocumentsFromChecklist());
  };

  useEffect(() => {
    refreshDocuments();

    window.addEventListener(DOCUMENT_UPLOAD_EVENT, refreshDocuments);
    window.addEventListener("storage", refreshDocuments);

    return () => {
      window.removeEventListener(DOCUMENT_UPLOAD_EVENT, refreshDocuments);
      window.removeEventListener("storage", refreshDocuments);
    };
  }, []);

  const applicantStats = useMemo(() => {
    return applicants.map((applicant) => {
      const applicantDocs = documents.filter(
        (doc) => doc.applicantKey === applicant.key
      );

      const uploaded = applicantDocs.filter((doc) => doc.status === "Uploaded").length;
      const mandatory = applicantDocs.filter((doc) => doc.mandatory).length;
      const mandatoryUploaded = applicantDocs.filter(
        (doc) => doc.mandatory && doc.status === "Uploaded"
      ).length;

      return {
        ...applicant,
        total: applicantDocs.length,
        uploaded,
        mandatory,
        mandatoryUploaded,
      };
    });
  }, [documents]);

  const applicantDocuments = useMemo(() => {
    return documents.filter((doc) => doc.applicantKey === selectedApplicantKey);
  }, [documents, selectedApplicantKey]);

  const filteredDocuments = useMemo(() => {
    return applicantDocuments.filter((doc) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Mandatory" && doc.mandatory) ||
        doc.status === activeFilter ||
        doc.verificationStatus === activeFilter;

      const search = searchText.trim().toLowerCase();

      const matchesSearch =
        !search ||
        doc.type.toLowerCase().includes(search) ||
        doc.subtype.toLowerCase().includes(search) ||
        doc.applicantName.toLowerCase().includes(search) ||
        doc.applicantRole.toLowerCase().includes(search) ||
        String(doc.source || "").toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [applicantDocuments, activeFilter, searchText]);

  const stats = useMemo(() => {
    const uploaded = applicantDocuments.filter((doc) => doc.status === "Uploaded").length;
    const pending = applicantDocuments.filter((doc) => doc.status === "Pending").length;
    const mandatory = applicantDocuments.filter((doc) => doc.mandatory).length;
    const mandatoryUploaded = applicantDocuments.filter(
      (doc) => doc.mandatory && doc.status === "Uploaded"
    ).length;

    return {
      total: applicantDocuments.length,
      uploaded,
      pending,
      mandatory,
      mandatoryUploaded,
      completion: applicantDocuments.length
        ? Math.round((uploaded / applicantDocuments.length) * 100)
        : 0,
    };
  }, [applicantDocuments]);

  const groupedDocuments = useMemo(() => {
    return filteredDocuments.reduce((acc, doc) => {
      if (!acc[doc.type]) acc[doc.type] = [];
      acc[doc.type].push(doc);
      return acc;
    }, {});
  }, [filteredDocuments]);

  const actualUploadedDocuments = applicantDocuments.filter(
    (doc) => doc.status === "Uploaded"
  );

  const handleUpload = (event, document) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : "";

    saveUploadedDocument({
      applicant: document.applicantKey,
      applicantName: document.applicantName,
      applicantRole: document.applicantRole,
      type: document.type,
      subtype: document.subtype,
      source: "Internal Upload",
      fileName: file.name,
      fileType: isImage ? "Image" : "PDF / Document",
      previewUrl,
      ocrStatus:
        document.type === "Identity Proof" || document.type === "Address Proof"
          ? "Captured"
          : document.ocrStatus === "Not Applicable"
            ? "Not Applicable"
            : "Pending Review",
      verificationStatus:
        document.type === "Photograph" ? "Captured" : "Pending Review",
    });

    refreshDocuments();
  };

  const handleMarkVerified = (documentId) => {
    setDocuments((previous) =>
      previous.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              verificationStatus: "Verified",
            }
          : doc
      )
    );
  };

  return (
    <div className="documents-page">
      <section className="doc-hero-card">
        <div className="doc-hero-left">
          <div className="doc-icon-wrap">
            <FileIcon />
          </div>
          <div>
            <span className="doc-eyebrow">Step 05</span>
            <h3>Documents</h3>
            <p>
              Manage applicant-wise document checklist, pending uploads, uploaded files, and verification status.
            </p>
          </div>
        </div>

        <div className="doc-completion-box">
          <strong>{stats.completion}%</strong>
          <span>{stats.uploaded}/{stats.total} uploaded for {selectedApplicant?.name}</span>
        </div>
      </section>

      <section className="doc-applicant-tabs">
        {applicantStats.map((applicant) => (
          <button
            key={applicant.key}
            type="button"
            className={selectedApplicantKey === applicant.key ? "active" : ""}
            onClick={() => {
              setSelectedApplicantKey(applicant.key);
              setActiveFilter("All");
              setSearchText("");
            }}
          >
            <span className="doc-tab-avatar">
              {applicant.name
                .split(" ")
                .map((item) => item[0])
                .slice(0, 2)
                .join("")}
            </span>

            <span className="doc-tab-content">
              <strong>{applicant.name}</strong>
              <small>
                {applicant.role} · {applicant.uploaded}/{applicant.total} uploaded
              </small>
            </span>

            <span className="doc-tab-count">
              {applicant.mandatoryUploaded}/{applicant.mandatory}
            </span>
          </button>
        ))}
      </section>

      <section className="doc-kpi-grid">
        <div className="doc-kpi-card">
          <span>Total Checklist</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="doc-kpi-card success">
          <span>Uploaded</span>
          <strong>{stats.uploaded}</strong>
        </div>
        <div className="doc-kpi-card warning">
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="doc-kpi-card">
          <span>Mandatory Complete</span>
          <strong>{stats.mandatoryUploaded}/{stats.mandatory}</strong>
        </div>
      </section>

      <section className="doc-toolbar-card">
        <div className="doc-filter-row">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              type="button"
              className={activeFilter === filter ? "active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <input
          className="doc-search"
          value={searchText}
          placeholder="Search by type, subtype, source..."
          onChange={(event) => setSearchText(event.target.value)}
        />
      </section>

      <section className="doc-layout">
        <main className="doc-main">
          {Object.entries(groupedDocuments).map(([type, docs]) => (
            <section className="doc-group-card" key={type}>
              <div className="doc-group-header">
                <div>
                  <span className="doc-eyebrow">Document Type</span>
                  <h4>{type}</h4>
                </div>
                <span className="doc-group-count">{docs.length} records</span>
              </div>

              <div className="doc-list">
                {docs.map((doc) => {
                  const statusClass = getStatusClass(doc.status);
                  const isUploaded = doc.status === "Uploaded";

                  return (
                    <article className="doc-row-card" key={doc.id}>
                      <div className="doc-row-main">
                        <div className={`doc-file-icon ${statusClass}`}>
                          {isUploaded ? <CheckIcon /> : <FileIcon />}
                        </div>

                        <div className="doc-title-block">
                          <div className="doc-title-line">
                            <h5>{doc.subtype}</h5>
                            {doc.mandatory && <span className="doc-required">Mandatory</span>}
                          </div>

                          <p>
                            {doc.applicantName} · {doc.applicantRole}
                            {doc.source ? ` · Source: ${doc.source}` : ""}
                          </p>

                          {isUploaded ? (
                            <div className="doc-file-meta">
                              <span>{doc.fileName}</span>
                              <span>{doc.fileType}</span>
                              <span>Uploaded by {doc.uploadedBy}</span>
                              <span>{doc.uploadedOn}</span>
                              <span>Source: {doc.source || "Internal Upload"}</span>
                            </div>
                          ) : (
                            <div className="doc-pending-note">
                              <AlertIcon />
                              Document pending upload
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="doc-status-stack">
                        <span className={`doc-status-pill ${statusClass}`}>
                          {doc.status}
                        </span>
                        <span className={`doc-sub-status ${doc.verificationStatus === "Verified" ? "verified" : ""}`}>
                          {doc.verificationStatus}
                        </span>
                        <span className="doc-ocr-status">
                          OCR: {doc.ocrStatus}
                        </span>
                      </div>

                      <div className="doc-actions">
                        {isUploaded && (
                          <>
                            <button
                              type="button"
                              className="doc-action-btn"
                              onClick={() => setPreviewDoc(doc)}
                            >
                              <EyeIcon />
                              View
                            </button>

                            {doc.verificationStatus !== "Verified" && (
                              <button
                                type="button"
                                className="doc-action-btn verify"
                                onClick={() => handleMarkVerified(doc.id)}
                              >
                                <CheckIcon />
                                Mark Verified
                              </button>
                            )}
                          </>
                        )}

                        <label className={`doc-upload-btn ${isUploaded ? "secondary" : ""}`}>
                          {isUploaded ? <RefreshIcon /> : <UploadIcon />}
                          {isUploaded ? "Re-upload" : "Upload"}
                          <input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(event) => handleUpload(event, doc)}
                          />
                        </label>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </main>

        <aside className="doc-side">
          <section className="doc-side-card">
            <h4>{selectedApplicant?.name}</h4>
            <p className="doc-side-subtitle">{selectedApplicant?.role}</p>

            <div className="doc-progress-block">
              <div className="doc-progress-top">
                <span>Overall Completion</span>
                <strong>{stats.completion}%</strong>
              </div>
              <div className="doc-progress-track">
                <div className="doc-progress-fill" style={{ width: `${stats.completion}%` }} />
              </div>
            </div>

            <div className="doc-checklist">
              <div className={stats.uploaded > 0 ? "done" : ""}>
                <span>{stats.uploaded > 0 ? <CheckIcon /> : "•"}</span>
                Uploaded documents available
              </div>
              <div className={stats.mandatoryUploaded === stats.mandatory ? "done" : ""}>
                <span>{stats.mandatoryUploaded === stats.mandatory ? <CheckIcon /> : "•"}</span>
                Mandatory documents complete
              </div>
              <div className={stats.pending === 0 ? "done" : ""}>
                <span>{stats.pending === 0 ? <CheckIcon /> : "•"}</span>
                No pending documents
              </div>
            </div>
          </section>

          <section className="doc-side-card soft">
            <h4>Actual Uploaded</h4>

            {actualUploadedDocuments.length === 0 ? (
              <div className="doc-empty-uploaded">
                <FileIcon />
                <p>No documents uploaded yet for {selectedApplicant?.name}.</p>
              </div>
            ) : (
              <div className="doc-captured-list">
                {actualUploadedDocuments.map((doc) => (
                  <div key={doc.documentKey}>
                    <span className="doc-mini-icon success">
                      <CheckIcon />
                    </span>
                    <div>
                      <strong>{doc.subtype}</strong>
                      <p>{doc.source || "Internal Upload"} · {doc.fileName}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="doc-side-card soft">
            <h4>Source Logic</h4>
            <div className="doc-rule-list">
              <p>Source stays blank until the document is uploaded.</p>
              <p>Manual uploads from this page are marked as Internal Upload.</p>
              <p>Uploads from earlier steps keep their step source, such as Customer Identity or Applicant Profile.</p>
            </div>
          </section>
        </aside>
      </section>

      {previewDoc && (
        <div
          className="doc-preview-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setPreviewDoc(null);
          }}
        >
          <section className="doc-preview-modal">
            <header>
              <div>
                <span className="doc-eyebrow">Document Preview</span>
                <h3>{previewDoc.subtype}</h3>
                <p>{previewDoc.fileName}</p>
              </div>

              <button type="button" onClick={() => setPreviewDoc(null)}>
                <XIcon />
              </button>
            </header>

            <div className="doc-preview-body">
              {previewDoc.previewUrl ? (
                <img src={previewDoc.previewUrl} alt={previewDoc.subtype} />
              ) : (
                <div className="doc-preview-placeholder">
                  <FileIcon />
                  <strong>{previewDoc.fileName}</strong>
                  <p>
                    Preview is available for image uploads. PDF/document records are shown as metadata.
                  </p>
                </div>
              )}
            </div>

            <footer>
              <div>
                <span>Applicant</span>
                <strong>{previewDoc.applicantName}</strong>
              </div>
              <div>
                <span>Uploaded By</span>
                <strong>{previewDoc.uploadedBy}</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>{previewDoc.source || "Internal Upload"}</strong>
              </div>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default DocumentsPage;