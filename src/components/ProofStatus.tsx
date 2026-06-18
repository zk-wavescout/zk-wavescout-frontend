import React from 'react';
import { ProofStatus as Status } from '../types';

const messages: Record<Status, string> = {
  idle: '',
  proving: '⚙️ Generating cryptographic proof locally on your device...',
  encrypting: '🔒 Encrypting solution payload with AES-GCM...',
  submitting: '🚀 Submitting proof verification payload to Soroban ledger...',
  success: '🎉 Bounty claimed successfully!',
  error: '',
};

interface Props {
  status: Status;
  txHash?: string;
  error?: string;
  proof?: string;
}

export default function ProofStatus({ status, txHash, error, proof }: Props) {
  if (status === 'idle') return null;

  if (status === 'error') return (
    <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: 6, padding: 16, marginTop: 16 }}>
      ❌ {error}
    </div>
  );

  if (status === 'success') return (
    <div style={{ background: '#065f46', border: '1px solid #059669', borderRadius: 6, padding: 20, marginTop: 16 }}>
      <h4 style={{ margin: '0 0 8px' }}>🎉 Bounty Claimed!</h4>
      <p style={{ margin: '4px 0' }}>TX Hash: <code>{txHash}</code></p>
      {proof && <p style={{ margin: '4px 0', fontSize: 12 }}>Proof: <code style={{ wordBreak: 'break-all' }}>{proof}</code></p>}
      <p style={{ margin: '4px 0', color: '#6ee7b7' }}>Solution securely forwarded to repository maintainers.</p>
    </div>
  );

  return (
    <p style={{ textAlign: 'center', color: '#38bdf8', fontWeight: 600, marginTop: 16 }}>
      {messages[status]}
    </p>
  );
}
