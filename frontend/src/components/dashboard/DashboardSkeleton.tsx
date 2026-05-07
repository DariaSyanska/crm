export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-48 rounded-xl bg-slate-200 dark:bg-slate-800" />

        <div className="mt-3 h-4 w-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="
              rounded-2xl border border-slate-200
              bg-white p-6 shadow-sm

              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div className="h-4 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />

            <div className="mt-4 h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 h-3 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div
          className="
            rounded-2xl border border-slate-200
            bg-white p-6 shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div className="h-5 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-6 h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>

        <div
          className="
            rounded-2xl border border-slate-200
            bg-white p-6 shadow-sm

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div className="h-5 w-36 rounded-xl bg-slate-200 dark:bg-slate-800" />

          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800" />

                  <div className="h-3 w-1/2 rounded-xl bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
