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
 * essentially `<Link href={path}{hashid}/>`
 *
 * Utility component. convert id to hashid.
 */
export function IdLink({ href, id, children, className }: Props) {
  return (
    <Link className={className} href={`${href}${hashidFromNumber(id)}`}>
      {children}
    </Link>
  );
}
