import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1b2c41",
    backgroundColor: "#ffffff",
  },

  header: {
    borderBottom: "2px solid #1e5fa5",
    paddingBottom: 12,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brandBlock: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#1e5fa5",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1b2c41",
    marginBottom: 3,
  },

  headerSub: {
    fontSize: 8.5,
    color: "#4d6882",
  },

  appMeta: {
    alignItems: "flex-end",
  },

  appNo: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1e5fa5",
    marginBottom: 4,
  },

  metaText: {
    fontSize: 8,
    color: "#4d6882",
    marginBottom: 2,
  },

  section: {
    border: "1px solid #dfe8f2",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },

  sectionHeader: {
    backgroundColor: "#e8f0fb",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderBottom: "1px solid #dfe8f2",
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1e5fa5",
  },

  sectionBody: {
    padding: 10,
  },

  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 7,
  },

  col: {
    flex: 1,
  },

  label: {
    fontSize: 7.2,
    color: "#88a2bc",
    textTransform: "uppercase",
    marginBottom: 2,
  },

  value: {
    fontSize: 9,
    color: "#1b2c41",
    fontWeight: 700,
    lineHeight: 1.3,
  },

  mutedValue: {
    fontSize: 9,
    color: "#4d6882",
    lineHeight: 1.3,
  },

  topSummary: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  applicantPhoto: {
    width: 86,
    height: 98,
    borderRadius: 8,
    border: "1px solid #cfdaeb",
    backgroundColor: "#f0f5fb",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  photoImage: {
    width: 86,
    height: 98,
    objectFit: "cover",
  },

  photoInitials: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e5fa5",
  },

  summaryGrid: {
    flex: 1,
    border: "1px solid #dfe8f2",
    borderRadius: 8,
    padding: 10,
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 7,
    borderRadius: 5,
    fontSize: 7.5,
    fontWeight: 700,
    alignSelf: "flex-start",
  },

  badgeGreen: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },

  badgeAmber: {
    backgroundColor: "#fef3e0",
    color: "#a05c0a",
  },

  badgeBlue: {
    backgroundColor: "#e8f0fb",
    color: "#1e5fa5",
  },

  table: {
    border: "1px solid #dfe8f2",
    borderRadius: 6,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f5fb",
    borderBottom: "1px solid #dfe8f2",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #edf2f8",
  },

  tableCellHeader: {
    padding: 6,
    fontSize: 7.5,
    fontWeight: 700,
    color: "#4d6882",
  },

  tableCell: {
    padding: 6,
    fontSize: 8,
    color: "#1b2c41",
  },

  w30: {
    width: "30%",
  },

  w25: {
    width: "25%",
  },

  w20: {
    width: "20%",
  },

  w15: {
    width: "15%",
  },

  w10: {
    width: "10%",
  },

  declarationBox: {
    backgroundColor: "#fafcff",
    border: "1px solid #dfe8f2",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },

  declarationText: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: "#4d6882",
  },

  signatureRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 22,
  },

  signatureBox: {
    flex: 1,
    borderTop: "1px solid #88a2bc",
    paddingTop: 6,
  },

  signatureText: {
    fontSize: 8,
    color: "#4d6882",
  },

  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 18,
    borderTop: "1px solid #dfe8f2",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 7,
    color: "#88a2bc",
  },
});

const fallbackData = {
  applicationNumber: "APP-2026-000245",
  generatedOn: "08 May 2026",
  branchName: "Mumbai Andheri Branch",
  sourcingChannel: "Website",
  ownerName: "Sales User",

  applicantPhoto: "",

  applicant: {
    fullName: "Rahul Sharma",
    firstName: "Rahul",
    lastName: "Sharma",
    gender: "Male",
    dateOfBirth: "14 Jul 1991",
    fatherName: "Mahesh Sharma",
    motherName: "Sunita Sharma",
    maritalStatus: "Married",
    mobile: "9876543210",
    email: "rahul.sharma@email.com",
    pan: "ABCDE1234F",
    residentialStatus: "Resident Indian",
  },

  address: {
    permanent:
      "Flat 402, Shree Heights, Andheri Kurla Road, Mumbai, Maharashtra - 400059",
    residential:
      "Flat 402, Shree Heights, Andheri Kurla Road, Mumbai, Maharashtra - 400059",
    communication: "Residential Address",
  },

  employment: {
    employmentType: "Salaried",
    employerName: "ABC Technologies Pvt. Ltd.",
    designation: "Senior Manager",
    monthlyIncome: "₹85,000",
    officeAddress: "BKC, Mumbai, Maharashtra",
  },

  loan: {
    product: "Home Loan",
    loanType: "New Loan",
    purpose: "Purchase of New Property",
    requestedAmount: "₹45,00,000",
    tenure: "20 Years",
    repaymentType: "EMI",
    rateType: "Floating",
  },

  collateral: {
    propertyType: "Flat / Apartment",
    propertyName: "Shree Heights",
    unitNumber: "402",
    propertyAddress:
      "Flat 402, Shree Heights, Andheri Kurla Road, Mumbai, Maharashtra - 400059",
    estimatedValue: "₹84,00,000",
    legalStatus: "Pending",
    technicalStatus: "Pending",
  },

  eligibility: {
    breResult: "Amber",
    decision: "Preliminarily Eligible",
    preliminaryAmount: "₹42,00,000",
    roi: "8.85%",
    emi: "₹37,180",
    remarks:
      "Preliminary offer is subject to document completion, credit appraisal, legal and technical verification.",
  },

  coApplicants: [
    {
      name: "Priya Sharma",
      role: "Co-Applicant",
      relationship: "Spouse",
      mobile: "9876509876",
      pan: "BCDEF2345G",
    },
  ],

  documents: [
    {
      type: "Identity Proof",
      subtype: "PAN Card",
      status: "Uploaded",
    },
    {
      type: "Photograph",
      subtype: "Applicant Photo",
      status: "Uploaded",
    },
    {
      type: "Address Proof",
      subtype: "Aadhaar",
      status: "Uploaded",
    },
    {
      type: "Income Proof",
      subtype: "Salary Slip",
      status: "Pending",
    },
    {
      type: "Property Document",
      subtype: "Agreement to Sale",
      status: "Pending",
    },
  ],
};

function safe(value, fallback = "—") {
  return value || fallback;
}

function FieldView({ label, value }) {
  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{safe(value)}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function StatusBadge({ value }) {
  const isGreen = value === "Green" || value === "Uploaded" || value === "Verified";
  const isAmber = value === "Amber" || value === "Pending" || value === "Preliminarily Eligible";

  return (
    <Text
      style={[
        styles.badge,
        isGreen ? styles.badgeGreen : isAmber ? styles.badgeAmber : styles.badgeBlue,
      ]}
    >
      {value}
    </Text>
  );
}

function ApplicationFormPdf({ data = fallbackData }) {
  const form = {
    ...fallbackData,
    ...data,
    applicant: {
      ...fallbackData.applicant,
      ...(data.applicant || {}),
    },
    address: {
      ...fallbackData.address,
      ...(data.address || {}),
    },
    employment: {
      ...fallbackData.employment,
      ...(data.employment || {}),
    },
    loan: {
      ...fallbackData.loan,
      ...(data.loan || {}),
    },
    collateral: {
      ...fallbackData.collateral,
      ...(data.collateral || {}),
    },
    eligibility: {
      ...fallbackData.eligibility,
      ...(data.eligibility || {}),
    },
    coApplicants: data.coApplicants || fallbackData.coApplicants,
    documents: data.documents || fallbackData.documents,
  };

  const initials = `${form.applicant.firstName?.[0] || "R"}${form.applicant.lastName?.[0] || "S"}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandBlock}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>LOS</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Loan Application Form</Text>
              <Text style={styles.headerSub}>Digital Lending Application Package</Text>
            </View>
          </View>

          <View style={styles.appMeta}>
            <Text style={styles.appNo}>{form.applicationNumber}</Text>
            <Text style={styles.metaText}>Generated On: {form.generatedOn}</Text>
            <Text style={styles.metaText}>Branch: {form.branchName}</Text>
            <Text style={styles.metaText}>Owner: {form.ownerName}</Text>
          </View>
        </View>

        <View style={styles.topSummary}>
          <View style={styles.applicantPhoto}>
            {form.applicantPhoto ? (
              <Image src={form.applicantPhoto} style={styles.photoImage} />
            ) : (
              <Text style={styles.photoInitials}>{initials}</Text>
            )}
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.row}>
              <FieldView label="Applicant Name" value={form.applicant.fullName} />
              <FieldView label="Mobile" value={form.applicant.mobile} />
              <FieldView label="PAN" value={form.applicant.pan} />
            </View>
            <View style={styles.row}>
              <FieldView label="Product" value={form.loan.product} />
              <FieldView label="Loan Type" value={form.loan.loanType} />
              <FieldView label="Requested Amount" value={form.loan.requestedAmount} />
            </View>
            <View style={styles.row}>
              <FieldView label="BRE Result" value={form.eligibility.breResult} />
              <FieldView label="Preliminary Decision" value={form.eligibility.decision} />
              <FieldView label="Preliminary Amount" value={form.eligibility.preliminaryAmount} />
            </View>
          </View>
        </View>

        <Section title="1. Customer Identity">
          <View style={styles.row}>
            <FieldView label="Full Name" value={form.applicant.fullName} />
            <FieldView label="Gender" value={form.applicant.gender} />
            <FieldView label="Date of Birth" value={form.applicant.dateOfBirth} />
          </View>
          <View style={styles.row}>
            <FieldView label="Father's Name" value={form.applicant.fatherName} />
            <FieldView label="Mother's Name" value={form.applicant.motherName} />
            <FieldView label="Marital Status" value={form.applicant.maritalStatus} />
          </View>
          <View style={styles.row}>
            <FieldView label="Email" value={form.applicant.email} />
            <FieldView label="Residential Status" value={form.applicant.residentialStatus} />
            <View style={styles.col}>
              <Text style={styles.label}>PAN Status</Text>
              <StatusBadge value="Verified" />
            </View>
          </View>
        </Section>

        <Section title="2. Address Details">
          <View style={styles.row}>
            <FieldView label="Permanent Address" value={form.address.permanent} />
          </View>
          <View style={styles.row}>
            <FieldView label="Residential Address" value={form.address.residential} />
          </View>
          <View style={styles.row}>
            <FieldView label="Preferred Communication Address" value={form.address.communication} />
          </View>
        </Section>

        <Section title="3. Income & Employment">
          <View style={styles.row}>
            <FieldView label="Employment Type" value={form.employment.employmentType} />
            <FieldView label="Employer / Business Name" value={form.employment.employerName} />
            <FieldView label="Designation" value={form.employment.designation} />
          </View>
          <View style={styles.row}>
            <FieldView label="Monthly Income" value={form.employment.monthlyIncome} />
            <FieldView label="Office Address" value={form.employment.officeAddress} />
          </View>
        </Section>

        <Section title="4. Loan Requirement">
          <View style={styles.row}>
            <FieldView label="Product" value={form.loan.product} />
            <FieldView label="Loan Type" value={form.loan.loanType} />
            <FieldView label="Loan Purpose" value={form.loan.purpose} />
          </View>
          <View style={styles.row}>
            <FieldView label="Requested Amount" value={form.loan.requestedAmount} />
            <FieldView label="Tenure" value={form.loan.tenure} />
            <FieldView label="Repayment Type" value={form.loan.repaymentType} />
          </View>
        </Section>

        <Section title="5. Collateral Details">
          <View style={styles.row}>
            <FieldView label="Property Type" value={form.collateral.propertyType} />
            <FieldView label="Property / Project Name" value={form.collateral.propertyName} />
            <FieldView label="Unit Number" value={form.collateral.unitNumber} />
          </View>
          <View style={styles.row}>
            <FieldView label="Property Address" value={form.collateral.propertyAddress} />
          </View>
          <View style={styles.row}>
            <FieldView label="Estimated Value" value={form.collateral.estimatedValue} />
            <FieldView label="Legal Status" value={form.collateral.legalStatus} />
            <FieldView label="Technical Status" value={form.collateral.technicalStatus} />
          </View>
        </Section>

        <Section title="6. Eligibility & Preliminary Offer">
          <View style={styles.row}>
            <FieldView label="BRE Result" value={form.eligibility.breResult} />
            <FieldView label="Decision" value={form.eligibility.decision} />
            <FieldView label="Preliminary Amount" value={form.eligibility.preliminaryAmount} />
          </View>
          <View style={styles.row}>
            <FieldView label="ROI" value={form.eligibility.roi} />
            <FieldView label="EMI" value={form.eligibility.emi} />
          </View>
          <View style={styles.row}>
            <FieldView label="Remarks" value={form.eligibility.remarks} />
          </View>
        </Section>

        <Section title="7. Co-Applicants / Related Parties">
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, styles.w30]}>Name</Text>
              <Text style={[styles.tableCellHeader, styles.w20]}>Role</Text>
              <Text style={[styles.tableCellHeader, styles.w20]}>Relationship</Text>
              <Text style={[styles.tableCellHeader, styles.w15]}>Mobile</Text>
              <Text style={[styles.tableCellHeader, styles.w15]}>PAN</Text>
            </View>
            {form.coApplicants.map((item, index) => (
              <View style={styles.tableRow} key={`${item.name}-${index}`}>
                <Text style={[styles.tableCell, styles.w30]}>{item.name}</Text>
                <Text style={[styles.tableCell, styles.w20]}>{item.role}</Text>
                <Text style={[styles.tableCell, styles.w20]}>{item.relationship}</Text>
                <Text style={[styles.tableCell, styles.w15]}>{item.mobile}</Text>
                <Text style={[styles.tableCell, styles.w15]}>{item.pan}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="8. Document Checklist">
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, styles.w30]}>Document Type</Text>
              <Text style={[styles.tableCellHeader, styles.w30]}>Subtype</Text>
              <Text style={[styles.tableCellHeader, styles.w20]}>Status</Text>
              <Text style={[styles.tableCellHeader, styles.w20]}>Source</Text>
            </View>
            {form.documents.map((item, index) => (
              <View style={styles.tableRow} key={`${item.type}-${item.subtype}-${index}`}>
                <Text style={[styles.tableCell, styles.w30]}>{item.type}</Text>
                <Text style={[styles.tableCell, styles.w30]}>{item.subtype}</Text>
                <Text style={[styles.tableCell, styles.w20]}>{item.status}</Text>
                <Text style={[styles.tableCell, styles.w20]}>{item.source || "Internal Upload"}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="9. Declaration">
          <View style={styles.declarationBox}>
            <Text style={styles.declarationText}>
              I / We declare that the information provided in this application is true and complete to the best of my / our knowledge.
              I / We authorize the lender to verify the information, perform bureau checks, validate documents, and process the application
              as per applicable policies. This application form is generated for review and eSign and does not represent final sanction.
            </Text>

            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>Applicant Signature</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>Co-Applicant Signature</Text>
              </View>
              <View style={styles.signatureBox}>
                <Text style={styles.signatureText}>Authorized Officer</Text>
              </View>
            </View>
          </View>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by LOS Digital Lending Platform</Text>
          <Text style={styles.footerText}>Page 1</Text>
        </View>
      </Page>
    </Document>
  );
}

export default ApplicationFormPdf;
export { fallbackData as mockApplicationFormData };