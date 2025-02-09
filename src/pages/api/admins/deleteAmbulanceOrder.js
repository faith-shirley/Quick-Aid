import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    // Check if the request method is GET
    if (req.method === "DELETE") {
      // Extract token from headers and validate
      const decodedToken = getTokenFromHeaders(req.headers);
      if (!decodedToken) {
        return res.status(403).json({ error: "Forbidden: Token has expired" });
      }

      // Check if the role is ADMIN
      const { role } = decodedToken;
      if (role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Forbidden: Admin is not authorized" });
      }

      // Extract blog ID from the request query
      const { id } = req.query;
      if (!id) {
        return res
          .status(400)
          .json({ error: "Bad Request: Blog ID is required" });
      }

      // Delete the ORDER from the database
      const deletedOrder = await prisma.ambulanceOrder.delete({
        where: { id },
      });

      // Return success message
      return res.status(200).json({
        message: "Order deleted successfully",
        data: deletedOrder,
        error: null,
      });
    } else {
      // Handle other HTTP methods if needed
      return res.status(405).json({
        message: "Method Not Allowed",
        status: 405,
        error: "Only GET method is allowed for this endpoint",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: null,
      status: 500,
      error: "An error occurred on the server. Please try again later!",
    });
  }
}
