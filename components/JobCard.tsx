import { motion } from "framer-motion";
import type { Job } from "@/data/jobs";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

export interface JobCardProps {
  job: Job;
  index: number;
  prefersReducedMotion: boolean;
}

export function JobCard({ job, index, prefersReducedMotion }: JobCardProps) {
  const postedRelative = formatDistanceToNow(new Date(job.postedOn), {
    addSuffix: true,
    locale: nb
  });

  const card = (
    <article className="glass-panel gradient-border relative flex flex-col gap-4 overflow-hidden p-6 transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-2xl">
      <div className="flex items-start gap-4">
        {job.companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={job.companyLogo}
            alt={`${job.organization} logo`}
            className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="h-14 w-14 flex-shrink-0 rounded-2xl bg-fjord-500/40" />
        )}
        <div>
          <p className="text-xs uppercase tracking-wide text-fjord-200">
            {job.organization}
          </p>
          <h3 className="text-xl font-semibold text-white">{job.title}</h3>
          <p className="text-sm text-slate-300">
            {job.city}, {job.region} • {job.type} • {job.shift} shift
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-200">{job.description}</p>

      <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
        <div>
          <h4 className="text-xs uppercase tracking-wide text-slate-400">Salary</h4>
          <p className="font-medium text-fjord-100">{job.salaryRange}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide text-slate-400">
            Language
          </h4>
          <p className="font-medium text-slate-100">{job.language}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <h4 className="text-xs uppercase tracking-wide text-slate-400">
            Key responsibilities
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-200">
            {job.responsibilities.slice(0, 3).map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wide text-slate-400">
            Requirements
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-slate-200">
            {job.requirements.slice(0, 3).map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-fjord-400/50 bg-fjord-500/10 px-3 py-1 text-xs text-fjord-100"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-fjord-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fjord-400"
        >
          Apply now
        </a>
      </div>

      <span className="text-xs text-slate-500">Posted {postedRelative}</span>
    </article>
  );

  if (prefersReducedMotion) {
    return card;
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      {card}
    </motion.div>
  );
}
