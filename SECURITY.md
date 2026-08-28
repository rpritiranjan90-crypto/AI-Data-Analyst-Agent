# Security Policy

## Supported Versions

The following versions of the AI Data Analyst Agent receive security updates:

| Version | Supported          |
|---------|--------------------|
| 2.x.x   | :white_check_mark: Yes (active) |
| 1.x.x   | :x: No (deprecated) |
| < 1.0   | :x: No (end-of-life) |

We follow [semantic versioning](https://semver.org/). Security patches are back-ported to the latest minor release of the current major version.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please report them privately via one of the following channels:

1. **GitHub Security Advisories** (preferred): https://github.com/personal/AI-Data-Analyst-Agent/security/advisories/new
2. **Email**: security@ai-data-analyst.example.invalid (replace with real address)
3. **Private issue**: Use GitHub's "Report a vulnerability" button on the Security tab.

When reporting, please include:

- A clear description of the vulnerability
- Steps to reproduce (proof-of-concept if possible)
- Affected component(s) and version
- Potential impact and attack scenario
- Any known mitigations

## Response Timeline

| Stage | Target Time |
|-------|-------------|
| Acknowledgement | 48 hours |
| Initial assessment | 7 days |
| Patch release (high/critical) | 30 days |
| Patch release (medium/low) | 90 days |
| Public disclosure | After patch is released |

## Security Architecture Overview

The platform implements the following security controls (mapped to OWASP Top 10):

| OWASP Category | Mitigation |
|----------------|------------|
| **A01: Broken Access Control** | JWT-based auth, role checks, admin-only endpoints |
| **A02: Cryptographic Failures** | Tokens signed with HS256, secrets via env vars, no hard-coded keys |
| **A03: Injection** | Parameterized DuckDB queries, CSV formula sanitization, magic-byte validation |
| **A04: Insecure Design** | Read-only SQL sandbox, prompt-injection shield, input validation |
| **A05: Security Misconfiguration** | CSP, HSTS, X-Frame-Options, non-root Docker user |
| **A07: Identification & Auth Failures** | Strong password policy, token expiration |
| **A09: Logging Failures** | Audit log middleware, governance metrics store |

## Out of Scope

The following are **not** considered security vulnerabilities:

- Denial of service attacks requiring sustained >1000 RPS from a single IP (rate-limited)
- Issues in third-party services we integrate with (report upstream)
- Self-XSS (you can't trick the user into pasting their own credentials into the wrong site)
- Theoretical vulnerabilities without a concrete attack path

## Recognition

Researchers who follow responsible disclosure and submit a valid report will be credited in the patch release notes (unless they prefer to remain anonymous).
