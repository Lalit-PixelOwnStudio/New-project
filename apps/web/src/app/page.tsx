import { STYLES } from "@truehand/catalog";
import { Editor } from "@/editor/Editor";
import s from "./home.module.css";

export default function Home() {
  return (
    <main>
      <Editor
        placeholder="/specimens/hero.webp"
        intro={
          <>
            <p className={s.eyebrow}>Text to handwriting · Free</p>
            <h1 className={s.title}>Text to handwriting that doesn&rsquo;t look like a font.</h1>
            <p className={s.lede}>
              Type or paste anything. Truehand rewrites every letter by hand, on real-looking paper, in {STYLES.length} different hands.
            </p>
          </>
        }
      />
    </main>
  );
}
