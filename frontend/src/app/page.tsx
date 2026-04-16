import Link from "next/link";

const features = [
  {
    title: "Client Management",
    description: "Store customer profiles, ownership, contact details, and activity history in one place.",
  },
  {
    title: "Sales Pipeline",
    description: "Track deals from lead to won, manage stages, and keep your revenue pipeline visible.",
  },
  {
    title: "Task Coordination",
    description: "Assign follow-ups, monitor deadlines, and keep the team focused on next actions.",
  },
];

const stats = [
  { label: "CRM Modules", value: "5+" },
  { label: "Team Roles", value: "Admin / Manager" },
  { label: "Core Stack", value: "Next.js + FastAPI" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div>
              <div className="text-2xl font-bold tracking-tight">CRM</div>
              <div className="text-sm text-slate-300">Sales workspace for teams</div>
            </div>

            <nav className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Create account
              </Link>
            </nav>
          </header>

          <div className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                Modern CRM for small teams
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Manage clients, deals, tasks, and notes in one clean workspace.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                A lightweight fullstack CRM built with Next.js, FastAPI, and role-based access.
                Keep customer records organized, track pipeline stages, and move faster as a team.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-500"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="rounded-2xl border border-white/15 px-6 py-3 text-base font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  >
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-slate-900 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Dashboard</p>
                      <h2 className="text-xl font-semibold text-white">Sales overview</h2>
                    </div>
                    <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                      Live workspace
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">Clients</p>
                      <p className="mt-2 text-2xl font-bold text-white">24</p>
                    </div>
                    <div className="rounded-2xl bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">Open Deals</p>
                      <p className="mt-2 text-2xl font-bold text-white">$18.4k</p>
                    </div>
                    <div className="rounded-2xl bg-slate-800 p-4">
                      <p className="text-xs text-slate-400">Tasks</p>
                      <p className="mt-2 text-2xl font-bold text-white">9</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Ivan Petrenko</p>
                          <p className="text-sm text-slate-400">Test Company</p>
                        </div>
                        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                          lead
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Website Development</p>
                          <p className="text-sm text-slate-400">Daria Sianska · $2,000</p>
                        </div>
                        <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300">
                          negotiation
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Call the client</p>
                          <p className="text-sm text-slate-400">Due today · Manager One</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                          open
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="pb-20">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Core features
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Everything needed for a compact CRM workflow
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
