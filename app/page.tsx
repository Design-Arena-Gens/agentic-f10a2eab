import narrative from '@/content/narrative.json';

const videoUrl = 'https://www.youtube.com/watch?v=_QItQo_TzQo';
const formattedDate = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeStyle: 'short',
}).format(new Date(narrative.generatedAt));

export default function Page() {
  return (
    <main>
      <div className="badge">Narrative Transcript</div>
      <h1>Machiavelli&apos;s Secret — Narrative Retelling</h1>
      <p className="lede">
        A flowing, timestamp-free narrative based on the YouTube talk “When You
        Stop Chasing, They Start Kneeling.” Every paragraph preserves the
        speaker&apos;s cadence while reading like a dramatic essay.
      </p>

      <div className="meta">
        <span>
          Source video:{' '}
          <a href={videoUrl} target="_blank" rel="noreferrer">
            Machiavelli’s Secret — When You Stop Chasing, They Start Kneeling
          </a>
        </span>
        <span>Transcript generated: {formattedDate}</span>
        <span>Paragraphs: {narrative.paragraphs.length}</span>
      </div>

      {narrative.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}

      <aside className="tips">
        <strong>How to use this:</strong> Share passages directly, rehearse them
        aloud to internalize the rhetoric, or adapt the language for essays,
        scripts, and newsletters. This retelling retains every idea while
        reading like a cohesive monologue.
      </aside>

      <p className="footer">
        Need the original timestamps? Re-run{' '}
        <code>npm run generate:narrative</code> after updating the{' '}
        <code>transcript.vtt</code> file to refresh this narrative.
      </p>
    </main>
  );
}
