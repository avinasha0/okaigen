(function () {
  const script = document.currentScript;
  const botId = script?.getAttribute("data-bot"); // Can be bot id or publicKey (atlas_xxx)
  let baseUrl = script?.getAttribute("data-base") || (script?.src ? new URL(script.src).origin : window.location.origin);
  // Use same-origin (relative) when page is on same site as API to avoid CORS (e.g. www vs non-www)
  function normalizedHost(url) {
    try {
      var u = typeof url === "string" ? new URL(url.indexOf("//") === -1 ? "https://" + url : url) : url;
      var h = u.hostname || "";
      return h.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  }
  var pageHost = normalizedHost(window.location.origin);
  var apiHost = baseUrl ? normalizedHost(baseUrl) : pageHost;
  if (pageHost && apiHost && pageHost === apiHost) {
    baseUrl = "";
  }

  if (!botId) return;

  let isOpen = false;
  let chatId = null;
  let quickPromptsList = [];
  let answeredPrompts = []; // Track which prompts have been answered
  const visitorId = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes atlas-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .atlas-widget { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .atlas-bubble { position: fixed; bottom: 20px; right: 20px; width: 112px; height: 112px; border-radius: 0; background: transparent; color: #0f172a; border: none; cursor: pointer; box-shadow: none; display: flex; align-items: center; justify-content: center; z-index: 999998; transition: transform 0.2s; padding: 0; animation: atlas-float 2.5s ease-in-out infinite; }
    .atlas-bubble:hover { animation: none; transform: scale(1.05); }
    .atlas-bubble svg { width: 28px; height: 28px; stroke: #0f172a; }
    .atlas-bubble .atlas-bubble-icon { width: 112px; height: 112px; object-fit: contain; display: block; }
    .atlas-panel { position: fixed; top: 80px; bottom: 140px; right: 16px; left: 16px; width: auto; max-width: 475px; height: auto; max-height: none; margin-left: auto; background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); display: flex; flex-direction: column; z-index: 999999; overflow: hidden; }
    @media (max-width: 419px) {
      .atlas-panel { top: 80px; bottom: calc(140px + env(safe-area-inset-bottom, 0)); left: 8px; right: 8px; height: auto; max-height: none; }
      .atlas-bubble { bottom: calc(20px + env(safe-area-inset-bottom, 0)); right: 16px; }
    }
    @media (min-width: 420px) { .atlas-panel { left: auto; right: 24px; width: 475px; } }
    .atlas-header { padding: 16px; background: linear-gradient(135deg, #1a6aff 0%, #0d5aeb 100%); color: white; font-weight: 600; font-size: 16px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
    .atlas-header-top { display: flex; align-items: center; gap: 10px; }
    .atlas-header-icon { width: 24px; height: 24px; object-fit: contain; flex-shrink: 0; }
    .atlas-header-favicon { width: 24px; height: 24px; object-fit: contain; }
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

  // Bubble button: favicon when closed, X when open
  const chatIconHtml = '<img src="' + (baseUrl || window.location.origin).replace(/\/$/, "") + '/widget-icon.jpg" alt="" class="atlas-bubble-icon" />';
  const closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
  const bubble = document.createElement("button");
  bubble.className = "atlas-widget atlas-bubble";
  bubble.innerHTML = chatIconHtml;
  bubble.setAttribute("aria-label", "Open chat");

  const panel = document.createElement("div");
  panel.className = "atlas-widget atlas-panel";
  panel.style.display = "none";
  panel.innerHTML = `
    <div class="atlas-header">
      <div class="atlas-header-top">SiteBotGPT Helper</div>
    </div>
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
    return div;
  }

  function addStreamingMessage() {
    const div = document.createElement("div");
    div.className = "atlas-msg assistant";
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function typeText(element, text, speed = 15) {
    if (!text) return null;
    let index = 0;
    const timer = setInterval(function() {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        // Auto-scroll to bottom
        messagesEl.scrollTop = messagesEl.scrollHeight;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return timer;
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
        body: JSON.stringify({ botId, chatId: chatId || undefined, email, name: name || undefined, phone: phone || undefined, pageUrl: window.location.href }),
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
    // Remove any existing quick prompts wrapper to avoid duplicates
    var existingWraps = messagesEl.querySelectorAll(".atlas-quick-prompts-wrap");
    existingWraps.forEach(function(w) { w.remove(); });
    
    // Filter out prompts that have already been answered
    var list = Array.isArray(prompts) ? prompts.filter(function (p) {
      // Exclude the current prompt being clicked
      if (excludeText && p === excludeText) return false;
      // Exclude prompts that have already been answered
      return answeredPrompts.indexOf(p) === -1;
    }) : [];
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
        // Mark this prompt as answered
        if (answeredPrompts.indexOf(q) === -1) {
          answeredPrompts.push(q);
        }
        sendMessage(q, q);
      });
      container.appendChild(btn);
    });
    wrap.appendChild(container);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addGreeting() {
    var loadingDiv = document.createElement("div");
    loadingDiv.className = "atlas-msg assistant loading";
    loadingDiv.textContent = "Loading...";
    messagesEl.appendChild(loadingDiv);
    var defaultPrompts = ["What do you offer?", "How can I contact you?", "Tell me about your services", "What are your hours?"];
    var embedUrl = (baseUrl || window.location.origin).replace(/\/$/, "") + "/api/embed/info?botId=" + encodeURIComponent(botId);
    fetch(embedUrl)
      .then((r) => r.json())
      .then((data) => {
        if (loadingDiv.parentNode) loadingDiv.remove();
        addMessage(data.greeting || "Hi! How can I help you today?", "assistant");
        quickPromptsList = data.quickPrompts && Array.isArray(data.quickPrompts) ? data.quickPrompts : defaultPrompts;
        addQuickPrompts(quickPromptsList);
        var headerTop = panel.querySelector(".atlas-header-top");
        if (headerTop) headerTop.textContent = data.headerTitle || "SiteBotGPT Helper";
        var brandingEl = panel.querySelector(".atlas-branding");
        if (brandingEl) {
          brandingEl.style.display = data.hideBranding ? "none" : "block";
          brandingEl.textContent = "Powered by " + (data.brandingName || "SiteBotGPT");
        }
      })
      .catch(function () {
        if (loadingDiv.parentNode) loadingDiv.remove();
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

    var chatUrl = (baseUrl || window.location.origin).replace(/\/$/, "") + "/api/chat";
    
    // Use streaming by default for better UX
    fetch(chatUrl, {
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
        stream: true, // Enable streaming
      }),
    })
      .then(function (r) {
        if (!r.ok) {
          return r.text().then(function (text) {
            var data;
            try {
              data = text ? JSON.parse(text) : {};
            } catch (e) {
              data = { error: "Server error" };
            }
            return { status: r.status, data: data, stream: false };
          });
        }

        // Check if response is streaming (text/event-stream)
        const contentType = r.headers.get("content-type") || "";
        if (contentType.includes("text/event-stream")) {
          return { status: r.status, stream: true, reader: r.body.getReader() };
        }

        // Fallback to non-streaming
        return r.text().then(function (text) {
          var data;
          try {
            data = text ? JSON.parse(text) : {};
          } catch (e) {
            data = { error: r.ok ? "Invalid response" : "Server error" };
          }
          return { status: r.status, data: data, stream: false };
        });
      })
      .then(function (result) {
        if (loadingEl.parentNode) loadingEl.remove();

        if (result.stream && result.reader) {
          // Handle streaming response
          const decoder = new TextDecoder();
          const streamingMsgEl = addStreamingMessage();
          let buffer = "";
          let fullResponse = "";
          let metadata = null;

          function processStream() {
            result.reader.read().then(function (chunk) {
              if (chunk.done) {
                if (metadata) {
                  chatId = metadata.chatId || chatId;
                  if (metadata.shouldCaptureLead) {
                    showLeadForm();
                  }
                  // Show remaining prompts after each answer if there are unanswered prompts
                  if (quickPromptsList.length > 0 && answeredPrompts.length < quickPromptsList.length) {
                    // Small delay to ensure answer is fully displayed
                    setTimeout(function() {
                      addQuickPrompts(quickPromptsList);
                    }, 500);
                  }
                }
                sendBtn.disabled = false;
                return;
              }

              buffer += decoder.decode(chunk.value, { stream: true });
              const lines = buffer.split("\n\n");
              buffer = lines.pop() || "";

              for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line.startsWith("data: ")) {
                  try {
                    var data = JSON.parse(line.slice(6));
                    if (data.done) {
                      metadata = data;
                    } else if (data.chunk && typeof data.chunk === "string") {
                      fullResponse += data.chunk;
                      // Append chunk directly for real-time streaming effect (like ChatGPT)
                      // This creates a natural letter-by-letter appearance as chunks arrive
                      streamingMsgEl.textContent += data.chunk;
                      messagesEl.scrollTop = messagesEl.scrollHeight;
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                }
              }

              processStream();
            }).catch(function (err) {
              if (streamingMsgEl.parentNode) {
                var msg = "Sorry, something went wrong. Please try again.";
                if (err && err.message && err.message.indexOf("Failed to fetch") !== -1) {
                  msg = "Network error. Please check your connection and try again.";
                }
                streamingMsgEl.textContent = msg;
              }
              sendBtn.disabled = false;
            });
          }

          processStream();
        } else {
          // Handle non-streaming response (fallback)
          if (result.status === 402 && result.data.quotaExceeded) {
            addMessage("⚠️ This bot has reached its daily message limit. Please contact the site owner or try again tomorrow.", "assistant");
          } else if (result.data.error) {
            var errMsg = typeof result.data.error === "string" ? result.data.error : "Sorry, something went wrong. Please try again.";
            if (errMsg.length > 300) errMsg = "Sorry, something went wrong. Please try again.";
            addMessage(errMsg, "assistant");
          } else if (result.data.response != null) {
            chatId = result.data.chatId;
            const msgEl = addMessage("", "assistant");
            // Type out the response character by character
            typeText(msgEl, result.data.response, 15);
            if (result.data.shouldCaptureLead) {
              setTimeout(function() {
                showLeadForm();
              }, result.data.response.length * 15 + 500);
            }
            // Show remaining prompts after each answer if there are unanswered prompts
            if (quickPromptsList.length > 0 && answeredPrompts.length < quickPromptsList.length) {
              setTimeout(function() {
                addQuickPrompts(quickPromptsList);
              }, result.data.response.length * 15 + 500);
            }
          } else {
            addMessage("Sorry, something went wrong. Please try again.", "assistant");
          }
          sendBtn.disabled = false;
        }
      })
      .catch(function (err) {
        if (loadingEl.parentNode) loadingEl.remove();
        var msg = "Sorry, something went wrong. Please try again.";
        if (err && err.message && err.message.indexOf("Failed to fetch") !== -1) {
          msg = "Network error. Please check your connection and try again.";
        }
        addMessage(msg, "assistant");
        sendBtn.disabled = false;
      });
  }

  bubble.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.style.display = isOpen ? "flex" : "none";
    bubble.innerHTML = isOpen ? closeIcon : chatIconHtml;
    bubble.setAttribute("aria-label", isOpen ? "Close chat" : "Open chat");
    if (isOpen && messagesEl.children.length === 0) {
      // Reset answered prompts when opening fresh chat
      answeredPrompts = [];
      addGreeting();
    }
  });

  // Allow external triggers (e.g. demo page chips) to open and send a message
  window.addEventListener("sitebotgpt-send", function (e) {
    if (!e.detail || e.detail.botId !== botId || !e.detail.text || !e.detail.text.trim()) return;
    var textToSend = e.detail.text.trim();
    if (!isOpen) {
      isOpen = true;
      panel.style.display = "flex";
      bubble.innerHTML = closeIcon;
      bubble.setAttribute("aria-label", "Close chat");
      if (messagesEl.children.length === 0) {
        addGreeting();
        // Wait for greeting to load (or 500ms) so panel is ready and we don't race with addGreeting
        setTimeout(function () {
          sendMessage(textToSend);
        }, 500);
      } else {
        setTimeout(function () {
          sendMessage(textToSend);
        }, 100);
      }
    } else {
      setTimeout(function () {
        sendMessage(textToSend);
      }, 100);
    }
  });

  sendBtn.addEventListener("click", () => sendMessage(inputEl.value));
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(inputEl.value);
  });

  document.body.appendChild(bubble);
  document.body.appendChild(panel);
})();
