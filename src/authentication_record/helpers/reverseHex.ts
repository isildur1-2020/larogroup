import * as hex2dec from 'hex2dec';

export const reverseHex = (data: string): string => {
  const hexReversed = `${data?.[6]}${data?.[7]}${data?.[4]}${data?.[5]}${data?.[2]}${data?.[3]}${data?.[0]}${data?.[1]}`;
  const decimalData = hex2dec.hexToDec(hexReversed);
  return decimalData;
};
