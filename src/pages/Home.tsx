import { Link } from "react-router-dom";
import { GlowCapture } from "../GlowCapture";
import { HeroTextWithDepthShadow } from "../HeroTextWithDepthShadow";

type TestimonialItem =
  | {
      kind: "video";
      name: string;
      role?: string;
      quote?: string;
      previewSrc: string; // local path in /public or full URL
      fullVideoUrl: string; // opens in new tab
    }
  | {
      kind: "image";
      name: string;
      role?: string;
      quote?: string;
      imageSrc: string; // local path in /public or full URL
      alt?: string;
    };

function TestimonialsGallery() {
  /**
   * איך להשתמש:
   * 1) שימי קבצי תמונות/וידאו בתוך: /public/testimonials/
   * 2) החליפי את ה-src/urls במערך למטה.
   *
   * אפשר לשים וידאו מקומי (mp4) ב-previewSrc, או URL חיצוני (Vimeo/YouTube לא יעבוד ישירות כ-<video>).
   * לכפתור "צפייה בסרטון המלא" שימי לינק ל-YouTube/Vimeo/Drive וכו' והוא ייפתח בטאב חדש.
   */
  const items: TestimonialItem[] = [
    {
      kind: "video",
      name: "לירז",
      role: "בעלת עסק",
      quote: "חד משמעית שווה את זה",
      previewSrc: "https://res.cloudinary.com/dordmerc0/video/upload/v1768743558/t1_mwaduc.mov",
      fullVideoUrl: "https://example.com/full-video-1",
    },
    {
      kind: "video",
      name: "אופק",
      role: "שכירה בהייטק",
      quote: "נתת לחלום שלי חיים",
      previewSrc: "https://res.cloudinary.com/dordmerc0/video/upload/v1768743526/t2_ti2tc4.mp4",
      fullVideoUrl: "https://example.com/full-video-2",
    },
    {
      kind: "video",
      name: "שירי",
      role: "שכירה בהייטק",
      quote: "הספרינט הכריח אותי לסיים. זה היה בדיוק מה שהייתי צריכה.",
      previewSrc: "/testimonials/testimonial-2.mp4",
      fullVideoUrl: "https://example.com/full-video-2",
    },
    {
      kind: "image",
      name: "",
      role: "צילום מסך",
      quote: "אם לא את הייתי מוותרת",
      imageSrc: "/testimonials/t1.jpg",
      alt: "צילום מסך המלצה בוואטסאפ",
    },
    {
      kind: "image",
      name: "",
      role: "צילום מסך",
      quote: "לייצר סביבה טובה",
      imageSrc: "/testimonials/t2.png",
      alt: "צילום מסך המלצה בוואטסאפ",
    },
    {
      kind: "image",
      name: "",
      role: "צילום מסך",
      quote: "מלא דברים שהייתי תקועה איתם התחילו לזרום",
      imageSrc: "/testimonials/t3.png",
      alt: "צילום מסך המלצה בוואטסאפ",
    },
  ];

  return (
    <div className="shadow-soft overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {items.map((it, idx) => (
          <div
            key={idx}
            className="border border-slate-100 bg-slate-50 overflow-hidden w-full"
          >
            <div className="aspect-video bg-black/5 h-[430px] w-full">
              {it.kind === "video" ? (
                <video
                  className="w-full h-full object-cover object-center"
                  controls
                  src={it.previewSrc}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={it.imageSrc}
                  alt={it.alt ?? it.name}
                  loading="lazy"
                />
              )}
            </div>

            <div className="relative pt-4 px-6 text-right h-24">
              {it.quote ? (
                <div className="font-bold text-ink text-sm">“{it.quote}”</div>
              ) : null}
              <div className="flex items-baseline justify-between gap-3 px-1">
                <div className="text-sm text-slate-400 font-extralight leading-relaxed">
                  {it.name}
                </div>
                {it.kind === "video" ? (
                  <a
                    href={it.fullVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-8 px-4 bg-brand text-white text-[11px] font-semibold shadow-btn hover:opacity-95 transition absolute bottom-0 left-0 "
                  >
                    לסרטון המלא
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-5xl px-6 pt-16 text-center">
        <HeroTextWithDepthShadow
          text="HERSALON"
          className="text-6xl sm:text-7xl font-black"
          shadowColorClass="text-brand"
        />
        <div className="">
          <HeroTextWithDepthShadow
            text="Inner Circle"
            className="text-5xl sm:text-6xl text-brand font-black"
            shadowColorClass="text-brand"
            scrollRange={620}
          />
        </div>

        <div className="mt-2 text-lg font-extralight text-brand/80">
          8 שבועות · ספרינט אחד · מוצר באוויר
        </div>

        <div className="mt-8 font-extralight">
          תכנית האצה לנשים עסוקות שרוצות להפוך רעיון להכנסה אמיתית וגם להנות
          מהדרך
        </div>

        <div className="mt-1 font-bold text-xl">
          השיטה שמאפשרת ליצור בהנאה בלי להפריע ללוז העמוס ועדיין להגיע לתוצאה
        </div>
        <div className=" text-lg font-extralight text-brand/80">
          (מבלי לעזוב את מקום העבודה או להקריב זמן יקר על מאבקים עם משימות שלא
          מתקדמות)
        </div>

        <div className="mt-10 mx-auto max-w-3xl">
          <div className="rounded-xl2 border border-slate-200 shadow-soft overflow-hidden bg-slate-50">
            <TestimonialsGallery />
          </div>
        </div>

        <div className="mt-12 mb-20 flex justify-center">
          <GlowCapture className="inline-block rounded-[999px]" glowSize={340}>
            <Link
              to="/inner-circle"
              className="h-16 px-12 rounded-[999px] bg-brand text-white font-semibold shadow-btn hover:opacity-95 transition inline-flex items-center justify-center"
            >
              רוצה לדעת מה מקבלים תכלס? לחצי כאן
            </Link>
          </GlowCapture>
        </div>
      </div>
    </div>
  );
}
