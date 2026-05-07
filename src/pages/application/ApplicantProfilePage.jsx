import { useMemo, useState } from "react";
import "./ApplicantProfilePage.css";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
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

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8" />
    <path d="M8 17h5" />
  </svg>
);

const defaultProfile = {
  firstName: "Rahul",
  middleName: "",
  lastName: "Sharma",
  gender: "Male",
  dateOfBirth: "1991-07-14",
  maritalStatus: "Married",
  fatherName: "Mahesh Sharma",
  motherName: "Sunita Sharma",
  spouseName: "Priya Sharma",
  nationality: "Indian",
  residentialStatus: "Resident Indian",
};

const emptyAddress = {
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
};

const mockAddressByProof = {
  Aadhaar: {
    line1: "Flat 402, Shree Heights",
    line2: "Andheri Kurla Road",
    landmark: "Near Metro Station",
    city: "Mumbai",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    pincode: "400059",
    country: "India",
  },
  "Driving License": {
    line1: "B-1204, Lake View Residency",
    line2: "Powai Main Road",
    landmark: "Opposite Hiranandani Gardens",
    city: "Mumbai",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    pincode: "400076",
    country: "India",
  },
  "Voter ID": {
    line1: "12, Green Park Society",
    line2: "MG Road",
    landmark: "Near City Mall",
    city: "Pune",
    district: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    country: "India",
  },
  Passport: {
    line1: "301, Orchid Enclave",
    line2: "Linking Road",
    landmark: "Near National College",
    city: "Mumbai",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    pincode: "400050",
    country: "India",
  },
};

function Field({ label, children, required }) {
  return (
    <label className="ap-field">
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
      className="ap-input"
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
      className="ap-input ap-select"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {children}
    </select>
  );
}

function AddressBlock({ title, badge, address, onChange, disabled }) {
  const updateAddress = (key, value) => {
    onChange({
      ...address,
      [key]: value,
    });
  };

  return (
    <div className={`ap-address-block ${disabled ? "disabled" : ""}`}>
      <div className="ap-address-title">
        <div>
          <h4>{title}</h4>
          {badge && <span>{badge}</span>}
        </div>
      </div>

      <div className="ap-field-grid two">
        <Field label="Address Line 1" required>
          <TextInput
            value={address.line1}
            placeholder="House / flat / building"
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

function ApplicantProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoName, setPhotoName] = useState("");

  const [permanentAddress, setPermanentAddress] = useState({
    line1: "Flat 402, Shree Heights",
    line2: "Andheri Kurla Road",
    landmark: "Near Metro Station",
    city: "Mumbai",
    district: "Mumbai Suburban",
    state: "Maharashtra",
    pincode: "400059",
    country: "India",
  });

  const [residentialAddress, setResidentialAddress] = useState({
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [preferredAddress, setPreferredAddress] = useState("Residential");
  const [addressProofType, setAddressProofType] = useState("Aadhaar");
  const [addressProofName, setAddressProofName] = useState("");
  const [addressProofPreview, setAddressProofPreview] = useState("");
  const [addressProofCaptured, setAddressProofCaptured] = useState(false);

  const communicationAddress = useMemo(() => {
    if (preferredAddress === "Permanent") return permanentAddress;
    return sameAsPermanent ? permanentAddress : residentialAddress;
  }, [preferredAddress, permanentAddress, residentialAddress, sameAsPermanent]);

  const updateProfile = (key, value) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);

    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview("");
    }
  };

  const handleSameAsPermanent = (checked) => {
    setSameAsPermanent(checked);

    if (checked) {
      setResidentialAddress(permanentAddress);
      if (preferredAddress === "Residential") {
        setPreferredAddress("Residential");
      }
    } else {
      setResidentialAddress(emptyAddress);
    }
  };

  const handlePermanentAddressChange = (nextAddress) => {
    setPermanentAddress(nextAddress);

    if (sameAsPermanent) {
      setResidentialAddress(nextAddress);
    }
  };

  const handleAddressProofUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAddressProofName(file.name);

    if (file.type.startsWith("image/")) {
      setAddressProofPreview(URL.createObjectURL(file));
    } else {
      setAddressProofPreview("");
    }

    const capturedAddress = mockAddressByProof[addressProofType] || mockAddressByProof.Aadhaar;

    setPermanentAddress(capturedAddress);

    if (sameAsPermanent || preferredAddress === "Residential") {
      setResidentialAddress(capturedAddress);
    }

    setAddressProofCaptured(true);
  };

  const completionItems = [
    {
      label: "Photo captured",
      complete: Boolean(photoName),
    },
    {
      label: "Basic profile completed",
      complete: Boolean(profile.firstName && profile.lastName && profile.gender && profile.fatherName),
    },
    {
      label: "Permanent address available",
      complete: Boolean(permanentAddress.line1 && permanentAddress.city && permanentAddress.pincode),
    },
    {
      label: "Residential address available",
      complete: Boolean((sameAsPermanent ? permanentAddress : residentialAddress).line1),
    },
    {
      label: "Address proof uploaded",
      complete: addressProofCaptured,
    },
  ];

  return (
    <div className="applicant-profile-page">
      <section className="ap-hero-card">
        <div className="ap-hero-left">
          <div className="ap-icon-wrap">
            <UserIcon />
          </div>
          <div>
            <span className="ap-eyebrow">Step 02</span>
            <h3>Applicant Profile</h3>
            <p>
              Capture personal information, applicant photograph, address details and communication preference.
            </p>
          </div>
        </div>

        <div className="ap-completion-box">
          <strong>{completionItems.filter((item) => item.complete).length}/{completionItems.length}</strong>
          <span>Profile checks completed</span>
        </div>
      </section>

      <section className="ap-layout">
        <main className="ap-main">
          <section className="ap-card">
            <div className="ap-section-header">
              <div>
                <span className="ap-eyebrow">Applicant Photograph</span>
                <h4>Photo Capture</h4>
              </div>
              {photoName && <span className="ap-status-pill completed">Captured</span>}
            </div>

            <div className="ap-photo-row">
              <div className="ap-photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Applicant preview" />
                ) : (
                  <div>
                    <UserIcon />
                    <span>No photo selected</span>
                  </div>
                )}
              </div>

              <div className="ap-upload-content">
                <h5>Upload applicant photograph</h5>
                <p>
                  Use a clear front-facing photograph. The image will be shown in the application profile.
                </p>

                <label className="ap-upload-btn">
                  <UploadIcon />
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>

                {photoName && (
                  <div className="ap-file-note">
                    <CheckIcon />
                    <span>{photoName}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="ap-card">
            <div className="ap-section-header">
              <div>
                <span className="ap-eyebrow">Personal Details</span>
                <h4>Basic Applicant Information</h4>
              </div>
            </div>

            <div className="ap-field-grid three">
              <Field label="First Name" required>
                <TextInput
                  value={profile.firstName}
                  placeholder="First name"
                  onChange={(value) => updateProfile("firstName", value)}
                />
              </Field>

              <Field label="Middle Name">
                <TextInput
                  value={profile.middleName}
                  placeholder="Middle name"
                  onChange={(value) => updateProfile("middleName", value)}
                />
              </Field>

              <Field label="Last Name" required>
                <TextInput
                  value={profile.lastName}
                  placeholder="Last name"
                  onChange={(value) => updateProfile("lastName", value)}
                />
              </Field>

              <Field label="Gender" required>
                <SelectInput
                  value={profile.gender}
                  onChange={(value) => updateProfile("gender", value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </SelectInput>
              </Field>

              <Field label="Date of Birth" required>
                <TextInput
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(value) => updateProfile("dateOfBirth", value)}
                />
              </Field>

              <Field label="Marital Status">
                <SelectInput
                  value={profile.maritalStatus}
                  onChange={(value) => updateProfile("maritalStatus", value)}
                >
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </SelectInput>
              </Field>

              <Field label="Father's Name" required>
                <TextInput
                  value={profile.fatherName}
                  placeholder="Father's full name"
                  onChange={(value) => updateProfile("fatherName", value)}
                />
              </Field>

              <Field label="Mother's Name">
                <TextInput
                  value={profile.motherName}
                  placeholder="Mother's full name"
                  onChange={(value) => updateProfile("motherName", value)}
                />
              </Field>

              <Field label="Spouse Name">
                <TextInput
                  value={profile.spouseName}
                  placeholder="Spouse name"
                  onChange={(value) => updateProfile("spouseName", value)}
                />
              </Field>

              <Field label="Nationality">
                <TextInput
                  value={profile.nationality}
                  placeholder="Nationality"
                  onChange={(value) => updateProfile("nationality", value)}
                />
              </Field>

              <Field label="Residential Status">
                <SelectInput
                  value={profile.residentialStatus}
                  onChange={(value) => updateProfile("residentialStatus", value)}
                >
                  <option value="Resident Indian">Resident Indian</option>
                  <option value="Non Resident Indian">Non Resident Indian</option>
                </SelectInput>
              </Field>
            </div>
          </section>

          <section className="ap-card">
            <div className="ap-section-header">
              <div>
                <span className="ap-eyebrow">Address Proof</span>
                <h4>Upload Address Proof</h4>
              </div>
              {addressProofCaptured && <span className="ap-status-pill completed">Details Captured</span>}
            </div>

            <div className="ap-proof-grid">
              <div className="ap-proof-controls">
                <Field label="Address Proof Type" required>
                  <SelectInput
                    value={addressProofType}
                    onChange={(value) => {
                      setAddressProofType(value);
                      setAddressProofCaptured(false);
                    }}
                  >
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Passport">Passport</option>
                  </SelectInput>
                </Field>

                <label className="ap-proof-upload">
                  <UploadIcon />
                  Upload {addressProofType}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleAddressProofUpload}
                  />
                </label>

                {addressProofName && (
                  <div className="ap-file-note">
                    <CheckIcon />
                    <span>{addressProofName}</span>
                  </div>
                )}

                <p className="ap-helper-text">
                  On upload, address details are extracted and populated into the address section for review.
                </p>
              </div>

              <div className="ap-proof-preview">
                {addressProofPreview ? (
                  <img src={addressProofPreview} alt="Address proof preview" />
                ) : (
                  <div>
                    <FileIcon />
                    <span>Preview appears for image uploads</span>
                    <small>PDF files will be attached without image preview</small>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="ap-card">
            <div className="ap-section-header">
              <div>
                <span className="ap-eyebrow">Address Details</span>
                <h4>Permanent & Residential Address</h4>
              </div>
            </div>

            <AddressBlock
              title="Permanent Address"
              badge={addressProofCaptured ? `Captured from ${addressProofType}` : "Manual entry allowed"}
              address={permanentAddress}
              onChange={handlePermanentAddressChange}
            />

            <div className="ap-address-toggle-row">
              <label className="ap-checkbox-row">
                <input
                  type="checkbox"
                  checked={sameAsPermanent}
                  onChange={(event) => handleSameAsPermanent(event.target.checked)}
                />
                <span>Residential address is same as permanent address</span>
              </label>
            </div>

            <AddressBlock
              title="Residential Address"
              badge={sameAsPermanent ? "Same as permanent address" : "Separate residential address"}
              address={sameAsPermanent ? permanentAddress : residentialAddress}
              onChange={setResidentialAddress}
              disabled={sameAsPermanent}
            />
          </section>

          <section className="ap-card">
            <div className="ap-section-header">
              <div>
                <span className="ap-eyebrow">Communication Preference</span>
                <h4>Preferred Communication Address</h4>
              </div>
            </div>

            <div className="ap-communication-options">
              {["Residential", "Permanent"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`ap-comm-card ${preferredAddress === type ? "active" : ""}`}
                  onClick={() => setPreferredAddress(type)}
                >
                  <span className="ap-comm-icon">
                    <HomeIcon />
                  </span>
                  <strong>{type} Address</strong>
                  <p>
                    Use {type.toLowerCase()} address for application correspondence.
                  </p>
                </button>
              ))}
            </div>

            <div className="ap-selected-address">
              <span>Selected Communication Address</span>
              <strong>
                {communicationAddress.line1 || "Address not captured"}
                {communicationAddress.city ? `, ${communicationAddress.city}` : ""}
                {communicationAddress.pincode ? ` - ${communicationAddress.pincode}` : ""}
              </strong>
            </div>
          </section>
        </main>

        <aside className="ap-side">
          <section className="ap-side-card">
            <h4>Profile Readiness</h4>
            <div className="ap-checklist">
              {completionItems.map((item) => (
                <div
                  key={item.label}
                  className={`ap-check-row ${item.complete ? "done" : ""}`}
                >
                  <span>{item.complete ? <CheckIcon /> : "•"}</span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="ap-side-card soft">
            <h4>Applicant Summary</h4>
            <div className="ap-summary-list">
              <div>
                <span>Name</span>
                <strong>
                  {[profile.firstName, profile.middleName, profile.lastName]
                    .filter(Boolean)
                    .join(" ") || "—"}
                </strong>
              </div>
              <div>
                <span>Gender</span>
                <strong>{profile.gender || "—"}</strong>
              </div>
              <div>
                <span>DOB</span>
                <strong>{profile.dateOfBirth || "—"}</strong>
              </div>
              <div>
                <span>Communication</span>
                <strong>{preferredAddress}</strong>
              </div>
              <div>
                <span>Address Proof</span>
                <strong>{addressProofCaptured ? addressProofType : "Pending"}</strong>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

export default ApplicantProfilePage;