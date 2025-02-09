// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res
    .status(200)
    .json({ person1: "Raymond", person2: "mohammed", person3: "fred" });
}
