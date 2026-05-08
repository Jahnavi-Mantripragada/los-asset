const STORAGE_KEY = "los_uploaded_documents";
export const DOCUMENT_UPLOAD_EVENT = "los-document-uploaded";

export function getUploadedDocuments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveUploadedDocument(document) {
  const existingDocuments = getUploadedDocuments();

  const documentKey = `${document.applicant || "Primary Applicant"}__${document.type}__${document.subtype}`;

  const updatedDocument = {
    ...document,
    documentKey,
    status: "Uploaded",
    uploadedBy: document.uploadedBy || "Sales User",
    uploadedOn:
      document.uploadedOn ||
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
  };

  const nextDocuments = [
    updatedDocument,
    ...existingDocuments.filter((item) => item.documentKey !== documentKey),
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDocuments));

  window.dispatchEvent(new Event(DOCUMENT_UPLOAD_EVENT));

  return updatedDocument;
}

export function removeUploadedDocument({ applicant = "Primary Applicant", type, subtype }) {
  const existingDocuments = getUploadedDocuments();
  const documentKey = `${applicant}__${type}__${subtype}`;

  const nextDocuments = existingDocuments.filter(
    (item) => item.documentKey !== documentKey
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDocuments));
  window.dispatchEvent(new Event(DOCUMENT_UPLOAD_EVENT));
}