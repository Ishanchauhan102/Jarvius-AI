export default function DownloadPage() {
  return (
    <main className="full-page">
      <h1>Download Jarvius AI</h1>

      <p>
        Download Jarvius AI and experience your personal
        intelligent assistant.
      </p>

      <div>
        <h2>💻 Desktop</h2>
        <p>
          Use Jarvius AI on your desktop for productivity,
          learning, and automation.
        </p>

        <button type="button">
          Download for Windows
        </button>
      </div>

      <br />

      <div>
        <h2>📱 Mobile</h2>
        <p>
          The mobile version of Jarvius AI will be available soon.
        </p>

        <button type="button" disabled>
          Coming Soon
        </button>
      </div>

      <br />

      <a href="/">
        <button type="button">
          Back to Home
        </button>
      </a>
    </main>
  );
}