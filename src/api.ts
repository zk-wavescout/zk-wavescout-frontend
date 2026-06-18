import { SubmissionPayload } from './types';

const BASE = process.env.REACT_APP_API_BASE ?? '/api';
const TIMEOUT_MS = 15000;

function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

async function handleResponse(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed: ${res.status} ${res.statusText}`);
  }
}

export async function uploadSubmission(payload: SubmissionPayload): Promise<void> {
  const res = await fetchWithTimeout(`${BASE}/submissions/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await handleResponse(res);
}

export async function fetchChallenge(id: string) {
  const res = await fetchWithTimeout(`${BASE}/challenges/${id}`, { method: 'GET' });
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return res.json();
}
