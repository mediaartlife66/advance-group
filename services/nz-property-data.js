export async function getNZPropertyData(address) {
  return {
    address,
    source: {
      name: "NZ Property Data",
      type: "external",
      status: "not_connected"
    },
    data: {}
  };
}
