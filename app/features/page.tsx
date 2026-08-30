import ProtectedPage from "../../components/ProtectedPage";

export default function FeaturesPage() {
  return (
    <ProtectedPage>
      <main className="full-page">

        <h1>Jarvius AI Features</h1>

        <p>
          Explore the powerful features of Jarvius AI.
        </p>

        <h2>🤖 Intelligent Automation</h2>

        <p>
          Jarvius AI can help automate repetitive tasks
          and make your daily work easier.
        </p>

        <h2>🔗 Seamless Integration</h2>

        <p>
          Connect Jarvius AI with different tools and
          services to improve your workflow.
        </p>

        <h2>⚡ Enhanced Productivity</h2>

        <p>
          Save time and focus on important tasks with
          intelligent AI assistance.
        </p>

        <br />

        <a href="/">
          <button type="button">
            Back to Home
          </button>
        </a>

      </main>
    </ProtectedPage>
  );
}