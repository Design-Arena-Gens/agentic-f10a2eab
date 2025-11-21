import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const transcriptPath = resolve(rootDir, 'transcript.vtt');
const outputPath = resolve(rootDir, 'content', 'narrative.json');

const raw = readFileSync(transcriptPath, 'utf8');
const lines = raw.split(/\r?\n/);

const cues = [];
let current = [];

const flush = () => {
  if (current.length === 0) return;
  const merged = current.join(' ').replace(/\s+/g, ' ').trim();
  if (!merged) {
    current = [];
    return;
  }
  if (cues.length === 0 || cues[cues.length - 1] !== merged) {
    cues.push(merged);
  }
  current = [];
};

for (const line of lines) {
  const trimmed = line.trim();
  if (
    trimmed === '' ||
    trimmed === 'WEBVTT' ||
    /^\d+$/.test(trimmed) ||
    trimmed.includes('-->')
  ) {
    flush();
    continue;
  }

  const cleaned = trimmed
    .replace(/\[[^\]]*\]/g, '')
    .replace(/♪+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) continue;
  if (/^[A-Za-z]+:\s/.test(cleaned) && cues.length === 0 && current.length === 0) {
    continue;
  }
  current.push(cleaned);
}
flush();

const text = cues.join(' ').replace(/\s+/g, ' ').replace(/\s+([,.;!?])/g, '$1').trim();

const sentencePattern = /[^.!?]+[.!?]+/g;
const sentences = text.match(sentencePattern) ?? [text];

const normalizeSentence = (sentence) => {
  const trimmedSentence = sentence.replace(/\s+/g, ' ').trim();
  if (!trimmedSentence) return null;
  const leadingQuoteMatch = trimmedSentence.match(/^["'“‘(\[]+/);
  const prefix = leadingQuoteMatch ? leadingQuoteMatch[0] : '';
  const rest = prefix ? trimmedSentence.slice(prefix.length) : trimmedSentence;
  const uppercased =
    rest.length > 0 ? rest[0].toUpperCase() + rest.slice(1) : rest;
  return `${prefix}${uppercased}`;
};

const normalizedSentences = [];

for (const sentence of sentences) {
  const normalized = normalizeSentence(sentence);
  if (!normalized) continue;
  normalizedSentences.push(normalized);
}

const mergedSentences = [];
for (let i = 0; i < normalizedSentences.length; i += 1) {
  const current = normalizedSentences[i];
  const next = normalizedSentences[i + 1];
  const plain = current.replace(/["'“‘(\[]/g, '').trim();
  if (
    next &&
    plain.length > 0 &&
    plain.length <= 15 &&
    /[.]$/.test(current) &&
    /^[A-Z]/.test(next)
  ) {
    const combined =
      current.replace(/[.]$/, ',') +
      ' ' +
      next[0].toLowerCase() +
      next.slice(1);
    mergedSentences.push(combined);
    i += 1;
    continue;
  }
  mergedSentences.push(current);
}

const replacements = [
  ['Machavelian', 'Machiavellian'],
  ['Machavevelian', 'Machiavellian'],
  ['vaselage', 'vassalage'],
  ['the opposite visibility', 'the opposite: visibility'],
  ['literally psychologically emotionally', 'literally, psychologically, emotionally'],
  ['You still cling to power moves toward', 'You still cling to the illusion that power moves toward'],
  ['supply roots', 'supply routes'],
  ['withdraw, step back', 'withdraw; step back'],
];

const applyReplacements = (value) =>
  replacements.reduce(
    (acc, [from, to]) => acc.replace(new RegExp(from, 'g'), to),
    value,
  );

const paragraphs = [];
let buffer = [];
const MAX_SENTENCES_PER_PARAGRAPH = 4;

for (const sentence of mergedSentences) {
  buffer.push(sentence);
  if (buffer.length >= MAX_SENTENCES_PER_PARAGRAPH) {
    paragraphs.push(applyReplacements(buffer.join(' ')));
    buffer = [];
  }
}
if (buffer.length > 0) {
  paragraphs.push(applyReplacements(buffer.join(' ')));
}

const narrative = {
  generatedAt: new Date().toISOString(),
  paragraphs,
};

const contentDir = resolve(rootDir, 'content');
await import('node:fs/promises')
  .then(async (fs) => {
    await fs.mkdir(contentDir, { recursive: true });
  })
  .catch((error) => {
    throw error;
  });

writeFileSync(outputPath, JSON.stringify(narrative, null, 2), 'utf8');
