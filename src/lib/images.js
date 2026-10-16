export function withImageWidth(url, width, quality = 70) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("w", width);
    parsed.searchParams.set("q", quality);
    return parsed.toString();
  } catch {
    return url;
  }
}
