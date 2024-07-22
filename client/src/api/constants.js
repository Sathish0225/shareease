export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api/v1"
    : "https://shareease-api.vercel.app/api/v1";
