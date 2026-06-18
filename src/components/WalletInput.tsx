import React from 'react';
import { getWalletError } from '../utils/validate';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function WalletInput({ value, onChange }: Props) {
  const error = value.length > 0 ? getWalletError(value) : null;
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
        Stellar Wallet Address:
      </label>
      <input
        aria-label="Stellar wallet address"
        aria-invalid={!!error}
        style={{ width: '100%', padding: 10, border: `1px solid ${error ? '#ef4444' : '#334155'}`, borderRadius: 4, background: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box' as const }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="G..."
      />
      {error && <p role="alert" style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>{error}</p>}
    </div>
  );
}
