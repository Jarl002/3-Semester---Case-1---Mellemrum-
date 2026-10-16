import { Link } from "react-router";
import usePageFocus from "../hooks/usePageFocus";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  const headingRef = usePageFocus("Side ikke fundet");

  return (
    <>
      <header>
        <h1 className="not-found-title" ref={headingRef} tabIndex={-1}>
          404
        </h1>
      </header>
      <main className="not-found">
        <p>Siden, du leder efter, findes ikke.</p>
        <Link to="/" className="not-found-link">
          Gå til forsiden
        </Link>
      </main>
      <Footer />
    </>
  );
}
