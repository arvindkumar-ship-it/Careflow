# Server-side access controls

Repair branch: `fix/internship-audit-20261010`. Changes are scoped to audit findings; no deployment or live provider action is included.

## Changed

Added server-issued JWT sessions, bcrypt account verification, doctor/nurse roles and patient-to-record binding. Browser-supplied roles/password constants no longer authorize access. Patient reads are scoped to the configured identity, and clinical writes/audits require the appropriate role. Groq calls are awaited; missing configuration does not create a fabricated successful report. Tracked environment and bytecode files were removed and safe environment examples added.

## Verification

`pytest -q; cd frontend && npm ci && npm run build`

Commands are entry points, not a claim that every live integration was executed. See the repair bundle for actual results.

## Setup and remaining evidence

Backend: copy backend/.env.example into backend/.env; use CAREFLOW_JWT_SECRET with 32+ random characters and CAREFLOW_USERS_JSON containing username, password_hash, role and patient_id for patient accounts. Generate bcrypt hashes offline (never store plaintext passwords). Start backend from its directory with uvicorn main:app; the active frontend is frontend/, not the historical backend/frontend scaffold. Frontend uses NEXT_PUBLIC_API_URL. Seed patients only with SEED_SYNTHETIC_PATIENTS=true. Previously committed credentials remain in Git history: rotate them before reuse. Real Mongo/provider integration, clinical output validation and medical accuracy remain unverified. This is a synthetic-data prototype, not a validated clinical system.
