import Link from "next/link";
import { hashidFromNumber } from "src/utils/hashids";

type Props = {
  /** With slash at end. eg "/profile/" */
  href: string;
  id: number;
  children: React.ReactNode;
  className?: string;
};

/**
 * utility for
 *
 * ```jsx
 * const path = `${href}${hashid(id)}`
 * <Link href={path}>
 * ```
 * use for linking to records via hashid rather than the real record id.
 *
 * Note: This is not a "security" thing. Its just nicer so see a link like "replay/DvzYw" instead of "replay/2"
 */
export function IdLink({ href, id, children, className }: Props) {
  return (
    <Link className={className} href={`${href}${hashidFromNumber(id)}`}>
      {children}
    </Link>
  );
}
