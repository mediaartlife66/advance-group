export async function getNZPropertyData(address, apiKey) {
  if (!apiKey) {
    return {
      address,
      source: {
        name: "LINZ Data Service",
        type: "external",
        status: "missing_api_key"
      },
      data: {}
    };
  }

  return {
    address,
    source: {
      name: "LINZ Data Service",
      type: "external",
      status: "connected"
    },
    data: {
      message: "LINZ connection ready."
    }
  };
}