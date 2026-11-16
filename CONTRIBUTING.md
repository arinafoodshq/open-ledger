# Contributing to Open Ledger

The most valuable contribution right now is a **real workflow the schema cannot
represent**. The second most valuable is an **independent implementation**.

## Before you open a PR

1. Read `SPEC.md` and `EVALUATION.md`.
2. Search the issue tracker for an existing discussion.
3. Open an issue with:
   - the business workflow;
   - the event you need to record;
   - the fields you need and why;
   - a synthetic example (never a real customer conversation);
   - what breaks if the field is missing.

## Pull requests

- Keep one change per pull request.
- Update `SPEC.md` and `schema/open-ledger.schema.json` together.
- Add or update a synthetic example in `examples/`.
- Run `node scripts/validate.mjs`.
- Sign off your commit with `Signed-off-by: Your Name <you@example.com>`.
- By contributing, you agree that your contribution is licensed under the same
  terms as the material you change: MIT for code and schema, CC BY 4.0 for
  documentation and examples.
- Do not add a dependency unless it is necessary to validate or demonstrate the
  format. If you do, state its licence and confirm it is compatible with MIT.

## What we will not accept

- real customer names, phone numbers, emails, addresses or bank details;
- a field that only one vendor can populate;
- a breaking change without a migration note;
- a schema change that makes the format depend on a proprietary service;
- a dataset release without a documented consent and redaction process.

## Review

A maintainer reviews for:

1. **Real workflow:** does this solve a problem an operator actually has?
2. **Portability:** can another implementer use it without TechAssembly?
3. **Simplicity:** is the new field necessary, or can an existing field carry
   the meaning?
4. **Privacy:** does it invite unnecessary personal data?
5. **Testability:** can the change be validated with a synthetic example?

## Code of conduct

Be direct about the work and generous with the person. Harassment, discrimination
and publishing private data are not welcome.
