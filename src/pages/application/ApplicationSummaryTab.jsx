import { useMemo, useState } from "react";
import "./ApplicationSummaryTab.css";

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
  type: event.type || "data_update",
  title: event.title || "Summary updated",
  description: event.description || "",
  stage: event.stage || "Appraisal & Eligibility",
  section: event.section || "Summary",
  fromStatus: event.fromStatus || "",
  toStatus: event.toStatus || "",
  actor,
  comments: event.comments || "",
  createdAt: new Date().toISOString(),
  metadata: event.metadata || {},
});

export default function ApplicationSummaryTab({
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

  const summaryData = leadDetails.applicationDetail?.summary || {};

  // Use this for future Summary actions. It updates parent state first and then
  // persists the complete applicationDetail node without dropping sibling tabs.
  const persistSummaryPatch = async (summaryPatch, activityEvent = null) => {
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
    const nextSummary = {
      ...(currentApplicationDetail.summary || {}),
      ...summaryPatch,
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
      summary: nextSummary,
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
            leadDetailsPatch: {
              applicationDetail: nextApplicationDetail,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Unable to save Summary (${response.status}).`);
      }

      setSaveState("saved");
      return { success: true, data: nextSummary };
    } catch (error) {
      setSaveState("error");
      setSaveError(error.message || "Unable to save Summary.");
      return { success: false, error };
    }
  };

  const handlePlaceholderSave = () => {
    persistSummaryPatch({ scaffoldReady: true });
  };

  return (
    <section className="summary-tab" aria-labelledby="summary-tab-title">
      <div className="summary-tab__heading">
        <div>
          <p className="summary-tab__eyebrow">Application workspace</p>
          <h2 id="summary-tab-title">Summary</h2>
          <p>
            Financial overview, application snapshot, checklist, and exceptions
            will be built here.
          </p>
        </div>
        <span className="summary-tab__persona">{persona}</span>
      </div>

      <div className="summary-tab__placeholder">
        <span aria-hidden="true">01</span>
        <div>
          <h3>Summary tab foundation is ready</h3>
          <p>
            This placeholder is connected to the shared lead state and the lead
            details PATCH endpoint.
          </p>
        </div>
      </div>

      <div className="summary-tab__footer">
        <p aria-live="polite" className={`summary-tab__save ${saveState}`}>
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Placeholder state saved"}
          {saveState === "error" && saveError}
          {saveState === "idle" &&
            (summaryData.scaffoldReady
              ? "Placeholder state is available"
              : "No tab-specific changes yet")}
        </p>
        <button
          type="button"
          className="summary-tab__button"
          onClick={handlePlaceholderSave}
          disabled={saveState === "saving"}
        >
          Verify save setup
        </button>
      </div>
    </section>
  );
}
