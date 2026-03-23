export interface WENNStatusResponse {
  status: {
    state: string;
    marketState: string;
    updatedAt: string;
    healthy: boolean;
    note: string;
  };
}

export async function getWennStatusResponse(): Promise<WENNStatusResponse> {
  const response = await fetch('/api/wenn/status');

  if (!response.ok) {
    throw new Error(`WENN status request failed: ${response.status}`);
  }

  return response.json() as Promise<WENNStatusResponse>;
}
