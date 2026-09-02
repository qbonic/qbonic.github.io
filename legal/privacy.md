# Privacy Policy

**Data Controller:** VitanuGenAI Technology Pvt Ltd (India)  
**Product:** Qbonic (https://qbonic.com)  
**Effective Date:** March 1, 2026  
**Version:** 2026-v2 (Global Compliance Edition)  

---

## 1. Our Fundamental Guarantee: 100% In-Browser Privacy
At **VitanuGenAI Technology Pvt Ltd**, we built Qbonic on a privacy-first foundation.

**Your CSV and spreadsheet data never leaves your computer.** All data parsing, metric calculations, column classification, and pivot transformations happen entirely inside your browser's local memory (RAM / Web Workers). 

We do **NOT** upload, store, replicate, or analyze your raw spreadsheet files on any cloud server or third-party database.

---

## 2. Information We Store in Cloud (Authentication & Billing Only)
Because we operate on a zero-upload model, our cloud database (`{env}_users`) stores only the minimal administrative metadata required to authenticate you and manage your subscription:

- **Account & Identity:** Work email address, display name, user ID (UID), login timestamps, and email verification status (authenticated via Google Firebase Auth).
- **Subscription Metadata:** Active plan tier (`Free` or `Pro`), billing cycle (`monthly` or `yearly`), subscription ID, customer ID, auto-renew status, and renewal/expiry dates.
- **Payment Card Data:** We do **NOT** collect, process, or store credit card numbers, CVVs, or full banking details. All financial transactions are securely processed by Paddle (our Merchant of Record).
- **Audit & Consent Records:** Immutable logs of terms acceptance (`termsAcceptedAt`, `termsVersion`) and subscription transition history.

---

## 3. Legal Bases for Processing under GDPR (Article 6)
If you reside in the European Economic Area (EEA) or UK, we process your personal data under the following lawful bases:
1. **Contractual Necessity (Art. 6(1)(b) GDPR):** To create your account, deliver access to Qbonic Pro, and manage subscription billing.
2. **Legitimate Interests (Art. 6(1)(f) GDPR):** To maintain platform uptime, secure the application from fraudulent abuse, and debug errors through aggregated telemetry.
3. **Legal Obligation (Art. 6(1)(c) GDPR):** To comply with tax, invoicing, and corporate compliance obligations.
4. **Consent (Art. 6(1)(a) GDPR):** For opt-in early beta invitations or direct communications.

---

## 4. Product Usage Analytics & Telemetry
We collect privacy-first, pseudonymous product telemetry to monitor service health, troubleshoot bugs, and improve user experience:
- **Pseudonymous Identifier (`User_UID`):** Usage logs are associated with a pseudonymous business ID (e.g., `SHP1000001` or guest session hash) rather than plain-text emails, ensuring strict GDPR/CCPA data minimization.
- **AI Classification Metadata Isolation:** When AI suggestions are used, only high-level column metadata (header names, data types, distinct value counts, and up to 3 anonymized sample values) is analyzed by Groq AI. Full dataset records and spreadsheet cell contents are strictly excluded.
- **Diagnostic Metrics:** Load times, calculation latency, client memory tiers, and unhandled JavaScript error stack traces.
- **Environment Context:** Browser type, screen resolution, operating system, and country derived from timezone.

Telemetry data contains **no personally identifiable business records, financial totals, or raw spreadsheet cell contents**.

---

## 5. Local Storage of Report Workspaces & Zero Cloud Persistence
All dashboard configurations, column mappings, custom metric formulas, and report draft states created in Qbonic reside **exclusively in your device's browser memory (LocalStorage / IndexedDB)**. We do not store, synchronize, or back up your workspace configurations on our cloud databases.

You acknowledge that clearing your browser cache, resetting your browser profile, or using private/incognito windows will erase locally stored configurations, and VitanuGenAI Technology Pvt Ltd bears no liability for lost local browser states.

---

## 6. Subprocessors & International Data Transfers
We partner with trusted, industry-leading infrastructure providers:
- **Google Firebase (Alphabet Inc.):** Cloud authentication and user status synchronization.
- **Paddle.com (Paddle Market Ltd / Paddle Payments Inc):** Global payment gateway, subscription management, invoicing, and Merchant of Record.
- **Google Cloud Platform (GCP Cloud Run, us-central1):** Secure backend webhook and gating validation.

**Cross-Border Data Safeguards:** When personal account data is transferred outside the EEA, UK, Canada, Australia, or India, we ensure adequate protections are in place through **Standard Contractual Clauses (SCCs)** approved by the European Commission, ISO 27001 certifications, and SOC 2 Type II compliance.

---

## 7. Global Privacy Rights & Compliance
We honor data privacy rights globally:

- **GDPR & UK Data Protection Act:** EU/UK residents have the right to access, rectify, port, restrict, or request permanent erasure of their personal account data ("Right to be Forgotten").
- **CCPA / CPRA (California, USA):** California residents have the right to know what personal data is collected and request deletion. We do **NOT** sell or share personal information for commercial behavioral advertising.
- **PIPEDA (Canada) & Australia Privacy Act 1988:** Personal data is collected fairly, transparently, and with meaningful consent.
- **Digital Personal Data Protection (DPDP) Act 2023 (India):** Personal digital data is processed lawfully with transparent safeguards and the right to grievance redressal.

---

## 8. Right to Withdraw Consent & 30-Day Permanent Deletion
You may withdraw your consent or request permanent deletion of your account and billing profile at any time by emailing `admin@qbonic.com`. Upon request, all personal account metadata will be permanently wiped from our databases within **thirty (30) days**.

---

## 9. Children's Privacy Protection (COPPA)
Qbonic is strictly intended for business and commercial use. We do not knowingly collect or solicit personal information from children under the age of 16 (or under 13 in the United States). If we learn that we have collected personal data from a child under the relevant age, we will immediately delete that information.

---

## 10. Cookies & "Do Not Track" / GPC
Qbonic uses browser LocalStorage and SessionStorage to cache your active report workspace configurations and theme preference locally on your device. We do not use third-party cross-site advertising cookies. We respect Global Privacy Control (GPC) signals and standard browser "Do Not Track" headers.

---

## 11. Statutory Grievance Redressal Officer (India DPDP Act 2023)
In accordance with the **Digital Personal Data Protection Act 2023** and the **Information Technology Act 2000**, the name and contact details of the Grievance Redressal Officer are provided below:

**Grievance Officer:** Legal & Compliance Desk  
**Company:** VitanuGenAI Technology Pvt Ltd  
**Email:** `grievance@qbonic.com` / `legal@qbonic.com`  
**Address:** India  
**Resolution Timeline:** All privacy grievances will be acknowledged within 48 hours and redressed within 30 days as prescribed by law.

---

## 12. Contact Us
For general privacy questions:  
**VitanuGenAI Technology Pvt Ltd**  
Email: `legal@qbonic.com` / `admin@qbonic.com`  
Website: https://qbonic.com  
