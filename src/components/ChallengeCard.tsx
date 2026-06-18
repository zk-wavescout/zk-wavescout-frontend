import React from 'react';
import { Challenge } from '../types';

interface Props {
  challenge: Challenge;
  solution: string;
  onSolutionChange: (v: string) => void;
}

export default function ChallengeCard({ challenge, solution, onSolutionChange }: Props) {
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: 24, marginBottom: 24 }}>
      <h3 style={{ margin: '0 0 8px', color: '#38bdf8' }}>{challenge.title}</h3>
      <p style={{ color: '#94a3b8', background: '#0f172a', padding: 12, borderRadius: 6, marginBottom: 16 }}>
        {challenge.description}<br />
        <code>Poseidon(s) == {challenge.targetHash}</code>
      </p>
      <p style={{ color: '#64748b', fontSize: 13 }}>
        Bounty: <strong style={{ color: '#34d399' }}>{challenge.bountyAmount} {challenge.currency}</strong>
      </p>
      <label style={{ fontWeight: 600, display: 'block', margin: '16px 0 6px' }}>
        Your Solution / Secret Preimage:
      </label>
      <textarea
        rows={6}
        style={{ width: '100%', padding: 10, background: '#0f172a', color: '#f1f5f9', border: '1px solid #334155', borderRadius: 4, fontFamily: 'monospace', boxSizing: 'border-box' as const }}
        placeholder="Paste your optimized script or secret preimage..." aria-label="Solution input" minLength={1}
        value={solution}
        onChange={(e) => onSolutionChange(e.target.value)}
      />
    </div>
  );
}
