/** Landing pages for each job Truehand does, one file per job under cases/. */
import assignments from "./cases/assignments";
import labRecords from "./cases/lab-records";
import cornellNotes from "./cases/cornell-notes";
import letters from "./cases/letters";
import journal from "./cases/journal";
import worksheets from "./cases/worksheets";
import type { UseCase } from "./types";

export type { UseCase } from "./types";

export const USE_CASES: UseCase[] = [assignments, labRecords, cornellNotes, letters, journal, worksheets];

export const useCaseBySlug = (slug: string) => USE_CASES.find((u) => u.slug === slug);
