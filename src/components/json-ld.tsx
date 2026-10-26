/**
 * Serialises a structured-data graph into a `<script type="application/ld+json">`.
 *
 * `<` is escaped to `<` so a string in the payload can never terminate the
 * script element early and inject markup. JSON.stringify does not do this.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
