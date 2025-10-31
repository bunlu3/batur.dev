export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
            {subtitle && <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
        </div>
    );
}
