import { STYLES } from "@truehand/catalog";
import type { Metadata } from "next";
import { Prose } from "@/components/Prose";

export const metadata: Metadata = { title: "Font credits", alternates: { canonical: "/credits" } };

export default function CreditsPage() {
  const fonts = [...new Map(STYLES.map((s) => [s.font.family, s])).values()].sort((a, b) => a.font.family.localeCompare(b.font.family));
  return (
    <Prose eyebrow="Credits" title="The fonts behind the hands">
      <p>
        Truehand&rsquo;s handwriting styles start from open-source handwriting fonts by the designers below, distributed through Google Fonts. Truehand adds the
        variation, layout and ink rendering on top; the letterforms are theirs. Thank you.
      </p>
      <table>
        <thead>
          <tr>
            <th>Truehand style</th>
            <th>Font</th>
            <th>Designer</th>
            <th>Licence</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((s) => (
            <tr key={s.font.family}>
              <td>
                {STYLES.filter((x) => x.font.family === s.font.family)
                  .map((x) => x.name)
                  .join(", ")}
              </td>
              <td>{s.font.family}</td>
              <td>{s.font.designer}</td>
              <td>{s.font.license === "OFL" ? "SIL Open Font License 1.1" : "Apache License 2.0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        The interface uses Host Grotesk and Martian Mono (SIL Open Font License), and text shaping is done by HarfBuzz (MIT licence). Full licence texts ship
        with the source code.
      </p>
    </Prose>
  );
}
