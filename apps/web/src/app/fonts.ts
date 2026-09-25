import localFont from "next/font/local";

/** Text, UI and headlines. Variable 300–800. */
export const host = localFont({
  src: "../fonts/HostGrotesk.woff2",
  variable: "--font-host",
  weight: "300 800",
  display: "swap",
});

/** Small technical details: counts, dimensions, references. */
export const martian = localFont({
  src: "../fonts/MartianMono.woff2",
  variable: "--font-martian",
  weight: "100 800",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 112.5%" }],
});
