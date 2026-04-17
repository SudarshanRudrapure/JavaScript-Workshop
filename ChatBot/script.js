// API key is in config.js — safe to push to GitHub!

//  Conversation history (multi-turn memory)
let history = [];

//  DOM Elements
const chatBox   = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn   = document.getElementById('send-btn');

//  Auto-grow textarea
userInput.addEventListener('input', () => {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
});

//  Enter = send, Shift+Enter = new line
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    askAI();
  }
});

//  Use a suggestion chip
function useChip(el) {
  userInput.value = el.textContent;
  askAI();
}

//  Clear the chat
function clearChat() {
  history = [];
  chatBox.innerHTML = `
    <div class="empty-state" id="empty-state">
      <div class="empty-icon">✦</div>
      <h2>What do you want to know?</h2>
      <p>Ask me anything — I'll do my best to help.</p>
      <div class="chips">
        <button class="chip" onclick="useChip(this)">What is quantum computing?</button>
        <button class="chip" onclick="useChip(this)">Explain recursion with an example</button>
        <button class="chip" onclick="useChip(this)">List all planets in our solar system</button>
        <button class="chip" onclick="useChip(this)">Write a Python function to reverse a string</button>
      </div>
    </div>`;
}

//  Add a message bubble to the chat
function addMessage(role, htmlContent) {
  document.getElementById('empty-state')?.remove();

  const wrapper = document.createElement('div');
  wrapper.className = `message ${role}`;

  if (role === 'user') {
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.textContent = htmlContent;
    wrapper.appendChild(bubble);
  } else {
    const row = document.createElement('div');
    row.className = 'ai-row';

    const avatar = document.createElement('div');
    avatar.className = 'ai-avatar';
    avatar.textContent = '✦';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = htmlContent;

    row.appendChild(avatar);
    row.appendChild(bubble);
    wrapper.appendChild(row);
  }

  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

//  Show typing indicator
function showTyping() {
  document.getElementById('empty-state')?.remove();

  const row = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typing-indicator';

  const avatar = document.createElement('div');
  avatar.className = 'ai-avatar';
  avatar.textContent = '✦';

  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Convert Markdown → HTML
function mdToHtml(text) {
  const escape = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const codeBlocks = [];
  text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push(`<pre><code>${escape(code.trim())}</code></pre>`);
    return `%%CB${codeBlocks.length - 1}%%`;
  });

  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${escape(c)}</code>`);
  text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.+)$/gm,  '<h2>$1</h2>');
  text = text.replace(/^# (.+)$/gm,   '<h1>$1</h1>');
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g,     '<em>$1</em>');

  text = text.replace(/((?:^\* .+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n')
      .map(l => `<li>${l.replace(/^\* /, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });

  text = text.replace(/((?:^\d+\. .+\n?)+)/gm, (block) => {
    const items = block.trim().split('\n')
      .map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });

  text = text.split(/\n{2,}/).map(para => {
    para = para.trim();
    if (!para) return '';
    if (/^<(h[123]|ul|ol|pre|blockquote)/.test(para)) return para;
    return `<p>${para.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  codeBlocks.forEach((block, i) => {
    text = text.replace(`%%CB${i}%%`, block);
  });

  return text;
}

//  MAIN: Call Groq API

async function askAI() {
  const query = userInput.value.trim();
  if (!query) return;

  userInput.value = '';
  userInput.style.height = 'auto';
  sendBtn.disabled = true;

  addMessage('user', query);
  history.push({ role: 'user', content: query });
  showTyping();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`  // 👈 comes from config.js
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: history.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      })
    });

    document.getElementById('typing-indicator')?.remove();

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'API error');
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || 'No response received.';

    history.push({ role: 'assistant', content: answer });
    addMessage('ai', mdToHtml(answer));

  } catch (err) {
    document.getElementById('typing-indicator')?.remove();
    addMessage('ai', `<p>⚠️ Error: ${err.message || 'Something went wrong. Check your API key in config.js'}</p>`);
    console.error('Groq API error:', err);
  }

  sendBtn.disabled = false;
  userInput.focus();
}