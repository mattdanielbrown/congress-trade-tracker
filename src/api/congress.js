// Congress API calls are proxied through a Netlify Function so the API key
// stays server-side and is never baked into the client bundle.


export const fetchMembers = async (congress = 118) => {
	const response = await fetch(`/.netlify/functions/congress-members?congress=${congress}`);
	if (!response.ok) {
		throw new Error(`Congress API error: ${response.status}`);
	}
	return response.json();
};
