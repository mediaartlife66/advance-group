// Advance Group
// Property Record V1
//
// This is the permanent record structure for a property.
// LINZ identifies the property.
// Advance Group adds customer, trade, job and certificate history.

export function createPropertyRecord(linzResult) {
  const now = new Date().toISOString();

  const addressData = linzResult?.data?.address || {};
  const addressProperties = addressData.properties || {};

  return {
    schemaVersion: "1.0",

    propertyId: createPropertyId(addressProperties, addressData),

    createdAt: now,
    updatedAt: now,

    identity: {
      verified: Boolean(linzResult?.data?.addressFound),

      address: addressProperties.full_address || null,

      addressId: addressProperties.address_id || null,

      linzFeatureId: addressData.id || null,

      territorialAuthority:
        addressProperties.territorial_authority || null,

      suburb:
        addressProperties.suburb_locality || null,

      townCity:
        addressProperties.town_city || null,

      coordinates: addressData.coordinates || null
    },

    parcel: {
      found: Boolean(linzResult?.data?.parcel?.found),

      featureCount:
        linzResult?.data?.parcel?.featureCount || 0,

      records:
        linzResult?.data?.parcel?.features || []
    },

    customer: {
      customerId: null,
      name: null,
      phone: null,
      email: null
    },

    property: {
      building: {
        exteriorMaterials: [],
        roof: null,
        windows: null,
        doors: null,
        notes: []
      },

      paint: {
        currentCondition: null,
        existingCoatings: [],
        colours: [],
        preparation: [],
        productsUsed: [],
        history: []
      },

      plumbing: {
        observations: [],
        workHistory: []
      },

      electrical: {
        observations: [],
        workHistory: []
      },

      roofing: {
        observations: [],
        workHistory: []
      },

      otherTrades: []
    },

    jobs: [],

    crm: {
      notes: [],
      communications: [],
      documents: []
    },

    certificate: {
      status: "not_issued",
      certificateId: null,
      issuedAt: null,
      issuedBy: null,
      warranty: null
    }
  };
}


function createPropertyId(properties, addressData) {
  if (properties.address_id) {
    return `NZ-${properties.address_id}`;
  }

  if (addressData.id) {
    return `NZ-${String(addressData.id).replace(/[^a-zA-Z0-9]/g, "-")}`;
  }

  return `NZ-PROPERTY-${Date.now()}`;
}
