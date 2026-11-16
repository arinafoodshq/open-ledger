import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const schema = JSON.parse(readFileSync(join(root, 'schema', 'open-ledger.schema.json'), 'utf8'));
const examplesDir = join(root, 'examples');
const files = readdirSync(examplesDir).filter((f) => f.endsWith('.json')).sort();

const required = schema.required;
const types = schema.properties.type.enum;
const channels = schema.$defs.source.properties.channel.enum;
const piiKeys = /^(phone|email|address|account_number|card_number|bvn)$/i;

function walkPii(value, path, errors) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (piiKeys.test(key)) errors.push(`PII key not allowed: ${path}${key}`);
    walkPii(child, `${path}${key}.`, errors);
  }
}

let failed = 0;
for (const file of files) {
  const errors = [];
  let event;
  try {
    event = JSON.parse(readFileSync(join(examplesDir, file), 'utf8'));
  } catch (err) {
    console.log(`FAIL ${file}`);
    console.error(`  invalid JSON: ${err.message}`);
    failed++;
    continue;
  }

  for (const key of required) {
    if (!(key in event)) errors.push(`missing required field: ${key}`);
  }
  if (event.schema_version !== '0.1.0') errors.push('schema_version must be 0.1.0');
  if (!types.includes(event.type)) errors.push(`unknown type: ${event.type}`);
  if (Number.isNaN(Date.parse(event.occurred_at))) errors.push('occurred_at is not a valid date-time');
  if (Number.isNaN(Date.parse(event.recorded_at))) errors.push('recorded_at is not a valid date-time');
  if (!event.subject?.business_id) errors.push('subject.business_id is required');
  if (!channels.includes(event.source?.channel)) errors.push(`invalid source.channel: ${event.source?.channel}`);
  if (event.currency !== undefined && !/^[A-Z]{3}$/.test(event.currency)) {
    errors.push('currency must be a 3-letter ISO 4217 code');
  }
  if (event.amount_minor !== undefined && (!Number.isInteger(event.amount_minor) || event.amount_minor < 0)) {
    errors.push('amount_minor must be a non-negative integer');
  }

  const payload = event.payload || {};
  if (event.type === 'order.created') {
    if (!payload.order_id) errors.push('order.created requires payload.order_id');
    if (!Array.isArray(payload.line_items) || payload.line_items.length === 0) {
      errors.push('order.created requires a non-empty payload.line_items');
    }
  }
  if (event.type === 'payment.received') {
    if (!payload.payment_id) errors.push('payment.received requires payload.payment_id');
    if (!payload.method) errors.push('payment.received requires payload.method');
  }
  if (event.type === 'stock.received' || event.type === 'stock.sold') {
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push(`${event.type} requires a non-empty payload.items`);
    }
  }
  if (event.type === 'stock.adjusted') {
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push('stock.adjusted requires a non-empty payload.items');
    }
    if (!payload.reason) errors.push('stock.adjusted requires payload.reason');
  }

  const items = payload.line_items || payload.items || [];
  for (const [index, item] of items.entries()) {
    if (!item.name) errors.push(`item ${index}: name is required`);
    if (item.quantity === undefined) errors.push(`item ${index}: quantity is required`);
    if (!item.unit) errors.push(`item ${index}: unit is required`);
  }

  walkPii(event, '', errors);

  if (errors.length) {
    failed++;
    console.log(`FAIL ${file}`);
    for (const error of errors) console.error(`  ${error}`);
  } else {
    console.log(`PASS ${file}`);
  }
}

if (failed) {
  console.error(`\n${failed} of ${files.length} examples failed the smoke check.`);
  process.exit(1);
}
console.log(`\n${files.length} examples passed the smoke check.`);
