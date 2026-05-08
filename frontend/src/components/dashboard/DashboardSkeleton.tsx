export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-4 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-9 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-3 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="h-5 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 h-[320px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-5 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-8 h-8 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 h-7 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="h-5 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-56 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 h-[320px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
          <div className="h-4 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-6 w-44 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-4 rounded-2xl p-2">
                <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-slate-800" />

                <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="h-4 w-1/2 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="mt-3 h-3 w-2/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
