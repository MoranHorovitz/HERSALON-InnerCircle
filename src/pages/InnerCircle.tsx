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
      const res = await fetch("http://localhost:5175/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
    <div dir="rtl" className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <GlowCapture className="inline-block rounded-xl2" glowSize={240}>
            <button
              onClick={() => setOpen(true)}
              className="h-10 rounded-xl2 bg-brand px-5 text-sm font-semibold text-white shadow-btn hover:opacity-95 transition"
            >
              הצטרפי לתכנית ההאצה של
              <span className="font-black"> HERSALON</span>
            </button>
          </GlowCapture>

          <div className="text-xl font-bold flex gap-1 items-center justify-center flex-row-reverse">
            <div className="font-black text-brand">HERSALON</div>
            {/* <div className="font-extralight mt-[-4px]">|</div>
            <div className="text-brand font-black">Inner Circle</div> */}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 text-center">
          <Reveal>
            <HeroTextWithDepthShadow
              text="HERSALON"
              className="text-6xl sm:text-7xl font-black text-brand"
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

            <div className="mt-2 text-2xl font-extralight text-black">
              8 שבועות · ספרינט אחד · מוצר באוויר
            </div>
            <div className="mt-6 text-lg sm:text-xl text-slate-600 font-bold">
              תכנית האצה לנשים עסוקות שרוצות להפוך רעיון להכנסה אמיתית וגם להנות
              מהדרך
            </div>
            <p className="mt-8 text-md font-extralight leading-relaxed max-w-4xl mx-auto">
              הפכי את הרעיון במגירה למקור הכנסה נוסף עם השיטה שמשלבת כלים
              מעולמות ההייטק והnlp ומביאה אותך לקו הסיום{" "}
              <div className="text-brand font-semibold">
                {" "}
                גם אם את עובדת במשרה מלאה
              </div>
            </p>
            <div className="mt-10 max-w-3xl mx-auto space-y-6 text-slate-600 leading-relaxed px-6 text-center text-lg">
              <p>
                הבעיה שלך היא לא שחסרים לך רעיונות אלא
                <b className="px-1">שיש לך יותר מדי מהם </b> <br />
                את חכמה, מוכשרת, “מתקתקת” קריירה ובית. <br />
                על הנייר, הכל מצוין.
                <br />
                אבל בראש? יש לך “מגירת חלומות” שרק הולכת ומתמלאת.
              </p>
              <p className="text-[16px] font-extralight ">
                יש לך רעיון למיזם דיגיטלי, סדנה שרצית להעביר, מוצר שחשבת
                לייצר... את יודעת שיש בזה פוטנציאל לכסף ולסיפוק, אבל איכשהו, בין
                העבודה לחיים, את לא מגיעה לזה. את מתחילה בשיא האנרגיה ונתקעת
                ברגע שזה נהיה מסובך, טכני או בודד.
              </p>
              <p className="text-[16px] font-extralight ">
                וזה מייצר תסכול שקט. תחושה של החמצה. את רואה נשים אחרות (אולי
                אפילו פחות מוכשרות ממך) משיקות דברים, ואת שואלת את עצמך: "למה
                אני עדיין במקום?"{" "}
              </p>
              <p className="text-slate-900">
                את לא צריכה עוד קורס תיאורטי. את לא צריכה “העצמה”. את צריכה
                מישהי שתנעל איתך את הדלת, תפתח איתך לפטופ ותגיד:{" "}
                <span className="text-brand font-semibold">
                  “אנחנו לא יוצאות מפה עד שזה עובד.”
                </span>
              </p>
            </div>
            <div className="mt-14 flex justify-center">
              <PrimaryCTA onClick={() => setOpen(true)} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-[#252122] border-y text-slate-100 relative pr-14 pl-[500px]">
        <div className="mx-auto px-2 pt-16 pb-4 text-center">
          <div className="flex gap-4">
            <div>
              {" "}
              <Reveal>
                <div className="text-4xl sm:text-5xl text-white font-extrabold">
                  צרי לעצמך קיצור דרך מטאורי למטרה!
                </div>
                <div className="mt-6 text-slate-100">
                  בעזרת מנטורים מהשורה הראשונה שכבר הגשימו יעדים משוגעים ובאים
                  לעבוד איתך בסלון! לא על במה! <br />
                  חוויה שלא יצא לך לחוות באף הזדמנות אחרת בחיים.
                </div>
              </Reveal>
              <div className="relative mt-10 inline-flex flex-wrap justify-center text-right gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <GlowCapture
                      className="border border-r-2 border-t-2 border-white rounded-2xl shadow-soft"
                      glowColor="rgba(91,79,228,0.45)"
                      glowSize={260}
                    >
                      <img
                        src={`mentors/m${i}.png`}
                        alt=""
                        className="w-full h-[200px] object-cover rounded-2xl border-4 border-[#252122]"
                      />
                    </GlowCapture>
                  </Reveal>
                ))}
              </div>{" "}
              <h6 className="text-white/60 text-[11px] p-2 w-full text-center">
                *רשימת המנטורים עשויה להשתנות
              </h6>
            </div>
            <div className="aspect-video bg-black/5 h-full w-[420px] absolute top-0 left-0">
              <video
                className="w-full h-full object-cover object-center"
                controls
                src="https://res.cloudinary.com/dordmerc0/video/upload/v1768924206/env_uinzb1.mp4"
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal>
            <div className="text-4xl sm:text-5xl font-extrabold">
              מה התכנית כוללת?
            </div>
            <div className="mt-4 text-slate-500">
              בפועל, את מקבלת מעטפת מלאה לעשייה
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-center">
            {includeCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <GlowCapture
                  className="rounded-xl2 bg-white border border-slate-100 shadow-soft p-8 h-44"
                  glowColor="rgba(91,79,228,0.45)"
                  glowSize={260}
                >
                  <div className="flex gap-2 items-center">
                    <div className="h-8 w-8 rounded-xl2 bg-brand/10 flex items-center justify-center text-brand text-xl">
                      {c.icon}
                    </div>
                    <div className="text-lg text-brand flex-nowrap font-bold">
                      {c.title}
                    </div>
                  </div>
                  <div className="mt-3 text-slate-500 leading-relaxed">
                    {c.desc}
                  </div>
                </GlowCapture>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPRINTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal>
            <div className="text-4xl sm:text-5xl font-extrabold">
              מיקוד לייזר + עבודה בספרינטים
            </div>
            <div className="mt-4 text-slate-500">
              5 שלבים שמזיזים אותך מהר מ״רעיון״ ל״מוצר שעובד״
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-right">
            {sprintSteps.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <GlowCapture
                  className="rounded-xl2 bg-white border border-slate-100 shadow-soft p-8 h-44"
                  glowColor="rgba(91,79,228,0.35)"
                  glowSize={240}
                >
                  <div className="flex gap-2 items-center">
                    <div className="h-8 w-8 rounded-xl2 bg-brand/10 flex items-center justify-center text-brand text-xl">
                      {c.icon}
                    </div>
                    <div className="text-lg text-brand flex-nowrap font-bold">
                      {c.title}
                    </div>
                  </div>
                  <div className="mt-2 text-slate-500 leading-relaxed">
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
                  className="w-full h-[580px] object-cover mt-3"
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
                    <div className="h-9 w-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold">
                      ✓
                    </div>
                    <div className="text-white/85">{t}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center rounded-xl2 bg-white/5 border border-white/10 p-6 text-white">
                לא כולן יוצאות באותו שלב אבל אף אחת לא נשארת תקועה
              </div>
              <div className="mt-8 text-brand font-black text-center w-full text-3xl">
                לא “יום אחד”, לא “כשיהיה זמן”{" "}
                <div className="text-white text-5xl">עכשיו</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <FAQSection />
      </div>

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

              <div className="mt-10 mx-auto bg-brand/5 border border-brand/10 p-6 text-brand font-semibold w-fit flex items-center justify-center gap-3">
                <span className="text-brand"></span>
                ההרשמה מותנית בשיחת התאמה - אני מחפשת נשים שבאות לעבוד, לא רק
                לחלום.
              </div>

              <div className="mt-10 flex justify-center">
                <GlowCapture
                  className="inline-block rounded-xl2"
                  glowSize={320}
                >
                  <button
                    onClick={() => setOpen(true)}
                    className="h-16 rounded-xl2 bg-brand px-12 text-white font-semibold shadow-btn hover:opacity-95 transition"
                  >
                    לבקשת שיחת התאמה
                  </button>
                </GlowCapture>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500">
          © HERSALON {new Date().getFullYear()} · כל הזכויות שמורות.
        </div>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
