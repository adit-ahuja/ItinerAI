import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Compass, DollarSign, PartyPopper } from "lucide-react";
import { interestOptions, styleOptions, trendingDestinations } from "../data/trending";

const steps = [
  { key: "destination", label: "Destination", icon: Compass },
  { key: "dates", label: "Dates", icon: CalendarDays },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "vibe", label: "Vibe", icon: PartyPopper }
];

export function TripWizard({
  step,
  setStep,
  form,
  setForm,
  onGenerate,
  loading,
  onSurprise
}) {
  const progress = ((step + 1) / steps.length) * 100;

  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]
    }));
  };

  return (
    <div className="glass soft-panel grain relative w-full max-w-3xl rounded-[32px] p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">AI Travel Console</p>
          <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Plan a trip with conversation-first intelligence
          </h2>
        </div>
        <button
          type="button"
          onClick={onSurprise}
          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-fuchsia-300/40 hover:bg-fuchsia-400/15"
        >
          Surprise Me 🌍
        </button>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/45">
          <span>Journey Setup</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const active = index === step;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setStep(index)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                active
                  ? "border-sky-300/40 bg-white/12 shadow-glow"
                  : "border-white/8 bg-white/5 hover:bg-white/8"
              }`}
            >
              <Icon className="mb-3 h-5 w-5 text-sky-200" />
              <p className="text-sm font-medium text-white">{item.label}</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={steps[step].key}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35 }}
          className="min-h-[270px]"
        >
          {step === 0 && (
            <div className="space-y-4">
              <label className="block text-sm text-white/70">Where do you want to go?</label>
              <input
                value={form.destination}
                onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))}
                placeholder="Tokyo, Lisbon, Patagonia..."
                className="w-full rounded-3xl border border-white/10 bg-white/6 px-5 py-5 text-lg text-white outline-none ring-0 placeholder:text-white/30 focus:border-sky-300/40"
              />
              <div className="flex flex-wrap gap-3">
                {trendingDestinations.map((item) => (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, destination: item.city }))}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-left hover:bg-white/10"
                  >
                    <p className="font-medium text-white">{item.city}</p>
                    <p className="text-sm text-white/45">{item.vibe}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <span className="mb-2 block text-sm text-white/60">Start date</span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                  className="w-full bg-transparent text-lg text-white outline-none"
                />
              </label>
              <label className="rounded-3xl border border-white/10 bg-white/6 p-5">
                <span className="mb-2 block text-sm text-white/60">End date</span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                  className="w-full bg-transparent text-lg text-white outline-none"
                />
              </label>
              <label className="rounded-3xl border border-white/10 bg-white/6 p-5 sm:col-span-2">
                <span className="mb-2 block text-sm text-white/60">Trip length</span>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={form.tripLength}
                  onChange={(event) => setForm((current) => ({ ...current, tripLength: Number(event.target.value) }))}
                  className="w-full accent-sky-400"
                />
                <div className="mt-3 text-lg font-medium text-white">{form.tripLength} days</div>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-white/60">Total trip budget</span>
                  <span className="text-xl font-semibold text-white">${form.budget}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="12000"
                  step="100"
                  value={form.budget}
                  onChange={(event) => setForm((current) => ({ ...current, budget: Number(event.target.value) }))}
                  className="w-full accent-fuchsia-400"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Smart saver", "Comfort-first", "Premium escape"].map((tier) => (
                  <div key={tier} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-white/65">
                    {tier}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm text-white/60">Interests</p>
                <div className="flex flex-wrap gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        form.interests.includes(interest)
                          ? "border-fuchsia-300/40 bg-fuchsia-400/16 text-white shadow-glow"
                          : "border-white/10 bg-white/6 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm text-white/60">Travel style</p>
                <div className="grid gap-3 sm:grid-cols-4">
                  {styleOptions.map((style) => (
                    <button
                      key={style.label}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, travelStyle: style.label }))}
                      className={`rounded-3xl border px-4 py-4 text-left transition ${
                        form.travelStyle === style.label
                          ? "border-sky-300/40 bg-sky-400/14"
                          : "border-white/10 bg-white/6 hover:bg-white/10"
                      }`}
                    >
                      <span className="mb-2 block text-xl">{style.emoji}</span>
                      <p className="font-medium text-white">{style.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/65 transition hover:bg-white/8"
        >
          Back
        </button>
        <div className="flex flex-wrap gap-3">
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(current + 1, steps.length - 1))}
              className="rounded-full bg-white/12 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/18"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={onGenerate}
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:scale-[1.02] disabled:opacity-50"
            >
              ✨ Plan My Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
