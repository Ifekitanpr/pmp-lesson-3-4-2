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
    kicker: "PRIVATE SPACE",
    text: "Create the private space where people say what they would not say in a group. Polite agreement in a steering meeting can become an honest concern one-to-one.",
  },
  {
    name: "Open questions",
    icon: MessageCircleQuestion,
    image: openQuestions,
    kicker: "INVITE, DON'T CONFIRM",
    text: "Ask “What does success look like to you?” rather than “Are you comfortable?” Open questions surface expectations instead of confirming the PM’s assumptions.",
  },
  {
    name: "Active listening",
    icon: Ear,
    image: activeListening,
    kicker: "HEAR THE WHOLE MESSAGE",
    text: "Listen for tone, hesitation, and what is left unsaid—not only literal words. A complaint often points toward something deeper than the complaint itself.",
  },
  {
    name: "A safe climate",
    icon: ShieldCheck,
    image: safeClimate,
    kicker: "MAKE HONESTY SAFE",
    text: "People reveal what they want or fear only when they trust it will not be dismissed or used against them. Building that trust is part of the PM’s job.",
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
  yes: "Right—the private setting and open question both invite what the group setting suppresses.",
  no: "Reconsider: both the setting and the question type matter.",
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
  yes: "Exactly—the surface complaint was not the real driver.",
  no: "Think about what was actually driving the resistance, not only the feature request.",
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
        {pick === data.correct && (
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
    [done, setDone] = useState(false);
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
                      <p className="eyebrow">
                        LESSON 3.4.2 · IDENTIFY STAKEHOLDER EXPECTATIONS
                      </p>
                      <h1>
                        The visible expectation is only <em>the tip.</em>
                      </h1>
                      <p>
                        An iceberg shows only a fraction of its mass. Navigating
                        by what is visible means betting the hidden nine-tenths
                        matches your assumptions.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          reveal(0, {
                            title: "Stakeholder expectations work the same way",
                            kicker: "THE HIDDEN MASS",
                            image: icebergReveal,
                            text: "What a stakeholder says aloud is only the visible tip. Below it sit assumptions about how decisions will be made, fears about status or control, political needs, previous experiences, and private definitions of success. These hidden expectations shape support and resistance even when they never appear in a requirement or meeting note.",
                            note: "The task is not to guess the hidden mass. It is to create the conditions and use the techniques that bring it safely into view.",
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
                      <p className="eyebrow">STATED VS. UNSTATED</p>
                      <h2>
                        Shared understanding needs <em>the whole picture.</em>
                      </h2>
                      <p>
                        Stated expectations live in charters, meetings, and
                        requirements. Unstated expectations live in assumptions,
                        fears, political needs, and private definitions of
                        success.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          reveal(1, {
                            title: "You cannot share what stays hidden",
                            kicker: "PMBOK® 8 · SHARED UNDERSTANDING",
                            image: statedReveal,
                            text: "The second enabler under ECO People Task 5 is to identify stakeholder expectations. Stated expectations appear in charters, requirements, agreements, and conversations; unstated expectations remain in people’s heads. PMBOK® 8 emphasizes shared understanding, which is possible only when both kinds are surfaced, tested, and reconciled.",
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
                    <p className="eyebrow">SURFACE THE UNSTATED</p>
                    <h2>Honesty takes deliberate technique.</h2>
                    <p className="lede">
                      Open each technique and mark it as read.
                    </p>
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
                        <p>Capture what is driving the stakeholder—not only what they were willing to say in the meeting.</p>
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
                    <p className="eyebrow">
                      CASE IN POINT · THE FRANCHISE OWNER
                    </p>
                    <h2>The complaint and the driver are not the same.</h2>
                    <p className="lede">Flip both cards to see why.</p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "The stated complaint",
                          front: "“This app ignores walk-in customers.”",
                          image: statedComplaintCard,
                          back: "Taken literally, this sounds like a product requirement: add walk-in functionality. The statement is real, but treating it as the complete expectation risks solving the visible symptom while leaving the stakeholder’s resistance untouched.",
                        },
                        {
                          name: "The unstated fear",
                          front: "Dig one layer deeper.",
                          image: unstatedFearCard,
                          back: "A private conversation reveals the deeper fear: “I’m losing control over my own customer relationships.” That expectation calls for reassurance, involvement in decisions, clear ownership boundaries, and evidence—not merely another feature.",
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
                        A product fix cannot resolve a fear about control. The
                        stated complaint informs the solution, but the unstated
                        expectation explains the resistance. Address both the
                        request and the real driver beneath it.
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
                      <p className="eyebrow">EXAM LENS · EXPECTATIONS</p>
                      <h2>
                        The expectations that sink projects are the ones nobody
                        said out loud.
                      </h2>
                      <p className="lede">Identification goes beyond recording requests. It uncovers what stakeholders expect, assume, and fear so the team can build genuine shared understanding.</p>
                      <button
                        className="primary compact-cta"
                        onClick={() => setDone(true)}
                      >
                        {done
                          ? "Expectation map complete"
                          : "Reveal the exam rules"}
                        <Sparkles />
                      </button>
                      {done && (
                        <ul>
                          <li>
                            Distinguish stated expectations from unstated
                            assumptions and fears.
                          </li>
                          <li>
                            Use one-to-one settings, open questions, active
                            listening, and a safe climate.
                          </li>
                          <li>
                            Map what stakeholders expect, assume, and fear.
                          </li>
                          <li>
                            Address the real driver, not only the stated
                            complaint.
                          </li>
                        </ul>
                      )}
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
