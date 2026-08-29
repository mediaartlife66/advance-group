import { propertySchema } from "./property-schema.js";

export function createProperty(address) {
  return {
    ...structuredClone(propertySchema),

    id: crypto.randomUUID(),

    address: {
      ...structuredClone(propertySchema.address),
      full: address.trim()
    },

    report: {
      ...structuredClone(propertySchema.report),
      status: "assessment_started",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
}
