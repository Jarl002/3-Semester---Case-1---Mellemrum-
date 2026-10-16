import { useEffect, useRef } from "react";

export default function usePageFocus(title) {
  const headingRef = useRef(null);

  useEffect(() => {
    document.title = title ? `${title} | Mellemrum` : "Mellemrum";
    headingRef.current?.focus();
  }, [title]);

  return headingRef;
}
