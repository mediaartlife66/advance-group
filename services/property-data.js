import { getNZPropertyData } from "./nz-property-data.js";
import { validateNZAddress } from "./nz-address-validation.js";

export async function getPropertyData(address, apiKey) {
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
    apiKey
  );

  return {
    address: validation.address,
    sources: [nzData.source],
    data: nzData.data,
    status: nzData.source.status,
    validation
  };
}