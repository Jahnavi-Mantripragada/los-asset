import { useMemo, useState } from "react";
import "./ApplicationDetailsTab.css";

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
  title: event.title || "Application details updated",
  description: event.description || "",
  stage: event.stage || "Appraisal & Eligibility",
  section: event.section || "Application Details",
  fromStatus: event.fromStatus || "",
  toStatus: event.toStatus || "",
  actor,
  comments: event.comments || "",
  createdAt: new Date().toISOString(),
  metadata: event.metadata || {},
});

export default function ApplicationDetailsTab({
  leadId,
  lead,
  setLead,
  loggedInUserEmail = "",
  persona = "Viewer",
  initialSection = "customerKyc",
  leadApiBase = DEFAULT_LEAD_API_BASE,
}) {
  const [saveState, setSaveState] = useState("idle");
  const [saveError, setSaveError] = useState("");

  const leadDetails = useMemo(
    () => parseLeadDetails(lead?.leadDetails ?? lead?.lead_details),
    [lead?.leadDetails, lead?.lead_details]
  );
  const detailsData = leadDetails.applicationDetail?.details || {};

  // Future section actions can pass partial details and an optional activity.
  const persistDetailsPatch = async (detailsPatch, activityEvent = null) => {
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
    const nextDetails = {
      ...(currentApplicationDetail.details || {}),
      ...detailsPatch,
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
      details: nextDetails,
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
          `Unable to save Application Details (${response.status}).`
        );
      }

      setSaveState("saved");
      return { success: true, data: nextDetails };
    } catch (error) {
      setSaveState("error");
      setSaveError(error.message || "Unable to save Application Details.");
      return { success: false, error };
    }
  };

  const handlePlaceholderSave = () => {
    persistDetailsPatch({ scaffoldReady: true, lastSection: initialSection });
  };

  return (
    <section className="details-tab" aria-labelledby="details-tab-title">
      <div className="details-tab__heading">
        <div>
          <p className="details-tab__eyebrow">Application workspace</p>
          <h2 id="details-tab-title">Application Details</h2>
          <p>
            Customer &amp; KYC, Loan &amp; Branch, Compliance, Jewellery
            Appraisal, Eligibility, and Checker Decision will live here.
          </p>
        </div>
        <span className="details-tab__persona">{persona}</span>
      </div>

      <div className="details-tab__placeholder">
        <span aria-hidden="true">02</span>
        <div>
          <h3>Application details foundation is ready</h3>
          <p>
            The section navigator and persona-specific forms will be added when
            we work on this tab.
          </p>
        </div>
      </div>

      <div className="details-tab__footer">
        <p aria-live="polite" className={`details-tab__save ${saveState}`}>
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Placeholder state saved"}
          {saveState === "error" && saveError}
          {saveState === "idle" &&
            (detailsData.scaffoldReady
              ? "Placeholder state is available"
              : "No tab-specific changes yet")}
        </p>
        <button
          type="button"
          className="details-tab__button"
          onClick={handlePlaceholderSave}
          disabled={saveState === "saving"}
        >
          Verify save setup
        </button>
      </div>
    </section>
  );
}
