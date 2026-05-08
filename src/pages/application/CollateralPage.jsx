import { useMemo, useState } from "react";
import "./CollateralPage.css";
import { saveUploadedDocument } from "../../utils/documentStore";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M16 8h2a2 2 0 0 1 2 2v11" />
    <path d="M8 7h2" />
    <path d="M8 11h2" />
    <path d="M8 15h2" />
    <path d="M4 21h17" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const RupeeIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13h7a5 5 0 0 0 0-10" />
    <path d="m6 13 8 8" />
  </svg>
);

const MapIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
    <path d="M9 3v15" />
    <path d="M15 6v15" />
  </svg>
);

const initialCollateral = {
  propertyIdentified: "Yes",
  collateralType: "Residential Property",
  propertyType: "Flat / Apartment",
  propertyUsage: "Self Occupied",
  propertyStage: "Ready to Move",
  occupancyStatus: "Occupied by Applicant",
  propertyOwnershipType: "Owned",
  projectName: "Shree Heights",
  builderName: "Shree Developers",
  towerBlock: "Tower A",
  unitNumber: "402",
  floorNumber: "4",
  totalFloors: "18",
  carpetArea: "820",
  builtUpArea: "1040",
  areaUnit: "Sq. Ft.",
  propertyAgeYears: "5",
  agreementValue: "7800000",
  estimatedMarketValue: "8600000",
  valuationAmount: "8400000",
  existingMortgage: "No",
  mortgageBankName: "",
  outstandingLoanAmount: "",
  legalStatus: "Pending",
  technicalStatus: "Pending",
  valuationStatus: "Pending",
  titleClearanceStatus: "Pending",
};

const initialAddress = {
  line1: "Flat 402, Shree Heights",
  line2: "Andheri Kurla Road",
  landmark: "Near Metro Station",
  city: "Mumbai",
  district: "Mumbai Suburban",
  state: "Maharashtra",
  pincode: "400059",
  country: "India",
};

const initialOwners = [
  {
    id: "OWN-001",
    name: "Rahul Sharma",
    role: "Primary Applicant",
    ownershipShare: "70",
    pan: "ABCDE1234F",
  },
  {
    id: "OWN-002",
    name: "Priya Sharma",
    role: "Co-Applicant",
    ownershipShare: "30",
    pan: "BCDEF2345G",
  },
];

const documentChecklist = [
  {
    id: "PROP-DOC-001",
    type: "Property Document",
    subtype: "Property Title / Chain Document",
    mandatory: true,
  },
  {
    id: "PROP-DOC-002",
    type: "Property Document",
    subtype: "Agreement to Sale",
    mandatory: true,
  },
  {
    id: "PROP-DOC-003",
    type: "Property Document",
    subtype: "Index II",
    mandatory: false,
  },
  {
    id: "PROP-DOC-004",
    type: "Property Document",
    subtype: "Property Tax Receipt",
    mandatory: false,
  },
  {
    id: "PROP-DOC-005",
    type: "Property Document",
    subtype: "Approved Building Plan",
    mandatory: false,
  },
  {
    id: "PROP-DOC-006",
    type: "Property Document",
    subtype: "Occupancy Certificate",
    mandatory: false,
  },
  {
    id: "PROP-DOC-007",
    type: "Property Document",
    subtype: "NOC from Society / Builder",
    mandatory: false,
  },
];

const propertyIdentifiedOptions = ["Yes", "No"];
const collateralTypeOptions = ["Residential Property", "Commercial Property", "Plot / Land", "Industrial Property"];
const propertyTypeOptions = ["Flat / Apartment", "Independent House", "Villa", "Row House", "Shop", "Office", "Plot", "Warehouse"];
const propertyUsageOptions = ["Self Occupied", "Rented", "Vacant", "Under Construction", "Business Use"];
const propertyStageOptions = ["Ready to Move", "Under Construction", "Resale", "New Booking"];
const occupancyStatusOptions = ["Occupied by Applicant", "Occupied by Tenant", "Vacant", "Builder Possession", "Seller Possession"];
const ownershipTypeOptions = ["Owned", "Jointly Owned", "Ancestral", "Leasehold", "Under Transfer"];
const statusOptions = ["Pending", "Initiated", "Completed", "Sent Back", "Waived"];

function Field({ label, children, required }) {
  return (
    <label className="coll-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      className="coll-input"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      className="coll-input coll-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function CurrencyInput({ value, onChange, placeholder }) {
  return (
    <div className="coll-currency-input">
      <span>₹</span>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function AddressBlock({ address, onChange }) {
  const updateAddress = (key, value) => {
    onChange({
      ...address,
      [key]: value,
    });
  };

  return (
    <div className="coll-address-card">
      <div className="coll-address-title">
        <span>
          <MapIcon />
        </span>
        <div>
          <h4>Property Address</h4>
          <p>Capture exact collateral location for technical and legal verification.</p>
        </div>
      </div>

      <div className="coll-field-grid two">
        <Field label="Address Line 1" required>
          <TextInput
            value={address.line1}
            placeholder="Flat / house / building"
            onChange={(value) => updateAddress("line1", value)}
          />
        </Field>

        <Field label="Address Line 2">
          <TextInput
            value={address.line2}
            placeholder="Street / area"
            onChange={(value) => updateAddress("line2", value)}
          />
        </Field>

        <Field label="Landmark">
          <TextInput
            value={address.landmark}
            placeholder="Nearby landmark"
            onChange={(value) => updateAddress("landmark", value)}
          />
        </Field>

        <Field label="City" required>
          <TextInput
            value={address.city}
            placeholder="City"
            onChange={(value) => updateAddress("city", value)}
          />
        </Field>

        <Field label="District">
          <TextInput
            value={address.district}
            placeholder="District"
            onChange={(value) => updateAddress("district", value)}
          />
        </Field>

        <Field label="State" required>
          <TextInput
            value={address.state}
            placeholder="State"
            onChange={(value) => updateAddress("state", value)}
          />
        </Field>

        <Field label="PIN Code" required>
          <TextInput
            value={address.pincode}
            placeholder="PIN code"
            onChange={(value) => updateAddress("pincode", value)}
          />
        </Field>

        <Field label="Country">
          <TextInput
            value={address.country}
            placeholder="Country"
            onChange={(value) => updateAddress("country", value)}
          />
        </Field>
      </div>
    </div>
  );
}

function StatusSelect({ label, value, onChange }) {
  return (
    <div className="coll-status-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
  );
}

function CollateralPage() {
  const [collateral, setCollateral] = useState(initialCollateral);
  const [propertyAddress, setPropertyAddress] = useState(initialAddress);
  const [owners, setOwners] = useState(initialOwners);
  const [documents, setDocuments] = useState(
    documentChecklist.map((doc) => ({
      ...doc,
      status: "Pending",
      fileName: "",
      uploadedBy: "",
      uploadedOn: "",
      fileType: "",
      previewUrl: "",
    }))
  );

  const updateCollateral = (key, value) => {
    setCollateral((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateOwner = (ownerId, key, value) => {
    setOwners((previous) =>
      previous.map((owner) =>
        owner.id === ownerId
          ? {
              ...owner,
              [key]: value,
            }
          : owner
      )
    );
  };

  const addOwner = () => {
    setOwners((previous) => [
      ...previous,
      {
        id: `OWN-${Date.now()}`,
        name: "",
        role: "Property Owner",
        ownershipShare: "",
        pan: "",
      },
    ]);
  };

  const removeOwner = (ownerId) => {
    setOwners((previous) => previous.filter((owner) => owner.id !== ownerId));
  };

  const handleDocumentUpload = (event, documentId) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : "";
    const uploadedOn = new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setDocuments((previous) =>
      previous.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              status: "Uploaded",
              fileName: file.name,
              fileType: isImage ? "Image" : "PDF / Document",
              previewUrl,
              uploadedBy: "Sales User",
              uploadedOn,
            }
          : doc
      )
    );

    const currentDoc = documents.find((doc) => doc.id === documentId);

    if (currentDoc) {
      saveUploadedDocument({
        applicant: "Primary Applicant",
        applicantName: "Rahul Sharma",
        applicantRole: "Primary Applicant",
        type: currentDoc.type,
        subtype: currentDoc.subtype,
        source: "Collateral",
        fileName: file.name,
        fileType: isImage ? "Image" : "PDF / Document",
        previewUrl,
        ocrStatus: "Pending Review",
        verificationStatus: "Pending Review",
      });
    }
  };

  const completionItems = useMemo(() => {
    return [
      {
        label: "Property identified",
        complete: collateral.propertyIdentified === "Yes",
      },
      {
        label: "Property details captured",
        complete: Boolean(collateral.propertyType && collateral.projectName && collateral.unitNumber),
      },
      {
        label: "Property address captured",
        complete: Boolean(propertyAddress.line1 && propertyAddress.city && propertyAddress.pincode),
      },
      {
        label: "Owner details captured",
        complete: owners.length > 0 && owners.every((owner) => owner.name && owner.ownershipShare),
      },
      {
        label: "Valuation captured",
        complete: Boolean(collateral.estimatedMarketValue && collateral.valuationAmount),
      },
      {
        label: "Mandatory property docs uploaded",
        complete: documents
          .filter((doc) => doc.mandatory)
          .every((doc) => doc.status === "Uploaded"),
      },
    ];
  }, [collateral, propertyAddress, owners, documents]);

  const uploadedDocCount = documents.filter((doc) => doc.status === "Uploaded").length;
  const mandatoryDocs = documents.filter((doc) => doc.mandatory);
  const mandatoryUploadedCount = mandatoryDocs.filter((doc) => doc.status === "Uploaded").length;
  const completedCount = completionItems.filter((item) => item.complete).length;

  return (
    <div className="collateral-page">
      <section className="coll-hero-card">
        <div className="coll-hero-left">
          <div className="coll-icon-wrap">
            <HomeIcon />
          </div>
          <div>
            <span className="coll-eyebrow">Step 06</span>
            <h3>Collateral Details</h3>
            <p>
              Capture property information, ownership, valuation, legal/technical status and property documents.
            </p>
          </div>
        </div>

        <div className="coll-completion-box">
          <strong>{completedCount}/{completionItems.length}</strong>
          <span>Collateral checks completed</span>
        </div>
      </section>

      <section className="coll-kpi-grid">
        <div className="coll-kpi-card">
          <span>Property Status</span>
          <strong>{collateral.propertyIdentified}</strong>
        </div>

        <div className="coll-kpi-card">
          <span>Valuation Amount</span>
          <strong>₹{Number(collateral.valuationAmount || 0).toLocaleString("en-IN")}</strong>
        </div>

        <div className="coll-kpi-card success">
          <span>Uploaded Docs</span>
          <strong>{uploadedDocCount}/{documents.length}</strong>
        </div>

        <div className="coll-kpi-card warning">
          <span>Mandatory Docs</span>
          <strong>{mandatoryUploadedCount}/{mandatoryDocs.length}</strong>
        </div>
      </section>

      <section className="coll-layout">
        <main className="coll-main">
          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Property Identification</span>
                <h4>Basic Collateral Information</h4>
              </div>
            </div>

            <div className="coll-field-grid three">
              <Field label="Property Identified" required>
                <SelectInput
                  value={collateral.propertyIdentified}
                  onChange={(value) => updateCollateral("propertyIdentified", value)}
                >
                  {propertyIdentifiedOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Collateral Type" required>
                <SelectInput
                  value={collateral.collateralType}
                  onChange={(value) => updateCollateral("collateralType", value)}
                >
                  {collateralTypeOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Property Type" required>
                <SelectInput
                  value={collateral.propertyType}
                  onChange={(value) => updateCollateral("propertyType", value)}
                >
                  {propertyTypeOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Property Usage">
                <SelectInput
                  value={collateral.propertyUsage}
                  onChange={(value) => updateCollateral("propertyUsage", value)}
                >
                  {propertyUsageOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Property Stage">
                <SelectInput
                  value={collateral.propertyStage}
                  onChange={(value) => updateCollateral("propertyStage", value)}
                >
                  {propertyStageOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Occupancy Status">
                <SelectInput
                  value={collateral.occupancyStatus}
                  onChange={(value) => updateCollateral("occupancyStatus", value)}
                >
                  {occupancyStatusOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Ownership Type">
                <SelectInput
                  value={collateral.propertyOwnershipType}
                  onChange={(value) => updateCollateral("propertyOwnershipType", value)}
                >
                  {ownershipTypeOptions.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </section>

          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Project / Unit Details</span>
                <h4>Property Unit Information</h4>
              </div>
            </div>

            <div className="coll-field-grid three">
              <Field label="Project / Property Name" required>
                <TextInput
                  value={collateral.projectName}
                  placeholder="Project / property name"
                  onChange={(value) => updateCollateral("projectName", value)}
                />
              </Field>

              <Field label="Builder Name">
                <TextInput
                  value={collateral.builderName}
                  placeholder="Builder / seller name"
                  onChange={(value) => updateCollateral("builderName", value)}
                />
              </Field>

              <Field label="Tower / Block">
                <TextInput
                  value={collateral.towerBlock}
                  placeholder="Tower / block"
                  onChange={(value) => updateCollateral("towerBlock", value)}
                />
              </Field>

              <Field label="Unit Number" required>
                <TextInput
                  value={collateral.unitNumber}
                  placeholder="Flat / unit number"
                  onChange={(value) => updateCollateral("unitNumber", value)}
                />
              </Field>

              <Field label="Floor Number">
                <TextInput
                  value={collateral.floorNumber}
                  placeholder="Floor number"
                  onChange={(value) => updateCollateral("floorNumber", value)}
                />
              </Field>

              <Field label="Total Floors">
                <TextInput
                  value={collateral.totalFloors}
                  placeholder="Total floors"
                  onChange={(value) => updateCollateral("totalFloors", value)}
                />
              </Field>

              <Field label="Carpet Area">
                <TextInput
                  type="number"
                  value={collateral.carpetArea}
                  placeholder="Carpet area"
                  onChange={(value) => updateCollateral("carpetArea", value)}
                />
              </Field>

              <Field label="Built-up Area">
                <TextInput
                  type="number"
                  value={collateral.builtUpArea}
                  placeholder="Built-up area"
                  onChange={(value) => updateCollateral("builtUpArea", value)}
                />
              </Field>

              <Field label="Area Unit">
                <SelectInput
                  value={collateral.areaUnit}
                  onChange={(value) => updateCollateral("areaUnit", value)}
                >
                  <option value="Sq. Ft.">Sq. Ft.</option>
                  <option value="Sq. Meter">Sq. Meter</option>
                  <option value="Acre">Acre</option>
                  <option value="Guntha">Guntha</option>
                </SelectInput>
              </Field>

              <Field label="Property Age Years">
                <TextInput
                  type="number"
                  value={collateral.propertyAgeYears}
                  placeholder="Age in years"
                  onChange={(value) => updateCollateral("propertyAgeYears", value)}
                />
              </Field>
            </div>
          </section>

          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Location</span>
                <h4>Property Address</h4>
              </div>
            </div>

            <AddressBlock address={propertyAddress} onChange={setPropertyAddress} />
          </section>

          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Ownership</span>
                <h4>Property Owner Details</h4>
              </div>

              <button type="button" className="coll-outline-btn" onClick={addOwner}>
                + Add Owner
              </button>
            </div>

            <div className="coll-owner-list">
              {owners.map((owner) => (
                <div className="coll-owner-card" key={owner.id}>
                  <div className="coll-owner-avatar">
                    {owner.name
                      ? owner.name
                          .split(" ")
                          .map((item) => item[0])
                          .slice(0, 2)
                          .join("")
                      : "OW"}
                  </div>

                  <div className="coll-owner-fields">
                    <div className="coll-field-grid four">
                      <Field label="Owner Name" required>
                        <TextInput
                          value={owner.name}
                          placeholder="Owner name"
                          onChange={(value) => updateOwner(owner.id, "name", value)}
                        />
                      </Field>

                      <Field label="Role">
                        <TextInput
                          value={owner.role}
                          placeholder="Role"
                          onChange={(value) => updateOwner(owner.id, "role", value)}
                        />
                      </Field>

                      <Field label="Ownership Share %" required>
                        <TextInput
                          type="number"
                          value={owner.ownershipShare}
                          placeholder="Share %"
                          onChange={(value) => updateOwner(owner.id, "ownershipShare", value)}
                        />
                      </Field>

                      <Field label="PAN">
                        <TextInput
                          value={owner.pan}
                          placeholder="PAN"
                          onChange={(value) => updateOwner(owner.id, "pan", value.toUpperCase())}
                        />
                      </Field>
                    </div>
                  </div>

                  {owners.length > 1 && (
                    <button
                      type="button"
                      className="coll-owner-remove"
                      onClick={() => removeOwner(owner.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Valuation</span>
                <h4>Property Value & Mortgage Details</h4>
              </div>
            </div>

            <div className="coll-field-grid three">
              <Field label="Agreement Value">
                <CurrencyInput
                  value={collateral.agreementValue}
                  placeholder="Agreement value"
                  onChange={(value) => updateCollateral("agreementValue", value)}
                />
              </Field>

              <Field label="Estimated Market Value" required>
                <CurrencyInput
                  value={collateral.estimatedMarketValue}
                  placeholder="Estimated value"
                  onChange={(value) => updateCollateral("estimatedMarketValue", value)}
                />
              </Field>

              <Field label="Valuation Amount" required>
                <CurrencyInput
                  value={collateral.valuationAmount}
                  placeholder="Valuation amount"
                  onChange={(value) => updateCollateral("valuationAmount", value)}
                />
              </Field>

              <Field label="Existing Mortgage">
                <SelectInput
                  value={collateral.existingMortgage}
                  onChange={(value) => updateCollateral("existingMortgage", value)}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </SelectInput>
              </Field>

              {collateral.existingMortgage === "Yes" && (
                <>
                  <Field label="Mortgage Bank Name">
                    <TextInput
                      value={collateral.mortgageBankName}
                      placeholder="Bank / FI name"
                      onChange={(value) => updateCollateral("mortgageBankName", value)}
                    />
                  </Field>

                  <Field label="Outstanding Loan Amount">
                    <CurrencyInput
                      value={collateral.outstandingLoanAmount}
                      placeholder="Outstanding amount"
                      onChange={(value) => updateCollateral("outstandingLoanAmount", value)}
                    />
                  </Field>
                </>
              )}
            </div>
          </section>

          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Verification</span>
                <h4>Legal, Technical & Valuation Status</h4>
              </div>
            </div>

            <div className="coll-verification-grid">
              <div className="coll-verification-card">
                <span className="coll-verification-icon">
                  <ShieldIcon />
                </span>
                <StatusSelect
                  label="Legal Status"
                  value={collateral.legalStatus}
                  onChange={(value) => updateCollateral("legalStatus", value)}
                />
              </div>

              <div className="coll-verification-card">
                <span className="coll-verification-icon">
                  <BuildingIcon />
                </span>
                <StatusSelect
                  label="Technical Status"
                  value={collateral.technicalStatus}
                  onChange={(value) => updateCollateral("technicalStatus", value)}
                />
              </div>

              <div className="coll-verification-card">
                <span className="coll-verification-icon">
                  <RupeeIcon />
                </span>
                <StatusSelect
                  label="Valuation Status"
                  value={collateral.valuationStatus}
                  onChange={(value) => updateCollateral("valuationStatus", value)}
                />
              </div>

              <div className="coll-verification-card">
                <span className="coll-verification-icon">
                  <FileIcon />
                </span>
                <StatusSelect
                  label="Title Clearance"
                  value={collateral.titleClearanceStatus}
                  onChange={(value) => updateCollateral("titleClearanceStatus", value)}
                />
              </div>
            </div>
          </section>

          <section className="coll-card">
            <div className="coll-section-header">
              <div>
                <span className="coll-eyebrow">Documents</span>
                <h4>Collateral Document Checklist</h4>
              </div>
            </div>

            <div className="coll-doc-list">
              {documents.map((doc) => {
                const isUploaded = doc.status === "Uploaded";

                return (
                  <div className="coll-doc-row" key={doc.id}>
                    <div className={`coll-doc-icon ${isUploaded ? "uploaded" : ""}`}>
                      {isUploaded ? <CheckIcon /> : <FileIcon />}
                    </div>

                    <div className="coll-doc-main">
                      <div className="coll-doc-title">
                        <strong>{doc.subtype}</strong>
                        {doc.mandatory && <span>Mandatory</span>}
                      </div>

                      {isUploaded ? (
                        <p>
                          {doc.fileName} · Uploaded by {doc.uploadedBy} · {doc.uploadedOn}
                        </p>
                      ) : (
                        <p>Pending upload</p>
                      )}
                    </div>

                    <label className={`coll-upload-btn ${isUploaded ? "secondary" : ""}`}>
                      <UploadIcon />
                      {isUploaded ? "Re-upload" : "Upload"}
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(event) => handleDocumentUpload(event, doc.id)}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        <aside className="coll-side">
          <section className="coll-side-card">
            <h4>Collateral Readiness</h4>

            <div className="coll-checklist">
              {completionItems.map((item) => (
                <div key={item.label} className={item.complete ? "done" : ""}>
                  <span>{item.complete ? <CheckIcon /> : "•"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="coll-side-card soft">
            <h4>Property Summary</h4>

            <div className="coll-summary-list">
              <div>
                <span>Property</span>
                <strong>{collateral.projectName || "—"}</strong>
              </div>
              <div>
                <span>Type</span>
                <strong>{collateral.propertyType}</strong>
              </div>
              <div>
                <span>Usage</span>
                <strong>{collateral.propertyUsage}</strong>
              </div>
              <div>
                <span>City</span>
                <strong>{propertyAddress.city || "—"}</strong>
              </div>
              <div>
                <span>Valuation</span>
                <strong>₹{Number(collateral.valuationAmount || 0).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </section>

          <section className="coll-side-card soft">
            <h4>Verification Summary</h4>

            <div className="coll-status-list">
              <div>
                <span>Legal</span>
                <strong>{collateral.legalStatus}</strong>
              </div>
              <div>
                <span>Technical</span>
                <strong>{collateral.technicalStatus}</strong>
              </div>
              <div>
                <span>Valuation</span>
                <strong>{collateral.valuationStatus}</strong>
              </div>
              <div>
                <span>Title</span>
                <strong>{collateral.titleClearanceStatus}</strong>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default CollateralPage;