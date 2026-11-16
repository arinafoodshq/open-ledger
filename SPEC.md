# Open Ledger specification — v0.1 (draft)

**Status:** Draft for public review. Not yet a stable standard.

This document defines the minimum event format needed to record the everyday
operations of a small business: orders, payments, stock receipts, stock sales
and stock adjustments. The JSON Schema in `schema/open-ledger.schema.json` is
the normative machine-readable definition.

## 1. Why an event format

A small business does not experience "a stock level" or "a monthly total". It
experiences events: a customer orders, a payment arrives, stock is received, a
case is sold, a crate is damaged. If the events are recorded faithfully, stock
levels, balances and reports can be rebuilt. If only the totals are kept, the
business cannot explain or correct them.

Open Ledger records the event, not just the number.

## 2. Envelope

Every event is a JSON object with these fields:

| Field | Type | Required | Meaning |
|---|---|---|---|
| `schema_version` | string | yes | Semantic version of this specification, e.g. `0.1.0` |
| `id` | string | yes | Stable unique event id. Recommended: UUID or a prefixed ULID |
| `type` | enum | yes | One of the event types in §4 |
| `occurred_at` | RFC 3339 string | yes | When the event happened in the real world |
| `recorded_at` | RFC 3339 string | yes | When the record was created |
| `subject` | object | yes | The business and optional location the event belongs to |
| `actor` | object | no | The person or system that recorded/performed the action |
| `counterparty` | object | no | The customer, supplier or other party |
| `source` | object | yes | Where the record came from and optional evidence |
| `currency` | string | no | ISO 4217 code when the event carries money |
| `amount_minor` | integer | no | Money in integer minor units (kobo, cents, pesewas) |
| `payload` | object | yes | Type-specific fields in §4 |
| `metadata` | object | no | Implementation-specific, namespaced extensions |

### `subject`

```json
{
  "business_id": "biz_01",
  "location_id": "loc_ikeja",
  "business_name": "Example Foods"
}
```

`business_id` is opaque to this specification. It must not contain a phone
number, email address or other personal identifier.

### `actor`

```json
{
  "id": "staff_01",
  "type": "owner",
  "name": "Ada"
}
```

`type` is one of `owner`, `staff`, `system`, `integration`.

### `counterparty`

```json
{
  "id": "cust_01",
  "type": "customer",
  "name": "Ada Okafor"
}
```

`type` is one of `customer`, `supplier`, `partner`, `other`. Do not publish real
names in public examples; use synthetic names.

### `source`

```json
{
  "channel": "whatsapp",
  "evidence_id": "msg_01",
  "raw_text": "12 cases of hot sauce, deliver Friday"
}
```

`channel` is one of `whatsapp`, `voice`, `pos`, `paper`, `api`, `import`,
`manual`.

`raw_text` is optional and must be redacted before public release. It is
evidence, not a transaction. `evidence_id` points to the original message,
transcript or file in the implementer's own storage.

## 3. Money and quantity rules

- **Money is an integer.** `amount_minor` is in the currency's minor unit:
  kobo for NGN, cents for USD/GHS/ZAR/KES. Never use floating point.
- **Currency is separate.** `currency` is an ISO 4217 code.
- **Quantities are explicit.** `quantity` is a number and `unit` is a string
  (`case`, `kg`, `piece`, `carton`). Never merge a case and a kilogram into one
  stock row.
- **Unit prices are optional but recommended.** `unit_price_minor` uses the same
  currency as the event.
- **Line totals are derived.** `line_total_minor = quantity × unit_price_minor`.
  Implementations may store the derived value, but the event carries the inputs.

## 4. Event types

### 4.1 `order.created`

A customer has placed an order.

```json
{
  "schema_version": "0.1.0",
  "id": "evt_order_01",
  "type": "order.created",
  "occurred_at": "2026-11-17T08:00:00Z",
  "recorded_at": "2026-11-17T08:01:12Z",
  "subject": { "business_id": "biz_01", "location_id": "loc_ikeja" },
  "actor": { "id": "staff_01", "type": "owner", "name": "Ada" },
  "counterparty": { "id": "cust_01", "type": "customer", "name": "Ada Okafor" },
  "source": { "channel": "whatsapp", "evidence_id": "msg_01" },
  "currency": "NGN",
  "amount_minor": 6000000,
  "payload": {
    "order_id": "ord_01",
    "line_items": [
      { "sku": "HOT-12", "name": "Hot sauce (case of 12)", "quantity": 12, "unit": "case", "unit_price_minor": 500000 }
    ],
    "fulfilment": "delivery",
    "note": "Deliver Friday"
  }
}
```

Required payload fields: `order_id`, `line_items` (non-empty). `line_items[]`
requires `name`, `quantity`, `unit`; `sku` and `unit_price_minor` are optional.

### 4.2 `payment.received`

Money has been received.

Required payload fields: `payment_id`, `method`. `amount_minor` and `currency`
are required on the envelope. `order_id` is optional but recommended when the
payment settles an order.

`method` is one of `cash`, `bank_transfer`, `card`, `mobile_money`, `cheque`,
`other`.

### 4.3 `stock.received`

Stock has arrived from a supplier or production.

Required payload fields: `items` (non-empty). Each item requires `name`,
`quantity`, `unit`; `sku` and `unit_cost_minor` are optional. `supplier` is
optional.

### 4.4 `stock.sold`

Stock has left the business because of a sale.

Required payload fields: `items` (non-empty). Each item requires `name`,
`quantity`, `unit`; `sku` is optional. `order_id` is recommended.

### 4.5 `stock.adjusted`

Stock has changed for a reason other than a sale or receipt (damage, theft,
count correction, expiry).

Required payload fields: `items` (non-empty) and `reason`. `reason` is one of
`damage`, `theft`, `expiry`, `count_correction`, `other`. Quantities may be
negative.

## 5. Idempotency

Every event `id` is unique. Implementations should also accept an
`idempotency_key` in `metadata` so a retried command does not create a second
event. The pair `(business_id, idempotency_key)` should be unique.

## 6. Projections

Stock levels, balances and reports are **projections** of events, not the source
of truth. A projection must be rebuildable from the event log. Implementations
may cache projections for speed, but the event log remains authoritative.

Example stock projection:

```
stock(business, sku, unit, location) =
  sum(stock.received.items.quantity)
  - sum(stock.sold.items.quantity)
  + sum(stock.adjusted.items.quantity)
```

## 7. Export format

An implementation must be able to export its events as newline-delimited JSON
(NDJSON) using this envelope. The export must be readable without the
implementer's application. A CSV export of projections is useful but is not a
substitute for the event export.

Recommended export bundle:

```
open-ledger-export/
  manifest.json
  events.ndjson
  schema.json
  README.txt
```

`manifest.json` records the export time, business id, schema version, event
count and any redactions.

## 8. Privacy and consent

- Public examples must be synthetic or irreversibly anonymised.
- Real conversations, phone numbers, emails, addresses, bank details and
  customer names are not part of a public dataset.
- If a dataset is released, it must document consent, purpose, retention,
  redaction and deletion.
- An event may carry a `metadata.consent` object:
  ```json
  { "captured": true, "purpose": "operational_record", "expires_at": "2027-11-17T00:00:00Z" }
  ```
- Consent to record an operational event is not consent to publish it.

## 9. Versioning

- The specification uses semantic versioning.
- Additive, backwards-compatible fields bump the minor version.
- Breaking changes bump the major version and require a migration note.
- Implementations must declare the `schema_version` they emit.

## 10. Out of scope for v0.1

- deliveries, returns and invoices;
- multi-currency settlement and exchange-rate events;
- payroll and tax;
- lending or credit scoring;
- a central database or hosted service;
- a UI or vendor-specific workflow.

These are future extensions. The first release should be small enough that two
independent developers can implement it and compare results.

## 11. Open questions for review

1. Should `order.created` carry a customer-facing order number, or only the
   internal `order_id`?
2. Should `payment.received` require a `reference` for bank transfers?
3. Should `stock.sold` be emitted separately from `order.created`, or should
   fulfilment be the event that reduces stock?
4. What is the smallest useful consent record for a synthetic dataset?
5. Which additional event type would unblock the most real businesses:
   delivery, return or invoice?

Comments and counter-examples are welcome in the issue tracker.
