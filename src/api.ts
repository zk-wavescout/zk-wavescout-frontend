import { SubmissionPayload } from './types';

const BASE = '/api';

export async function uploadSubmission(payload: SubmissionPayload): Promise<void> {
  const res = await fetch(`${BASE}/submissions/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
}

export async function fetchChallenge(id: string) {
  const res = await fetch(`${BASE}/challenges/${id}`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return res.json();
}
