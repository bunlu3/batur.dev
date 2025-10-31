export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <div className="mx-auto max-w-6xl px-6">
                © {new Date().getFullYear()} Baturalp (Batur) Unlu — Built with Next.js & Tailwind
            </div>
        </footer>
    );
}
