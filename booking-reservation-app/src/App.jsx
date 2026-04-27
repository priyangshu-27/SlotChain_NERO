import React, { useState, useRef, useCallback, useEffect } from "react";
import { checkConnection, createSlot, bookSlot, cancelBooking, completeBooking, getSlot, listSlots, getSlotCount } from "../lib/nero.js";

const nowTs = () => Math.floor(Date.now() / 1000);
const truncateAddr = (a) => (!a || a.length < 12 ? a : `${a.slice(0, 6)}…${a.slice(-4)}`);
const initialForm = () => ({
  id: "slot1",
  provider: "",
  customer: "",
  serviceName: "Consultation",
  date: String(nowTs()),
  startTime: String(nowTs()),
  endTime: String(nowTs() + 3600),
  price: "1000",
});

/* ─────────────────────────────────────────────
   LANDING PAGE SECTION
   ───────────────────────────────────────────── */
function LandingPage({ onLaunch }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const glowX = 20 + mousePos.x * 60;
  const glowY = 20 + mousePos.y * 60;

  const features = [
    { icon: "⏰", title: "Time Slots", desc: "Create granular time slots with custom pricing, service names, and availability windows." },
    { icon: "🔐", title: "On-Chain Auth", desc: "All bookings are signed via MetaMask wallet — no custodial risk, no middlemen." },
    { icon: "✅", title: "State Machine", desc: "Slots flow through available → booked → completed (or cancelled) with full auditability." },
    { icon: "⚡", title: "EVM Compatible", desc: "Built on Nero Chain's EVM platform. Fast finality, minimal fees." },
    { icon: "🌐", title: "Open Protocol", desc: "Any provider can list slots. Any customer with a Web3 wallet can book." },
    { icon: "📊", title: "Live Queries", desc: "Read slot state instantly with simulated transactions — no wallet needed to browse." },
  ];

  const steps = [
    { n: "01", title: "Connect Wallet", desc: "Link your MetaMask wallet with one click to authenticate as a provider or customer." },
    { n: "02", title: "Create a Slot", desc: "Define your service, set the time window and price. The slot is stored on-chain." },
    { n: "03", title: "Get Booked", desc: "Customers browse and book available slots. The contract locks the appointment." },
    { n: "04", title: "Complete & Settle", desc: "Mark the service complete. The history is permanently recorded on Nero Chain." },
  ];

  return (
    <div style={styles.landing}>
      {/* Animated background */}
      <div style={{ ...styles.glow, left: `${glowX}%`, top: `${glowY}%` }} />
      <div style={styles.grid} />

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo}>◈</span>
          <span style={styles.navName}>SlotChain</span>
          <span style={styles.navBadge}>TESTNET</span>
        </div>
        <div style={styles.navLinks}>
          <span style={styles.navLink}>Docs</span>
          <span style={styles.navLink}>GitHub</span>
          <button style={styles.navCta} onClick={onLaunch}>Launch App →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroEyebrow}>
          <span style={styles.dot} />
          Nero Chain · EVM Smart Contract
        </div>
        <h1 style={styles.heroH1}>
          Decentralized<br />
          <span style={styles.heroAccent}>Booking</span> &amp;<br />
          Reservation
        </h1>
        <p style={styles.heroSub}>
          Create service time slots, manage appointments, and settle payments — all on-chain, trustlessly, on the Nero Network.
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.heroPrimary} onClick={onLaunch}>
            Open App
            <span style={styles.arrowSpan}>→</span>
          </button>
          <button style={styles.heroSecondary}>
            View Contract ↗
          </button>
        </div>
        <div style={styles.heroStats}>
          {[["~2s", "Finality"], ["&lt;$0.01", "Per Tx"], ["100%", "On-chain"], ["0", "Middlemen"]].map(([val, lbl]) => (
            <div key={lbl} style={styles.heroStat}>
              <span style={styles.heroStatVal} dangerouslySetInnerHTML={{ __html: val }} />
              <span style={styles.heroStatLbl}>{lbl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>FEATURES</div>
        <h2 style={styles.sectionH2}>Everything you need to run a booking service on-chain</h2>
        <div style={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ ...styles.section, maxWidth: 760, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={styles.sectionLabel}>HOW IT WORKS</div>
        <h2 style={styles.sectionH2}>Four steps from listing to settlement</h2>
        <div style={styles.steps}>
          {steps.map((s, i) => (
            <div key={s.n} style={styles.step}>
              <div style={styles.stepNum}>{s.n}</div>
              {i < steps.length - 1 && <div style={styles.stepLine} />}
              <div style={styles.stepBody}>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaH2}>Ready to go on-chain?</h2>
          <p style={styles.ctaSub}>Connect your MetaMask wallet and create your first slot in under a minute.</p>
          <button style={styles.heroPrimary} onClick={onLaunch}>
            Launch the App <span style={styles.arrowSpan}>→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerBrand}>◈ SlotChain</span>
        <span style={styles.footerMeta}>Built on Nero Chain · EVM · MIT License</span>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP (DAPP UI)
   ───────────────────────────────────────────── */
function DApp({ onBack }) {
  const [form, setForm] = useState(initialForm);
  const [output, setOutput] = useState(null);
  const [outputStatus, setOutputStatus] = useState("idle");
  const [txHash, setTxHash] = useState(null);
  const [walletKey, setWalletKey] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [busyAction, setBusyAction] = useState("");
  const [countValue, setCountValue] = useState("–");
  const [activeTab, setActiveTab] = useState("create");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const confirmTimer = useRef(null);
  const outputRef = useRef(null);

  const setField = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const run = async (fn, label) => {
    setIsBusy(true);
    setBusyAction(label);
    setOutputStatus("idle");
    setOutput(null);
    setTxHash(null);
    try {
      const res = await fn();
      if (res && res.hash) {
        setTxHash(res.hash);
      }
      setOutput(typeof res === "string" ? res : JSON.stringify(res, null, 2));
      setOutputStatus("success");
    } catch (err) {
      setOutput(err?.message || String(err));
      setOutputStatus("error");
    } finally {
      setIsBusy(false);
      setBusyAction("");
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
    }
  };

  const onConnect = () => run(async () => {
    const user = await checkConnection();
    if (!user) throw new Error("Wallet not connected");
    setWalletKey(user.publicKey);
    setForm((p) => ({ ...p, provider: user.publicKey, customer: user.publicKey }));
    return `Connected: ${user.publicKey}`;
  }, "connect");

  const onCreateSlot   = () => run(() => createSlot({ id: form.id.trim(), provider: form.provider.trim(), serviceName: form.serviceName.trim(), date: Number(form.date), startTime: Number(form.startTime), endTime: Number(form.endTime), price: form.price.trim() }), "createSlot");
  const onBookSlot     = () => run(() => bookSlot({ id: form.id.trim(), customer: form.customer.trim() }), "bookSlot");
  const onCompleteBooking = () => run(() => completeBooking({ id: form.id.trim(), provider: form.provider.trim() }), "completeBooking");
  const onGetSlot      = () => run(() => getSlot(form.id.trim()), "getSlot");
  const onList         = () => run(() => listSlots(), "list");
  const onCount        = () => run(async () => { const v = await getSlotCount(); setCountValue(String(v)); return { count: v }; }, "count");

  const handleCancelBooking = useCallback(() => {
    if (confirmCancel) {
      clearTimeout(confirmTimer.current);
      setConfirmCancel(false);
      run(() => cancelBooking({ id: form.id.trim(), caller: form.customer.trim() || form.provider.trim() }), "cancelBooking");
    } else {
      setConfirmCancel(true);
      confirmTimer.current = setTimeout(() => setConfirmCancel(false), 3000);
    }
  }, [confirmCancel, form]);

  const isBusy_ = (a) => isBusy && busyAction === a;
  const connected = walletKey.length > 0;

  const tabs = [
    { id: "create",  label: "Create Slot",  icon: "＋" },
    { id: "booking", label: "Booking",       icon: "📋" },
    { id: "query",   label: "Query",         icon: "🔍" },
  ];

  return (
    <div style={appStyles.shell}>
      {/* Sidebar */}
      <aside style={appStyles.sidebar}>
        <div style={appStyles.sidebarTop}>
          <button style={appStyles.backBtn} onClick={onBack}>← Back</button>
          <div style={appStyles.sidebarBrand}>
            <span style={appStyles.sidebarLogo}>◈</span>
            <div>
              <div style={appStyles.sidebarName}>SlotChain</div>
              <div style={appStyles.sidebarNet}>Nero Testnet</div>
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div style={appStyles.walletBox}>
          <div style={appStyles.walletLabel}>Wallet</div>
          <button
            style={{ ...appStyles.connectBtn, ...(connected ? appStyles.connectBtnConnected : {}) }}
            onClick={onConnect}
            disabled={isBusy}
          >
            {isBusy_("connect") ? <Spinner /> : connected ? `◉ ${truncateAddr(walletKey)}` : "◎ Connect MetaMask"}
          </button>
        </div>

        {/* Slot ID — shared across tabs */}
        <div style={appStyles.sidebarField}>
          <label style={appStyles.fieldLabel}>Slot ID</label>
          <input style={appStyles.input} name="id" value={form.id} onChange={setField} placeholder="e.g. slot1" />
          <span style={appStyles.helper}>Max 32 chars · used by all actions</span>
        </div>

        {/* Stat tiles */}
        <div style={appStyles.statTiles}>
          <div style={appStyles.statTile}>
            <span style={appStyles.statTileVal}>{countValue}</span>
            <span style={appStyles.statTileLbl}>Total Slots</span>
          </div>
          <div style={appStyles.statTile}>
            <span style={{ ...appStyles.statTileVal, color: connected ? "#4ade80" : "#f87171" }}>
              {connected ? "Live" : "Off"}
            </span>
            <span style={appStyles.statTileLbl}>Wallet</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={appStyles.main}>
        {/* Tab bar */}
        <div style={appStyles.tabBar}>
          {tabs.map((t) => (
            <button
              key={t.id}
              style={{ ...appStyles.tab, ...(activeTab === t.id ? appStyles.tabActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div style={appStyles.panel}>
          {activeTab === "create" && (
            <CreatePanel form={form} setField={setField} onSubmit={onCreateSlot} isBusy={isBusy_("createSlot")} />
          )}
          {activeTab === "booking" && (
            <BookingPanel form={form} setField={setField}
              onBook={onBookSlot} onCancel={handleCancelBooking}
              onComplete={onCompleteBooking}
              busyBook={isBusy_("bookSlot")} busyCancel={isBusy_("cancelBooking")}
              busyComplete={isBusy_("completeBooking")}
              confirmCancel={confirmCancel} isBusy={isBusy}
            />
          )}
          {activeTab === "query" && (
            <QueryPanel onGetSlot={onGetSlot} onList={onList} onCount={onCount}
              busyGet={isBusy_("getSlot")} busyList={isBusy_("list")} busyCount={isBusy_("count")}
              isBusy={isBusy}
            />
          )}
        </div>

        {/* Output */}
        <div ref={outputRef} style={appStyles.outputWrap}>
          <div style={appStyles.outputBar}>
            <span style={{ ...appStyles.outputDot, background: outputStatus === "success" ? "#4ade80" : outputStatus === "error" ? "#f87171" : "#6b7280" }} />
            OUTPUT STREAM
            {isBusy && <span style={appStyles.outputBusy}>⟳ {busyAction}…</span>}
          </div>
          {output == null ? (
            <div style={appStyles.emptyOutput}>
              <span style={appStyles.emptyIcon}>◈</span>
              <p style={appStyles.emptyText}>Connect your wallet and perform an action to see results here.</p>
            </div>
          ) : outputStatus === "success" && txHash ? (
            <div style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4ade80", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.2rem" }}>✅</span>
                <strong style={{ fontSize: "0.95rem" }}>Transaction Successful!</strong>
              </div>
              <div style={{ fontSize: "0.85rem", color: C.textMuted, marginBottom: "1rem" }}>
                Your transaction has been confirmed on the network.
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href={`https://testnet.neroscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)",
                  color: "#4ade80", padding: "0.5rem 1rem", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem",
                  fontWeight: "bold"
                }}>
                  View on Explorer ↗
                </a>
              </div>
              <pre style={{ ...appStyles.outputPre, color: "#d1fae5", marginTop: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "1rem", border: `1px solid ${C.borderFaint}` }}>
                {output}
              </pre>
            </div>
          ) : (
            <pre style={{ ...appStyles.outputPre, color: outputStatus === "error" ? "#fca5a5" : "#d1fae5" }}>
              {output}
            </pre>
          )}
        </div>
      </main>
    </div>
  );
}

/* ── Sub-panels ── */
function CreatePanel({ form, setField, onSubmit, isBusy }) {
  return (
    <div>
      <div style={appStyles.panelTitle}>Create a Service Slot</div>
      <p style={appStyles.panelSub}>Define a new time slot on-chain. You must be authenticated as the provider.</p>
      <div style={appStyles.formGrid}>
        <Field label="Provider Address" name="provider" value={form.provider} onChange={setField} placeholder="0x…" helper="Your Wallet public key" full />
        <Field label="Service Name" name="serviceName" value={form.serviceName} onChange={setField} />
        <Field label="Price (wei)" name="price" value={form.price} onChange={setField} type="number" helper="1 NERO = 10^18 wei" />
        <Field label="Date (unix ts)" name="date" value={form.date} onChange={setField} type="number" helper="Seconds since epoch" />
        <Field label="Start Time (unix ts)" name="startTime" value={form.startTime} onChange={setField} type="number" />
        <Field label="End Time (unix ts)" name="endTime" value={form.endTime} onChange={setField} type="number" />
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <ActionBtn onClick={onSubmit} busy={isBusy} label="Create Slot" busyLabel="Creating…" primary />
      </div>
    </div>
  );
}

function BookingPanel({ form, setField, onBook, onCancel, onComplete, busyBook, busyCancel, busyComplete, confirmCancel, isBusy }) {
  return (
    <div>
      <div style={appStyles.panelTitle}>Booking Management</div>
      <p style={appStyles.panelSub}>Book, cancel, or mark slots complete. The Slot ID is taken from the sidebar.</p>
      <div style={appStyles.formGrid}>
        <Field label="Customer Address" name="customer" value={form.customer} onChange={setField} placeholder="0x…" helper="Public key of the customer" full />
        <Field label="Provider Address (for complete)" name="provider" value={form.provider} onChange={setField} placeholder="0x…" full />
      </div>
      <div style={{ ...appStyles.btnRow, marginTop: "1.5rem" }}>
        <ActionBtn onClick={onBook}     busy={busyBook}     label="Book Slot"      busyLabel="Booking…"     primary disabled={isBusy} />
        <ActionBtn onClick={onCancel}   busy={busyCancel}   label={confirmCancel ? "Confirm Cancel?" : "Cancel Booking"} busyLabel="Cancelling…" danger  disabled={isBusy} />
        <ActionBtn onClick={onComplete} busy={busyComplete} label="Complete"        busyLabel="Completing…"  disabled={isBusy} />
      </div>
    </div>
  );
}

function QueryPanel({ onGetSlot, onList, onCount, busyGet, busyList, busyCount, isBusy }) {
  return (
    <div>
      <div style={appStyles.panelTitle}>Query the Contract</div>
      <p style={appStyles.panelSub}>Read-only calls — no wallet signature required. The Slot ID is taken from the sidebar.</p>
      <div style={appStyles.btnRow}>
        <ActionBtn onClick={onGetSlot} busy={busyGet}   label="Get Slot"      busyLabel="Fetching…" disabled={isBusy} />
        <ActionBtn onClick={onList}    busy={busyList}   label="List All Slots" busyLabel="Listing…"  disabled={isBusy} />
        <ActionBtn onClick={onCount}   busy={busyCount}  label="Get Count"     busyLabel="Counting…" disabled={isBusy} />
      </div>
    </div>
  );
}

/* ── Reusable atoms ── */
function Field({ label, name, value, onChange, placeholder, helper, type = "text", full }) {
  return (
    <div style={{ ...(full ? { gridColumn: "1 / -1" } : {}) }}>
      <label style={appStyles.fieldLabel}>{label}</label>
      <input style={appStyles.input} name={name} value={value} onChange={onChange} placeholder={placeholder} type={type} />
      {helper && <span style={appStyles.helper}>{helper}</span>}
    </div>
  );
}

function ActionBtn({ onClick, busy, label, busyLabel, primary, danger, disabled }) {
  const base = {
    ...appStyles.btn,
    ...(primary ? appStyles.btnPrimary : danger ? appStyles.btnDanger : appStyles.btnGhost),
    ...(disabled && !busy ? { opacity: 0.45, cursor: "not-allowed" } : {}),
  };
  return (
    <button style={base} onClick={onClick} disabled={disabled}>
      {busy ? <><Spinner />{busyLabel}</> : label}
    </button>
  );
}

function Spinner() {
  return <span style={appStyles.spinner}>⟳ </span>;
}

/* ─────────────────────────────────────────────
   ROOT — toggle between landing & app
   ───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("landing");
  return page === "landing"
    ? <LandingPage onLaunch={() => setPage("app")} />
    : <DApp onBack={() => setPage("landing")} />;
}

/* ═══════════════════════════════════════════
   STYLES — Landing
═══════════════════════════════════════════ */
const C = {
  bg: "#0a0a0f",
  bgCard: "#0f0f1a",
  bgCard2: "#13131f",
  accent: "#7c6af7",
  accentGlow: "rgba(124,106,247,0.25)",
  accentLight: "#a89bff",
  text: "#f0eeff",
  textMuted: "#9b93cc",
  textFaint: "#5a5580",
  border: "rgba(124,106,247,0.18)",
  borderFaint: "rgba(255,255,255,0.06)",
  success: "#4ade80",
  danger: "#f87171",
};

const styles = {
  landing: {
    background: C.bg,
    color: C.text,
    fontFamily: "'DM Sans', 'Outfit', 'Helvetica Neue', sans-serif",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "fixed",
    width: 700,
    height: 700,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,106,247,0.12) 0%, transparent 70%)",
    transform: "translate(-50%,-50%)",
    pointerEvents: "none",
    transition: "left 0.3s ease, top 0.3s ease",
    zIndex: 0,
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(124,106,247,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,106,247,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "48px 48px",
    zIndex: 0,
    pointerEvents: "none",
  },
  nav: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.25rem 2.5rem",
    borderBottom: `1px solid ${C.borderFaint}`,
  },
  navBrand: { display: "flex", alignItems: "center", gap: "0.6rem" },
  navLogo: { fontSize: "1.4rem", color: C.accent },
  navName: { fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em", color: C.text },
  navBadge: {
    fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em",
    background: "rgba(124,106,247,0.15)", color: C.accent,
    border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 7px",
  },
  navLinks: { display: "flex", alignItems: "center", gap: "1.5rem" },
  navLink: { color: C.textMuted, fontSize: "0.88rem", cursor: "pointer", transition: "color 0.2s" },
  navCta: {
    background: C.accent, color: "#fff", border: "none", borderRadius: 8,
    padding: "0.45rem 1.1rem", fontWeight: 700, fontSize: "0.85rem",
    cursor: "pointer", transition: "background 0.2s",
  },
  hero: {
    position: "relative", zIndex: 5,
    maxWidth: 780, margin: "0 auto",
    padding: "6rem 2rem 5rem",
    textAlign: "center",
  },
  heroEyebrow: {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em",
    color: C.accent, textTransform: "uppercase",
    background: "rgba(124,106,247,0.1)", border: `1px solid ${C.border}`,
    borderRadius: 20, padding: "0.3rem 0.9rem", marginBottom: "2rem",
  },
  dot: { width: 6, height: 6, borderRadius: "50%", background: C.success, animation: "pulse 2s infinite" },
  heroH1: {
    fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
    fontWeight: 900, lineHeight: 1.05,
    letterSpacing: "-0.03em",
    marginBottom: "1.5rem",
    color: C.text,
  },
  heroAccent: {
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "1.1rem", color: C.textMuted, lineHeight: 1.7,
    maxWidth: 560, margin: "0 auto 2.5rem",
  },
  heroBtns: { display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "3.5rem", flexWrap: "wrap" },
  heroPrimary: {
    display: "inline-flex", alignItems: "center", gap: "0.5rem",
    background: C.accent, color: "#fff",
    border: "none", borderRadius: 10, padding: "0.75rem 1.75rem",
    fontWeight: 700, fontSize: "1rem", cursor: "pointer",
    boxShadow: `0 0 30px ${C.accentGlow}`,
    transition: "all 0.2s",
  },
  arrowSpan: { display: "inline-block", transition: "transform 0.2s" },
  heroSecondary: {
    background: "transparent", color: C.text,
    border: `1px solid ${C.border}`, borderRadius: 10,
    padding: "0.75rem 1.75rem", fontWeight: 600, fontSize: "1rem",
    cursor: "pointer", transition: "all 0.2s",
  },
  heroStats: {
    display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap",
  },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center" },
  heroStatVal: { fontSize: "1.75rem", fontWeight: 900, color: C.text, letterSpacing: "-0.02em" },
  heroStatLbl: { fontSize: "0.7rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2rem" },

  section: { position: "relative", zIndex: 5, maxWidth: 1000, margin: "0 auto", padding: "5rem 2rem" },
  sectionLabel: {
    fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em",
    color: C.accent, textTransform: "uppercase", marginBottom: "0.75rem",
  },
  sectionH2: {
    fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
    fontWeight: 800, letterSpacing: "-0.025em",
    color: C.text, marginBottom: "3rem", lineHeight: 1.2,
    maxWidth: 560,
  },
  featureGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem",
  },
  featureCard: {
    background: C.bgCard, border: `1px solid ${C.borderFaint}`,
    borderRadius: 14, padding: "1.75rem",
    transition: "border-color 0.2s, transform 0.2s",
  },
  featureIcon: { fontSize: "1.6rem", display: "block", marginBottom: "0.9rem" },
  featureTitle: { fontWeight: 700, fontSize: "0.98rem", color: C.text, marginBottom: "0.5rem" },
  featureDesc: { fontSize: "0.85rem", color: C.textMuted, lineHeight: 1.65 },

  steps: { display: "flex", flexDirection: "column", gap: 0 },
  step: { display: "flex", gap: "1.5rem", alignItems: "flex-start", position: "relative", paddingBottom: "2rem" },
  stepNum: {
    fontSize: "0.7rem", fontWeight: 800, color: C.accent, letterSpacing: "0.1em",
    background: "rgba(124,106,247,0.1)", border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "0.3rem 0.6rem", flexShrink: 0, marginTop: "0.1rem",
  },
  stepLine: {
    position: "absolute", left: 22, top: 32, bottom: 0,
    width: 1, background: `linear-gradient(${C.border}, transparent)`,
  },
  stepBody: {},
  stepTitle: { fontWeight: 700, fontSize: "1rem", color: C.text, marginBottom: "0.35rem" },
  stepDesc: { fontSize: "0.87rem", color: C.textMuted, lineHeight: 1.65 },

  ctaSection: {
    position: "relative", zIndex: 5,
    borderTop: `1px solid ${C.borderFaint}`,
    padding: "6rem 2rem",
    textAlign: "center",
    background: `radial-gradient(ellipse at center, rgba(124,106,247,0.07) 0%, transparent 70%)`,
  },
  ctaInner: { maxWidth: 560, margin: "0 auto" },
  ctaH2: { fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.025em", color: C.text, marginBottom: "1rem" },
  ctaSub: { color: C.textMuted, fontSize: "1rem", lineHeight: 1.65, marginBottom: "2rem" },

  footer: {
    position: "relative", zIndex: 5,
    borderTop: `1px solid ${C.borderFaint}`,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "1.5rem 2.5rem",
  },
  footerBrand: { fontWeight: 800, color: C.accent, fontSize: "0.9rem" },
  footerMeta: { color: C.textFaint, fontSize: "0.75rem" },
};

/* ═══════════════════════════════════════════
   STYLES — DApp
═══════════════════════════════════════════ */
const appStyles = {
  shell: {
    display: "flex", minHeight: "100vh",
    fontFamily: "'DM Sans', 'Outfit', 'Helvetica Neue', sans-serif",
    background: C.bg, color: C.text,
  },
  sidebar: {
    width: 280, flexShrink: 0,
    background: C.bgCard,
    borderRight: `1px solid ${C.borderFaint}`,
    display: "flex", flexDirection: "column",
    padding: "1.5rem", gap: "1.5rem",
  },
  sidebarTop: { display: "flex", flexDirection: "column", gap: "1rem" },
  backBtn: {
    background: "transparent", border: `1px solid ${C.borderFaint}`,
    color: C.textMuted, borderRadius: 7, padding: "0.35rem 0.75rem",
    fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start",
    transition: "all 0.15s",
  },
  sidebarBrand: { display: "flex", alignItems: "center", gap: "0.6rem" },
  sidebarLogo: { fontSize: "1.3rem", color: C.accent },
  sidebarName: { fontWeight: 800, fontSize: "0.98rem", color: C.text },
  sidebarNet: { fontSize: "0.65rem", color: C.textMuted, letterSpacing: "0.06em" },

  walletBox: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  walletLabel: { fontSize: "0.65rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" },
  connectBtn: {
    background: "rgba(124,106,247,0.1)", border: `1px solid ${C.border}`,
    color: C.accent, borderRadius: 8, padding: "0.55rem 0.9rem",
    fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
    textAlign: "left", transition: "all 0.2s",
  },
  connectBtnConnected: {
    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)",
    color: C.success,
  },

  sidebarField: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  fieldLabel: {
    fontSize: "0.65rem", fontWeight: 700, color: C.textMuted,
    textTransform: "uppercase", letterSpacing: "0.1em",
  },
  input: {
    background: C.bgCard2, border: `1px solid ${C.borderFaint}`,
    color: C.text, borderRadius: 8, padding: "0.55rem 0.75rem",
    fontSize: "0.85rem", fontFamily: "inherit", outline: "none",
    transition: "border-color 0.2s",
    width: "100%", boxSizing: "border-box",
  },
  helper: { fontSize: "0.68rem", color: C.textFaint, lineHeight: 1.4 },

  statTiles: { display: "flex", gap: "0.6rem", marginTop: "auto" },
  statTile: {
    flex: 1, background: C.bgCard2, border: `1px solid ${C.borderFaint}`,
    borderRadius: 10, padding: "0.75rem", textAlign: "center",
  },
  statTileVal: { display: "block", fontSize: "1.3rem", fontWeight: 900, color: C.accent },
  statTileLbl: { fontSize: "0.6rem", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" },

  main: {
    flex: 1, display: "flex", flexDirection: "column",
    padding: "0", overflow: "auto",
  },
  tabBar: {
    display: "flex", borderBottom: `1px solid ${C.borderFaint}`,
    background: C.bgCard, padding: "0 1.75rem",
  },
  tab: {
    background: "none", border: "none", color: C.textMuted,
    padding: "1rem 1.1rem", fontWeight: 600, fontSize: "0.85rem",
    cursor: "pointer", borderBottom: "2px solid transparent",
    display: "flex", alignItems: "center", gap: "0.4rem",
    transition: "color 0.15s",
    fontFamily: "inherit",
  },
  tabActive: { color: C.accent, borderBottomColor: C.accent },
  panel: {
    padding: "2rem 2rem 1.5rem",
    borderBottom: `1px solid ${C.borderFaint}`,
    flex: 1,
  },
  panelTitle: { fontSize: "1.1rem", fontWeight: 800, color: C.text, marginBottom: "0.35rem", letterSpacing: "-0.01em" },
  panelSub: { fontSize: "0.83rem", color: C.textMuted, lineHeight: 1.6, marginBottom: "1.75rem" },
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem",
  },
  btnRow: { display: "flex", flexWrap: "wrap", gap: "0.65rem" },
  btn: {
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    borderRadius: 9, padding: "0.55rem 1.2rem",
    fontWeight: 700, fontSize: "0.83rem", cursor: "pointer",
    fontFamily: "inherit", border: "none",
    transition: "all 0.15s",
  },
  btnPrimary: { background: C.accent, color: "#fff", boxShadow: `0 0 20px ${C.accentGlow}` },
  btnDanger: { background: "rgba(248,113,113,0.1)", color: C.danger, border: `1px solid rgba(248,113,113,0.25)` },
  btnGhost: { background: C.bgCard2, color: C.textMuted, border: `1px solid ${C.borderFaint}` },

  outputWrap: {
    margin: "0", background: "#060609",
    borderTop: `1px solid ${C.borderFaint}`,
    minHeight: 180,
  },
  outputBar: {
    display: "flex", alignItems: "center", gap: "0.5rem",
    padding: "0.6rem 1.25rem",
    background: "rgba(0,0,0,0.4)",
    fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em",
    color: C.textFaint, textTransform: "uppercase",
    borderBottom: `1px solid ${C.borderFaint}`,
  },
  outputDot: { width: 7, height: 7, borderRadius: "50%", display: "inline-block" },
  outputBusy: { marginLeft: "auto", color: C.accent, fontSize: "0.7rem", letterSpacing: "0.05em" },
  outputPre: {
    margin: 0, padding: "1.25rem 1.5rem",
    fontFamily: "'Fira Code', 'Consolas', monospace",
    fontSize: "0.82rem", lineHeight: 1.65,
    whiteSpace: "pre-wrap", wordBreak: "break-all",
  },
  emptyOutput: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: 160, gap: "0.6rem",
    color: C.textFaint,
  },
  emptyIcon: { fontSize: "1.6rem", opacity: 0.3 },
  emptyText: { fontSize: "0.82rem", lineHeight: 1.5, textAlign: "center", maxWidth: 280 },

  spinner: { display: "inline-block", animation: "spin 0.7s linear infinite" },
};