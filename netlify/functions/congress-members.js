import axios from 'axios';

const BASE_URL = 'https://api.congress.gov/v3';

export default async function handler(req, context) {
  const apiKey = process.env.CONGRESS_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Congress API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const congress = url.searchParams.get('congress') || '118';

  try {
    const response = await axios.get(`${BASE_URL}/member/${congress}`, {
      params: { api_key: apiKey },
    });
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const status = err.response?.status || 502;
    const message = err.response?.data || err.message;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
