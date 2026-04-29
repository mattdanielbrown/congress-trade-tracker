import axios from 'axios';

const CONGRESS_API_KEY = import.meta.env.VITE_CONGRESS_API_KEY;
const BASE_URL = 'https://api.congress.gov/v3';

export const congressClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: CONGRESS_API_KEY,
  },
});

export const fetchMembers = async (congress = 118) => {
  const response = await congressClient.get(`/member/${congress}`);
  return response.data;
};
