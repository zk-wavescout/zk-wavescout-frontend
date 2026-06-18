export type ProofStatus = 'idle' | 'proving' | 'encrypting' | 'submitting' | 'success' | 'error';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetHash: string;
  bountyAmount: string;
  currency: string;
}

export interface SubmissionPayload {
  contributorAddress: string;
  encryptedCode: string;
  iv: string;
  authTag: string;
  proof: string;
  challengeId: string;
}

export interface ProofResult {
  proof: string;
  publicInputs: string[];
}
