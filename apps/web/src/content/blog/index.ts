/**
 * Blog posts answer what students search for (a project file acknowledgement, a
 * leave application, the formal letter format) with samples they can copy, and
 * one click from each sample to the editor, where it comes out handwritten.
 *
 * Each post lives in its own file under posts/. Add a post there, then list it
 * here in the order it should appear.
 */
import acknowledgementForProjectFile from "./posts/acknowledgement-for-project-file";
import certificateForProjectFile from "./posts/certificate-for-project-file";
import indexForProjectFile from "./posts/index-for-project-file";
import leaveApplicationForSchool from "./posts/leave-application-for-school";
import applicationForTransferCertificate from "./posts/application-for-transfer-certificate";
import formalLetterFormat from "./posts/formal-letter-format";
import informalLetterFormat from "./posts/informal-letter-format";
import noticeWritingFormat from "./posts/notice-writing-format";
import howToImproveHandwriting from "./posts/how-to-improve-handwriting";
import textToHandwritingConverter from "./posts/text-to-handwriting-converter";
import type { BlogPost, BlogTemplate } from "./types";

export type { BlogBlock, BlogPost, BlogTemplate } from "./types";

export const BLOG: BlogPost[] = [
  acknowledgementForProjectFile,
  certificateForProjectFile,
  indexForProjectFile,
  leaveApplicationForSchool,
  applicationForTransferCertificate,
  formalLetterFormat,
  informalLetterFormat,
  noticeWritingFormat,
  howToImproveHandwriting,
  textToHandwritingConverter,
];

export const blogBySlug = (slug: string) => BLOG.find((b) => b.slug === slug);

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
