# Security policy

Clinical UI is a presentation library and must never receive real patient data in issues, stories,
screenshots, reproduction repositories, or test fixtures.

Report security or privacy vulnerabilities privately to the maintainers of the deployment that embeds
Clinical UI. Do not open a public issue containing protected health information, credentials, internal
FHIR endpoints, access tokens, device identifiers, or production resource identifiers.

Only the latest released minor line is intended to receive security fixes until a formal support matrix
is published. The library does not replace authorization, consent, audit, signature, validation, or
clinical-governance controls in the host system.
