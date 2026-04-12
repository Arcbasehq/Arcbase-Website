# Security Policy

## Our Commitment

At arcbase, security is a core principle — not an afterthought. We build tools for a freer, more secure web, and we hold ourselves to the same standard we set for others. We take all security reports seriously and are committed to responding quickly and transparently.

## Supported Versions

We actively maintain and patch the following:

| Project        | Status             |
| :------------- | :----------------- |
| Website        | ✅ Actively maintained |
| ArcOS          | ✅ Actively maintained |
| Sentinel       | ✅ Actively maintained |
| Arc Manager    | ✅ Actively maintained |
| OpenShelf      | ✅ Actively maintained |

Only the latest release of each project receives security patches. We strongly encourage all users to stay up to date.

## Reporting a Vulnerability

> [!IMPORTANT]
> **Please do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**

If you discover a security vulnerability in any arcbase project, please report it responsibly by emailing us directly:

**[arcbase@tuta.io](mailto:arcbase@tuta.io)**

### What to Include

To help us triage and reproduce the issue as quickly as possible, please provide:

- **Project & component**: Which repository or part of the system is affected.
- **Description**: A clear summary of the vulnerability and its potential impact.
- **Steps to reproduce**: A minimal, reliable way to trigger the issue.
- **Proof of concept**: Code, screenshots, or a recorded demo if available.
- **Suggested fix**: If you have one — we welcome it, but it is not required.
- **Your contact details**: So we can follow up and credit you properly.

Encrypting your report is encouraged. Please reach out first and we will provide a PGP key on request.

## Response Timeline

We aim to follow this process after receiving a report:

| Stage                        | Target Timeframe |
| :--------------------------- | :--------------- |
| Acknowledgement of report    | Within 48 hours  |
| Initial triage & assessment  | Within 5 days    |
| Fix development & testing    | Within 30 days   |
| Public disclosure            | After patch ships |

If we need more time for a complex issue, we will communicate that to you directly and work toward a mutually agreed disclosure date.

## Disclosure Policy

arcbase follows a **coordinated disclosure** model:

1. You report the issue to us privately.
2. We investigate, develop a fix, and prepare a release.
3. We notify you before publishing the fix.
4. We publicly disclose the vulnerability details alongside or shortly after the patch.

We ask that you give us a reasonable window to address the issue before any public disclosure. We will always credit reporters who wish to be acknowledged.

## Scope

The following are **in scope** for security reports:

- Authentication and authorization flaws
- Cross-site scripting (XSS) and injection vulnerabilities
- Sensitive data exposure or leakage
- Privilege escalation
- Remote code execution
- Server-side request forgery (SSRF)
- Insecure dependencies with a clear exploitable path
- Broken access control or misconfigured permissions

The following are **out of scope**:

- Vulnerabilities in third-party services we do not control (e.g., Supabase, Netlify, Vercel, Datadog)
- Denial of service (DoS/DDoS) attacks
- Social engineering or phishing of arcbase team members
- Issues that require physical access to a user's device
- Theoretical vulnerabilities with no practical exploit
- Reports from automated scanners with no validation

## Safe Harbor

We will not pursue legal action against researchers who:

- Report vulnerabilities in good faith using the process described above
- Avoid accessing, modifying, or deleting data belonging to other users
- Do not disrupt or degrade the availability of our services
- Do not exploit a vulnerability beyond what is necessary to demonstrate it

We appreciate the work of the security research community and are committed to working with you constructively.

## Acknowledgements

We maintain a hall of fame for researchers who have responsibly disclosed vulnerabilities to us. If you would like to be credited, please let us know in your report.

---

Thank you for helping keep arcbase and its users safe.

**Contact**: [arcbase@tuta.io](mailto:arcbase@tuta.io)  
**GitHub**: [https://github.com/arcbasehq](https://github.com/arcbasehq)
