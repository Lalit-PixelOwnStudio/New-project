/**
 * Blog posts answer what students search for (a project file acknowledgement, a
 * leave application, the formal letter format) with samples they can copy, and
 * one click from each sample to the editor, where it comes out handwritten.
 *
 * Each post lives in its own file under posts/. Add a post there, then list it
 * here in the order it should appear.
 */
import projectFileCoverPage from "./posts/project-file-cover-page";
import certificateForProjectFile from "./posts/certificate-for-project-file";
import acknowledgementForProjectFile from "./posts/acknowledgement-for-project-file";
import indexForProjectFile from "./posts/index-for-project-file";
import bibliographyForProjectFile from "./posts/bibliography-for-project-file";
import leaveApplicationForSchool from "./posts/leave-application-for-school";
import leaveApplicationForCollege from "./posts/leave-application-for-college";
import sickLeaveApplicationForOffice from "./posts/sick-leave-application-for-office";
import applicationForTransferCertificate from "./posts/application-for-transfer-certificate";
import applicationForBonafideCertificate from "./posts/application-for-bonafide-certificate";
import applicationForFeeConcession from "./posts/application-for-fee-concession";
import formalLetterFormat from "./posts/formal-letter-format";
import informalLetterFormat from "./posts/informal-letter-format";
import apologyLetterToTeacher from "./posts/apology-letter-to-teacher";
import resignationLetter from "./posts/resignation-letter";
import thankYouNoteForTeacher from "./posts/thank-you-note-for-teacher";
import noticeWritingFormat from "./posts/notice-writing-format";
import diaryEntryFormat from "./posts/diary-entry-format";
import howToImproveHandwriting from "./posts/how-to-improve-handwriting";
import textToHandwritingConverter from "./posts/text-to-handwriting-converter";
import type { BlogPost, BlogTemplate } from "./types";

export { CATEGORIES } from "./categories";
export type { BlogBlock, BlogCategory, BlogPost, BlogTemplate } from "./types";

export const BLOG: BlogPost[] = [
  projectFileCoverPage,
  certificateForProjectFile,
  acknowledgementForProjectFile,
  indexForProjectFile,
  bibliographyForProjectFile,
  leaveApplicationForSchool,
  leaveApplicationForCollege,
  sickLeaveApplicationForOffice,
  applicationForTransferCertificate,
  applicationForBonafideCertificate,
  applicationForFeeConcession,
  formalLetterFormat,
  informalLetterFormat,
  apologyLetterToTeacher,
  resignationLetter,
  thankYouNoteForTeacher,
  noticeWritingFormat,
  diaryEntryFormat,
  howToImproveHandwriting,
  textToHandwritingConverter,
];

export const blogBySlug = (slug: string) => BLOG.find((b) => b.slug === slug);

/** The posts the home page links to: what students search for most. */
export const FEATURED: BlogPost[] = [
  "acknowledgement-for-project-file",
  "leave-application-for-school",
  "certificate-for-project-file",
  "formal-letter-format",
  "index-for-project-file",
  "application-for-transfer-certificate",
  "notice-writing-format",
  "informal-letter-format",
  "how-to-improve-handwriting",
  "text-to-handwriting-converter",
].map((slug) => blogBySlug(slug)!);

/** Every sample in a post, in order. */
export const templatesOf = (post: BlogPost): BlogTemplate[] =>
  post.sections.flatMap((s) => s.blocks).flatMap((b) => (b.kind === "template" ? [b.template] : []));

export const templateOf = (post: BlogPost, id: string) => templatesOf(post).find((t) => t.id === id);

/** The markup without its formatting, for copying as plain text. */
export const plainText = (markup: string) =>
  markup
    .split("\n")
    .map((line) => line.replace(/^#{1,2} /, "").replace(/\*\*(.+?)\*\*/g, "$1"))
    .join("\n");
