import prisma from "../../../../lib/prisma";
import { getTokenFromHeaders } from "../../../../utils/getTokenFromHeaders";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const decodedToken = getTokenFromHeaders(req.headers);
        if (!decodedToken) {
          return res
            .status(403)
            .json({ error: "Forbidden: Token has expired" });
        }

        // Check if the role is USER
        const { role } = decodedToken;
        if (role !== "USER") {
          return res
            .status(403)
            .json({ error: "Forbidden: User is not authorized" });
        }

        const id = decodedToken?.id;

        // Validate if id is provided
        if (!id) {
          return res.status(400).json({ error: "User id is required" });
        }

        // Fetch user details from the database
        const user = await prisma.user.findUnique({
          where: { id },
        });

        // Check if user exists
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        const { name, phone, photo, medicalHistory } = req.body;

        try {
          const user = await prisma.user.update({
            where: { id },
            data: {
              name,
              phone,
              medicalHistory,
              photo: photo ? photo : undefined,
            },
          });

          return res
            .status(200)
            .json({ message: "Profile updated successfully", user });
        } catch (error) {
          return res.status(500).json({ error: "Error updating profile" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ error: "An error occurred while processing the form" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.log({ error });
  }
}
