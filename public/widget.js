(function () {
  const script = document.currentScript;
  const botId = script?.getAttribute("data-bot"); // Can be bot id or publicKey (atlas_xxx)
  const baseUrl = script?.getAttribute("data-base") || (script?.src ? new URL(script.src).origin : window.location.origin);

  if (!botId) return;

  let isOpen = false;
  let chatId = null;
  let quickPromptsList = [];
  const visitorId = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);

  const style = document.createElement("style");
  style.textContent = `
    .atlas-widget { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .atlas-bubble { position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #1a6aff 0%, #0d5aeb 100%); color: white; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(26, 106, 255, 0.4); display: flex; align-items: center; justify-content: center; z-index: 999998; transition: transform 0.2s; }
    @media (min-width: 420px) { .atlas-bubble { bottom: 24px; right: 24px; } }
    .atlas-bubble:hover { transform: scale(1.05); }
    .atlas-bubble svg { width: 34px; height: 34px; }
    .atlas-panel { position: fixed; bottom: 80px; right: 16px; left: 16px; width: auto; max-width: 475px; height: 87.5vh; max-height: 650px; margin-left: auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: flex; flex-direction: column; z-index: 999999; overflow: hidden; }
    @media (max-width: 419px) {
      .atlas-panel { bottom: calc(76px + env(safe-area-inset-bottom, 0)); left: 8px; right: 8px; height: calc(100vh - 96px - env(safe-area-inset-bottom, 0) - env(safe-area-inset-top, 0)); max-height: none; }
      .atlas-bubble { bottom: calc(20px + env(safe-area-inset-bottom, 0)); right: 16px; }
    }
    @media (min-width: 420px) { .atlas-panel { left: auto; right: 24px; width: 475px; } }
    .atlas-header { padding: 16px; background: linear-gradient(135deg, #1a6aff 0%, #0d5aeb 100%); color: white; font-weight: 600; font-size: 16px; }
    .atlas-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .atlas-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 14px; line-height: 1.5; white-space: pre-line; }
    .atlas-msg.user { align-self: flex-end; background: linear-gradient(135deg, #1a6aff 0%, #0d5aeb 100%); color: white; }
    .atlas-msg.assistant { align-self: flex-start; background: #f1f5f9; color: #0f172a; }
    .atlas-msg.loading { opacity: 0.7; }
    .atlas-input-wrap { padding: 12px 16px; border-top: 1px solid #e4e4e7; display: flex; gap: 8px; }
    .atlas-input { flex: 1; padding: 10px 14px; border: 1px solid #e4e4e7; border-radius: 10px; font-size: 14px; outline: none; }
    .atlas-input:focus { border-color: #18181b; }
.atlas-send { padding: 10px 16px; background: linear-gradient(135deg, #1a6aff 0%, #0d5aeb 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; }
.atlas-send:hover { opacity: 0.9; }
    .atlas-send:disabled { opacity: 0.5; cursor: not-allowed; }
    .atlas-lead-form { margin-top: 8px; padding: 12px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .atlas-lead-form input { width: 100%; padding: 8px 12px; margin-bottom: 8px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; }
    .atlas-lead-form button { width: 100%; padding: 8px 12px; background: #1a6aff; color: white; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; }
    .atlas-lead-form button:hover { opacity: 0.9; }
    .atlas-lead-form p { margin: 0 0 8px; font-size: 12px; color: #64748b; }
    .atlas-quick-prompts-wrap { align-self: flex-start; width: 100%; margin-top: 4px; }
    .atlas-quick-prompts { display: flex; flex-direction: row; flex-wrap: wrap; gap: 8px; }
    .atlas-quick-prompt { flex: 0 0 auto; padding: 8px 12px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1a6aff; cursor: pointer; transition: all 0.15s; max-width: 100%; }
    .atlas-quick-prompt:hover { background: #e8f0fe; border-color: #1a6aff; }
    .atlas-branding { padding: 8px 16px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
  `;
  document.head.appendChild(style);

  // Brand icon: bot head + chat bubble (white on blue button)
  const chatIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="12" height="12" rx="3" stroke="white" stroke-width="1.5" fill="none"/><path stroke="white" stroke-width="1.5" stroke-linecap="round" d="M7 2V0.5M13 2V0.5"/><circle cx="8" cy="7" r="1.25" fill="white"/><circle cx="12" cy="7" r="1.25" fill="white"/><path d="M8 10.5h4" stroke="white" stroke-width="1" stroke-linecap="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15 6h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1.5l-1.5 2-1.5-2H15a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="white"/></svg>';
  const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
  const bubble = document.createElement("button");
  bubble.className = "atlas-widget atlas-bubble";
  bubble.innerHTML = chatIcon;
  bubble.setAttribute("aria-label", "Open chat");

  const panel = document.createElement("div");
  panel.className = "atlas-widget atlas-panel";
  panel.style.display = "none";
  panel.innerHTML = `
    <div class="atlas-header">Chat</div>
    <div class="atlas-messages"></div>
    <div class="atlas-input-wrap">
      <input type="text" class="atlas-input" placeholder="Ask a question..." />
      <button class="atlas-send">Send</button>
    </div>
    <div class="atlas-branding" style="display:none;">Powered by SiteBotGPT</div>
  `;

  const messagesEl = panel.querySelector(".atlas-messages");
  const inputEl = panel.querySelector(".atlas-input");
  const sendBtn = panel.querySelector(".atlas-send");

  function addMessage(content, role, isLoading) {
    const div = document.createElement("div");
    div.className = "atlas-msg " + role + (isLoading ? " loading" : "");
    div.textContent = content;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showLeadForm() {
    const existing = panel.querySelector(".atlas-lead-form-wrap");
    if (existing) return;
    const wrap = document.createElement("div");
    wrap.className = "atlas-lead-form-wrap";
    wrap.innerHTML = '<div class="atlas-msg assistant"><div class="atlas-lead-form"><p>Leave your details and we\'ll get back to you.</p><input type="email" placeholder="Your email" class="atlas-lead-email" required /><input type="text" placeholder="Name (optional)" class="atlas-lead-name" /><input type="tel" placeholder="Mobile (optional)" class="atlas-lead-phone" /><button type="button" class="atlas-lead-submit">Submit</button></div></div>';
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    wrap.querySelector(".atlas-lead-submit").addEventListener("click", function () {
      const email = wrap.querySelector(".atlas-lead-email").value.trim();
      if (!email) return;
      const name = wrap.querySelector(".atlas-lead-name").value.trim();
      const phone = wrap.querySelector(".atlas-lead-phone").value.trim();
      this.disabled = true;
      fetch(baseUrl + "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, email, name: name || undefined, phone: phone || undefined, pageUrl: window.location.href }),
      })
        .then((r) => r.json())
        .then(function (data) {
          wrap.remove();
          addMessage("Thanks! We'll get back to you soon.", "assistant");
        })
        .catch(function () {
          this.disabled = false;
          addMessage("Could not submit. Please try again.", "assistant");
        }.bind(this));
    });
  }

  function addQuickPrompts(prompts, excludeText) {
    var list = Array.isArray(prompts) ? (excludeText ? prompts.filter(function (p) { return p !== excludeText; }) : prompts) : [];
    if (list.length === 0) return;
    const wrap = document.createElement("div");
    wrap.className = "atlas-quick-prompts-wrap";
    const container = document.createElement("div");
    container.className = "atlas-quick-prompts";
    list.forEach(function (q) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "atlas-quick-prompt";
      btn.textContent = q;
      btn.addEventListener("click", function () {
        wrap.remove();
        sendMessage(q, q);
      });
      container.appendChild(btn);
    });
    wrap.appendChild(container);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addGreeting() {
    addMessage("Loading...", "assistant", true);
    var defaultPrompts = ["What do you offer?", "How can I contact you?", "Tell me about your services", "What are your hours?"];
    fetch(baseUrl + "/api/embed/info?botId=" + encodeURIComponent(botId))
      .then((r) => r.json())
      .then((data) => {
        const last = messagesEl.lastElementChild;
        if (last) last.remove();
        addMessage(data.greeting || "Hi! How can I help you today?", "assistant");
        quickPromptsList = data.quickPrompts && Array.isArray(data.quickPrompts) ? data.quickPrompts : defaultPrompts;
        addQuickPrompts(quickPromptsList);
        var brandingEl = panel.querySelector(".atlas-branding");
        if (brandingEl) brandingEl.style.display = data.hideBranding ? "none" : "block";
      })
      .catch(() => {
        const last = messagesEl.lastElementChild;
        if (last) last.remove();
        addMessage("Hi! How can I help you today?", "assistant");
        quickPromptsList = defaultPrompts;
        addQuickPrompts(quickPromptsList);
        var brandingEl = panel.querySelector(".atlas-branding");
        if (brandingEl) brandingEl.style.display = "block";
      });
  }

  function sendMessage(text, clickedQuickPrompt) {
    if (!text.trim()) return;
    addMessage(text.trim(), "user");
    inputEl.value = "";
    sendBtn.disabled = true;

    const loadingEl = document.createElement("div");
    loadingEl.className = "atlas-msg assistant loading";
    loadingEl.textContent = "...";
    messagesEl.appendChild(loadingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    fetch(baseUrl + "/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Bot-Key": botId,
        "X-Visitor-Id": visitorId,
        "X-Page-Url": window.location.href,
      },
      body: JSON.stringify({
        botId,
        message: text.trim(),
        chatId,
        history: [],
      }),
    })
      .then((r) => r.json().then(d => ({ status: r.status, data: d })))
      .then(function(result) {
        loadingEl.remove();
        if (result.status === 402 && result.data.quotaExceeded) {
          addMessage("⚠️ This bot has reached its daily message limit. Please contact the site owner or try again tomorrow.", "assistant");
        } else if (result.data.error) {
          var msg = result.data.error && result.data.error.length < 200 ? result.data.error : "Sorry, something went wrong. Please try again.";
          addMessage(msg, "assistant");
        } else {
          chatId = result.data.chatId;
          addMessage(result.data.response, "assistant");
          if (result.data.shouldCaptureLead) {
            showLeadForm();
          }
          if (clickedQuickPrompt && quickPromptsList.length > 0) {
            addQuickPrompts(quickPromptsList, clickedQuickPrompt);
          }
        }
      })
      .catch(() => {
        loadingEl.remove();
        addMessage("Sorry, something went wrong. Please try again.", "assistant");
      })
      .finally(() => {
        sendBtn.disabled = false;
      });
  }

  bubble.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.style.display = isOpen ? "flex" : "none";
    bubble.innerHTML = isOpen ? closeIcon : chatIcon;
    bubble.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat");
    if (isOpen && messagesEl.children.length === 0) addGreeting();
  });

  sendBtn.addEventListener("click", () => sendMessage(inputEl.value));
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(inputEl.value);
  });

  document.body.appendChild(bubble);
  document.body.appendChild(panel);
})();
