import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Get token from headers and validate admin role
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken || decodedToken.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not authorized" });
      }

      // Create the blog category
      const { name } = req.body;
      const createdCategory = await prisma.blogCategory.create({
        data: {
          name,
        },
      });

      // Return the created category
      return res
        .status(201)
        .json({
          message: "Blog category created successfully",
          category: createdCategory,
        });
    } else {
      return res.status(405).json({
        message: "Method Not Allowed",
        error: "Only POST method is allowed for this endpoint",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
