/**
 * Starter guides: one question a student would ask, answered step by step on
 * screenshots of the real editor. Each guide lives in its own file under
 * posts/; list it here in the order it should appear.
 */
import gettingStarted from "./posts/getting-started";
import makeYourOwnHandwritingFont from "./posts/make-your-own-handwriting-font";
import typedAssignmentToHandwriting from "./posts/typed-assignment-to-handwriting";
import nameClassOnEveryPage from "./posts/name-class-on-every-page";
import makeItLookReal from "./posts/make-it-look-real";
import labRecordFormat from "./posts/lab-record-format";
import handwrittenStudyNotes from "./posts/handwritten-study-notes";
import writeAJournalOnline from "./posts/write-a-journal-online";
import handwrittenLetterOrCard from "./posts/handwritten-letter-or-card";
import useTruehandOnYourPhone from "./posts/use-truehand-on-your-phone";
import downloadPrintAndShare from "./posts/download-print-and-share";
import type { Guide } from "./types";

export type { Guide, GuideBlock } from "./types";

export const GUIDES: Guide[] = [
  gettingStarted,
  makeYourOwnHandwritingFont,
  typedAssignmentToHandwriting,
  nameClassOnEveryPage,
  makeItLookReal,
  labRecordFormat,
  handwrittenStudyNotes,
  writeAJournalOnline,
  handwrittenLetterOrCard,
  useTruehandOnYourPhone,
  downloadPrintAndShare,
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
