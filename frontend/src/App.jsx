import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Bot, Compass, Sparkles, WandSparkles } from "lucide-react";
import { FloatingScene } from "./components/FloatingScene";
import { TripWizard } from "./components/TripWizard";
import { GenerationOverlay } from "./components/GenerationOverlay";
import { ItineraryBoard } from "./components/ItineraryBoard";
import { ChatPanel } from "./components/ChatPanel";
import { generateItinerary, modifyItinerary, saveItinerary } from "./utils/api";

const LOCAL_STORAGE_KEY = "iteanary-ai-session";

const initialForm = {
  destination: "Tokyo",
  startDate: "",
  endDate: "",
  budget: 3200,
  interests: ["Food", "Architecture", "Wellness"],
  travelStyle: "Balanced",
  tripLength: 4
};

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Tell me the destination, pacing, or mood you want and I’ll shape the itinerary around it."
    }
  ]);
  const [shareId, setShareId] = useState("");
  const [timelineIndex, setTimelineIndex] = useState(0);
  const heroRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-copy", {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    const handleMove = (event) => {
      const bounds = panel.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
      const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;

      gsap.to(".parallax-layer", {
        x: x * 18,
        y: y * 18,
        duration: 0.8,
        ease: "power3.out"
      });
    };

    const reset = () => {
      gsap.to(".parallax-layer", {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power3.out"
      });
    };

    panel.addEventListener("mousemove", handleMove);
    panel.addEventListener("mouseleave", reset);

    return () => {
      panel.removeEventListener("mousemove", handleMove);
      panel.removeEventListener("mouseleave", reset);
    };
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setForm(parsed.form || initialForm);
      setItinerary(parsed.itinerary || null);
      setHistory(parsed.history || []);
      setMessages(parsed.messages || []);
      setShareId(parsed.shareId || "");
      setTimelineIndex(parsed.timelineIndex || 0);
    } catch (error) {
      console.warn("Failed to restore local session", error);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedId = params.get("share");
    if (!sharedId) return;

    const loadSharedItinerary = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050"}/itinerary/${sharedId}`);
        if (!response.ok) return;
        const payload = await response.json();
        setShareId(payload.shareId);
        setForm(payload.tripInput || initialForm);
        setItinerary(payload.itinerary || null);
        setHistory(payload.history || []);
        setMessages(payload.messages || []);
        setTimelineIndex(Math.max((payload.history || []).length - 1, 0));
      } catch (error) {
        console.warn("Unable to load shared itinerary", error);
      }
    };

    loadSharedItinerary();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ form, itinerary, history, messages, shareId, timelineIndex })
    );
  }, [form, itinerary, history, messages, shareId, timelineIndex]);

  const canUndo = timelineIndex > 0;
  const canRedo = timelineIndex < Math.max(history.length - 1, 0);

  const currentTimeline = useMemo(() => history[timelineIndex], [history, timelineIndex]);

  useEffect(() => {
    if (currentTimeline?.itinerary) {
      setItinerary(currentTimeline.itinerary);
    }
  }, [currentTimeline]);

  const pushHistory = (nextHistory) => {
    setHistory(nextHistory);
    setTimelineIndex(nextHistory.length - 1);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        ...form,
        interests: form.interests
      };
      const response = await generateItinerary(payload);
      setItinerary(response.itinerary);
      setShareId(response.shareId);
      pushHistory(response.history);
      setMessages([
        {
          role: "assistant",
          content: `Your ${form.destination} itinerary is live. Ask me to adjust pace, budget, weather, or specific days.`
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: `I hit a snag generating the itinerary: ${error.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async (content, options = {}) => {
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content }]);

    try {
      const response = await modifyItinerary({
        shareId,
        message: content,
        itinerary,
        tripInput: form,
        regenerateDay: options.regenerateDay
      });

      setItinerary(response.itinerary);
      setShareId(response.shareId);
      pushHistory(response.history);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: options.regenerateDay ? `Day ${options.regenerateDay} has been redesigned.` : "Updated. I kept the rest of the plan consistent and only changed what was needed." }
      ]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: `Update failed: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;
    try {
      await saveItinerary({
        shareId,
        destination: form.destination,
        tripInput: form,
        itinerary,
        history,
        messages
      });
      setMessages((current) => [...current, { role: "assistant", content: "Saved. Your latest itinerary state is stored." }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: `Save failed: ${error.message}` }]);
    }
  };

  const handleShare = async () => {
    const shareUrl = shareId ? `${window.location.origin}?share=${shareId}` : window.location.href;
    await navigator.clipboard.writeText(shareUrl).catch(() => null);
    setMessages((current) => [...current, { role: "assistant", content: "Share link copied to your clipboard." }]);
  };

  const handleSurprise = () => {
    const presets = [
      { destination: "Seoul", interests: ["Shopping", "Food", "Art"], travelStyle: "Luxury" },
      { destination: "Reykjavik", interests: ["Nature", "Wellness", "Architecture"], travelStyle: "Adventure" },
      { destination: "Lisbon", interests: ["Food", "History", "Nightlife"], travelStyle: "Balanced" }
    ];
    const preset = presets[Math.floor(Math.random() * presets.length)];
    setForm((current) => ({ ...current, ...preset }));
  };

  const handleReorderActivity = (dayId, sourceIndex, targetIndex) => {
    const nextItinerary = {
      ...itinerary,
      days: itinerary.days.map((day) => {
        if (day.id !== dayId) return day;
        const nextActivities = [...day.activities];
        const [moved] = nextActivities.splice(sourceIndex, 1);
        nextActivities.splice(targetIndex, 0, moved);
        return { ...day, activities: nextActivities };
      })
    };

    setItinerary(nextItinerary);
  };

  return (
    <div className="relative min-h-screen px-4 pb-12 pt-6 sm:px-6 lg:px-10">
      <FloatingScene />
      <GenerationOverlay open={loading} />

      <main className="mx-auto max-w-[1600px]">
        <section
          ref={heroRef}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] px-6 py-10 shadow-soft backdrop-blur-sm sm:px-10 sm:py-14"
        >
          <div className="absolute inset-0 bg-noise opacity-80" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-7">
              <div className="hero-copy inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
                <Bot className="h-4 w-4 text-sky-200" />
                AI-native travel planning
              </div>
              <div className="hero-copy">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                  Iteanary.ai turns travel planning into a cinematic conversation.
                </h1>
              </div>
              <p className="hero-copy max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                Generate a richly structured itinerary, refine it in a persistent AI side chat, and evolve the trip with
                premium motion, memory, and real-world travel logic.
              </p>
              <div className="hero-copy flex flex-wrap gap-3 text-sm text-white/65">
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Glass + neumorphic UI</span>
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Version history + undo</span>
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">AI modification workflow</span>
              </div>
              <div className="hero-copy grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Sparkles, label: "Generate", copy: "Context-aware itineraries with JSON precision." },
                  { icon: WandSparkles, label: "Refine", copy: "Ask for mood, weather, budget, or day-level changes." },
                  { icon: Compass, label: "Explore", copy: "Save, share, export, and reorder plans fluidly." }
                ].map((item) => (
                  <div key={item.label} className="glass rounded-[28px] p-5">
                    <item.icon className="h-5 w-5 text-sky-200" />
                    <h3 className="mt-4 text-lg font-medium text-white">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                className="parallax-layer absolute inset-0 mx-auto my-auto h-[85%] w-[85%] rounded-full bg-fuchsia-500/18 blur-3xl"
              />
              <div ref={panelRef} className="parallax-layer">
                <TripWizard
                  step={step}
                  setStep={setStep}
                  form={form}
                  setForm={setForm}
                  onGenerate={handleGenerate}
                  loading={loading}
                  onSurprise={handleSurprise}
                />
              </div>
            </div>
          </div>
        </section>

        {itinerary && (
          <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_420px]">
            <ItineraryBoard
              itinerary={itinerary}
              history={history}
              onRegenerateDay={(dayNumber) =>
                handleModify(`Regenerate day ${dayNumber} with fresh ideas but keep the overall trip coherent.`, {
                  regenerateDay: dayNumber
                })
              }
              onSave={handleSave}
              onShare={handleShare}
              onUndo={() => canUndo && setTimelineIndex((current) => current - 1)}
              onRedo={() => canRedo && setTimelineIndex((current) => current + 1)}
              canUndo={canUndo}
              canRedo={canRedo}
              onRestoreVersion={(entry) => {
                const index = history.findIndex((item) => item.createdAt === entry.createdAt && item.versionLabel === entry.versionLabel);
                if (index >= 0) setTimelineIndex(index);
              }}
              onReorderActivity={handleReorderActivity}
            />
            <ChatPanel messages={messages} onSend={handleModify} loading={loading} />
          </section>
        )}
      </main>
    </div>
  );
}
