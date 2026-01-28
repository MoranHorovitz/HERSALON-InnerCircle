import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroTextWithDepthShadow } from "../HeroTextWithDepthShadow";
import { GlowCapture } from "../GlowCapture";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  canAttend: boolean;
};

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function PrimaryCTA({ onClick }: { onClick: () => void }) {
  return (
    <GlowCapture className="inline-block rounded-[999px]" glowSize={320}>
      <button
        onClick={onClick}
        className="h-16 rounded-[999px] bg-brand px-12 text-base font-semibold text-white shadow-btn hover:opacity-95 transition inline-flex items-center gap-3"
      >
        לבקשת שיחת התאמה
      </button>
    </GlowCapture>
  );
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [s, setS] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    canAttend: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit =
    s.fullName.trim().length >= 2 &&
    s.phone.trim().length >= 8 &&
    /^\S+@\S+\.\S+$/.test(s.email.trim()) &&
    s.canAttend &&
    status !== "sending";

  async function submit() {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch(
        "https://hersalon-leads.moran-horovitz.workers.dev/?key=H3754L0N",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(s),
        }
      );
      if (!res.ok) throw new Error("bad");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-lg rounded-xl2 bg-white shadow-soft overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">בקשת שיחת התאמה</div>
                  <div className="mt-1 text-xl font-bold text-brand">
                    HERSALON
                  </div>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-700"
                  onClick={onClose}
                  aria-label="close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                <input
                  className="h-12 rounded-xl2 border border-slate-200 px-4 outline-none focus:border-brand"
                  placeholder="שם מלא"
                  value={s.fullName}
                  onChange={(e) => setS({ ...s, fullName: e.target.value })}
                />
                <input
                  className="h-12 rounded-xl2 border border-slate-200 px-4 outline-none focus:border-brand"
                  placeholder="טלפון"
                  value={s.phone}
                  onChange={(e) => setS({ ...s, phone: e.target.value })}
                />
                <input
                  className="h-12 rounded-xl2 border border-slate-200 px-4 outline-none focus:border-brand"
                  placeholder="מייל"
                  value={s.email}
                  onChange={(e) => setS({ ...s, email: e.target.value })}
                />

                <label className="mt-2 flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 accent-brand"
                    checked={s.canAttend}
                    onChange={(e) =>
                      setS({ ...s, canAttend: e.target.checked })
                    }
                  />
                  <span>
                    יש לי אפשרות להגיע למפגש שבועי בין 19-22 פיזי בשכונת בילויים
                    ברמת גן
                  </span>
                </label>

                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className="mt-3 h-12 rounded-xl2 bg-brand text-white font-semibold shadow-btn disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition"
                >
                  {status === "sending" ? "שולחת..." : "שליחה"}
                </button>

                {status === "sent" && (
                  <div className="text-sm text-emerald-700">
                    נשלח! אחזור אלייך לתיאום שיחה 💜
                  </div>
                )}
                {status === "error" && (
                  <div className="text-sm text-rose-700">
                    משהו השתבש. נסי שוב אח״כ או שלחי ידנית בקשה למייל:
                    morry4@gmail.com
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function InnerCirclePage() {
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, []);

  const includeCards = useMemo(
    () => [
      {
        icon: "✦",
        title: "8 מפגשי עבודה פיזיים",
        desc: "8 מפגשי עבודה פיזיים ברמת גן בשעות הערב שמתאימות לנשים עם לוז מלא. מפגשים צפופים שמייצרים תוצר.",
      },
      {
        icon: "✦",
        title: "דדליין שאי אפשר לברוח ממנו",
        desc: "אנחנו לא מדברות על העסק אנחנו בונות אותו. כל מפגש מסתיים בהתקדמות אמיתית.",
      },
      {
        icon: "✦",
        title: "AI + עיצוב חוויה",
        desc: "כלי AI שחוסכים ימים + אריזה ועיצוב שגורמים למוצר להרגיש מליון דולר.",
      },
      {
        icon: "✦",
        title: "קבוצה מגובשת שמחזיקה אותך",
        desc: "עד X משתתפות. נשים שבאות לעבוד. יחד זה קל יותר - ומתקדם מהר יותר.",
      },
    ],
    []
  );

  const mentorCards = useMemo(
    () => [
      {
        icon: "✦",
        title: "8 מפגשי עבודה פיזיים",
        desc: "8 מפגשי עבודה פיזיים ברמת גן בשעות הערב שמתאימות לנשים עם לוז מלא. מפגשים צפופים שמייצרים תוצר.",
      },
      {
        icon: "✦",
        title: "דדליין שאי אפשר לברוח ממנו",
        desc: "אנחנו לא מדברות על העסק אנחנו בונות אותו. כל מפגש מסתיים בהתקדמות אמיתית.",
      },
      {
        icon: "✦",
        title: "AI + עיצוב חוויה",
        desc: "כלי AI שחוסכים ימים + אריזה ועיצוב שגורמים למוצר להרגיש מליון דולר.",
      },
      {
        icon: "✦",
        title: "קבוצה מגובשת שמחזיקה אותך",
        desc: "עד X משתתפות. נשים שבאות לעבוד. יחד זה קל יותר - ומתקדם מהר יותר.",
      },
    ],
    []
  );

  function AboutSection() {
    return (
      <section className="bg-neutral-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="me2.png"
              alt="מורן הורוביץ"
              className="rounded-3xl shadow-lg object-cover w-full h-full"
            />
          </div>

          {/* Text */}
          <div className="text-neutral-800">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              אני מורן הורוביץ
            </h2>

            <p className="text-lg leading-relaxed mb-4">
              מתכנתת, יזמת, ובשנים האחרונות מלווה נשים חכמות ומוכשרות להפוך ידע,
              ניסיון ורעיונות —{" "}
              <span className="font-semibold">לתוצרים שמכניסים כסף</span>.
            </p>

            <p className="text-lg leading-relaxed mb-4">
              הקמתי את <span className="font-semibold">HerSalon</span> מתוך הבנה
              פשוטה: נשים לא נתקעות מחוסר יכולת — הן נתקעות מחוסר מסגרת נכונה.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              הסלון הוא המקום שבו מפסיקים{" "}
              <span className="italic">“להתלבט”</span>
              ומתחילים <span className="font-semibold">לסיים</span>.
            </p>

            <button className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-neutral-800 transition">
              רוצה להצטרף לסלון
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  function AboutSectionAlt() {
    return (
      <section className="relative bg-[#0b1023] text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* IMAGE */}
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-brand/10 blur-2xl" />
                <img
                  src="/me.png"
                  alt="מורן הורוביץ"
                  className="relative z-10 w-full h-[520px] object-cover rounded-3xl shadow-soft"
                />
              </div>
            </Reveal>

            {/* TEXT */}
            <div className="relative">
              <Reveal>
                <div className="text-sm tracking-wide text-brand font-semibold mb-4">
                  נעים להכיר
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                  אני מורן הורוביץ
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 text-lg text-white/85 leading-relaxed">
                  מתכנתת, יזמת, ובשנים האחרונות מלווה נשים חכמות ומוכשרות להפוך
                  ידע, ניסיון ורעיונות —
                  <span className="text-white font-semibold">
                    {" "}
                    לתוצרים שמכניסים כסף.
                  </span>
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mt-5 text-lg text-white/75 leading-relaxed">
                  הקמתי את <span className="font-semibold">HerSalon</span> מתוך
                  הבנה פשוטה:
                  <br />
                  נשים לא נתקעות מחוסר יכולת —
                  <span className="text-white font-semibold">
                    {" "}
                    הן נתקעות מחוסר מסגרת נכונה.
                  </span>
                </p>
              </Reveal>

              {/* QUOTE */}
              <Reveal delay={0.2}>
                <div className="mt-10 rounded-xl2 bg-white/5 border border-white/10 p-6 text-lg leading-relaxed">
                  הסלון הוא המקום שבו מפסיקים
                  <span className="italic"> “להתלבט” </span>
                  ומתחילים
                  <span className="font-semibold"> לסיים.</span>
                </div>
              </Reveal>

              {/* CTA */}
              <Reveal delay={0.25}>
                <div className="mt-10">
                  <GlowCapture
                    className="inline-block rounded-[999px]"
                    glowSize={260}
                  >
                    <button className="h-14 rounded-[999px] bg-brand px-10 text-white font-semibold shadow-btn hover:opacity-95 transition">
                      לבקשת שיחת התאמה
                    </button>
                  </GlowCapture>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function FitSection() {
    const suitable = [
      "אנשים עם רעיון שהם רוצים להפוך למוצר / שירות במציאות.",
      "נשים עסוקות שרוצות הנחיה ברורה ופרקטית (לא עוד קורסים תיאורטיים).",
      "מי שמוכנה להגיע למפגשים פיזיים ולעבוד באמת על תוצאות.",
      "מי שרוצה לצאת עם נכס עובד — לא רק ״עוד השראה״.",
    ];

    const notSuitable = [
      "מי שמחפשת רק השראה או שיעורים תיאורטיים.",
      "אנשים שלא מוכנים להתחייב למפגשים שבועיים פיזיים.",
      "מי שמחפשת פתרון מיידי ללא עבודה עצמית.",
      "מי שמעדיפה לעשות לבד בלי מסגרת מגובשת.",
    ];

    return (
      <section className="bg-neutral-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8">
              למי התוכנית מתאימה ולמי לא
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 text-right">
            {/* מתאים */}
            <Reveal className="space-y-4">
              <div className="text-2xl font-semibold text-brand mb-4">
                ✔️ מי זה מתאים לו
              </div>
              <ul className="space-y-2 text-lg text-slate-700">
                {suitable.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-brand font-bold">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* לא מתאים */}
            <Reveal className="space-y-4">
              <div className="text-2xl font-semibold text-rose-600 mb-4">
                ❌ מי זה *לא* מתאים לו
              </div>
              <ul className="space-y-2 text-lg text-slate-700">
                {notSuitable.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-rose-600 font-bold">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  function AboutSectionEditorial() {
    return (
      <section id="about" className="bg-slate-100 p-10 lg:p-32">
        <div className="mx-auto max-w-6xl lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* IMAGE */}
            <Reveal delay={0.05} className="lg:col-span-6 lg:pr-10">
              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl" />
                  <img
                    src="/me2.png"
                    className="relative object-cover lg:h-[420px]"
                  />
                </div>
              </div>
            </Reveal>
            {/* TEXT */}
            <Reveal className="lg:col-span-6 lg:pl-32">
              <h2 className="text-4xl font-extrabold text-brand leading-tight text-center lg:text-right">
                איך נוצר סלון היזמיות
              </h2>

              <div className="lg:mt-3 space-y-4 text-md text-slate-600 leading-relaxed text-center lg:text-right">
                <p className="text-lg font-semibold leading-relaxed text-slate-900 mt-3 lg:mt-8">
                  נעים להכיר, אני מורן הורוביץ
                </p>
                <p>
                  מתכנתת, יזמת, ובשנים האחרונות מלווה נשים חכמות ומוכשרות להפוך
                  ידע, ניסיון ורעיונות
                  <div className="font-semibold text-slate-900">
                    {" "}
                    לתוצרים שמכניסים כסף.
                  </div>
                </p>

                <p>
                  הקמתי את <span className="font-semibold">HERSALON</span> מתוך
                  הבנה פשוטה, נשים לא נתקעות בגלל חוסר יכולת
                  <span className="font-semibold text-slate-900">
                    {" "}
                    הן נתקעות בגלל חוסר במסגרת נכונה.
                  </span>
                </p>
              </div>

              <div className="mt-10 text-slate-900 font-medium text-lg border-r-2 border-brand pr-5">
                הסלון הוא המקום שבו מפסיקים להתלבט ומתחילים לסיים.
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  const mentors = [
    "פיצוח אישי לכל אחת בשיטת ׳עסק ללא מתחרים׳ של צביקה!",
    "סדנה מעשית להשקה נכונה של המוצר שלך!",
    "פגישה 1 על 1 עם יהודית להתגברות על חסמים מנטליים!!",
    "איב תעשה לנו סושיאל שמח ותוציא כל אחת עם חומרים מוכנים לפרסום!",
    "פיצוח קהל היעד והגדרת המוצר המדוייקת שלך!",
  ];

  const outcomes = useMemo(
    () => [
      "יהיה לך מוצר / שירות / הצעה מוגדרת וברורה",
      "יהיה לך עמוד מכירה או תשתית שמוכנה למכירה",
      "תדעי להסביר במשפט אחד מה את עושה ולמי",
      "תצאי עם תהליך שיווק בסיסי ולא מאיים",
      "ובעיקר – תחווי תחושת מסוגלות ושקט: אני יודעת להזיז דברים",
    ],
    []
  );
  const sprintSteps = useMemo(
    () => [
      {
        icon: "✦",
        title: "פיצוח הקונספט (The Concept)",
        desc: "הופכות רעיון אמורפי למוצר ברור עם מודל עסקי.",
      },
      {
        icon: "✦",
        title: "אריזה ועיצוב (Design)",
        desc: "עיצוב חוויה ויזואלית כדי שהמוצר יראה מליון דולר (גם אם עשית אותו בערב אחד).",
      },
      {
        icon: "✦",
        title: "טכנולוגיה בקליק (Tech)",
        desc: "דפי נחיתה, אוטומציות וכלי AI כדי לעבוד פחות ולהתקדם יותר.",
      },
      {
        icon: "✦",
        title: "השקה ומכירה (Launch)",
        desc: "יוצאים לאור. לא כשיהיה מושלם, אלא עכשיו.",
      },
    ],
    []
  );

  const yes = [
    "יש לך רעיון (או כמה) שיושבים במגירה ואת מרגישה שהגיע הזמן להזיז",
    "את אישה עסוקה (עבודה, חיים, עומס) ומחפשת מסגרת שגורמת לדברים לקרות",
    "חשוב לך לייצר תוצאה מוחשית בעבודה מהירה",
    "את פתוחה לחשיבה יצירתית, שימוש ב-AI וקיצורי דרך חכמים",
    "את אוהבת לעבוד בקבוצה קטנה, אינטימית, בלי רעש ובלי אגו",
    "את מחפשת חוויה שהיא גם עשייה, גם חיבור וגם פאן",
    "את מסוגלת לשים בצד את שיטות העבודה שלמדת עד עכשיו ולבוא בראש פתוח",
  ];

  const no = [
    "את מחפשת ידע תיאורטי או הרצאות ",
    "את לא פנויה להתחייב לתהליך ולזמן עבודה אמיתי",
    "מחוייבות להגעה לרמת גן לא מתאימה לך",
    "את מחפשת מסגרת בקבוצה גדולה, כללית, בלי יחס אישי",
    "את עוד לא מרגישה בשלה להזיז דברים לשלב הבא",
    "את מחפשת סביבת עבודה משרדית רגילה",
    "את עובדת יותר טוב בזום / אונליין ולא פיזית",
  ];

  // ✅ Add this component somewhere above InnerCirclePage (same file)
  // (uses framer-motion already imported)
  function FAQSection() {
    const faqs = [
      {
        q: "למה יש סינון לתכנית?",
        a: `כי זו קבוצת עבודה, חשובה  התאמה של חברות הקבוצה זו לזו וגם התאמה של כל אחת לצורת העבודה. כדי שהפורמט יעבוד אנחנו שומרות על קבוצה קטנה שמגיעה פיזית, באה לעבוד בקצב גבוה, ומסוגלת להחזיק תהליך. הסינון נועד לשמור על האנרגיה, הקצב והאיכות של הקבוצה - גם בשבילך.`,
      },
      {
        q: "איך מתבצעת שיחת ההתאמה?",
        a: `שיחת התאמה קצרה (כ־15 דקות), אחד על אחד. נבדוק באיזה שלב את נמצאת, איזה רעיון את רוצה לקדם, והאם המסגרת הזו באמת יכולה לשרת אותך עכשיו. אין מבחן ואין “נכון/לא נכון” - רק התאמה או חוסר התאמה.`,
      },
      {
        q: "מה בודקים בסינון?",
        a: `שלושה דברים: (1) יכולת להגיע פיזית למפגש שבועי 19:00–22:00 ברמת גן, (2) בשלות לבוא לעבוד ולא רק “לקבל השראה”, (3) שיש לך רעיון/כיוון אמיתי שאת רוצה להזיז עכשיו (גם אם הוא עדיין לא סגור).`,
      },
      {
        q: "מה אם אני עדיין לא בטוחה ברעיון?",
        a: `זה בסדר גמור. הרבה משתתפות מגיעות עם כיוון כללי או כמה רעיונות. התהליך בנוי כדי לעזור לך לבחור פרויקט פוקוס אחד, להוריד מורכבות, ולהתחיל לבנות - לא להגיע כבר “סגורה”.`,
      },
      {
        q: "זה מתאים גם למתכנתות / נשות מוצר / יוצרות?",
        a: `כן. יש מקום למתכנתות שבונות אפליקציה/מוצר, ליוצרות שמפתחות שירות/סדנה/מוצר דיגיטלי, וגם לרעיונות עסקיים בתחילת הדרך. כל אחת עובדת על המיזם שלה - המסגרת מחזיקה את כולן.`,
      },
      {
        q: "האם באמת עובדים במהלך המפגשים או שזה רק תוכן?",
        a: `עובדים. בתוכנית יש 3–4 מפגשי Execution רשמיים שבהם לפטופים פתוחים ובונים בפועל: קוד, תשתית, עמוד, אוטומציות, נכסים שיווקיים - כל אחת את שלה, באותו חלל, בתוך המפגש.`,
      },
      {
        q: "אני עובדת במשרה מלאה - זה ריאלי?",
        a: `כן. המפגשים בערב ומתאימים לנשים עם לוז מלא. אנחנו לא בונות “עוד משימות”, אלא צעדים ממוקדים שמתקדמים בכל שבוע. המטרה היא מומנטום, לא עומס.`,
      },
      {
        q: "מה אם לא אספיק להשיק עד הסוף?",
        a: `המטרה היא לא “מושלם”, אלא “קיים”. בסיום התוכנית את יוצאת עם מוצר/הצעה מוגדרת + תשתית שמוכנה למכירה/פיילוט/בטא - ומשהו שמתקדם בעולם, לא רק בראש.`,
      },
      {
        q: "מה לגבי המחיר?",
        a: `זו לא סדנה חד־פעמית ולא קורס דיגיטלי. זו קבוצה קטנה מאוד, מפגשים ארוכים, עבודה אישית, ומנטורים שמגיעים לעבוד איתך בחדר אשר גובים מחיר גבוה מאוד לשעה של נוכחות שלהם. המחיר משקף עומק, נוכחות ואחריות וגם גורם לך להתחייב לתהליך במקסימום.`,
      },
      {
        q: "מה קורה אם אחרי שיחת ההתאמה נבין שזה לא בשבילי?",
        a: `אם זה לא מדויק - נגיד את זה בכנות. המטרה היא לא “למלא מקומות”, אלא לבנות קבוצה שעובדת. אם לא תהיה התאמה, אכוון אותך לאלטרנטיבה טובה יותר עבורך.`,
      },
    ];

    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
      <div className="mt-10 max-w-4xl mx-auto text-right">
        <div className="text-4xl font-extrabold mb-6">מה עוד חשוב לדעת?</div>

        <div className="space-y-3 pb-10">
          {faqs.map((item, i) => {
            const isOpen = openIdx === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;

            return (
              <div
                key={item.q}
                className="rounded-xl2 border border-slate-100 bg-white shadow-soft overflow-hidden"
              >
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-right"
                >
                  <div className="font-semibold text-slate-900">{item.q}</div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 h-8 w-8 rounded-xl2 bg-brand/10 text-brand flex items-center justify-center"
                  >
                    ▾
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="px-6"
                    >
                      <div className="pb-6 text-slate-600 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="my-16 flex justify-center">
          <GlowCapture className="inline-block rounded-[999px]" glowSize={300}>
            <button
              onClick={() => setOpen(true)}
              className="h-14 rounded-[999px] bg-brand px-10 text-white font-semibold shadow-btn hover:opacity-95 transition"
            >
              לבקשת שיחת התאמה
            </button>
          </GlowCapture>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="h-screen bg-white text-slate-900 overflow-y-auto scroll-smooth"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex gap-2 lg:gap-8">
            <GlowCapture className="rounded-xl2" glowSize={240}>
              <button
                onClick={() => setOpen(true)}
                className="h-10 rounded-xl2 bg-brand px-5 text-sm font-semibold text-white shadow-btn transition hidden lg:block hover:opacity-95"
              >
                הצטרפי לתכנית ההאצה של
                <span className="font-black"> HERSALON</span>
              </button>
              <button
                onClick={() => setOpen(true)}
                className="h-10 rounded-xl2 bg-brand px-5 text-sm font-semibold text-white shadow-btn transition lg:hidden"
              >
                הצטרפי עכשיו
              </button>
            </GlowCapture>

            <div className="text-xl font-bold flex gap-1 items-center justify-center flex-row-reverse">
              <div className="text-sm text-brand/70 hover:text-brand">
                <a href="#about" className="cursor-pointer">
                  על הסלון
                </a>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold flex gap-1 items-center justify-center flex-row-reverse">
            <div className="font-black text-brand">HERSALON</div>
            {/* <div className="font-extralight mt-[-4px]">|</div>
            <div className="text-brand font-black">Inner Circle</div> */}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-10 md:pt-28 pb-24 text-center">
          <Reveal>
            <HeroTextWithDepthShadow
              text="HERSALON"
              className="text-5xl md:text-7xl font-black text-brand"
              shadowColorClass="text-brand"
            />
            <div className="">
              <HeroTextWithDepthShadow
                text="מציגה"
                className="relative text-3xl text-brand font-black"
                shadowColorClass="text-brand"
                scrollRange={620}
              />
            </div>
            <div className="mt-2 text-xl md:text-2xl font-extralight text-black">
              8 שבועות · ספרינט אחד · מוצר באוויר
            </div>
            <div className="mt-4 lg:mt-8 mx-auto bg-brand/10 text-brand p-4 px-6 rounded-md w-fit text-lg lg:text-xl font-bold">
              תכנית האצה לנשים עסוקות שרוצות להפוך רעיון להכנסה אמיתית וגם להנות
              מהדרך
            </div>{" "}
            <div className="mt-4 lg:mt-10 max-w-3xl mx-auto space-y-6 text-slate-600 leading-relaxed text-center text-md lg:text-lg">
              הפכי את הרעיון במגירה למקור הכנסה נוסף עם השיטה שמשלבת כלים
              <b className="px-1 rounded-md text-brand">
                מעולמות ההייטק והnlp{" "}
              </b>
              ומביאה אותך לקו הסיום{" "}
              <b className="bg-brand/10 px-1 rounded-md text-brand">
                גם אם את עובדת במשרה מלאה
              </b>
              <button
                onClick={() => setOpen(true)}
                className="h-10 rounded-xl2 bg-brand px-5 text-sm font-semibold text-white shadow-btn transition lg:hidden"
              >
                לשיחת התאמה ללא עלות לחצי כאן
              </button>
            </div>
            <Reveal>
              <div className="rounded-xl2 bg-white shadow-soft border border-slate-100 px-10 pb-10 max-w-3xl text-center mx-auto mt-8">
                <div className="mt-6 lg:mt-10 max-w-3xl mx-auto space-y-6 text-slate-600 leading-relaxed text-center text-sm lg:text-lg">
                  <p>
                    הבעיה שלך היא לא שחסרים לך רעיונות אלא
                    <b className="px-1 rounded-md text-brand">
                      שיש לך יותר מדי מהם{" "}
                    </b>{" "}
                    <br />
                    את חכמה, מוכשרת, מתקתקת קריירה ובית <br />
                    על הנייר הכל מצוין
                    <br />
                    אבל בראש? יש לך{" "}
                    <b className="bg-brand/10 px-1 rounded-md text-brand">
                      מגירת חלומות
                    </b>{" "}
                    שרק הולכת ומתמלאת
                  </p>
                  <p className="text-[16px] bg-brand/10 rounded-md px-10 w-full py-3 text-brand">
                    יש לך רעיון ל
                    <b>מיזם דיגיטלי, סדנה שרצית להעביר, מוצר שחשבת לייצר... </b>
                    <br />
                    את יודעת שיש בזה פוטנציאל לכסף ולסיפוק, אבל איכשהו, בין
                    העבודה לחיים,
                    <br /> את לא מגיעה לזה.
                    <br />
                    <b>את מתחילה בשיא האנרגיה </b>ונתקעת ברגע שזה נהיה מסובך,
                    טכני או בודד.
                  </p>
                  <p className="text-[16px] font-extralight ">
                    וזה מייצר תסכול שקט. תחושה של החמצה. את רואה נשים אחרות
                    (אולי אפילו פחות מוכשרות ממך) משיקות דברים, ואת שואלת את
                    עצמך{" "}
                    <b className="bg-brand/10 px-1 rounded-md text-brand">
                      למה אני עדיין במקום?
                    </b>
                  </p>
                  <p className="text-slate-900">
                    את לא צריכה עוד קורס תיאורטי. את לא צריכה "העצמה". את צריכה
                    מישהי שתנעל איתך את הדלת, תפתח איתך לפטופ ותגיד:{" "}
                    <span className="text-brand font-semibold">
                      "אנחנו לא יוצאות מפה עד שזה עובד"
                    </span>
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="mt-14 flex justify-center">
              <PrimaryCTA onClick={() => setOpen(true)} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-[#252122] border-y text-slate-100 relative lg:pr-32 lg:pl-[550px] px-4">
        <div className="mx-auto pt-16 pb-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start text-center lg:text-right">
            {/* VIDEO */}
            <div
              className="
        w-full aspect-video 
        lg:absolute lg:top-0 lg:left-0 
        lg:w-[410px] lg:h-full
        bg-black/5
      "
            >
              <video
                className="w-full h-[600px] lg:h-full object-cover object-center"
                controls
                src="https://res.cloudinary.com/dordmerc0/video/upload/v1769514814/riverside_copy_of_avira___jan_20_2026_001_moran_horovitz_s_st_5_baln1f.mp4"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            </div>
            {/* TEXT + IMAGES */}
            <div className="w-full text-center">
              <Reveal>
                <div className="text-4xl sm:text-5xl text-white font-extrabold">
                  צרי לעצמך קיצור דרך מטאורי למטרה!
                </div>
                <div className="mt-6 text-slate-100 text-sm lg:text-md">
                  בעזרת מנטורים מהשורה הראשונה שכבר הגשימו יעדים משוגעים ובאים
                  לעבוד איתך בסלון! לא על במה! <br />
                  חוויה שלא יצא לך לחוות באף הזדמנות אחרת בחיים.
                </div>
              </Reveal>

              <div className="relative mt-10 inline-flex flex-wrap justify-center gap-2 w-full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <GlowCapture
                      className="border border-r-2 border-t-2 border-white rounded-2xl shadow-soft w-[260px] max-w-full h-[270px]"
                      glowColor="rgba(91,79,228,0.45)"
                      glowSize={260}
                    >
                      <img
                        src={`mentors/m${i}.png`}
                        alt=""
                        className="w-full h-[220px] object-cover rounded-2xl border-4 border-[#252122] object-top"
                      />
                      <div className="px-8 py-1.5 text-[11px] font-black">
                        {mentors[i - 1]}
                      </div>
                    </GlowCapture>
                  </Reveal>
                ))}
              </div>

              <h6 className="text-white/60 text-[11px] p-2 w-full text-center">
                *רשימת המנטורים עשויה להשתנות
              </h6>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal>
            <div className="text-4xl sm:text-5xl font-extrabold">
              מה התכנית כוללת?
            </div>
            <div className="mt-4 text-slate-500">
              בפועל את מקבלת מעטפת מלאה לעשייה
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-center">
            {includeCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <GlowCapture
                  className="rounded-xl2 bg-white border border-slate-100 shadow-soft p-6 lg:p-8 h-44"
                  glowColor="rgba(91,79,228,0.45)"
                  glowSize={260}
                >
                  <div className="flex gap-2 items-center">
                    <div className="h-8 w-8 rounded-xl2 bg-brand/10 flex items-center justify-center text-brand text-xl">
                      {c.icon}
                    </div>
                    <div className="text-md lg:text-lg text-brand flex-nowrap font-bold">
                      {c.title}
                    </div>
                  </div>
                  <div className="lg:mt-3 text-slate-500 leading-relaxed text-right pr-10 pl-4 text-sm lg:text-base">
                    {c.desc}
                  </div>
                </GlowCapture>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* <FitSection /> */}

      <section className="bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-4">
              למי זה מתאים?
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-6">
              הסלון הוא לא עוד תכנית כללית. הוא מיועד לנשים מאוד מסוימות וזו
              הסיבה שהוא עובד
            </p>
          </Reveal>

          <div className="flex flex-col lg:flex-row justify-center gap-6">
            {/* מתאים */}
            <Reveal>
              <div className="h-full rounded-3xl bg-green-800/10 p-10 w-full lg:w-[540px] pl-4 border-2 border-green-800">
                <h3 className="text-2xl font-bold text-green-800">
                  התכנית מתאימה לך אם
                </h3>
                <div className="mt-6 space-y-5">
                  {yes.map((t, i) => (
                    <motion.div
                      key={t}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                        delay: i * 0.06,
                      }}
                    >
                      <div className="min-h-6 min-w-6 w-6 h-6 rounded-full bg-green-800/30 flex items-center justify-center text-green-800/90 font-bold">
                        ✓
                      </div>
                      <div className="text-[12px] text-green-800/90">{t}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
            {/* לא מתאים */}
            <Reveal delay={0.1}>
              <div className="h-full rounded-3xl bg-red-800/5 w-full lg:w-[540px] p-10 pl-4">
                <h3 className="text-2xl font-bold text-red-900">
                  {" "}
                  התכנית פחות מתאימה אם
                </h3>
                <div className="mt-6 space-y-5">
                  {no.map((t, i) => (
                    <motion.div
                      key={t}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: 18 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                        delay: i * 0.06,
                      }}
                    >
                      <div className="h-6 w-6 rounded-full bg-red-800/10 flex items-center justify-center text-red-800/90 font-bold">
                        ✘
                      </div>
                      <div className="text-[12px] text-red-900/60">{t}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* <Reveal delay={0.2}>
            <p className="text-center text-lg font-semibold p-6 rounded-md mt-12 w-fit mx-auto">
              אם קראת את הרשימה והרגשת שזה בדיוק את אז כנראה שהגעת למקום הנכון
            </p>
          </Reveal> */}
        </div>
      </section>

      {/* <section className="bg-[#0b1023] text-white relative shadow-xl">
        <div className="flex">
          <Reveal>
            <div className="overflow-hidden shadow-soft p-8">
              <img
                src="me.png"
                alt=""
                className="w-[700px] h-full object-contain"
              />
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="py-8 px-20">
              <h2 className="mt-8 font-black w-full text-3xl">נעים להכיר</h2>
              <div className="mt-8 font-extralight w-full text-2xl pl-20">
                אני מורן הורוביץ. <br />
                מתכנתת, יזמת, ובשנים האחרונות מלווה נשים חכמות ומוכשרות להפוך
                ידע, ניסיון ורעיונות לתוצרים שמכניסים כסף. <br />
                הקמתי את HerSalon מתוך הבנה פשוטה: נשים לא נתקעות מחוסר יכולת הן
                נתקעות מחוסר מסגרת נכונה. הסלון הוא המקום שבו מפסיקים “להתלבט”
                ומתחילים לסיים.
              </div>
            </div>
          </Reveal>
        </div>
      </section> */}

      {/* SPRINTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal>
            <div className="text-4xl sm:text-5xl font-extrabold">
              מיקוד לייזר + עבודה בספרינטים
            </div>
            <div className="mt-4 text-slate-500">
              4 שלבים שמזיזים אותך מהר מ<b>רעיון</b> ל<b>מוצר שעובד</b>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-right">
            {sprintSteps.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <GlowCapture
                  className="rounded-xl2 bg-white border border-slate-100 shadow-soft p-6 lg:p-8 h-44"
                  glowColor="rgba(91,79,228,0.35)"
                  glowSize={240}
                >
                  <div className="flex gap-2 items-center">
                    <div className="h-8 w-8 rounded-xl2 bg-brand/10 flex items-center justify-center text-brand text-xl">
                      {c.icon}
                    </div>
                    <div className="text-md lg:text-lg text-brand flex-nowrap font-bold">
                      {c.title}
                    </div>
                  </div>
                  <div className="lg:mt-3 text-slate-500 leading-relaxed text-right pr-10 pl-4 text-sm lg:text-base">
                    {c.desc}
                  </div>
                </GlowCapture>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-slate-600 max-w-4xl mx-auto leading-relaxed text-right">
            אנחנו נפגשות כדי לעבוד, לא רק כדי להנות ולקשקש. את מגיעה עם רעיון
            (גם אם הוא עדיין מבולגן), ויוצאת עם תוצר שמתקדם כל שבוע.
          </div>
        </div>
      </section>

      {/* DARK OUTCOMES */}
      <section className="bg-[#0b1023] text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Reveal>
              <div className="overflow-hidden shadow-soft">
                <img
                  src="salon.png"
                  alt=""
                  className="w-full h-[580px] object-cover mt-3 rounded-md"
                />
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="text-4xl sm:text-5xl font-extrabold leading-tight">
                מה את מקבלת בסוף התהליך?
              </div>
              <div className="mt-4 text-white">
                בעוד 8 שבועות מהיום, את לא תהיי עם עוד מחברת מלאה סיכומים{" "}
                <div className="font-black">את תצאי עם נכס ביד:</div>
              </div>

              <div className="mt-10 space-y-5">
                {outcomes.map((t, i) => (
                  <motion.div
                    key={t}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.06,
                    }}
                  >
                    <div className="h-9 w-9 !min-h-9 !min-w-9 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold">
                      ✓
                    </div>
                    <div className="text-white pt-1.5">{t}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center rounded-md bg-brand/20 p-6 text-white">
                לא כולן יוצאות באותו שלב אבל אף אחת לא נשארת תקועה
              </div>
              <div className="mt-8 text-brand font-black text-center w-full text-3xl">
                <div className="flex justify-between lg:px-10 pb-4 text-brand/60 text-lg lg:text-3xl">
                  <div>לא "יום אחד"</div>
                  <div> לא "כשיהיה זמן"</div>
                </div>
                <div className="text-brand/60 text-5xl">עכשיו</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <Reveal>
            <div className="rounded-xl2 bg-white shadow-soft border border-slate-100 p-10 md:p-14 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold">
                האם אני מוכנה כבר להפוך <br /> את הרעיון שלי למוצר קיים?
              </div>

              {/* <div className="text-4xl sm:text-5xl font-extrabold">
                כמה יעלה לי להפוך את הרעיון שלי
                <br /> למוצר קיים?
              </div> */}

              {/* <div className="mt-10 px-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="text-slate-400">הרשמה מוקדמת</div>
                  <div className="mt-2 text-5xl font-extrabold text-brand">
                    ₪7,000
                  </div>
                </div>

                <div className="md:border-r md:border-slate-100">
                  <div className="text-slate-400">הרשמה מאוחרת</div>
                  <div className="mt-2 text-5xl font-extrabold">₪8,888</div>
                </div>
              </div> */}

              <div className="mt-6 text-slate-600 max-w-3xl mx-auto leading-relaxed">
                <br /> הצטרפי אלינו לקבוצה מגובשת וסגורה (עד{" "}
                <span className="font-semibold">8</span> משתתפות) של נשים שנבחרו
                בקפידה
              </div>

              <div className="w-fit mx-auto">
                <div className="mt-10 mx-auto bg-brand/5 rounded-md p-6 text-brand font-semibold w-fit flex items-center justify-center gap-3">
                  <span className="text-brand"></span>
                  ההרשמה מותנית בשיחת התאמה - אני מחפשת נשים שבאות לעבוד, לא רק
                  לחלום.
                </div>

                <div className="mt-10 flex justify-center w-full">
                  <GlowCapture
                    className="inline-block rounded-xl2 w-full"
                    glowSize={320}
                  >
                    <button
                      onClick={() => setOpen(true)}
                      className="h-14 rounded-full bg-brand px-4 w-full text-white font-semibold shadow-btn hover:opacity-95 transition"
                    >
                      לבקשת שיחת התאמה
                    </button>
                  </GlowCapture>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6">
          <FAQSection />
        </div>
      </section>

      <AboutSectionEditorial />

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500">
          © HERSALON {new Date().getFullYear()} · כל הזכויות שמורות.
        </div>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
