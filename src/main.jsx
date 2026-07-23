import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  Ear,
  HelpCircle,
  Menu,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./styles.css";
import SynthesisModal from "./SynthesisModal";
import iceberg from "./assets/illustrations/iceberg-expectations.png";
import stated from "./assets/illustrations/stated-unstated.png";
import franchise from "./assets/illustrations/franchise-owner.png";
import honestMap from "./assets/illustrations/honest-expectation-map-v3.png";
import icebergReveal from "./assets/illustrations/iceberg-reveal.png";
import statedReveal from "./assets/illustrations/stated-unstated-reveal.png";
import oneToOne from "./assets/illustrations/one-to-one.png";
import openQuestions from "./assets/illustrations/open-questions.png";
import activeListening from "./assets/illustrations/active-listening.png";
import safeClimate from "./assets/illustrations/safe-climate.png";
import statedComplaintCard from "./assets/illustrations/stated-complaint-card.png";
import unstatedFearCard from "./assets/illustrations/unstated-fear-card.png";
const screens = [
  "Below the surface",
  "Stated vs. unstated",
  "Surface the unstated",
  "Case in point",
  "Exam lens",
];
const techniques = [
  {
    name: "One-to-one conversations",
    icon: Users,
    image: oneToOne,
    kicker: "One-to-One Conversations",
    text: "Create the private space where people say things they wouldn't say in a group. A stakeholder who voices polite agreement in a steering committee meeting may, one-to-one, reveal a concern they were unwilling to raise publicly.",
  },
  {
    name: "Open questions",
    icon: MessageCircleQuestion,
    image: openQuestions,
    kicker: "Open Questions",
    text: "Invite expectations to surface rather than confirming assumptions the PM has already made. \"Are you comfortable with the timeline?\" invites a yes-or-no answer. \"What does success look like to you for this project?\" invites something that might never have come up otherwise.",
  },
  {
    name: "Active listening",
    icon: Ear,
    image: activeListening,
    kicker: "Active Listening",
    text: "Means hearing what's actually being communicated — tone, hesitation, what's left unsaid — not just processing the literal words. A stakeholder's complaint often points toward something deeper than the complaint itself.",
  },
  {
    name: "A safe climate",
    icon: ShieldCheck,
    image: safeClimate,
    kicker: "A Safe Climate",
    text: "The precondition for all three above. People only admit what they really want or fear when they trust it won't be used against them or dismissed. Building that trust is itself part of the PM's job — and connects directly to PMBOK® 8's principle of building an empowered culture.",
  },
];
const q1 = {
  q: "In a group meeting, a stakeholder says the timeline “seems fine.” What is most likely to surface a different concern?",
  answers: [
    "Ask again in the next group meeting",
    "Use a one-to-one conversation and ask “What does success look like to you?”",
    "Send a yes/no survey",
    "Assume “fine” means there is nothing more",
  ],
  correct: 1,
  yes: "Right — group settings and closed questions both suppress exactly the kind of disclosure a private conversation and an open question are designed to invite.",
  no: "Reconsider — the setting and the question type both matter here. A group meeting and a closed question both work against surfacing anything unstated.",
};
const q2 = {
  q: "The PM adds walk-in features, but the franchise owner's resistance continues. What is the most likely explanation?",
  answers: [
    "The features were built poorly",
    "The underlying fear about losing control was never addressed",
    "The owner resists all change",
    "More walk-in features are needed",
  ],
  correct: 1,
  yes: "Exactly — this is the pattern the enabler is built around: the expectations that sink projects are almost always the ones nobody said out loud, and addressing the stated version alone leaves the real driver untouched.",
  no: "Think about what was actually driving the resistance — it was never really about the feature set.",
};
function Modal({ detail, onClose, onRead }) {
  useEffect(() => {
    const f = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [onClose]);
  return createPortal(
    <motion.div
      className="modal-backdrop focused-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="detail-sheet detail-modal"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="drawer-close" onClick={onClose}>
          <X />
        </button>
        {detail.image && (
          <img className="drawer-illustration" src={detail.image} alt="" />
        )}
        <p className="mini-label">{detail.kicker}</p>
        <h3>{detail.name || detail.title}</h3>
        <p>{detail.text}</p>
        {detail.note && (
          <div className="sheet-note">
            <Target />
            <span>{detail.note}</span>
          </div>
        )}
        <button className="modal-close-bottom" onClick={onRead}>
          <Check /> Mark as read
        </button>
      </motion.section>
    </motion.div>,
    document.body,
  );
}
function Quiz({ data, onFinish }) {
  const [pick, setPick] = useState(null);
  return createPortal(
    <div className="knowledge-modal-backdrop">
      <motion.section
        className="quiz knowledge-modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="quiz-label">
          <Target /> MICRO KNOWLEDGE CHECK
        </div>
        <h3>{data.q}</h3>
        <div className="answers">
          {data.answers.map((a, i) => (
            <button
              key={a}
              className={
                pick === i ? (i === data.correct ? "correct" : "wrong") : ""
              }
              onClick={() => setPick(i)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {a}
            </button>
          ))}
        </div>
        {pick !== null && (
          <p className={`feedback ${pick === data.correct ? "good" : "bad"}`}>
            {pick === data.correct ? data.yes : data.no}
          </p>
        )}
        {pick !== null && (
          <button className="finish-check" onClick={onFinish}>
            Finish check <ArrowRight />
          </button>
        )}
      </motion.section>
    </div>,
    document.body,
  );
}
function Art({ src, alt, className = "" }) {
  return (
    <img className={`custom-lesson-art ${className}`} src={src} alt={alt} />
  );
}
function App() {
  const [page, setPage] = useState(0),
    [sound, setSound] = useState(true),
    [menu, setMenu] = useState(false),
    [detail, setDetail] = useState(null),
    [reveals, setReveals] = useState([false, false]),
    [seen, setSeen] = useState([]),
    [map, setMap] = useState(false),
    [flips, setFlips] = useState([]),
    [qOne, setQOne] = useState(false),
    [qTwo, setQTwo] = useState(false),
    [quiz, setQuiz] = useState(null),
    [done, setDone] = useState(false),
    [synthesisOpen, setSynthesisOpen] = useState(false);
  const can = [
    reveals[0],
    reveals[1],
    seen.length === 4 && map && qOne,
    flips.length === 2 && qTwo,
    done,
  ][page];
  const reveal = (i, d) => {
    setDetail(d);
    setReveals((v) => v.map((x, n) => (n === i ? true : x)));
  };
  const read = () => {
    if (detail?.index !== undefined)
      setSeen((v) => (v.includes(detail.index) ? v : [...v, detail.index]));
    setDetail(null);
  };
  const next = () => {
    if (can && page < 4) {
      setPage(page + 1);
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select">
          <Award />
          <span>PMP Project Management Professional</span>
          <ChevronDown />
        </button>
        <div className="module-progress">
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`progress-dot ${i < 9 ? "done" : i === 9 ? "active" : ""}`}
              >
                {i < 9 ? <Check /> : <span />}
              </span>
            ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">
            <X size={20} />
            <span>Quit</span>
          </button>
        </div>
      </header>
      <main className="workspace">
        <section className="lesson-stage">
          <div className="outline">
            <button className="menu-button" onClick={() => setMenu(!menu)}>
              <Menu />
            </button>
            {menu && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <b>Lesson 3.4.2</b>
                </div>
                <div className="lesson-list">
                  {screens.map((s, i) => (
                    <button
                      key={s}
                      className={`lesson ${i === page ? "current" : ""}`}
                      disabled={i > page}
                      onClick={() => setPage(i)}
                    >
                      <span
                        className={`progress-dot ${i < page ? "done" : ""}`}
                      >
                        {i < page ? <Check /> : <span />}
                      </span>
                      <span>{s}</span>
                      <small>{i + 1}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p className="section-tabs-count">Section {page + 1} of 5</p>
              <div className="section-tabs-row">
                {screens.map((s, i) => (
                  <button
                    key={s}
                    className={`section-tab ${i === page ? "active" : i < page ? "done" : "locked"}`}
                    disabled={i > page}
                    onClick={() => setPage(i)}
                  >
                    {i < page && <Check />}
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </nav>
            <AnimatePresence mode="wait">
              <motion.section
                key={page}
                className="lesson-content comm-page expectation-page"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                {page === 0 && (
                  <div className="comm-hero">
                    <div>
                      <p className="eyebrow">LESSON 3.4.2</p>
                      <h1>Identify Stakeholder Expectations</h1>
                      <p>An iceberg shows you maybe a tenth of its actual mass above the waterline. A ship's crew that charts a course based only on what's visible isn't navigating safely — they're navigating on a guess, betting that the nine-tenths they can't see happens to line up with what they assumed.</p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          reveal(0, {
                            title: "Stakeholder expectations work the same way",
                            kicker: "CLICK-TO-REVEAL",
                            image: icebergReveal,
                            text: "Stakeholder expectations work exactly the same way. What a stakeholder says out loud — in a meeting, in the charter, in a requirements document — is the tenth above the waterline. The assumptions, fears, and private definitions of success sitting beneath it are the mass that actually determines whether the project stays on course or runs into something nobody saw coming. That gap between what's said and what's actually expected, feared, or assumed is exactly what this enabler exists to close.",
                          })
                        }
                      >
                        Reveal what lies below <ArrowRight />
                      </button>
                    </div>
                    <Art
                      src={iceberg}
                      alt="A small iceberg tip above a much larger hidden mass"
                    />{" "}
                  </div>
                )}
                {page === 1 && (
                  <div className="calibration">
                    <div>
                      <p className="eyebrow">SCREEN 2</p>
                      <h2>Stated vs. Unstated</h2>
                      <p>The second enabler of ECO People Task 5 asks the project manager to identify stakeholder expectations — and it draws a hard line between two very different categories.</p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          reveal(1, {
                            title: "Stated expectations and unstated expectations",
                            kicker: "CLICK-TO-REVEAL",
                            image: statedReveal,
                            text: "Stated expectations are the easy ones. They're written in the charter, said out loud in meetings, captured in requirements documents — everyone can point to them. Unstated expectations are the dangerous ones: the assumptions, the fears, the political needs, and the private definitions of success that nobody has put into words — sometimes because the stakeholder hasn't fully articulated them even to themselves. This connects directly to PMBOK® 8's emphasis on shared understanding — holding the project's purpose and benefits in common across the team and stakeholders. But shared understanding is only possible when expectations are actually on the table. You cannot share an understanding that half your stakeholders are quietly keeping in their heads.",
                          })
                        }
                      >
                        Reveal the distinction <ArrowRight />
                      </button>
                    </div>
                    <Art
                      src={stated}
                      alt="Visible stated expectations overlap with hidden unstated expectations"
                    />
                  </div>
                )}
                {page === 2 && (
                  <div className="wide">
                    <p className="eyebrow">SCREEN 3</p>
                    <h2>How to Surface the Unstated</h2>
                    <p className="lede">Surfacing what nobody's saying doesn't happen by accident in a group status meeting — it takes deliberate technique, applied on purpose. Click each one to see how it works.</p>
                    <div className="direct-card-grid">
                      {techniques.map((t, i) => {
                        const I = t.icon;
                        return (
                          <button
                            key={t.name}
                            className={`direct-detail-card ${seen.includes(i) ? "visited" : ""}`}
                            onClick={() => setDetail({ ...t, index: i })}
                          >
                            <span className="direct-card-icon">
                              <I />
                            </span>
                            <span className="direct-card-copy">
                              <small>
                                {seen.includes(i) ? (
                                  <>
                                    <Check /> READ
                                  </>
                                ) : (
                                  `0${i + 1}`
                                )}
                              </small>
                              <strong>{t.name}</strong>
                            </span>
                            <ArrowRight className="direct-card-arrow" />
                          </button>
                        );
                      })}
                    </div>
                    {seen.length === 4 && !map && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setMap(true)}
                      >
                        <Sparkles /> Reveal expectation map
                      </button>
                    )}
                    {map && (
                      <div className="expectation-map">
                        <div className="map-heading">
                          <span className="map-heading-icon"><Users /></span>
                          <span><small>OUTPUT OF THIS ENABLER</small><b>Honest expectation map</b></span>
                          <em>KEY STAKEHOLDER / GROUP</em>
                        </div>
                        <div className="map-field expect">
                          <Target />
                          <span><b>EXPECT</b><small>What do they need to happen?</small></span>
                        </div>
                        <div className="map-field assume">
                          <HelpCircle />
                          <span><b>ASSUME</b><small>What do they believe is already true?</small></span>
                        </div>
                        <div className="map-field fear">
                          <ShieldCheck />
                          <span><b>FEAR</b><small>What could threaten their position, control, or success?</small></span>
                        </div>
                        <p>The output of this enabler is an honest expectation map — for each key stakeholder or group, what they expect, what they assume, and what they fear. Not just what they've said. What's actually driving their position.</p>
                      </div>
                    )}
                    {map && !qOne && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setQuiz(q1)}
                      >
                        <Target /> Start knowledge check <ArrowRight />
                      </button>
                    )}
                  </div>
                )}
                {page === 3 && (
                  <div className="wide">
                    <p className="eyebrow">SCREEN 4</p>
                    <h2>Case in Point: The Franchise Owner</h2>
                    <p className="lede">Back to that franchise owner from the opening. His actual words, taken at face value, would have sent the project in the wrong direction entirely. Flip both cards to see why.</p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "The stated complaint",
                          front: "“This app ignores walk-in customers.”",
                          image: statedComplaintCard,
                          back: "\"This app ignores walk-in customers.\" Taken at face value, this sounds like a feature gap — the fix looks like adding functionality for walk-in traffic.",
                        },
                        {
                          name: "The unstated fear",
                          front: "Dig one layer deeper.",
                          image: unstatedFearCard,
                          back: "Dig one layer deeper, through a one-to-one conversation and active listening, and what actually surfaces is: \"I'm losing control over my own customer relationships.\" A completely different problem, with a completely different fix.",
                        },
                      ].map((f, i) => (
                        <div className="illustrated-flip" key={f.name}>
                        <img className="flip-card-art" src={f.image} alt="" />
                        <button
                          className={`flip ${flips.includes(i) ? "flipped" : ""}`}
                          onClick={() =>
                            setFlips((v) => (v.includes(i) ? v : [...v, i]))
                          }
                        >
                          <div className="flip-inner">
                            <div className="flip-front">
                              <small>CLICK TO FLIP</small>
                              <h3>{f.name}</h3>
                              <p>{f.front}</p>
                            </div>
                            <div className="flip-back">
                              <small>UNDER THE SURFACE</small>
                              <h3>{f.name}</h3>
                              <p>{f.back}</p>
                            </div>
                          </div>
                        </button>
                        </div>
                      ))}
                    </div>
                    {flips.length === 2 && (
                      <div className="backing">
                        Those are two very different problems. The stated complaint suggests a product fix. The unstated fear suggests something else entirely — reassurance, involvement in decisions, evidence that the franchise owner's role isn't being displaced. A PM who only addresses the stated complaint may genuinely believe the issue is resolved — and be blindsided when resistance continues, because the actual driver was never touched.
                      </div>
                    )}
                    {flips.length === 2 && !qTwo && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setQuiz(q2)}
                      >
                        <Target /> Start knowledge check <ArrowRight />
                      </button>
                    )}
                  </div>
                )}
                {page === 4 && (
                  <div className="exam">
                    <Art
                      src={honestMap}
                      alt="Spoken and unspoken expectations merge into shared understanding"
                    />
                    <div>
                      <p className="eyebrow">SCREEN 5 · SYNTHESIS (EXAM LENS)</p>
                      <h2>One line sums up everything this enabler is built around — and it's worth carrying into the exam room exactly as stated.</h2>
                      <button
                        className="primary compact-cta"
                        disabled={done}
                        onClick={() => setSynthesisOpen(true)}
                      >
                        {done ? "Synthesis reviewed" : "Reveal the synthesis"}
                        <Sparkles />
                      </button>
                    </div>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
            {can && (
              <div className="anchor">
                <Check /> Interaction complete — continue when ready.
              </div>
            )}
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft /> Previous
              </button>
              <button
                className={`primary-button ${can ? "unlocked" : ""}`}
                disabled={!can}
                onClick={next}
              >
                {page === 4 ? "Complete" : "Continue"}
                <ArrowRight />
              </button>
            </footer>
          </article>
        </section>
      </main>
      <AnimatePresence>
        {detail && (
          <Modal
            detail={detail}
            onClose={() => setDetail(null)}
            onRead={read}
          />
        )}
        {synthesisOpen && (
          <SynthesisModal
            title="Surface what stakeholders did not say"
            onClose={() => setSynthesisOpen(false)}
            onReviewed={() => {
              setDone(true);
              setSynthesisOpen(false);
            }}
          >
            <p>The expectations that sink projects are the ones nobody said out loud. A stated position captured in a meeting is only ever part of the picture. The unstated assumptions, fears, and private definitions of success sitting underneath it are where real alignment — or real conflict — actually lives. Use one-to-one conversations. Ask open questions. Listen actively, for what's said and what isn't. Build the trust that makes honesty safe. And produce an honest expectation map — not just a record of what stakeholders were willing to say in front of everyone else.</p>
            <h4>Exam-relevant enablers to remember:</h4>
            <ul>
              <li>Distinguish stated expectations (charter, meetings, requirements) from unstated ones (assumptions, fears, private definitions of success)</li>
              <li>Surfacing the unstated takes technique: one-to-one settings, open questions, active listening, and a safe climate</li>
              <li>The deliverable is an honest expectation map — expect, assume, and fear, not just what was said</li>
              <li>A stated complaint and an unstated fear can point to two completely different fixes — address the real driver, not just the surface version</li>
            </ul>
          </SynthesisModal>
        )}
      </AnimatePresence>
      {quiz && (
        <Quiz
          data={quiz}
          onFinish={() => {
            if (quiz === q1) setQOne(true);
            else setQTwo(true);
            setQuiz(null);
          }}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
