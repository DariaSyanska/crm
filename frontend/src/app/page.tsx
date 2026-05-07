import Link from "next/link";

const features = [
  {
    title: "Client Management",
    description:
      "Store customer profiles, ownership, contact details, and activity history in one place.",
  },
  {
    title: "Sales Pipeline",
    description:
      "Track deals from lead to won, manage stages, and keep your revenue pipeline visible.",
  },
  {
    title: "Task Coordination",
    description:
      "Assign follow-ups, monitor deadlines, and keep the team focused on next actions.",
  },
];

const stats = [
  { label: "CRM Modules", value: "5+" },
  { label: "Team Roles", value: "Admin / Manager" },
  { label: "Core Stack", value: "Next.js + FastAPI" },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Gradient Background */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-[120px]" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div>
              <div className="text-2xl font-bold tracking-tight">CRM</div>
              <div className="text-sm text-slate-300">
                Sales workspace for teams
              </div>
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

          {/* Hero */}
          <div className="grid gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            {/* Left */}
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                Modern CRM for small teams
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                Manage clients, deals, tasks, and notes in one clean workspace.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                A lightweight fullstack CRM built with Next.js, FastAPI, and
                modern SaaS architecture. Keep customer records organized, track
                pipeline stages, and collaborate faster as a team.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:scale-[1.03] hover:bg-blue-500"
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

              {/* Stats */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                  >
                    <p className="text-sm text-slate-400">{item.label}</p>

                    <p className="mt-2 text-2xl font-bold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Screenshot */}
            <div className="flex items-center">
              <div className="relative w-full">
                <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur">
                  <img
                    src="/screenshots/dashboard-dark-1.png"
                    alt="CRM Dashboard"
                    className="rounded-[1.5rem] border border-slate-800 shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <section className="pb-24">
            <div className="mb-10">
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
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/10"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="pb-24">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
              <h2 className="text-4xl font-bold text-white">
                Ready to explore the CRM?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-300">
                Open the live demo and test dashboard analytics, drag & drop
                deals, client management, tasks, and notes system.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/register"
                  className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  Get Started
                </Link>

                <a
                  href="https://github.com/DariaSyanska/crm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  View Code
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
