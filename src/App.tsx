import React, { useState } from 'react';
import WalletInput from './components/WalletInput';
import ChallengeCard from './components/ChallengeCard';
import ProofStatus from './components/ProofStatus';
import { useProofPipeline } from './hooks/useProofPipeline';
import { Challenge } from './types';

const ACTIVE_CHALLENGE: Challenge = {
  id: 'challenge-001',
  title: 'Poseidon Preimage Pre-optimization',
  description: 'Find the optimization parameter s that satisfies:',
  targetHash: '0x2bf98d...1290',
  bountyAmount: '500',
  currency: 'USDC',
};

export default function App() {
  const [wallet, setWallet] = useState('');
  const [solution, setSolution] = useState('');
  const { status, txHash, proof, error, run, reset } = useProofPipeline(ACTIVE_CHALLENGE.id);

  const busy = !['idle', 'error', 'success'].includes(status);
  const canSubmit = wallet.trim().length > 0 && solution.trim().length > 0;

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#0f172a', color: '#f1f5f9', minHeight: '100vh', padding: 40 }}>
      <header style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: '2.2rem', color: '#38bdf8', margin: 0 }}>🔍 ZK-WaveScout</h1>
        <p style={{ color: '#94a3b8', marginTop: 8 }}>Automated Anti-Plagiarism Bounty Verification Engine for Soroban</p>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <WalletInput value={wallet} onChange={setWallet} />
        <ChallengeCard challenge={ACTIVE_CHALLENGE} solution={solution} onSolutionChange={setSolution} />

        {status !== 'success' && (
          <button
            disabled={busy || !canSubmit}
            onClick={() => run(wallet, solution)}
            style={{ width: '100%', padding: 14, background: '#0284c7', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: busy || !canSubmit ? 'not-allowed' : 'pointer', opacity: busy || !canSubmit ? 0.6 : 1 }}
          >
            {busy ? 'Processing…' : 'Generate ZK-Proof & Claim Bounty'}
          </button>
        )}

        {status === 'success' && (
          <button onClick={reset} style={{ width: '100%', padding: 14, background: '#334155', color: '#f1f5f9', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>
            Submit Another
          </button>
        )}

        <ProofStatus status={status} txHash={txHash} error={error} proof={proof} />
      </div>
    </div>
  );
}
