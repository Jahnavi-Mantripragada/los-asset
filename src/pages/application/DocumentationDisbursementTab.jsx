import { useMemo, useState } from "react";
import "./DocumentationDisbursementTab.css";

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
  type: event.type || "workflow_action",
  title: event.title || "Documentation and disbursement updated",
  description: event.description || "",
  stage: event.stage || "Documentation & Disbursement",
  section: event.section || "Documentation & Disbursement",
  fromStatus: event.fromStatus || "",
  toStatus: event.toStatus || "",
  actor,
  comments: event.comments || "",
  createdAt: new Date().toISOString(),
  metadata: event.metadata || {},
});

export default function DocumentationDisbursementTab({
  leadId,
  lead,
  setLead,
  loggedInUserEmail = "",
  persona = "Viewer",
  isLocked = false,
  leadApiBase = DEFAULT_LEAD_API_BASE,
}) {
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");

  const leadDetails = useMemo(
    () => parseLeadDetails(lead?.leadDetails ?? lead?.lead_details),
    [lead?.leadDetails, lead?.lead_details]
  );
  const workflowData =
    leadDetails.applicationDetail?.documentationDisbursement || {};

  // Use for document generation, execution, CBS, checklist, and disbursement.
  const persistWorkflowPatch = async (workflowPatch, activityEvent = null) => {
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
    const nextWorkflow = {
      ...(currentApplicationDetail.documentationDisbursement || {}),
      ...workflowPatch,
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
      documentationDisbursement: nextWorkflow,
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
        throw new Error(
          `Unable to save Documentation & Disbursement (${response.status}).`
        );
      }

      setSaveState("saved");
      return { success: true, data: nextWorkflow };
    } catch (error) {
      setSaveState("error");
      setSaveError(
        error.message || "Unable to save Documentation & Disbursement."
      );
      return { success: false, error };
    }
  };

  const handlePlaceholderSave = () => {
    persistWorkflowPatch({ scaffoldReady: true });
  };

  return (
    <section
      className={`documentation-tab${isLocked ? " is-locked" : ""}`}
      aria-labelledby="documentation-tab-title"
    >
      <div className="documentation-tab__heading">
        <div>
          <p className="documentation-tab__eyebrow">Application workspace</p>
          <h2 id="documentation-tab-title">Documentation &amp; Disbursement</h2>
          <p>
            Sanction, document generation, execution, pre-disbursement checks,
            and final CBS disbursement will live here.
          </p>
        </div>
        <span className="documentation-tab__persona">
          {isLocked ? "Locked" : persona}
        </span>
      </div>

      <div className="documentation-tab__placeholder">
        <span aria-hidden="true">04</span>
        <div>
          <h3>
            {isLocked
              ? "Available after Checker sanction"
              : "Documentation and disbursement foundation is ready"}
          </h3>
          <p>
            {isLocked
              ? "The parent can unlock this tab by passing isLocked={false}."
              : "The Stage 3 workflows will be added when we build this tab."}
          </p>
        </div>
      </div>

      <div className="documentation-tab__footer">
        <p
          aria-live="polite"
          className={`documentation-tab__save ${saveState}`}
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Placeholder state saved"}
          {saveState === "error" && saveError}
          {saveState === "idle" &&
            (workflowData.scaffoldReady
              ? "Placeholder state is available"
              : "No tab-specific changes yet")}
        </p>
        <button
          type="button"
          className="documentation-tab__button"
          onClick={handlePlaceholderSave}
          disabled={isLocked || saveState === "saving"}
        >
          {isLocked ? "Locked until sanction" : "Verify save setup"}
        </button>
      </div>
    </section>
  );
}
