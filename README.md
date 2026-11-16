# Open Ledger for Small Businesses

**Status:** Draft 0.1 — public review. This is the first public artefact of the
Mozilla Fellowship 2027–2028 proposal.

**Repository:** https://github.com/arinafoodshq/open-ledger

**One line:** An open, AI-assisted operational record standard for informal and
small businesses.

Small businesses already generate valuable economic data through orders,
payments, stock movements and deliveries. Much of it is trapped in WhatsApp
chats, voice notes, paper notebooks and disconnected spreadsheets. Open Ledger
defines a small, portable event format that turns those interactions into
records an owner can inspect, export and carry between tools.

This is **not** a TechAssembly product repository and it does not require a
TechAssembly account. TechAssembly provides the engineering experience and the
live testing environment; the specification, examples and evaluation methods
are intended to stand on their own.

## What is in this repository

| Path | What it is |
|---|---|
| `SPEC.md` | The event model, field rules, money/quantity rules, provenance and privacy rules |
| `schema/open-ledger.schema.json` | JSON Schema 2020-12 for the v0.1 envelope and core event types |
| `examples/` | Synthetic, non-identifiable example events |
| `EVALUATION.md` | Proposed extraction metrics and data-governance rules |
| `GOVERNANCE.md` | Stewardship, versioning and contribution process |
| `CONTRIBUTING.md` | How to propose changes and review the schema |
| `scripts/validate.mjs` | Dependency-free smoke check for the examples |

## Scope for v0.1

The first release is deliberately narrow:

- `order.created`
- `payment.received`
- `stock.received`
- `stock.sold`
- `stock.adjusted`

Deliveries, returns, invoices and multi-currency settlement are future
extensions. A narrow model that works is more useful than a large model nobody
can implement.

## Design principles

1. **Owner-controlled.** The business that generates the record owns it and can
   export it without asking a vendor.
2. **Event-first.** The record is an immutable event with a timestamp and
   provenance; totals and stock levels are projections.
3. **Portable.** The same record can move between tools, accountants and
   lenders.
4. **Money is integer minor units.** No floats. `amount_minor` + ISO 4217
   `currency`.
5. **Quantity is explicit.** A number and a unit (`case`, `kg`, `piece`) are
   never merged.
6. **Provenance is visible.** Every event says where it came from (WhatsApp,
   voice, POS, paper, API) and, where appropriate, points to evidence.
7. **Privacy by default.** Examples are synthetic. Real conversations are not
   published; consent and redaction are documented.
8. **No vendor lock-in.** The schema and exports must be usable without
   TechAssembly or any other single vendor.

## Validate the examples

```bash
node scripts/validate.mjs
```

The script is a dependency-free smoke check, not a full JSON Schema validator.
The JSON Schema is the normative definition. A future release will add a
standards-compliant validator to CI.

## Licence

- Code and schema: MIT (`LICENSE`).
- Documentation and specification text: CC BY 4.0 (`LICENSE-docs`).

## Contributing

Read `CONTRIBUTING.md`. The most useful contributions right now are:

- a real small-business workflow the schema cannot represent;
- a field that is ambiguous in Nigerian English, Nigerian Pidgin or
  code-switched speech;
- an independent implementation or export test;
- a privacy or consent failure mode.

## Roadmap

- **0.1 (this draft):** envelope, five core event types, synthetic examples.
- **0.2:** delivery, return and invoice events; independent implementations.
- **0.3:** evaluation harness and a consent-based synthetic/real dataset
  release where lawful.
- **1.0:** stable schema, versioning policy and community stewardship.

## Contact

Samuel Iso · sam@techassembly.io · https://techassembly.io
