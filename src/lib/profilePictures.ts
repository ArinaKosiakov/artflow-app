/**
 * Profile pictures are stored as filenames (e.g. "1.png") in the DB.
 * Actual assets live in src/profilePictures/ and are resolved at runtime.
 * Uses webpack require.context (typed as any to avoid TS missing definition).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const profilePicturesContext = (require as any).context(
  "../profilePictures",
  false,
  /\.png$/
) as { keys: () => string[]; (id: string): string | { default: string } };

export const AVAILABLE_PROFILE_PICTURES: string[] = profilePicturesContext
  .keys()
  .map((k: string) => k.replace(/^\.\//, ""))
  .sort((a: string, b: string) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
  });

function resolveContextUrl(mod: string | { default: string }): string | undefined {
  if (typeof mod === "string") return mod;
  return mod?.default;
}

/**
 * Returns the URL for a profile picture.
 * Only supports local predefined assets (e.g. "1.png", "2.png") from src/profilePictures/
 */
export function getProfilePictureUrl(
  value: string | null | undefined,
): string | undefined {
  if (value == null || value === "") return undefined;

  // Legacy: absolute URLs or data URLs
  if (value.startsWith("http") || value.startsWith("data:")) return value;

  // Check if it's a local asset (numbered files like "1.png", "2.png")
  const key = `./${value}`;
  if (profilePicturesContext.keys().includes(key)) {
    return resolveContextUrl(profilePicturesContext(key));
  }

  // If not found, return undefined
  return undefined;
}
