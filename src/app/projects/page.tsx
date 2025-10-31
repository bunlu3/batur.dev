// src/app/projects/page.tsx
export const dynamic = "force-static";

export default function ProjectsPage() {
    return (
        <section className="relative z-10 mx-auto mt-24 max-w-4xl px-6">
            <div className="
        rounded-3xl border border-white/10 bg-slate-900/40
        shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-md
        px-6 py-8 sm:px-10 sm:py-12
        animate-[aboutIn_520ms_cubic-bezier(.2,.8,.25,1)_forwards]
      ">
                <p className="m-0 text-center text-[22px] sm:text-[26px] font-semibold
          bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                    Projects
                </p>
                <p className="mt-3 text-center text-slate-300/95 text-[14.5px] leading-7">
                    Coming soon.
                </p>
            </div>
            <style>{`
        @keyframes aboutIn {
          from { opacity: 0; transform: translateY(16px) scale(.995); filter: blur(2px); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    filter: none; }
        }
      `}</style>
        </section>
    );
}
