import { createProperty } from "../data/property.js";

export async function getPropertyData(address) {
  const property = createProperty(address);

  property.sources.push({
    name: "Property Data Service",
    type: "internal",
    status: "connected"
  });

  return property;
}
