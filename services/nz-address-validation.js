export function validateNZAddress(address) {
  const value = String(address || "").trim();

  if (!value) {
    return {
      valid: false,
      address: "",
      status: "invalid",
      reason: "Address is required"
    };
  }

  return {
    valid: true,
    address: value,
    status: "unverified",
    reason: null
  };
}
