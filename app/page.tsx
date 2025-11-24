"use client";

import { useMemo, useState } from "react";
import { FiltersPanel, type FilterState } from "@/components/FiltersPanel";
import { JobCard } from "@/components/JobCard";
import { jobs } from "@/data/jobs";
import { useReducedMotion } from "framer-motion";

function computeSalaryBounds() {
  const mins = jobs.map((job) => job.salaryMonthlyNok[0]);
  const maxes = jobs.map((job) => job.salaryMonthlyNok[1]);
  return [Math.min(...mins), Math.max(...maxes)] as [number, number];
}

const salaryBounds = computeSalaryBounds();

export default function Page() {
  const prefersReducedMotion = useReducedMotion();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    city: "Any",
    type: "Any",
    shift: "Any",
    language: "Any",
    tags: [],
    salaryMin: salaryBounds[0],
    salaryMax: salaryBounds[1]
  });

  const filteredJobs = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    return jobs.filter((job) => {
      const compositeLocation = `${job.city}, ${job.region}`;
      const matchesSearch =
        searchTerm.length === 0 ||
        [job.title, job.description, job.organization, job.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);

      const matchesCity =
        filters.city === "Any" || compositeLocation === filters.city;

      const matchesType = filters.type === "Any" || job.type === filters.type;

      const matchesShift = filters.shift === "Any" || job.shift === filters.shift;

      const matchesLanguage =
        filters.language === "Any" ||
        job.language.toLowerCase().includes(filters.language.toLowerCase());

      const matchesTags =
        filters.tags.length === 0 ||
        filters.tags.every((tag) => job.tags.includes(tag));

      const [salaryMin, salaryMax] = job.salaryMonthlyNok;
      const matchesSalary =
        salaryMax >= filters.salaryMin && salaryMin <= filters.salaryMax;

      return (
        matchesSearch &&
        matchesCity &&
        matchesType &&
        matchesShift &&
        matchesLanguage &&
        matchesTags &&
        matchesSalary
      );
    });
  }, [filters]);

  const summary = useMemo(() => {
    const cities = new Map<string, number>();
    filteredJobs.forEach((job) => {
      const key = `${job.city}, ${job.region}`;
      cities.set(key, (cities.get(key) ?? 0) + 1);
    });

    const topCities = Array.from(cities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const averageSalary =
      filteredJobs.reduce((acc, job) => acc + job.salaryMonthlyNok[1], 0) /
      (filteredJobs.length || 1);

    return {
      total: filteredJobs.length,
      topCities,
      averageSalary: Math.round(averageSalary)
    };
  }, [filteredJobs]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 md:py-20">
      <section className="glass-panel gradient-border relative overflow-hidden p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-fjord-400/50 bg-fjord-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-fjord-100">
              Norway stocker opportunities
            </span>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Find logistics and stocking roles across Norway&apos;s leading hubs
            </h1>
            <p className="text-lg text-slate-200">
              Explore curated openings for warehouse, fulfilment, and distribution
              stockers. Filter by city, shift pattern, language, and salary to match
              your goals—then head straight to the employer application page.
            </p>
          </div>
          <div className="glass-panel gradient-border max-w-sm rounded-3xl border-white/10 bg-slate-900/60 p-6 text-sm text-slate-200">
            <h2 className="text-lg font-semibold text-white">
              Quick market snapshot
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex justify-between">
                <span>Total curated roles</span>
                <span className="font-semibold text-fjord-100">
                  {summary.total.toString().padStart(2, "0")}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Average top salary</span>
                <span className="font-semibold text-fjord-100">
                  NOK {summary.averageSalary.toLocaleString("no-NO")}
                </span>
              </li>
              <li>
                <span className="block">Most active hubs</span>
                <div className="mt-1 space-y-1 text-xs text-slate-400">
                  {summary.topCities.length > 0 ? (
                    summary.topCities.map(([city, count]) => (
                      <p key={city}>
                        {city} • {count} openings
                      </p>
                    ))
                  ) : (
                    <p>No hubs with current filters.</p>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pointer-events-none absolute -top-32 right-12 h-64 w-64 rounded-full bg-fjord-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-72 w-72 rounded-full bg-fjord-300/30 blur-3xl" />
      </section>

      <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <FiltersPanel
          jobs={jobs}
          filters={filters}
          onFiltersChange={setFilters}
          salaryBounds={salaryBounds}
        />

        <div className="space-y-6">
          <header className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-white">
              {filteredJobs.length} open role
              {filteredJobs.length === 1 ? "" : "s"}
            </h2>
            <p className="text-sm text-slate-300">
              Showing positions that match your filters. Tap into the details for
              responsibilities, requirements, and next steps.
            </p>
          </header>

          <div className="grid gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                prefersReducedMotion={Boolean(prefersReducedMotion)}
              />
            ))}
            {filteredJobs.length === 0 && (
              <div className="glass-panel gradient-border flex flex-col items-start gap-4 p-8 text-slate-200">
                <h3 className="text-xl font-semibold text-white">
                  No matches with the current filters
                </h3>
                <p className="text-sm">
                  Try expanding your salary range, removing some tags, or selecting{" "}
                  <span className="font-medium text-fjord-100">Any</span> for shift
                  or language to see more opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel gradient-border space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-white">
            Prepare for Norwegian logistics interviews
          </h2>
          <ul className="space-y-3 text-sm text-slate-200">
            <li>
              <span className="font-semibold text-fjord-100">
                Highlight safety culture:
              </span>{" "}
              Employers value documented HSE routines, forklift licenses, and food
              safety certificates. Bring proof on the day of interview.
            </li>
            <li>
              <span className="font-semibold text-fjord-100">Emphasise digital fluency:</span>{" "}
              Many warehouses rely on WMS, tablets, and automation dashboards. A short
              demo of your previous workflow can stand out.
            </li>
            <li>
              <span className="font-semibold text-fjord-100">Brush up on language basics:</span>{" "}
              Even when English is accepted, simple Norwegian phrases demonstrate
              commitment to the team.
            </li>
          </ul>
        </div>

        <div className="glass-panel gradient-border space-y-4 p-8">
          <h2 className="text-2xl font-semibold text-white">Helpful resources</h2>
          <ul className="space-y-3 text-sm text-fjord-100">
            <li>
              <a
                href="https://www.nav.no/en/home"
                className="text-sm text-fjord-100 underline hover:text-fjord-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                NAV arbeid – official Norwegian labour portal
              </a>
              <p className="text-xs text-slate-300">
                Search for logistics, lager, and distribution openings nationwide.
              </p>
            </li>
            <li>
              <a
                href="https://arbeidsplassen.nav.no/stillinger"
                className="text-sm text-fjord-100 underline hover:text-fjord-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Arbeidsplassen – job board curated by the Labour and Welfare
                Administration
              </a>
              <p className="text-xs text-slate-300">
                Filter by keyword &ldquo;lager&rdquo;, &ldquo;stocker&rdquo; or
                &ldquo;logistikk&rdquo; for more leads.
              </p>
            </li>
            <li>
              <a
                href="https://www.workindenmark.dk/find-a-job/job-search-tools/eures-portal"
                className="text-sm text-fjord-100 underline hover:text-fjord-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                EURES Norway – cross-border job support
              </a>
              <p className="text-xs text-slate-300">
                Access relocation advice, CV translation, and job fairs across the EEA.
              </p>
            </li>
            <li>
              <a
                href="https://www.yrkesnorsk.no/"
                className="text-sm text-fjord-100 underline hover:text-fjord-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yrkesnorsk – workplace Norwegian training
              </a>
              <p className="text-xs text-slate-300">
                Learn vocabulary specific to warehousing, logistics, and transport.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
