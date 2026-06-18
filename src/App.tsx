import React, { useState } from 'react';
import WalletInput from './components/WalletInput';
import ChallengeCard from './components/ChallengeCard';
import ProofStatus from './components/ProofStatus';
import { generateProof } from './prover';
import { encrypt } from './crypto';
import { uploadSubmission } from './api';
import { Challenge, ProofStatus as Status } from './types';

const ACTIVE_CHALLENGE: Challenge = {
  id: 'challenge-001',
  title: 'Poseidon Preimage Pre-optimization',
  description: 'Find the optimization parameter s that satisfies:',
  targetHash: '0x2bf98d...1290',
  bountyAmount: '500',
  currency: 'USDC',
};

// Shared secret for AES-GCM key derivation (in production: derive from on-chain commitment)
const SHARED_SECRET = process.env.REACT_APP_SHARED_SECRET ?? 'zk-wavescout-aes-secret-v1';

export default function App() {
  const [wallet, setWallet] = useState('');
  const [solution, setSolution] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [txHash, setTxHash] = useState('');
  const [proof, setProof] = useState('');
  const [error, setError] = useState('');

  const handleClaim = async () => {
    if (!wallet.trim() || !solution.trim()) return;
    setError('');

    try {
      setStatus('proving');
      const { proof: proofHex } = await generateProof(solution, wallet);
      setProof(proofHex);

      setStatus('encrypting');
      const { ciphertext, iv, authTag } = await encrypt(solution, SHARED_SECRET);

      setStatus('submitting');
      await uploadSubmission({
        contributorAddress: wallet,
        encryptedCode: ciphertext,
        iv,
        authTag,
        proof: proofHex,
        challengeId: ACTIVE_CHALLENGE.id,
      });

      // Simulate Soroban on-chain confirmation (~2s)
      await new Promise((r) => setTimeout(r, 2000));
      setTxHash('0x7a30e159fa6...612d');
      setStatus('success');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', padding: 40 }}>
      <header style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: '2.2rem', color: '#38bdf8', margin: 0 }}>🔍 ZK-WaveScout</h1>
        <p style={{ color: '#94a3b8', marginTop: 8 }}>Automated Anti-Plagiarism Bounty Verification Engine for Soroban</p>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <WalletInput value={wallet} onChange={setWallet} />
        <ChallengeCard
          challenge={ACTIVE_CHALLENGE}
          solution={solution}
          onSolutionChange={setSolution}
        />

        {status === 'success' ? null : ['idle', 'error'].includes(status) ? (
          <button
            disabled={!wallet.trim() || !solution.trim()}
            onClick={handleClaim}
            style={{ width: '100%', padding: 14, background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            Generate ZK-Proof &amp; Claim Bounty
          </button>
        ) : (
          <button disabled style={{ width: '100%', padding: 14, background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, opacity: 0.6, cursor: 'not-allowed' }}>
            Processing…
          </button>
        )}

        <ProofStatus status={status} txHash={txHash} error={error} proof={proof} />
      </div>
    </div>
  );
}
