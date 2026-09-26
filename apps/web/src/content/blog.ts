import type { EditorSettings } from "@/lib/settings";

/**
 * Blog posts answer what students search for (a project file acknowledgement, a
 * leave application, the formal letter format) with samples they can copy, and
 * one click from each sample to the editor, where it comes out handwritten.
 */

/** A sample, in the editor's markup: # heading, **bold**, - list, one paragraph per line. */
export interface BlogTemplate {
  id: string;
  title: string;
  text: string;
  settings?: Partial<Pick<EditorSettings, "paperId" | "styleId" | "fontSize">>;
}

export type BlogBlock =
  { kind: "p"; text: string } | { kind: "list" | "steps"; items: string[] } | { kind: "note"; text: string } | { kind: "template"; template: BlogTemplate };

export interface BlogPost {
  slug: string;
  /** The headline on the page. */
  title: string;
  /** The <title>, when the headline is too long for search results. */
  seoTitle: string;
  description: string;
  published: string;
  updated: string;
  minutes: number;
  /** Two or three sentences that answer the search on their own. */
  intro: string;
  sections: { heading: string; blocks: BlogBlock[] }[];
  faqs: { q: string; a: string }[];
  related: string[];
}

const p = (text: string): BlogBlock => ({ kind: "p", text });
const list = (...items: string[]): BlogBlock => ({ kind: "list", items });
const steps = (...items: string[]): BlogBlock => ({ kind: "steps", items });
const note = (text: string): BlogBlock => ({ kind: "note", text });
const sample = (id: string, title: string, lines: string[], settings?: BlogTemplate["settings"]): BlogBlock => ({
  kind: "template",
  template: { id, title, text: lines.join("\n"), settings },
});

const PUBLISHED = "2026-09-26";

/** The same closing for every application to a principal. */
const SIGN_OFF = ["Thanking you.", "Yours obediently,", "[Your name]", "Class [Class and section], Roll No. [Roll number]"];
const TO_PRINCIPAL = ["To", "The Principal", "[School name]", "[City]", "", "Date: [DD/MM/YYYY]", ""];

export const BLOG: BlogPost[] = [
  {
    slug: "acknowledgement-for-project-file",
    title: "Acknowledgement for a project file: 6 samples you can copy",
    seoTitle: "Acknowledgement for Project File: 6 Samples",
    description:
      "Six ready-to-copy acknowledgements for school and college project files: CBSE, science practical, computer, group and college projects. Free to use.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 5,
    intro:
      "An acknowledgement is the page where you thank the people who helped with your project: your teacher, the principal, your parents and friends. It comes right after the certificate page. Copy a sample below, change the names, and write it out, or let Truehand write it in handwriting for you.",
    sections: [
      {
        heading: "Where the acknowledgement goes",
        blocks: [
          p("Most schools expect the pages of a project file in this order:"),
          steps("Cover page", "Certificate", "Acknowledgement", "Index", "The project itself: introduction, main content, conclusion", "Bibliography"),
          p(
            "Keep the acknowledgement to one page, about 100 to 200 words, and write it in the first person: “I would like to thank…”. In a group project, use “we”.",
          ),
        ],
      },
      {
        heading: "Who to thank",
        blocks: [
          list(
            "Your subject teacher or project guide, by name (Mrs., Mr., Ms. or Dr.).",
            "The principal, for the opportunity and the facilities.",
            "The lab assistant or librarian, if they helped.",
            "Your parents, friends and group members.",
            "Books, websites or people you took information from, briefly.",
          ),
        ],
      },
      {
        heading: "Sample 1: school project (CBSE)",
        blocks: [
          sample("school", "School project (CBSE)", [
            "# Acknowledgement",
            "I would like to express my special thanks of gratitude to my teacher, [Teacher's name], who gave me the opportunity to do this project on the topic “[Project topic]”. It helped me do a lot of research, and I learnt many new things.",
            "I would also like to thank our principal, [Principal's name], for providing the facilities needed for this project.",
            "I am grateful to my parents and friends, who helped me a lot in finishing this project within the given time.",
            "",
            "[Your name]",
            "Class [Class and section]",
          ]),
        ],
      },
      {
        heading: "Sample 2: science practical file",
        blocks: [
          sample("practical", "Science practical file", [
            "# Acknowledgement",
            "I am grateful to my [Physics / Chemistry / Biology] teacher, [Teacher's name], for guiding me through every experiment in this practical file and for patiently answering my questions in the laboratory.",
            "I sincerely thank our principal, [Principal's name], for a well-equipped laboratory, and our lab assistant, [Lab assistant's name], for helping us set up the apparatus safely.",
            "Finally, I thank my parents and classmates for their support and encouragement while I completed this file.",
            "",
            "[Your name]",
            "Class [Class and section], Roll No. [Roll number]",
          ]),
        ],
      },
      {
        heading: "Sample 3: computer science project",
        blocks: [
          sample("computer", "Computer science project", [
            "# Acknowledgement",
            "I would like to thank my computer science teacher, [Teacher's name], for guiding me throughout this project, “[Project name]”, and for helping me solve the problems I faced while writing and testing the program.",
            "I am thankful to our principal, [Principal's name], for providing the computer lab and the time we needed to complete this work.",
            "I also thank my parents and friends for their support, and the authors of the books and websites that helped me understand the concepts used in this project.",
            "",
            "[Your name]",
            "Class [Class and section], Roll No. [Roll number]",
          ]),
        ],
      },
      {
        heading: "Sample 4: group project",
        blocks: [
          sample("group", "Group project", [
            "# Acknowledgement",
            "We, the students of Class [Class and section], would like to thank our teacher, [Teacher's name], for guiding us through this project on “[Project topic]” and for the valuable suggestions at every stage.",
            "We are grateful to our principal, [Principal's name], for encouraging us and giving us this opportunity.",
            "We also thank our parents for their constant support, and each member of our group for working together patiently and sharing the work fairly.",
            "",
            "Group members:",
            "- [Name 1]",
            "- [Name 2]",
            "- [Name 3]",
            "- [Name 4]",
          ]),
        ],
      },
      {
        heading: "Sample 5: college project or report",
        blocks: [
          sample("college", "College project or report", [
            "# Acknowledgement",
            "I would like to express my sincere gratitude to my project guide, [Guide's name], [Designation], Department of [Department], for the guidance, encouragement and valuable feedback throughout this project.",
            "I am thankful to [Head of Department's name], Head of the Department of [Department], and to [College name] for providing the resources and facilities needed to complete this work.",
            "I also thank my parents, friends and classmates for their support and motivation.",
            "",
            "[Your name]",
            "[Course and year], Roll No. [Roll number]",
          ]),
        ],
      },
      {
        heading: "Sample 6: a short acknowledgement",
        blocks: [
          sample("short", "Short acknowledgement", [
            "# Acknowledgement",
            "I sincerely thank my teacher, [Teacher's name], for the guidance and support that helped me complete this project, and our principal, [Principal's name], for the opportunity. I am also grateful to my parents and friends for their encouragement.",
            "",
            "[Your name]",
          ]),
        ],
      },
      {
        heading: "Tips for a good acknowledgement",
        blocks: [
          list(
            "Change a line or two so it sounds like you. Teachers read the same sample many times.",
            "Spell every name exactly right, with the correct title.",
            "Mention the project topic once; it makes the page specific.",
            "Use the same pen and handwriting as the rest of the file, and sign your name at the end.",
          ),
        ],
      },
    ],
    faqs: [
      {
        q: "Where does the acknowledgement go in a project file?",
        a: "After the certificate page and before the index. The cover page comes first, then the certificate, then the acknowledgement.",
      },
      { q: "How long should an acknowledgement be?", a: "One page at most. Around 100 to 200 words, in three or four short paragraphs, is plenty." },
      {
        q: "Does the acknowledgement have to be handwritten?",
        a: "Many schools ask for handwritten project files, so check what your teacher wants. If handwriting is allowed to be printed, Truehand writes it in realistic handwriting on ruled paper for you to print.",
      },
      {
        q: "Should I write “I” or “we”?",
        a: "Use “I” for your own project and “we” for a group project, where you can also list the group members at the end.",
      },
    ],
    related: ["certificate-for-project-file", "index-for-project-file", "how-to-improve-handwriting"],
  },
  {
    slug: "certificate-for-project-file",
    title: "Certificate for a project file: samples for school and college",
    seoTitle: "Certificate for Project File: Samples to Copy",
    description: "Ready-to-copy certificate pages for school and college project files and practical files, with where each person signs. Free to use.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 4,
    intro:
      "The certificate page states that you did the project yourself under your teacher's guidance. It comes right after the cover page, and your teacher signs it, sometimes with the principal and an external examiner. Copy a sample, fill in the blanks, and leave the signature lines empty.",
    sections: [
      {
        heading: "What a certificate page includes",
        blocks: [
          list(
            "The heading “Certificate”.",
            "Your name, class and section, and roll number.",
            "The project title and subject.",
            "The academic session, like 2026–27.",
            "Your teacher's name, and lines for the signatures.",
          ),
          note("Never sign the certificate yourself. The signature lines are for your teacher, the principal and, for board practicals, the examiners."),
        ],
      },
      {
        heading: "Sample 1: school project",
        blocks: [
          sample("school", "School project", [
            "# Certificate",
            "This is to certify that [Your name], a student of Class [Class and section], Roll No. [Roll number], has successfully completed the project titled “[Project title]” in [Subject] under my guidance during the academic session [2026–27].",
            "The project is the student's own work and has been completed to my satisfaction.",
            "",
            "Teacher's signature: ____________",
            "[Teacher's name]",
            "",
            "Principal's signature: ____________",
          ]),
        ],
      },
      {
        heading: "Sample 2: CBSE board practical file",
        blocks: [
          sample("cbse-practical", "CBSE board practical file", [
            "# Certificate",
            "This is to certify that [Your name], Roll No. [Board roll number], a student of Class XII, has satisfactorily completed the practical work in [Subject] as prescribed by the Central Board of Secondary Education for the session [2026–27].",
            "",
            "Internal examiner: ____________",
            "External examiner: ____________",
            "Principal: ____________",
          ]),
        ],
      },
      {
        heading: "Sample 3: science practical file",
        blocks: [
          sample("practical", "Science practical file", [
            "# Certificate",
            "This is to certify that [Your name] of Class [Class and section] has carried out the experiments recorded in this practical file in the [Physics / Chemistry / Biology] laboratory of [School name] during the session [2026–27].",
            "",
            "Subject teacher: ____________",
            "Date: ____________",
          ]),
        ],
      },
      {
        heading: "Sample 4: college project report",
        blocks: [
          sample("college", "College project report", [
            "# Certificate",
            "This is to certify that the project report titled “[Project title]”, submitted by [Your name], Roll No. [Roll number], in partial fulfilment of the requirements for the degree of [Course] at [College name], is a record of original work carried out under my supervision during [Year].",
            "",
            "Project guide: ____________",
            "[Guide's name], [Designation]",
            "",
            "Head of Department: ____________",
          ]),
        ],
      },
    ],
    faqs: [
      {
        q: "Who signs the certificate in a project file?",
        a: "Your subject teacher or project guide. For board practical files, the internal and external examiners and the principal sign too. You never sign it yourself.",
      },
      { q: "Where does the certificate go?", a: "Right after the cover page, before the acknowledgement and the index." },
      {
        q: "What is the difference between the certificate and the acknowledgement?",
        a: "The certificate is your teacher confirming the work is yours. The acknowledgement is you thanking the people who helped.",
      },
    ],
    related: ["acknowledgement-for-project-file", "index-for-project-file", "text-to-handwriting-converter"],
  },
  {
    slug: "index-for-project-file",
    title: "Index for a project file: format and example",
    seoTitle: "Index for Project File: Format and Example",
    description: "How to write the index page of a school project or practical file, the right order of pages, and a ready-to-copy example.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 3,
    intro:
      "The index lists what's in your project file and on which page. It comes after the acknowledgement. Number your pages first and write the index last, so every page number is right.",
    sections: [
      {
        heading: "The order of pages",
        blocks: [
          steps(
            "Cover page",
            "Certificate",
            "Acknowledgement",
            "Index",
            "Introduction",
            "Main content, or the experiments in a practical file",
            "Conclusion",
            "Bibliography",
          ),
          p("The pages before the index usually aren't numbered. Start at 1 with the introduction."),
        ],
      },
      {
        heading: "What each line of the index shows",
        blocks: [
          list(
            "A serial number.",
            "The topic or experiment, the same as its heading in the file.",
            "The page number it starts on.",
            "In a practical file, also the date and a space for the teacher's signature.",
          ),
          note(
            "Truehand writes on ruled lines but doesn't draw table columns. For a ruled table, draw the columns with a ruler after printing, or use the list layout below, which needs no table.",
          ),
        ],
      },
      {
        heading: "Sample: project file index",
        blocks: [
          sample("project", "Project file index", [
            "# Index",
            "1. Introduction ........................ 1",
            "2. Objectives ........................ 2",
            "3. [Topic 1] ........................ 3",
            "4. [Topic 2] ........................ 6",
            "5. [Topic 3] ........................ 9",
            "6. Findings ........................ 12",
            "7. Conclusion ........................ 14",
            "8. Bibliography ........................ 15",
          ]),
        ],
      },
      {
        heading: "Sample: practical file index",
        blocks: [
          sample("practical", "Practical file index", [
            "# Index",
            "1. [Aim of experiment 1]: page 1, date __/__/____, sign ______",
            "2. [Aim of experiment 2]: page 4, date __/__/____, sign ______",
            "3. [Aim of experiment 3]: page 7, date __/__/____, sign ______",
            "4. [Aim of experiment 4]: page 10, date __/__/____, sign ______",
            "5. [Aim of experiment 5]: page 13, date __/__/____, sign ______",
          ]),
        ],
      },
    ],
    faqs: [
      {
        q: "Should the certificate and acknowledgement be in the index?",
        a: "Usually not. The index starts from the first numbered page, the introduction. Ask your teacher if your school does it differently.",
      },
      { q: "When should I write the index?", a: "Last. Finish the file and number the pages first, then the page numbers in the index will be right." },
    ],
    related: ["acknowledgement-for-project-file", "certificate-for-project-file", "how-to-improve-handwriting"],
  },
  {
    slug: "leave-application-for-school",
    title: "Leave application for school: 7 samples for students",
    seoTitle: "Leave Application for School: 7 Samples",
    description:
      "Seven leave application samples for school students: sick leave, fever, family function, urgent work, out of station, half day and a parent's letter.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 5,
    intro:
      "A leave application is a short, polite letter to your principal or class teacher asking for leave and giving the reason. Write it before the leave if you can, or on the day you return. Pick the sample that fits, change the details, and write it out or let Truehand write it for you.",
    sections: [
      {
        heading: "The format",
        blocks: [
          steps(
            "To, The Principal (or Class Teacher), the school's name and city.",
            "The date.",
            "Subject: one line saying what you want, like “Application for sick leave”.",
            "Salutation: Respected Sir / Respected Madam.",
            "The body: who you are, why you need leave, the exact dates, and a polite request.",
            "Closing: Thanking you. Yours obediently, your name, class, section and roll number.",
          ),
          p("Keep it short: three or four sentences in the body are enough. Always give exact dates."),
        ],
      },
      {
        heading: "Sample 1: sick leave (fever)",
        blocks: [
          sample("sick-leave", "Sick leave (fever)", [
            ...TO_PRINCIPAL,
            "Subject: Application for sick leave",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. I have had a high fever since last night, and the doctor has advised me to rest for [number] days. So I will not be able to attend school from [date] to [date].",
            "Kindly grant me leave for these days. I will complete the work I miss.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 2: leave for a family function",
        blocks: [
          sample("family-function", "Leave for a family function", [
            ...TO_PRINCIPAL,
            "Subject: Application for leave to attend my [relation]'s wedding",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. My [relation]'s wedding is on [date], and my family and I will be attending it in [place]. So I will not be able to come to school from [date] to [date].",
            "Kindly grant me leave for these [number] days. I will make up for the classes I miss.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 3: leave for urgent work at home",
        blocks: [
          sample("urgent-work", "Leave for urgent work", [
            ...TO_PRINCIPAL,
            "Subject: Application for leave due to urgent work",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. Due to some urgent work at home, I will not be able to attend school today, [date].",
            "Kindly grant me leave for one day.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 4: going out of station",
        blocks: [
          sample("out-of-station", "Going out of station", [
            ...TO_PRINCIPAL,
            "Subject: Application for leave to go out of station",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. My family has to travel to [place] because of [reason], and we will be away from [date] to [date]. So I will not be able to attend school on these days.",
            "Kindly grant me leave for this period. I will complete my homework and notes after I return.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 5: half-day leave",
        blocks: [
          sample("half-day", "Half-day leave", [
            "To",
            "The Class Teacher",
            "Class [Class and section]",
            "[School name]",
            "",
            "Date: [DD/MM/YYYY]",
            "",
            "Subject: Application for half-day leave",
            "",
            "Respected Sir/Madam,",
            "I have a dentist's appointment at [time] today, so I need to leave school after the [number] period. My [father / mother] will come to pick me up.",
            "Kindly allow me to leave early today.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 6: leave application written by a parent",
        blocks: [
          sample("by-parent", "Written by a parent", [
            ...TO_PRINCIPAL,
            "Subject: Leave application for my [son / daughter]",
            "",
            "Respected Sir/Madam,",
            "My [son / daughter], [Student's name], studies in Class [Class and section] of your school. [He / She] has been unwell with [illness] and has been advised rest by the doctor, so [he / she] will not be able to attend school from [date] to [date].",
            "Kindly grant [him / her] leave for these days.",
            "Thanking you.",
            "Yours sincerely,",
            "[Parent's name]",
            "Phone: [Phone number]",
          ]),
        ],
      },
      {
        heading: "Sample 7: application after being absent",
        blocks: [
          sample("after-absence", "After being absent", [
            ...TO_PRINCIPAL,
            "Subject: Application for leave for the days I was absent",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. I could not attend school from [date] to [date] because I was suffering from [illness]. I have attached my medical certificate.",
            "Kindly grant me leave for these days. I have already started completing the work I missed.",
            ...SIGN_OFF,
          ]),
        ],
      },
    ],
    faqs: [
      {
        q: "Who should I address a leave application to?",
        a: "The principal for one day or more, or your class teacher if your school allows it for a short leave. Use “The Principal” unless you've been told otherwise.",
      },
      {
        q: "Should I write “Yours obediently” or “Yours faithfully”?",
        a: "Students usually write “Yours obediently” to the principal. A parent writes “Yours sincerely” or “Yours faithfully”.",
      },
      {
        q: "Do I need a medical certificate?",
        a: "For sick leave of more than two or three days, most schools ask for one. Mention it in the letter and attach it.",
      },
    ],
    related: ["application-for-transfer-certificate", "formal-letter-format", "how-to-improve-handwriting"],
  },
  {
    slug: "application-for-transfer-certificate",
    title: "Application for a transfer certificate (TC): samples to copy",
    seoTitle: "Application for Transfer Certificate (TC)",
    description:
      "Sample applications to the principal for a transfer certificate (TC): a parent's job transfer, moving city, changing school, or written by a parent.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 4,
    intro:
      "A transfer certificate (TC), also called a school leaving certificate, is what your new school asks for when you change schools. You get it by writing a short application to your principal with the reason. Copy the sample that matches your situation and change the details.",
    sections: [
      {
        heading: "What to include",
        blocks: [
          list(
            "Your name, class and section, roll number, and admission number if you know it.",
            "The reason you're leaving: a transfer, moving city, or changing school.",
            "When you're leaving.",
            "A line saying your fees and library books are cleared, if they are.",
            "A request to issue the TC and any other documents, like a character certificate.",
          ),
        ],
      },
      {
        heading: "Sample 1: parent's job transfer",
        blocks: [
          sample("transfer", "Parent's job transfer", [
            ...TO_PRINCIPAL,
            "Subject: Application for transfer certificate",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section], Admission No. [Admission number]. My father has been transferred to [City], and our family is moving there on [date]. So I will have to leave this school.",
            "I have cleared all my fees and returned my library books. Kindly issue my transfer certificate at the earliest so that I can take admission in a new school.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 2: moving to another city",
        blocks: [
          sample("moving", "Moving to another city", [
            ...TO_PRINCIPAL,
            "Subject: Application for transfer certificate",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. My family is shifting to [City] for personal reasons, so I will not be able to continue my studies here after [date].",
            "Kindly issue my transfer certificate and character certificate. All my dues have been cleared.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 3: changing school or stream",
        blocks: [
          sample("changing-school", "Changing school or stream", [
            ...TO_PRINCIPAL,
            "Subject: Application for transfer certificate",
            "",
            "Respected Sir/Madam,",
            "I am [Your name], a student of Class [Class and section]. I have taken admission in [New school's name] for Class [Class] in the [Science / Commerce / Humanities] stream, which is not offered here.",
            "Kindly issue my transfer certificate so that I can complete my admission. I have cleared all my dues.",
            ...SIGN_OFF,
          ]),
        ],
      },
      {
        heading: "Sample 4: written by a parent",
        blocks: [
          sample("by-parent", "Written by a parent", [
            ...TO_PRINCIPAL,
            "Subject: Request for transfer certificate",
            "",
            "Respected Sir/Madam,",
            "My [son / daughter], [Student's name], is a student of Class [Class and section], Admission No. [Admission number]. As our family is moving to [City] on [date], [he / she] will be leaving this school.",
            "I request you to kindly issue [his / her] transfer certificate. All fees have been paid.",
            "Thanking you.",
            "Yours faithfully,",
            "[Parent's name]",
            "Phone: [Phone number]",
          ]),
        ],
      },
    ],
    faqs: [
      { q: "Who can write a TC application?", a: "The student or a parent. Many schools prefer the parent to sign it, especially for younger students." },
      {
        q: "How long does a school take to issue a TC?",
        a: "Usually a few working days once all dues are cleared. Apply as early as you can, since the new school will need it for admission.",
      },
      { q: "Is a TC the same as a school leaving certificate?", a: "Yes. Different schools and states use either name for the same document." },
    ],
    related: ["leave-application-for-school", "formal-letter-format", "text-to-handwriting-converter"],
  },
  {
    slug: "formal-letter-format",
    title: "Formal letter format, with examples",
    seoTitle: "Formal Letter Format with Examples",
    description:
      "The formal letter format taught in school, part by part, with three full examples: a letter to the editor, a complaint letter and a letter of enquiry.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 6,
    intro:
      "A formal letter follows a fixed order: your address, the date, the receiver's address, the subject, the salutation, the body, and the closing. Most school boards, including CBSE, use this block format with every part starting at the left margin. The examples below follow it exactly.",
    sections: [
      {
        heading: "The parts of a formal letter",
        blocks: [
          steps(
            "Sender's address. In exams, use “Examination Hall” or the address given in the question.",
            "Date, written in full, like 26 September 2026.",
            "Receiver's address: their designation, organisation and city.",
            "Subject: one line that says what the letter is about.",
            "Salutation: Sir / Madam, or Respected Sir / Madam.",
            "Body: an opening paragraph that says why you're writing, one or two paragraphs of detail, and a closing paragraph with what you'd like done.",
            "Complimentary close: Yours faithfully (or Yours sincerely), then your name.",
          ),
          note("CBSE letters are usually 120 to 150 words. Marks go to format, content and language, so every part above matters."),
        ],
      },
      {
        heading: "Example 1: letter to the editor",
        blocks: [
          sample("editor", "Letter to the editor", [
            "Examination Hall",
            "[City]",
            "",
            "26 September 2026",
            "",
            "The Editor",
            "[Newspaper name]",
            "[City]",
            "",
            "Subject: Traffic jams near schools during rush hours",
            "",
            "Sir,",
            "Through the columns of your esteemed newspaper, I wish to draw the attention of the authorities to the traffic jams outside schools in our area every morning and afternoon.",
            "Cars are parked on both sides of the road, buses stop in the middle of it, and there is no traffic police to manage the rush. Students have to walk between moving vehicles, which is dangerous, and many reach school late.",
            "I request the traffic police to post a constable near schools during these hours and to mark a separate area for school buses. Parents should also be asked not to park on the road.",
            "Yours faithfully,",
            "[Your name]",
          ]),
        ],
      },
      {
        heading: "Example 2: complaint letter",
        blocks: [
          sample("complaint", "Complaint letter", [
            "[House number, Street]",
            "[Area, City]",
            "",
            "26 September 2026",
            "",
            "The Commissioner",
            "Municipal Corporation",
            "[City]",
            "",
            "Subject: Garbage not collected in [Area name]",
            "",
            "Sir,",
            "I am writing to complain that garbage has not been collected from [Area name] for the last two weeks.",
            "Heaps of waste have piled up at the street corners. The smell is unbearable, stray animals scatter the garbage, and mosquitoes are breeding, which puts residents at risk of dengue and malaria.",
            "I request you to arrange for the garbage to be cleared at once and to make sure it is collected regularly in future.",
            "Yours faithfully,",
            "[Your name]",
          ]),
        ],
      },
      {
        heading: "Example 3: letter of enquiry",
        blocks: [
          sample("enquiry", "Letter of enquiry", [
            "Examination Hall",
            "[City]",
            "",
            "26 September 2026",
            "",
            "The Director",
            "[Institute name]",
            "[City]",
            "",
            "Subject: Enquiry about the summer coding course",
            "",
            "Sir/Madam,",
            "I read your advertisement in [newspaper] about the summer coding course for school students and would like to know more about it.",
            "Kindly send me details of the course duration, class timings, fees, and whether any prior knowledge is needed. I would also like to know if a certificate is given at the end.",
            "I look forward to your reply.",
            "Yours faithfully,",
            "[Your name]",
          ]),
        ],
      },
    ],
    faqs: [
      {
        q: "Yours faithfully or yours sincerely?",
        a: "Use “Yours faithfully” when you start with “Sir” or “Madam” and don't know the person by name. Use “Yours sincerely” when you address them by name.",
      },
      { q: "Where does the date go in a formal letter?", a: "Below your address, before the receiver's address, in the block format used by CBSE." },
      { q: "Is the subject line necessary?", a: "Yes. In school exams, missing the subject line costs a format mark." },
    ],
    related: ["informal-letter-format", "notice-writing-format", "leave-application-for-school"],
  },
  {
    slug: "informal-letter-format",
    title: "Informal letter format, with examples",
    seoTitle: "Informal Letter Format with Examples",
    description:
      "The informal letter format for school, with three full examples: congratulating a friend, advising a younger brother, and writing to grandparents.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 5,
    intro:
      "An informal letter is a personal letter to a friend or relative. It has fewer parts than a formal letter: your address, the date, a warm greeting, the body, and a friendly closing. There's no subject line and no receiver's address.",
    sections: [
      {
        heading: "The parts of an informal letter",
        blocks: [
          steps(
            "Your address.",
            "The date.",
            "Salutation: Dear [name], or My dear [name].",
            "Body: ask how they are, the main news or advice, and a warm ending.",
            "Complimentary close: Your loving friend, Yours affectionately, or With love, then your name.",
          ),
        ],
      },
      {
        heading: "Example 1: congratulating a friend",
        blocks: [
          sample("congratulate", "Congratulating a friend", [
            "[Your address]",
            "[City]",
            "",
            "26 September 2026",
            "",
            "Dear [Friend's name],",
            "I hope you are doing well. I was so happy to hear from Aunty that you won first prize in the inter-school debate competition. Congratulations!",
            "All the practice you did in the evenings has really paid off. I remember how nervous you were before your first debate last year, and now you've beaten the best speakers in the city.",
            "Please share the video of your speech with me. Give my regards to Uncle and Aunty.",
            "Your loving friend,",
            "[Your name]",
          ]),
        ],
      },
      {
        heading: "Example 2: advising a younger brother",
        blocks: [
          sample("advice", "Advising a younger brother", [
            "[Your address]",
            "[City]",
            "",
            "26 September 2026",
            "",
            "Dear [Brother's name],",
            "I hope you have settled into the hostel. Mummy told me that you have been spending a lot of time on your phone and your exams are only a month away.",
            "I know the phone is fun, but it's easy to lose hours on it. Try keeping it away while you study, and use it only after you finish your day's revision. Make a timetable and stick to it; you will feel much less stressed.",
            "I know you can do really well. Write to me about how your preparation is going.",
            "Your loving sister,",
            "[Your name]",
          ]),
        ],
      },
      {
        heading: "Example 3: writing to grandparents",
        blocks: [
          sample("grandparents", "Writing to grandparents", [
            "[Your address]",
            "[City]",
            "",
            "26 September 2026",
            "",
            "Dear Dadi and Dadaji,",
            "I hope you are both keeping well. We reached home safely after our holiday with you, and I already miss your stories and Dadi's cooking.",
            "School has started again, and I've joined the art club. I'm painting the view from your terrace from the photo I took.",
            "Please take care of your health, and come and stay with us soon.",
            "With lots of love,",
            "[Your name]",
          ]),
        ],
      },
    ],
    faqs: [
      { q: "Does an informal letter have a subject?", a: "No. Subject lines are only for formal letters." },
      {
        q: "How do I end an informal letter?",
        a: "With a friendly close that fits the person: Your loving friend, Yours affectionately, With love, or Your loving son or daughter, followed by your name.",
      },
    ],
    related: ["formal-letter-format", "notice-writing-format", "how-to-improve-handwriting"],
  },
  {
    slug: "notice-writing-format",
    title: "Notice writing format, with examples",
    seoTitle: "Notice Writing Format with Examples",
    description: "The notice writing format used in school exams, part by part, with three examples: a school trip, a lost and found notice and a competition.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 4,
    intro:
      "A notice is a short, formal announcement put up for a group of people, like students of a school. In CBSE exams it is written inside a box, in about 50 words, with the institution's name, the word NOTICE, the date, a heading, the details, and the writer's name and designation.",
    sections: [
      {
        heading: "The format",
        blocks: [
          steps(
            "Name of the school or organisation.",
            "NOTICE, in capital letters.",
            "Date.",
            "Heading: what the notice is about.",
            "Body: what, when, where, who can take part, and whom to contact. Around 50 words.",
            "Name and designation of the person issuing it, like Secretary, Literary Club.",
          ),
          note("Draw a box around the whole notice. If you print it from Truehand, draw the box with a ruler afterwards."),
        ],
      },
      {
        heading: "Example 1: school trip",
        blocks: [
          sample("trip", "School trip", [
            "# [School name], [City]",
            "## NOTICE",
            "26 September 2026",
            "**Educational trip to the Science Centre**",
            "The school is organising a one-day trip to the Regional Science Centre for students of Classes VIII to X on 10 October 2026. Buses will leave at 8 a.m. and return by 3 p.m. The cost is ₹300. Interested students should give their names to the undersigned by 3 October.",
            "[Your name]",
            "Secretary, Science Club",
          ]),
        ],
      },
      {
        heading: "Example 2: lost and found",
        blocks: [
          sample("lost", "Lost and found", [
            "# [School name], [City]",
            "## NOTICE",
            "26 September 2026",
            "**Lost: blue water bottle**",
            "A blue steel water bottle with the name “[Name]” written on it was lost in the playground during the games period on 24 September. Anyone who has found it is requested to hand it over to the undersigned or to the school office.",
            "[Your name]",
            "Class [Class and section]",
          ]),
        ],
      },
      {
        heading: "Example 3: inter-house competition",
        blocks: [
          sample("competition", "Inter-house competition", [
            "# [School name], [City]",
            "## NOTICE",
            "26 September 2026",
            "**Inter-house poetry recitation**",
            "An inter-house poetry recitation competition will be held in the school auditorium on 8 October 2026 at 11 a.m. Each house may send two participants from Classes VI to VIII. Poems may be in Hindi or English, up to three minutes long. Give your names to your house captains by 1 October.",
            "[Your name]",
            "Cultural Secretary",
          ]),
        ],
      },
    ],
    faqs: [
      { q: "What is the word limit for a notice?", a: "About 50 words for the body in CBSE Class 10 and 12 exams. Stick close to it." },
      { q: "Is the box necessary?", a: "Yes, in school exams the notice is written inside a box. The heading and date go inside it too." },
    ],
    related: ["formal-letter-format", "informal-letter-format", "text-to-handwriting-converter"],
  },
  {
    slug: "how-to-improve-handwriting",
    title: "How to improve your handwriting: 12 tips that work",
    seoTitle: "How to Improve Your Handwriting: 12 Tips",
    description:
      "Twelve practical ways to make your handwriting neater and faster, from pen grip and posture to daily drills, plus a free practice sheet to copy.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 6,
    intro:
      "Neat handwriting comes from a relaxed grip, even letter sizes and steady spacing, and it improves with ten minutes of practice a day. These tips work at any age, and the practice sheet at the end gives you a model to copy.",
    sections: [
      {
        heading: "Get the basics right",
        blocks: [
          steps(
            "Hold the pen loosely, about 2 to 3 cm from the tip. A tight grip makes letters shaky and your hand tired.",
            "Sit straight with both feet on the floor, and rest your forearm on the desk.",
            "Tilt the page slightly: to the left if you're right-handed, to the right if you're left-handed.",
            "Use a pen that glides: a gel or fine ballpoint pen is easier to control than a scratchy one.",
          ),
        ],
      },
      {
        heading: "Make every letter consistent",
        blocks: [
          steps(
            "Slow down. Neat first, fast later; speed comes on its own with practice.",
            "Keep small letters the same height, sitting on the line. Ruled paper helps.",
            "Make tall letters (b, d, h, k, l) about twice the height of small ones.",
            "Leave the width of one small letter o between words.",
            "Keep the same slant, straight up or slightly forward, but not mixed.",
          ),
        ],
      },
      {
        heading: "Practise a little every day",
        blocks: [
          steps(
            "Warm up with rows of loops, zigzags and circles to loosen your hand.",
            "Write a pangram, a sentence with every letter, three times a day. The practice sheet below has five.",
            "Pick the three letters you write worst and fill a line with each.",
          ),
          p(
            "Copying a neat model is the fastest way to improve. Open the practice sheet below in Truehand, pick a neat hand like Theo, print it, and copy it line by line underneath.",
          ),
          sample(
            "practice",
            "Handwriting practice sheet",
            [
              "# Handwriting practice",
              "The quick brown fox jumps over the lazy dog.",
              "Pack my box with five dozen liquor jugs.",
              "How vexingly quick daft zebras jump!",
              "Sphinx of black quartz, judge my vow.",
              "The five boxing wizards jump quickly.",
              "a b c d e f g h i j k l m n o p q r s t u v w x y z",
              "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
              "0 1 2 3 4 5 6 7 8 9",
            ],
            { styleId: "theo", paperId: "wide", fontSize: 1.15 },
          ),
        ],
      },
    ],
    faqs: [
      {
        q: "How long does it take to improve handwriting?",
        a: "Most people see a clear difference in two to three weeks with ten to fifteen minutes of practice a day.",
      },
      {
        q: "Should I write in cursive or print?",
        a: "Whichever you can keep neat and consistent. Many people write fastest in a mix: print letters that join where it's natural.",
      },
      {
        q: "Which pen is best for neat handwriting?",
        a: "A smooth gel pen or a fine ballpoint with a comfortable grip. Avoid pens that skip or scratch; they make you press harder.",
      },
    ],
    related: ["text-to-handwriting-converter", "acknowledgement-for-project-file", "informal-letter-format"],
  },
  {
    slug: "text-to-handwriting-converter",
    title: "Text to handwriting converter: how it works, and how to make it look real",
    seoTitle: "Text to Handwriting Converter: How It Works",
    description: "What a text to handwriting converter does, why most results look fake, and how to make typed text look genuinely handwritten on ruled paper.",
    published: PUBLISHED,
    updated: PUBLISHED,
    minutes: 5,
    intro:
      "A text to handwriting converter takes typed text and writes it out on a page in a handwriting style, ready to download as a PDF or image. The good ones vary every letter, wobble the line and press the ink unevenly, the way a real hand does. Here's how that works and how to get the most realistic result.",
    sections: [
      {
        heading: "Why most converters look fake",
        blocks: [
          p(
            "Most converters simply set your text in a handwriting font. A font draws every “e” exactly the same, on a perfectly straight line, with perfectly even spacing. Your eye notices that repetition immediately, even if you can't say why.",
          ),
          p(
            "Real handwriting is never that regular. The same letter changes a little every time, words drift up and down, and the writing gets looser as your hand tires.",
          ),
        ],
      },
      {
        heading: "What makes it look real",
        blocks: [
          list(
            "Letter variation: each letter is drawn slightly differently every time it appears.",
            "A wandering baseline: words sit a little above or below the line, and lines drift.",
            "Ink and pressure: strokes are darker where the pen pressed harder, and the ink looks absorbed by the paper.",
            "The right paper: ruled lines, a margin and a paper texture that match a real notebook.",
            "Fatigue: the writing loosens slightly towards the bottom of a long page.",
          ),
          p("Truehand does all of these for every page, so no two pages come out the same, and you can press Rewrite for a fresh version of the same text."),
        ],
      },
      {
        heading: "How to use it",
        blocks: [
          steps(
            "Type or paste your text in the editor. Start a line with # for a heading.",
            "Pick a handwriting, a paper and a pen. Blue ballpoint on college ruled paper looks most like a school notebook.",
            "In Style & page, set the size and messiness, and add your name and page numbers if you need them.",
            "Download a PDF to print, or PNG images to share.",
          ),
          sample("try-it", "Try it with this paragraph", [
            "# My first handwritten page",
            "This page was typed, not written. Every letter was drawn a moment ago, with its own slant, its own pressure and a small wobble off the line.",
            "Change anything and watch the page write itself again.",
          ]),
        ],
      },
      {
        heading: "Tips for the most realistic result",
        blocks: [
          list(
            "Choose an everyday hand, not a decorative one. Everyday and print styles look most natural.",
            "Keep messiness around the middle. Too neat looks printed; too messy looks careless.",
            "Print at Actual size, not Fit to page, so the ruled lines stay the right height.",
            "Print in colour: blue ink looks far more real than black.",
          ),
        ],
      },
    ],
    faqs: [
      {
        q: "Can teachers tell it isn't handwritten?",
        a: "It's designed to look natural, but rules differ. If your teacher asks for work written in your own hand, write it yourself. Truehand is best for notes, drafts, letters, cards and anything where printed handwriting is welcome.",
      },
      { q: "Is it free?", a: "Yes. You can write and download 10 pages a day free, in Full HD, with no sign-up." },
      {
        q: "Can I use my own handwriting?",
        a: "Yes. Fill in a one-page template by hand, take a photo, and Truehand turns it into your own handwriting.",
      },
    ],
    related: ["how-to-improve-handwriting", "acknowledgement-for-project-file", "leave-application-for-school"],
  },
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
