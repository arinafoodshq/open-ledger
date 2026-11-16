# Evaluation and data governance — v0.1 (draft)

The point of Open Ledger is not to claim that AI "understands" a business. It
is to measure, honestly, how reliably everyday speech and text can become a
structured record — and to publish the failure cases.

## 1. What to measure

| Metric | Definition |
|---|---|
| Field accuracy | Percentage of fields (item, quantity, unit, amount, currency, date, counterparty) exactly correct |
| Exact-record accuracy | Percentage of events where every required field is correct |
| Error rate by input | Accuracy split by WhatsApp text, voice note, paper transcription, POS/API |
| Error rate by language | Nigerian English, Nigerian Pidgin, code-switched speech, other supported varieties |
| Human correction effort | Median edits per record before an operator accepts it |
| Latency | Time from input to a reviewable record |
| Cost | Cost per accepted record, including model and human review |
| Failure severity | Whether an error changes money, stock or a customer commitment |

Do not report a single aggregate accuracy without the denominator, the test set,
the language mix and the error taxonomy.

## 2. Evaluation protocol

1. Define the test set before tuning the model.
2. Hold out examples that are not used for prompt or model selection.
3. Use human-verified records as the reference, not another model's output.
4. Report per-field and exact-record results, not only an average.
5. Publish a sample of failures, including the input and the incorrect output.
6. Report confidence intervals where the sample is small.
7. Re-run the same evaluation after every model or prompt change.
8. Keep a public version of the harness so others can reproduce the result.

## 3. Data governance

### Consent

- Collect only what is needed for the evaluation.
- Explain the purpose in plain language.
- Record consent separately from the operational event.
- Allow withdrawal and deletion where technically and legally possible.

### Minimisation and redaction

- Remove phone numbers, emails, addresses, bank details and payment card data.
- Replace customer names with stable pseudonyms before public release.
- Do not publish raw voice notes or full chat threads unless the participant
  has explicitly agreed.
- Prefer synthetic examples for the public repository.

### Release tiers

| Tier | What is released | When |
|---|---|---|
| Synthetic | Hand-written examples | Now |
| Aggregate | Counts, error rates, failure taxonomy | After evaluation |
| Consented anonymised | Redacted inputs and labels | Only with explicit consent and review |
| Raw | Never public | Not released |

### Retention

- Define a retention period before collection.
- Delete raw recordings when the evaluation is complete, unless consent says
  otherwise.
- Keep the minimum metadata needed to reproduce the evaluation.

## 4. Error taxonomy

At minimum, classify errors as:

- missing event (the input contained an event that was not recorded);
- wrong event type;
- wrong item or SKU;
- wrong quantity;
- wrong unit (case vs piece vs kilogram);
- wrong money amount or currency;
- wrong date or counterparty;
- invented field (the model produced a value not present in the input);
- merged events (two events recorded as one);
- split event (one event recorded as two).

## 5. What success looks like

A successful v0.1 evaluation is not "95% accuracy". It is a reproducible report
that says:

- which inputs and language varieties work;
- which fields fail and how often;
- how much human correction is needed;
- what the model must never be trusted to do without review;
- what data was used, under what consent, and what was withheld.

That is more useful to a small business, a developer and a funder than a
polished demo.
