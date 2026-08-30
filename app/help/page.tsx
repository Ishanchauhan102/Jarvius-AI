export default function HelpPage() {
  return (
    <main className="full-page">
      <h1>Jarvius AI Help</h1>

      <p>
        Need help using Jarvius AI? Here are some common questions.
      </p>

      <h2>🤖 What is Jarvius AI?</h2>
      <p>
        Jarvius AI is an intelligent assistant designed to
        help with learning, productivity, and automation.
      </p>

      <h2>🔐 How do I create an account?</h2>
      <p>
        Go to the Login page and select the Register option
        to create your account.
      </p>

      <h2>🔑 How do I log in?</h2>
      <p>
        Enter your registered email and password on the
        Login page.
      </p>

      <h2>❓ Still need help?</h2>
      <p>
        Visit our Contact page and send us your question.
      </p>

      <br />

      <a href="/contact">
        <button type="button">
          Contact Us
        </button>
      </a>

      <br />
      <br />

      <a href="/">
        <button type="button">
          Back to Home
        </button>
      </a>
    </main>
  );
}