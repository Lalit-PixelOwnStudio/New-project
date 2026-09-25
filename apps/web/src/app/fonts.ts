import localFont from "next/font/local";

/** Display: condensed, heavy headlines. Variable width and weight. */
export const anybody = localFont({
  src: "../fonts/Anybody.woff2",
  variable: "--font-anybody",
  weight: "100 900",
  style: "normal",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "50% 150%" }],
});

/** Text and UI. */
export const host = localFont({
  src: "../fonts/HostGrotesk.woff2",
  variable: "--font-host",
  weight: "300 800",
  display: "swap",
});

/** Labels, numbers, anything technical. */
export const martian = localFont({
  src: "../fonts/MartianMono.woff2",
  variable: "--font-martian",
  weight: "100 800",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 112.5%" }],
});
