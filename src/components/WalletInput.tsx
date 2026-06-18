import React from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function WalletInput({ value, onChange }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
        Stellar Wallet Address:
      </label>
      <input
        style={{ width: '100%', padding: 10, border: '1px solid #334155', borderRadius: 4, background: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="G..."
      />
    </div>
  );
}
