import { getNZPropertyData } from "./nz-property-data.js";
import { validateNZAddress } from "./nz-address-validation.js";

export async function getPropertyData(address, env) {
  const validation = validateNZAddress(address);

  if (!validation.valid) {
    return {
      address: validation.address,
      sources: [],
      data: {},
      status: validation.status,
      validation,
      message: validation.reason
    };
  }

  const nzData = await getNZPropertyData(validation.address, env);

  return {
    address: validation.address,
    sources: [nzData.source],
    data: nzData.data,
    status: nzData.status,
    validation,
    message: nzData.message
  };
}
