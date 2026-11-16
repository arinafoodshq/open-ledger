# Governance — v0.1 (draft)

Open Ledger is intended to become public infrastructure, not a specification
controlled by one vendor. This document describes the starting governance and
the path to shared stewardship.

## 1. Starting point

- **Maintainer:** Samuel Iso (TechAssembly) as the initial editor.
- **Technical home:** a public repository, open issue tracker and public
  release history.
- **Independence goal:** the specification, examples and evaluation methods
  must remain usable without TechAssembly, a TechAssembly account or a
  commercial subscription.
- **No single-vendor control:** TechAssembly may implement the standard and
  sell products around it, but it must not be the only party able to change or
  use the standard.

## 2. Decisions

1. Discuss a change in a public issue.
2. Write a short proposal: the problem, the proposed change, the migration
   impact and at least one counter-example.
3. Allow a review period (normally 7–14 days).
4. Seek rough consensus among maintainers and active implementers.
5. Record the decision in the issue and the changelog.

A maintainer may reject a change that adds complexity without a real workflow,
or that makes the format vendor-specific.

## 3. Versioning

- The specification uses semantic versioning.
- Additive, backwards-compatible fields bump the minor version.
- Breaking changes bump the major version and require a migration note.
- Deprecations are announced for at least one minor release.
- Every release includes a changelog and an updated JSON Schema.

## 4. Contributions

- Contributions are accepted under the Developer Certificate of Origin (DCO):
  sign off each commit with `Signed-off-by`.
- No copyright assignment is required.
- Code and schema: MIT.
- Documentation and specification text: CC BY 4.0.
- Contributors must not submit customer data, confidential business records or
  identifiable personal data.

## 5. Privacy and security

- Report a privacy or security issue privately to the maintainer before opening
  a public issue.
- A confirmed incident gets a public note after the affected users can be
  protected.
- The project does not operate a central database; implementers are responsible
  for their own storage, consent and retention.

## 6. Path to shared stewardship

Within the Fellowship year, the goal is to move from a single maintainer to a
small stewardship group that includes:

- an independent developer who has implemented the schema;
- a small-business operator or business-support organisation;
- an accountant or financial-literacy practitioner;
- a researcher working on speech, evaluation or data governance.

The group should publish its membership, decision record and conflicts of
interest. The long-term home could be a community foundation, a university
centre or a neutral open-source organisation. That decision should be made in
public, not by one company.
