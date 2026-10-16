import { useState } from "react";
import { SUPABASE_URL, headers } from "../lib/api";

export default function EventSignupForm({ event }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/registrations`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({
          name,
          email,
          eventId: event.id,
          status: "Ny"
        })
      });

      if (!response.ok) {
        throw new Error(`Tilmelding mislykkedes (status ${response.status})`);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Tilmelding fejlede:", error);
      setSubmitError("Vi kunne ikke gemme din tilmelding. Prøv venligst igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return <p className="form-message">Tak! Din tilmelding er registreret.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Navn
        <input value={name} onChange={(inputEvent) => setName(inputEvent.target.value)} />
      </label>
      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        value={email}
        onChange={(inputEvent) => setEmail(inputEvent.target.value)}
        placeholder="dig@example.com"
      />
      {submitError && (
        <p role="alert" className="form-message is-error">
          {submitError}
        </p>
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sender..." : "Tilmeld mig"}
      </button>
    </form>
  );
}
