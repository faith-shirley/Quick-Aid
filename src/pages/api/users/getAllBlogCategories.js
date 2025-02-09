import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Get token from headers and validate admin role
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken || decodedToken.role !== "USER") {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not authorized" });
      }

      // Fetch all blog categories
      const blogCategories = await prisma.blogCategory.findMany();

      // Return the list of blog categories
      return res.status(200).json({ message: blogCategories, error: null });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
        error: "Only GET method is allowed for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
