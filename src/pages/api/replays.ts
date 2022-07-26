// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

export default async function replays(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ message: "ok", success: true });
  /*
  if (req.method === "POST") {
    return await createReplay(req, res);
  } else {
    return res.status(200).json({ message: "hello", success: false });
  }
  */
}

async function createReplay(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const newReplay = await prisma.replay.create({
      data: {
        info: body.info,
        data: body.data,
      },
    });
    return res.status(200).json({ id: newReplay.id });
  } catch (error) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating replay" });
  }
}
