const SHORT_BASE = process.env.NEXT_PUBLIC_SHORT_URL;

export function shortUrlDe(slug: string): string {
  return SHORT_BASE ? `${SHORT_BASE}/${slug}` : `http://localhost:3000/s/${slug}`;
}