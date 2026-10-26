import Image from "next/image";
import { SITE_NAME } from "@/lib/site";

/**
 * Brand lockup: the two-way arrow mark beside the script wordmark.
 * The mark is decorative (`alt=""`) because the wordmark text beside it
 * already names the company.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* Mark only — the wordmark is carried by the `aria-label` on the link
          wrapping this, so the company name is still announced. */}
      <Image
        src="/logo-mark.png"
        alt={SITE_NAME}
        width={481}
        height={622}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </span>
  );
}
