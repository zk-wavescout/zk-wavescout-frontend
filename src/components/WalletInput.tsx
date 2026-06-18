import React from 'react';
import { isValidStellarAddress } from '../utils/validate';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function WalletInput({ value, onChange }: Props) {
  const invalid = value.length > 0 && !isValidStellarAddress(value);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
        Stellar Wallet Address:
      </label>
      <input
        style={{ width: '100%', padding: 10, border: `1px solid ${invalid ? '#ef4444' : '#334155'}`, borderRadius: 4, background: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box' as const }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="G..." aria-label="Stellar wallet address"
      />
      {invalid && <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>Invalid Stellar address format</p>}
    </div>
  );
}
