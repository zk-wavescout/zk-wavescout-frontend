import { useState } from 'react';
import { ProofStatus, SubmissionPayload } from '../types';
import { generateProof } from '../prover';
import { encrypt } from '../crypto';
import { uploadSubmission } from '../api';

const SHARED_SECRET = process.env.REACT_APP_SHARED_SECRET ?? 'zk-wavescout-aes-secret-v1';

export function useProofPipeline(challengeId: string) {
  const [status, setStatus] = useState<ProofStatus>('idle');
  const [txHash, setTxHash] = useState('');
  const [proof, setProof] = useState('');
  const [error, setError] = useState('');

  const submitClaim = async (wallet: string, solution: string) => {
    if (!wallet.trim() || !solution.trim()) return;
    setError('');
    try {
      setStatus('proving');
      const { proof: proofHex } = await generateProof(solution, wallet);
      setProof(proofHex);

      setStatus('encrypting');
      const { ciphertext, iv, authTag } = await encrypt(solution, SHARED_SECRET);

      setStatus('submitting');
      const payload: SubmissionPayload = {
        contributorAddress: wallet,
        encryptedCode: ciphertext,
        iv,
        authTag,
        proof: proofHex,
        challengeId,
      };
      await uploadSubmission(payload);

      const { CONFIRM_MOCK_DELAY_MS } = await import("../constants");
      await new Promise((r) => setTimeout(r, CONFIRM_MOCK_DELAY_MS));
      setTxHash('0x7a30e159fa6...612d');
      setStatus('success');
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
      setStatus('error');
    }
  };

  const reset = () => { setStatus('idle'); setError(''); setProof(''); setTxHash(''); };

  return { status, txHash, proof, error, submitClaim, reset };
}
