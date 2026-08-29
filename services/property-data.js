import { getNZPropertyData } from "./nz-property-data.js";

export async function getPropertyData(address) {
  const nzData = await getNZPropertyData(address);

  return {
    address,
    sources: [nzData.source],
    data: nzData.data,
    status: nzData.source.status
  };
}
