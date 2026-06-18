/** Basic Stellar public key format check (G... 56 chars). */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address.trim());
}

export function isSolutionNonEmpty(solution: string): boolean {
  return solution.trim().length > 0;
}
