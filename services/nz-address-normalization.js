export function normalizeNZAddress(address) {
  const value = String(address || "")
    .trim()
    .replace(/\s+/g, " ");

  return {
    original: address,
    normalized: value,
    status: value ? "normalized" : "empty"
  };
}
