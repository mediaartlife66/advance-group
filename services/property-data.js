import { getNZPropertyData } from "./nz-property-data.js";
import { validateNZAddress } from "./nz-address-validation.js";
import { createPropertyRecord } from "./property-record.js";

export async function getPropertyData(
  address,
  apiKey,
  latitude = null,
  longitude = null
) {
  const validation = validateNZAddress(address);

  if (!validation.valid) {
    return {
      address: validation.address,
      sources: [],
      data: {},
      status: validation.status,
      validation
    };
  }

  const nzData = await getNZPropertyData(
    validation.address,
    apiKey,
    latitude,
    longitude
  );

  const propertyRecord = createPropertyRecord(nzData);

  return {
    address: validation.address,

    sources: [
      nzData.source
    ],

    data: nzData.data,

    propertyRecord,

    status: nzData.source.status,

    validation
  };
}