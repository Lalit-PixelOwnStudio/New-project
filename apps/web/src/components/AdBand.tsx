import { ADS_ENABLED, DESKTOP } from "@/lib/ads";
import { AdSlot, type Placement } from "./AdSlot";
import s from "./AdBand.module.css";

/**
 * A full-width band holding one ad between page sections, on the section's
 * background. Its height is reserved up front so the page doesn't shift when
 * the ad arrives; `desktopOnly` keeps it off phones.
 */
export function AdBand({ placement = "feed", tone = "plain", desktopOnly = false }: { placement?: Placement; tone?: "plain" | "page"; desktopOnly?: boolean }) {
  if (!ADS_ENABLED) return null;
  return (
    <div className={s.band} data-tone={tone} data-desktop-only={desktopOnly || undefined}>
      <div className={s.inner} data-placement={placement}>
        <AdSlot placement={placement} media={desktopOnly ? DESKTOP : undefined} />
      </div>
    </div>
  );
}
