// Slug corto con Web Crypto (disponible en Node 18+ y navegadores). Cada
// carácter se toma del alfabeto sin ambigüedad (sin 0/O/1/l/I). 6 caracteres ≈
// 58^6 ≈ 39 mil millones de combinaciones; las colisiones se reintentan en la
// API con un slug nuevo.

const SLUG_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const SLUG_LENGTH = 6;

function randomSlug(): string {
  const bytes = new Uint8Array(SLUG_LENGTH);
  crypto.getRandomValues(bytes);
  let slug = "";
  for (const byte of bytes) {
    slug += SLUG_ALPHABET[byte % SLUG_ALPHABET.length];
  }
  return slug;
}

export { randomSlug };