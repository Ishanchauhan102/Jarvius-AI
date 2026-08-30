import Robot from "./robot";

export default function Hero() {
  return (
    <section>
      <Robot />

      <p>
        Your Intelligent AI Assistant for Learning,
        Productivity and Automation.
      </p>

      <button
        className="btn"
        onClick={() => {
          window.location.href = "/login";
        }}
      >
        Get Started
      </button>

      <button
        onClick={() => {
          window.location.href = "#download";
        }}
      >
        Download
      </button>
    </section>
  );
}