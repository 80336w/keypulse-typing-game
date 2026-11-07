import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { categories, difficulties, featureCards, keyboardRows, practiceTexts } from "./data.js";

const navItems = [
  { id: "home", label: "首页" },
  { id: "beginner", label: "指法入门" },
  { id: "practice", label: "专项练习" },
  { id: "speed", label: "测速挑战" },
  { id: "battle", label: "联机 PK" },
  { id: "leaderboard", label: "排行榜" },
];

const pageTitles = {
  home: "练习面板",
  beginner: "指法入门",
  practice: "专项练习",
  speed: "测速挑战",
  battle: "联机 PK",
  leaderboard: "排行榜",
};

function getRandomText(categoryId, difficultyId, previousText = "") {
  const matching = practiceTexts.filter(
    (item) => item.category === categoryId && item.difficulty === difficultyId,
  );
  const pool = matching.length
    ? matching
    : practiceTexts.filter((item) => item.category === categoryId);
  const choices = pool.filter((item) => item.text !== previousText);
  return (choices.length ? choices : pool)[Math.floor(Math.random() * (choices.length || pool.length))]?.text
    ?? "Practice makes progress.";
}

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function getFingerClass(key) {
  if ("QWERTASDFGZXCVB".includes(key)) return "finger-left";
  if ("YUIOPHJKLNM".includes(key)) return "finger-right";
  return "";
}

export default function App() {
  const [activePage, setActivePage] = useState("home");
  const [category, setCategory] = useState(categories[0].id);
  const [difficulty, setDifficulty] = useState(difficulties[0].id);
  const [duration, setDuration] = useState(60);
  const [targetText, setTargetText] = useState(() => getRandomText(categories[0].id, difficulties[0].id));
  const [typedText, setTypedText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [status, setStatus] = useState("idle");
  const [showHint, setShowHint] = useState(true);
  const [blindMode, setBlindMode] = useState(false);

  const activeCategory = categories.find((item) => item.id === category) ?? categories[0];
  const targetCharacters = useMemo(() => [...targetText], [targetText]);
  const typedCharacters = useMemo(() => [...typedText], [typedText]);
  const correctCount = typedCharacters.reduce(
    (count, character, index) => count + (character === targetCharacters[index] ? 1 : 0),
    0,
  );
  const accuracy = typedText.length ? Math.round((correctCount / typedText.length) * 100) : 100;
  const elapsedSeconds = duration - secondsLeft;
  const wpm = elapsedSeconds > 0 ? Math.round(correctCount / 5 / (elapsedSeconds / 60)) : 0;
  const progress = targetText.length ? Math.min(100, Math.round((typedText.length / targetText.length) * 100)) : 0;
  const currentCharacter = targetCharacters[typedCharacters.length] ?? "";

  useEffect(() => {
    if (status !== "running") return undefined;
    const timerId = window.setInterval(() => {
      setSecondsLeft((remaining) => {
        if (remaining <= 1) {
          window.clearInterval(timerId);
          setStatus("done");
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [status]);

  function resetPractice(options = {}) {
    const nextCategory = options.category ?? category;
    const nextDifficulty = options.difficulty ?? difficulty;
    const nextDuration = options.duration ?? duration;
    setCategory(nextCategory);
    setDifficulty(nextDifficulty);
    setDuration(nextDuration);
    setSecondsLeft(nextDuration);
    setTypedText("");
    setStatus("idle");
    setTargetText((previous) => getRandomText(nextCategory, nextDifficulty, previous));
  }

  function handleTyping(event) {
    if (status === "done") return;
    const nextValue = event.target.value.slice(0, targetText.length);
    setTypedText(nextValue);
    if (nextValue.length > 0 && status === "idle") setStatus("running");
    if (nextValue.length >= targetText.length) setStatus("done");
  }

  function handleNavigation(pageId) {
    setActivePage(pageId);
    if (pageId === "speed") resetPractice({ duration: 60 });
    if (pageId === "beginner") resetPractice({ category: "english", difficulty: "beginner" });
  }

  function renderTypingPractice() {
    return (
      <div className="practice-layout">
        <section className="panel practice-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">{activeCategory.label}</span><h2>{pageTitles[activePage] ?? "开始练习"}</h2></div>
            <span className={`status-pill status-${status}`}>{status === "running" ? "练习中" : status === "done" ? "已完成" : "准备就绪"}</span>
          </div>
          <div className="practice-controls">
            <label><span>练习类型</span><select value={category} onChange={(event) => resetPractice({ category: event.target.value })}>{categories.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
            <label><span>难度</span><select value={difficulty} onChange={(event) => resetPractice({ difficulty: event.target.value })}>{difficulties.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
            <label><span>时长</span><select value={duration} onChange={(event) => resetPractice({ duration: Number(event.target.value) })}><option value={60}>1 分钟</option><option value={180}>3 分钟</option><option value={300}>5 分钟</option></select></label>
          </div>
          <div className="typing-card">
            <div className="typing-card-top"><span>输入下方文本开始练习</span><span className="timer">{formatTime(secondsLeft)}</span></div>
            <div className={`prompt-text ${blindMode ? "is-blind" : ""}`}>
              {targetCharacters.map((character, index) => {
                let className = "prompt-character";
                if (index < typedCharacters.length) className += typedCharacters[index] === character ? " is-correct" : " is-wrong";
                else if (index === typedCharacters.length) className += " is-current";
                return <span className={className} key={`${index}-${character}`}>{character === " " ? "\u00a0" : character}</span>;
              })}
            </div>
            <textarea aria-label="打字练习输入框" className="typing-input" placeholder="点击这里，然后开始打字……" value={typedText} onChange={handleTyping} disabled={status === "done"} spellCheck="false" autoCapitalize="off" autoComplete="off" autoCorrect="off" />
            <div className="progress-row"><span>练习进度</span><span>{progress}%</span></div>
            <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
            {status === "done" && <div className="result-banner"><strong>本轮完成！</strong><span>{wpm} WPM · 准确率 {accuracy}%</span></div>}
            <div className="typing-actions">
              <button className="button button-primary" onClick={() => resetPractice()}>{status === "idle" ? "换一段文本" : "重新开始"}</button>
              <button className="button button-secondary" onClick={() => setShowHint((value) => !value)}>{showHint ? "隐藏提示" : "显示提示"}</button>
              <button className={`button button-secondary ${blindMode ? "selected" : ""}`} onClick={() => setBlindMode((value) => !value)}>{blindMode ? "关闭盲打" : "盲打模式"}</button>
            </div>
            {showHint && <p className="practice-hint">正确字符显示为青色，错误字符显示为红色。WPM 按每 5 个正确字符折算为一个单词计算。</p>}
          </div>
          {!blindMode && <div className="keyboard-wrap">
            <div className="keyboard-heading"><span>虚拟键盘</span><span className="finger-legend"><i className="legend-dot left-dot" />左手<i className="legend-dot right-dot" />右手</span></div>
            <div className="virtual-keyboard">
              {keyboardRows.map((row, rowIndex) => <div className="keyboard-row" key={`row-${rowIndex}`}>{row.map((key) => <div className={`keyboard-key ${getFingerClass(key)} ${currentCharacter.toUpperCase() === key ? "key-active" : ""}`} key={key}>{key}</div>)}</div>)}
              <div className="keyboard-row"><div className={`keyboard-key space-key ${currentCharacter === " " ? "key-active" : ""}`}>SPACE</div></div>
            </div>
          </div>}
        </section>
        <aside className="side-column">
          <section className="panel stats-panel"><div className="panel-heading compact-heading"><div><span className="eyebrow">实时数据</span><h2>本轮表现</h2></div></div>
            <div className="stats-grid"><div className="stat-card"><span>当前速度</span><strong>{wpm}</strong><small>WPM</small></div><div className="stat-card"><span>准确率</span><strong>{accuracy}%</strong><small>实时统计</small></div><div className="stat-card"><span>正确字符</span><strong>{correctCount}</strong><small>本轮累计</small></div><div className="stat-card"><span>剩余时间</span><strong>{formatTime(secondsLeft)}</strong><small>倒计时</small></div></div>
          </section>
          <section className="panel goal-panel"><span className="eyebrow">今日目标</span><h2>保持练习节奏</h2><p>每天几分钟，也能逐步建立稳定的输入手感。</p><div className="goal-progress"><div className="goal-progress-top"><span>今日练习</span><strong>1 / 3 组</strong></div><div className="progress-track"><span style={{ width: "34%" }} /></div></div><button className="button button-primary button-full" onClick={() => handleNavigation("speed")}>开始测速挑战</button></section>
        </aside>
      </div>
    );
  }

  function renderPageContent() {
    if (["home", "beginner", "practice", "speed"].includes(activePage)) return renderTypingPractice();
    if (activePage === "battle") return <section className="panel feature-page"><span className="eyebrow">多人竞技 · 前端演示</span><h2>准备好和朋友来一场 PK 了吗？</h2><p>这里可以扩展实时匹配、私人房间和赛季段位。接入 WebSocket 服务后即可实现多人同步对战。</p><div className="battle-preview"><div className="battle-player"><span className="player-avatar">你</span><strong>练习者</strong><small>等待匹配</small></div><div className="battle-vs">VS</div><div className="battle-player"><span className="player-avatar opponent">?</span><strong>等待对手</strong><small>同水平匹配</small></div></div><button className="button button-primary" onClick={() => window.alert("这是前端演示界面，联机匹配需要接入实时服务。")}>开始匹配</button></section>;
    return <section className="panel feature-page"><span className="eyebrow">本周榜单 · 示例数据</span><h2>排行榜</h2><p>练习成绩将在此展示。当前榜单为页面示例数据。</p><div className="leaderboard">{[["01", "KeyMaster", "128 WPM", "98%"], ["02", "小小打字家", "112 WPM", "97%"], ["03", "CodeRunner", "106 WPM", "96%"], ["04", "你", `${wpm} WPM`, `${accuracy}%`]].map(([rank, name, speed, accuracyValue]) => <div className="leaderboard-row" key={rank}><span className="rank-number">{rank}</span><strong>{name}</strong><span>{speed}</span><span className="leaderboard-accuracy">{accuracyValue}</span></div>)}</div></section>;
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" onClick={() => handleNavigation("home")} aria-label="KeyPulse 首页"><span className="brand-mark">K</span><span>KeyPulse</span></a>
      <nav className="main-nav" aria-label="主导航">{navItems.map((item) => <button className={activePage === item.id ? "nav-link active" : "nav-link"} key={item.id} onClick={() => handleNavigation(item.id)}>{item.label}</button>)}</nav>
      <div className="header-actions"><button className="login-button" onClick={() => window.alert("登录功能可在项目中接入账号服务。")}>登录</button><button className="avatar-button" aria-label="个人中心" onClick={() => handleNavigation("leaderboard")}>K</button><button className="settings-button" aria-label="设置" onClick={() => setShowHint((value) => !value)}>⚙</button></div>
    </header>
    <main id="top">
      <section className="hero-section"><div className="hero-copy"><span className="hero-badge"><span className="live-dot" />从练习到进阶，每次击键都有进步</span><h1>找到你的<br /><span>打字节奏。</span></h1><p>通过循序渐进的练习、即时反馈和清晰的数据复盘，让打字变得更快、更准，也更有趣。</p><div className="hero-actions"><button className="button button-primary" onClick={() => handleNavigation("beginner")}>开始练习 <span aria-hidden="true">→</span></button><button className="button button-secondary" onClick={() => handleNavigation("speed")}>快速测速</button></div><div className="hero-trust"><div className="trust-avatars" aria-hidden="true"><span>小</span><span>K</span><span>码</span></div><span>免费开始 · 无需注册 · 随时练习</span></div></div>
        <div className="hero-preview"><div className="preview-glow" /><div className="preview-window"><div className="preview-top"><div className="window-dots"><i /><i /><i /></div><span>实时打字训练</span><span className="preview-live">● LIVE</span></div><div className="preview-text"><span>Every small step</span><br /><span className="preview-highlight">builds a better rhythm.</span><span className="cursor" /></div><div className="preview-keyboard" aria-hidden="true">{["A", "S", "D", "F", "J", "K", "L"].map((key, index) => <span className={index === 3 ? "preview-key active" : "preview-key"} key={key}>{key}</span>)}</div><div className="preview-stats"><div><span>速度</span><strong>72 <small>WPM</small></strong></div><div><span>准确率</span><strong>98.6<small>%</small></strong></div><div className="preview-streak"><span>连击</span><strong>24 <small>次</small></strong></div></div></div><div className="floating-chip chip-one">✦ 稳步提升</div><div className="floating-chip chip-two">准确率 98%</div></div>
      </section>
      <section className="feature-strip" aria-label="产品特色">{featureCards.map((card) => <article className="feature-card" key={card.title}><span className="feature-icon">{card.icon}</span><div><h3>{card.title}</h3><p>{card.description}</p></div></article>)}</section>
      <section className="workspace-section"><div className="section-title-row"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>{pageTitles[activePage]}</h2></div><span className="guest-badge">游客模式 · 进度保存在当前页面</span></div>{renderPageContent()}</section>
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#top" onClick={() => handleNavigation("home")}><span className="brand-mark">K</span><span>KeyPulse</span></a><span>© 2026 KeyPulse. 让每一次击键都更有力量。</span><div className="footer-links"><a href="#help">帮助中心</a><a href="#privacy">隐私政策</a><a href="mailto:hello@keypulse.example">联系我们</a></div></footer>
  </div>;
}
