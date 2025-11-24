import { useMemo } from "react";
import type { Job, JobType, ShiftType } from "@/data/jobs";

export interface FilterState {
  search: string;
  city: string;
  type: JobType | "Any";
  shift: ShiftType | "Any";
  language: string;
  tags: string[];
  salaryMin: number;
  salaryMax: number;
}

export interface FiltersPanelProps {
  jobs: Job[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  salaryBounds: [number, number];
}

export function FiltersPanel({
  jobs,
  filters,
  onFiltersChange,
  salaryBounds
}: FiltersPanelProps) {
  const distinctCities = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => `${job.city}, ${job.region}`))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [jobs]
  );

  const distinctLanguages = useMemo(
    () =>
      Array.from(new Set(jobs.map((job) => job.language))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [jobs]
  );

  const distinctTags = useMemo(
    () => Array.from(new Set(jobs.flatMap((job) => job.tags))).sort(),
    [jobs]
  );

  const handleChange = <Key extends keyof FilterState>(
    key: Key,
    value: FilterState[Key]
  ) => {
    if (key === "salaryMin") {
      const nextMin = Math.min(value as number, filters.salaryMax);
      onFiltersChange({
        ...filters,
        salaryMin: nextMin
      });
      return;
    }

    if (key === "salaryMax") {
      const nextMax = Math.max(value as number, filters.salaryMin);
      onFiltersChange({
        ...filters,
        salaryMax: nextMax
      });
      return;
    }

    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleTagToggle = (tag: string) => {
    const hasTag = filters.tags.includes(tag);
    const nextTags = hasTag
      ? filters.tags.filter((current) => current !== tag)
      : [...filters.tags, tag];
    handleChange("tags", nextTags);
  };

  return (
    <aside className="glass-panel gradient-border space-y-6 p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">Filter opportunities</h2>
        <p className="text-sm text-slate-400">
          Tailor the stocker roles to match your experience and preferences.
        </p>
      </header>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-200">
          Keyword search
          <input
            type="text"
            placeholder="cold storage, forklift..."
            value={filters.search}
            onChange={(event) => handleChange("search", event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-fjord-400 focus:ring-2 focus:ring-fjord-400/40"
          />
        </label>

        <label className="block text-sm font-medium text-slate-200">
          Location
          <select
            value={filters.city}
            onChange={(event) => handleChange("city", event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-fjord-400 focus:ring-2 focus:ring-fjord-400/40"
          >
            <option value="Any">Any location</option>
            {distinctCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-200">
            Contract type
            <select
              value={filters.type}
              onChange={(event) =>
                handleChange("type", event.target.value as FilterState["type"])
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-fjord-400 focus:ring-2 focus:ring-fjord-400/40"
            >
              <option value="Any">Any</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-200">
            Preferred shift
            <select
              value={filters.shift}
              onChange={(event) =>
                handleChange("shift", event.target.value as FilterState["shift"])
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-fjord-400 focus:ring-2 focus:ring-fjord-400/40"
            >
              <option value="Any">Any</option>
              <option value="Day">Day</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
              <option value="Rotational">Rotational</option>
            </select>
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-200">
          Working language
          <select
            value={filters.language}
            onChange={(event) =>
              handleChange("language", event.target.value as FilterState["language"])
            }
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-fjord-400 focus:ring-2 focus:ring-fjord-400/40"
          >
            <option value="Any">Any</option>
            {distinctLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <div>
          <div className="flex items-center justify-between text-sm font-medium text-slate-200">
            <span>Salary range (monthly NOK)</span>
            <span className="text-xs text-slate-400">
              {filters.salaryMin.toLocaleString("no-NO")} –{" "}
              {filters.salaryMax.toLocaleString("no-NO")}
            </span>
          </div>
          <input
            type="range"
            min={salaryBounds[0]}
            max={salaryBounds[1]}
            value={filters.salaryMin}
            step={500}
            onChange={(event) => handleChange("salaryMin", Number(event.target.value))}
            className="mt-2 w-full accent-fjord-400"
          />
          <input
            type="range"
            min={salaryBounds[0]}
            max={salaryBounds[1]}
            value={filters.salaryMax}
            step={500}
            onChange={(event) => handleChange("salaryMax", Number(event.target.value))}
            className="mt-2 w-full accent-fjord-400"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-200">Skill tags</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {distinctTags.map((tag) => {
            const isActive = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  isActive
                    ? "border-fjord-400 bg-fjord-500/20 text-fjord-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-fjord-400/50 hover:text-white"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onFiltersChange({
            ...filters,
            search: "",
            city: "Any",
            type: "Any",
            shift: "Any",
            language: "Any",
            tags: [],
            salaryMin: salaryBounds[0],
            salaryMax: salaryBounds[1]
          })
        }
        className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
      >
        Reset filters
      </button>
    </aside>
  );
}
