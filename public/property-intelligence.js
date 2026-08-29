export function createProperty(address) {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),

    address: {
      full: address.trim(),
      street: "",
      suburb: "",
      city: "",
      postcode: "",
      country: "New Zealand"
    },

    property: {
      type: null,
      yearBuilt: null,
      bedrooms: null,
      bathrooms: null,
      floors: null
    },

    exterior: {
      wallMaterial: null,
      roofMaterial: null,
      windows: null,
      condition: null
    },

    maintenance: {
      lastKnownWork: null,
      history: [],
      condition: null
    },

    photos: [],

    intelligence: {
      observations: [],
      risks: [],
      recommendations: []
    },

    painting: {
      preparationLevel: null,
      paintSystem: null,
      estimatedLabourHours: null,
      estimatedMaterialCost: null,
      estimatedDuration: null
    },

    sources: [],

    report: {
      status: "assessment_started",
      createdAt: now,
      updatedAt: now
    }
  };
}
