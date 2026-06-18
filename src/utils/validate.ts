/** Basic Stellar public key format check (G... 56 chars). */
export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address.trim());
}

export function isSolutionNonEmpty(solution: string): boolean {
  return solution.trim().length > 0;
}

/** Returns a user-facing error message or null if valid. */
export function getWalletError(address: string): string | null {
  if (!address.trim()) return 'Wallet address is required';
  if (!isValidStellarAddress(address)) return 'Invalid Stellar address format';
  return null;
}
