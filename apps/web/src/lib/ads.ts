/** Until AdSense is live, reserved ad spaces show as labelled placeholders. Set to "0" to hide them. */
export const AD_PLACEHOLDERS = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS !== "0";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
/** Whether the site shows ads at all (to free users). */
export const ADS_ENABLED = AD_PLACEHOLDERS || Boolean(ADSENSE_CLIENT);
/** Phones and small tablets, where the editor stacks and top banners stay off. */
export const DESKTOP = "(min-width: 961px)";
