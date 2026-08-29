export const propertySchema = {
  id: null,

  address: {
    full: "",
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
    status: "not_started",
    createdAt: null,
    updatedAt: null
  }
};
