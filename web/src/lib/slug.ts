import { randomBytes } from "node:crypto";

const SLUG_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const SLUG_LENGTH = 6;

function randomSlug(): string {
  const bytes = randomBytes(SLUG_LENGTH);
  let slug = "";
  for (const byte of bytes) {
    slug += SLUG_ALPHABET[byte % SLUG_ALPHABET.length];
  }
  return slug;
}

export { randomSlug };