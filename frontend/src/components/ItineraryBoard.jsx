import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  MapPinned,
  RefreshCw,
  Save,
  Share2,
  Undo2,
  Redo2,
  CloudRain,
  Download
} from "lucide-react";

function ActivityCard({ activity, onDragStart, onDrop }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className="rounded-[26px] border border-white/10 bg-white/6 p-4 transition hover:-translate-y-1 hover:border-sky-300/30 hover:bg-white/10"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
          <Clock3 className="h-3.5 w-3.5" />
          {activity.timeOfDay}
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">{activity.cost}</span>
      </div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-sky-100">
          {activity.startTime} - {activity.endTime}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{activity.neighborhood}</p>
      </div>
      <h4 className="text-lg font-semibold text-white">{activity.placeName}</h4>
      <p className="mt-1 text-sm font-medium text-white/70">{activity.title}</p>
      <p className="mt-2 text-sm leading-6 text-white/64">{activity.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-white/48">
        <div className="flex items-center gap-2">
          <MapPinned className="h-4 w-4" />
          <span>{activity.location}</span>
        </div>
        <span>{activity.mapHint}</span>
      </div>
      <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/30 p-3 text-xs leading-5 text-white/52">
        <p>Transit: {activity.transitNote}</p>
        <p className="mt-1">Booking: {activity.bookingNote}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {activity.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/55">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ItineraryBoard({
  itinerary,
  history,
  onRegenerateDay,
  onSave,
  onShare,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onRestoreVersion,
  onReorderActivity
}) {
  const [expandedDay, setExpandedDay] = useState(itinerary?.days?.[0]?.id || null);
  const [dragState, setDragState] = useState(null);

  const versionItems = useMemo(() => [...history].reverse().slice(0, 5), [history]);

  if (!itinerary) return null;

  return (
    <div className="space-y-6">
      <section className="glass soft-panel grain rounded-[32px] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Generated Journey</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{itinerary.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">{itinerary.overview}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="rounded-full border border-white/10 bg-white/6 p-3 text-white/80 disabled:opacity-40"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="rounded-full border border-white/10 bg-white/6 p-3 text-white/80 disabled:opacity-40"
            >
              <Redo2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save
              </span>
            </button>
            <button
              type="button"
              onClick={onShare}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              <span className="inline-flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400 px-5 py-3 text-sm font-medium text-slate-950"
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-white/55">Budget</p>
            <p className="mt-2 text-lg font-semibold text-white">{itinerary.budgetSummary}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
            <p className="text-sm text-white/55">Style</p>
            <p className="mt-2 text-lg font-semibold text-white">{itinerary.travelStyle}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 lg:col-span-2">
            <p className="text-sm text-white/55">AI suggestions</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {itinerary.aiSuggestions?.map((suggestion) => (
                <span key={suggestion} className="rounded-full bg-white/8 px-3 py-2 text-xs text-white/65">
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {itinerary.days.map((day) => (
            <motion.article
              key={day.id}
              layout
              className="glass soft-panel grain overflow-hidden rounded-[32px] border border-white/10"
            >
              <button
                type="button"
                onClick={() => setExpandedDay((current) => (current === day.id ? null : day.id))}
                className="flex w-full flex-wrap items-center justify-between gap-4 p-6 text-left"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Day {day.dayNumber}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{day.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{day.summary}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs text-white/60">
                    {day.theme}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRegenerateDay(day.dayNumber);
                    }}
                    className="rounded-full border border-white/10 bg-white/6 p-3 text-white/80 transition hover:bg-white/10"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </button>

              <AnimatePresence>
                {expandedDay === day.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/8 px-6 pb-6"
                  >
                    <div className="mb-4 mt-5 flex items-start gap-2 rounded-2xl border border-sky-300/18 bg-sky-400/10 p-4 text-sm text-sky-50/88">
                      <CloudRain className="mt-0.5 h-4 w-4 shrink-0" />
                      {day.weatherHint}
                    </div>
                    <div className="grid gap-4 xl:grid-cols-2">
                      {day.activities.map((activity, index) => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          onDragStart={() => setDragState({ dayId: day.id, index })}
                          onDrop={() => {
                            if (!dragState || dragState.dayId !== day.id || dragState.index === index) return;
                            onReorderActivity(day.id, dragState.index, index);
                            setDragState(null);
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>

        <aside className="glass soft-panel grain h-fit rounded-[32px] p-5 xl:sticky xl:top-6">
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Version history</p>
          <div className="mt-6 space-y-4">
            {versionItems.map((entry, index) => (
              <button
                key={`${entry.versionLabel}-${index}`}
                type="button"
                onClick={() => onRestoreVersion(entry)}
                className="relative block w-full rounded-[24px] border border-white/10 bg-white/6 p-4 text-left hover:bg-white/10"
              >
                <span className="absolute left-[-8px] top-6 h-3 w-3 rounded-full bg-gradient-to-r from-sky-300 to-fuchsia-300" />
                <p className="text-sm font-medium text-white">{entry.versionLabel}</p>
                <p className="mt-2 text-xs leading-5 text-white/48">
                  {new Date(entry.createdAt || Date.now()).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
