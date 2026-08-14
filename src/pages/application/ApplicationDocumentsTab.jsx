import { useMemo, useState } from "react";
import "./ApplicationDocumentsTab.css";

const DEFAULT_LEAD_API_BASE =
  "https://700pag34e9.execute-api.ap-south-1.amazonaws.com/prod/leads";

const parseLeadDetails = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const createActivityEvent = (event, actor) => ({
  id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: event.type || "document_event",
  title: event.title || "Documents updated",
  description: event.description || "",
  stage: event.stage || "Appraisal & Eligibility",
  section: event.section || "Documents",
  fromStatus: event.fromStatus || "",
  toStatus: event.toStatus || "",
  actor,
  comments: event.comments || "",
  createdAt: new Date().toISOString(),
  metadata: event.metadata || {},
});

export default function ApplicationDocumentsTab({
  leadId,
  lead,
  setLead,
  loggedInUserEmail = "",
  persona = "Viewer",
  leadApiBase = DEFAULT_LEAD_API_BASE,
}) {
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");

  const leadDetails = useMemo(
    () => parseLeadDetails(lead?.leadDetails ?? lead?.lead_details),
    [lead?.leadDetails, lead?.lead_details]
  );
  const documentsData = leadDetails.applicationDetail?.documents || {};

  // Use for uploads, verification, deletion flags, and generated-document updates.
  const persistDocumentsPatch = async (
    documentsPatch,
    activityEvent = null
  ) => {
    const leadIdentity = leadId || lead?.id || lead?.leadnumber;
    if (!leadIdentity) {
      setSaveState("error");
      setSaveError("Lead ID is unavailable.");
      return { success: false };
    }

    const currentDetails = parseLeadDetails(
      lead?.leadDetails ?? lead?.lead_details
    );
    const currentApplicationDetail = currentDetails.applicationDetail || {};
    const currentActivity = currentApplicationDetail.activity || {};
    const nextDocuments = {
      ...(currentApplicationDetail.documents || {}),
      ...documentsPatch,
      lastUpdatedAt: new Date().toISOString(),
    };

    let nextActivity = currentActivity;
    if (activityEvent) {
      const event = createActivityEvent(activityEvent, {
        name: lead?.loggedInUserName || "",
        email: loggedInUserEmail,
        role: persona,
      });
      nextActivity = {
        ...currentActivity,
        events: [...(currentActivity.events || []), event],
        lastUpdatedAt: event.createdAt,
      };
    }

    const nextApplicationDetail = {
      ...currentApplicationDetail,
      documents: nextDocuments,
      activity: nextActivity,
    };
    const nextLeadDetails = {
      ...currentDetails,
      applicationDetail: nextApplicationDetail,
    };

    setLead?.((previousLead) => ({
      ...previousLead,
      leadDetails: nextLeadDetails,
    }));
    setSaveState("saving");
    setSaveError("");

    try {
      const response = await fetch(
        `${leadApiBase}/${encodeURIComponent(leadIdentity)}/details`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadId: leadIdentity,
            leadDetailsPatch: { applicationDetail: nextApplicationDetail },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Unable to save Documents (${response.status}).`);
      }

      setSaveState("saved");
      return { success: true, data: nextDocuments };
    } catch (error) {
      setSaveState("error");
      setSaveError(error.message || "Unable to save Documents.");
      return { success: false, error };
    }
  };

  const handlePlaceholderSave = () => {
    persistDocumentsPatch({ scaffoldReady: true });
  };

  return (
    <section className="documents-tab" aria-labelledby="documents-tab-title">
      <div className="documents-tab__heading">
        <div>
          <p className="documents-tab__eyebrow">Application workspace</p>
          <h2 id="documents-tab-title">Documents</h2>
          <p>
            KYC, CIBIL, land, jewellery, appraisal, generated, and executed
            documents will be listed here.
          </p>
        </div>
        <span className="documents-tab__persona">{persona}</span>
      </div>

      <div className="documents-tab__placeholder">
        <span aria-hidden="true">03</span>
        <div>
          <h3>Document repository foundation is ready</h3>
          <p>
            The document table, filters, upload controls, and responsive cards
            will be added when we build this tab.
          </p>
        </div>
      </div>

      <div className="documents-tab__footer">
        <p aria-live="polite" className={`documents-tab__save ${saveState}`}>
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Placeholder state saved"}
          {saveState === "error" && saveError}
          {saveState === "idle" &&
            (documentsData.scaffoldReady
              ? "Placeholder state is available"
              : "No tab-specific changes yet")}
        </p>
        <button
          type="button"
          className="documents-tab__button"
          onClick={handlePlaceholderSave}
          disabled={saveState === "saving"}
        >
          Verify save setup
        </button>
      </div>
    </section>
  );
}
