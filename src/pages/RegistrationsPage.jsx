import { useEffect, useState } from "react";
import { Link } from "react-router";
import usePageFocus from "../hooks/usePageFocus";
import { SUPABASE_URL, headers } from "../lib/api";
import Footer from "../components/Footer";

export default function RegistrationsPage() {
  const headingRef = usePageFocus("Tilmeldinger");
  const [registrations, setRegistrations] = useState([]);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function getRegistrations() {
      setStatus("loading");

      try {
        const response = await fetch(
          `${SUPABASE_URL}/registrations?select=*,event:events(title)&order=createdAt.desc`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`Kunne ikke hente tilmeldinger (status ${response.status})`);
        }

        const data = await response.json();
        setRegistrations(data);
        setRegistrationCount(data.length);
        setStatus("success");
      } catch (error) {
        console.error("Hentning af tilmeldinger fejlede:", error);
        setStatus("error");
      }
    }

    getRegistrations();
  }, []);

  return (
    <>
      <header className="admin-header">
        <p className="eyebrow">Internt overblik</p>
        <h1 ref={headingRef} tabIndex={-1}>
          Tilmeldinger
        </h1>
        <p>{registrationCount} tilmeldinger i alt</p>
      </header>
      <main>
        {status === "loading" && <p className="state-message">Indlæser tilmeldinger...</p>}

        {status === "error" && (
          <p className="state-message is-error" role="alert">
            Vi kunne ikke hente tilmeldinger lige nu. Prøv at genindlæse siden.
          </p>
        )}

        {status === "success" && registrations.length === 0 && (
          <p className="state-message">Ingen tilmeldinger endnu.</p>
        )}

        {status === "success" && registrations.length > 0 && (
          <div className="registration-list">
            <div className="registration-row registration-labels">
              <span>Navn</span>
              <span>Event</span>
              <span>Tilmeldt</span>
              <span>Status</span>
            </div>
            {registrations.map((registration) => (
              <div className="registration-row" key={registration.id}>
                <div>
                  <strong>{registration.name}</strong>
                  <small>{registration.email}</small>
                </div>
                <span>{registration.event?.title ?? "Ukendt event"}</span>
                <span>{new Date(registration.createdAt).toLocaleDateString("da-DK")}</span>
                <span className="status">{registration.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
