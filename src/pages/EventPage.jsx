import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import NotFoundPage from "./NotFoundPage";
import usePageFocus from "../hooks/usePageFocus";
import { SUPABASE_URL, headers } from "../lib/api";
import { withImageWidth } from "../lib/images";
import Footer from "../components/Footer";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState("loading");
  const headingRef = usePageFocus(event?.title);

  useEffect(() => {
    async function getEvent() {
      setStatus("loading");

      try {
        const response = await fetch(`${SUPABASE_URL}/events?id=eq.${eventId}&select=*,venue:venues(*)`, {
          headers
        });

        if (!response.ok) {
          throw new Error(`Kunne ikke hente event (status ${response.status})`);
        }

        const data = await response.json();

        if (data.length === 0) {
          setStatus("not-found");
          return;
        }

        setEvent(data[0]);
        setStatus("success");
      } catch (error) {
        console.error("Hentning af event fejlede:", error);
        setStatus("error");
      }
    }

    getEvent();
  }, [eventId]);

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

  if (status === "loading") {
    return (
      <main className="event-page">
        <p className="state-message">Indlæser event...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="event-page">
        <p className="state-message is-error" role="alert">
          Vi kunne ikke hente dette event lige nu. Prøv at genindlæse siden.
        </p>
      </main>
    );
  }

  if (status === "not-found") {
    return <NotFoundPage />;
  }

  const date = new Date(event.date);

  return (
    <>
      <main className="event-page">
        <Link className="back-link" to="/">
          ← Alle events
        </Link>

        <section className="event-detail">
          <img src={withImageWidth(event.image, 1000, 75)} alt={event.title} />
          <div className="event-detail-content">
            <p className="event-category">{event.category}</p>
            <h1 ref={headingRef} tabIndex={-1}>
              {event.title}
            </h1>
            <p className="lead">{event.summary}</p>
            <div className="detail-list">
              <p>
                <strong>Dato</strong>
                {date.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long" })} kl.{" "}
                {date.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venue?.name}
                  <br />
                  {event.venue?.address}, {event.venue?.postalCode} {event.venue?.city}
                  {event.venue?.website && (
                    <>
                      <br />
                      <a href={event.venue.website}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              <p>
                <strong>Pris</strong>
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>
            <p>{event.description}</p>
          </div>
        </section>

        <section className="signup-panel">
          <div>
            <p className="eyebrow dark">Tilmelding</p>
            <h2>Reserver din plads</h2>
            <p>Udfyld formularen, så sender vi din tilmelding til arrangøren.</p>
          </div>

          {isSubmitted ? (
            <p className="form-message">Tak! Din tilmelding er registreret.</p>
          ) : (
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
