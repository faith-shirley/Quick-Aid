import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      
      // Extract token from headers
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken) {
        return res.status(403).json({ error: "Forbidden: Token has expired" });
      }

      // Check if the role is USER
      const { role } = decodedToken;
      if (role !== "USER") {
        return res
          .status(403)
          .json({ error: "Forbidden: User is not authorized" });
      }

      // Validate request body
      const { location, healthCondition, notes, photoUrl } = req.body;
      if (!location || !healthCondition) {
        return res.status(400).json({ error: "Incomplete data provided" });
      }

      // Create the ambulance order
      const createdOrder = await prisma.ambulanceOrder.create({
        data: {
          location,
          healthCondition,
          notes,
          photoUrl,
          userId: decodedToken.id,
        },
      });

      // Return the created order
      return res.status(201).json({ message: createdOrder, error: null });
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
