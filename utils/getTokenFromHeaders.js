import jwt, { TokenExpiredError } from "jsonwebtoken";

export function getTokenFromHeaders(headers) {
  // Retrieve the Authorization header from the headers object
  const authorizationHeader = headers.authorization;

  // Check if the Authorization header exists
  if (!authorizationHeader) {
    return null; // Access token is missing
  }

  // Split the Authorization header value to get the token part (excluding the "Bearer" prefix)
  const [, token] = authorizationHeader.split(" ");

  // Check if the token exists
  if (!token) {
    return null; // Access token is missing
  }

  // Return the decoded token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("Token has expired:", error.message);
    } else {
      console.error("Error decoding token:", error.message);
    }
    return null; // Token is expired or invalid
  }
}
