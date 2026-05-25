/* =============================================================
   chat.js — K AG Foresight Radar
   Smart Language Mode: Apertus 8B via lokales Ollama
   ============================================================= */

(function () {
  'use strict';

  var OLLAMA_URL = 'http://localhost:11434';
  var MODEL = 'MichelRosselli/apertus:8b-instruct-2509-q4_k_m';
  var MODEL_FALLBACK = 'MichelRosselli/apertus';

  var panel = document.getElementById('chat-panel');
  var toggle = document.getElementById('chat-toggle');
  var closeBtn = document.getElementById('chat-close');
  var input = document.getElementById('chat-input');
  var sendBtn = document.getElementById('chat-send');
  var messagesEl = document.getElementById('chat-messages');
  var statusEl = document.getElementById('chat-status');

  var messages = [];
  var isStreaming = false;
  var resolvedModel = null;

  /* ---- SYSTEM PROMPT ---------------------------------------- */
  function buildSystemPrompt() {
    var fieldsData = FIELDS.map(function (f) {
      var cluster = CLUSTERS.find(function (c) { return c.key === f.cluster; });
      return {
        name: f.name,
        desc: f.desc,
        cluster: cluster ? cluster.label : f.cluster,
        totalScore: f.totalScore,
        zone: f.zone.label,
        scores: f.scores,
        insight: f.insight
      };
    });

    var clusterSummary = CLUSTERS.map(function (c) {
      var cFields = FIELDS.filter(function (f) { return f.cluster === c.key; });
      var avg = Math.round(cFields.reduce(function (s, f) { return s + f.totalScore; }, 0) / cFields.length);
      return c.label + ' (Durchschnitt: ' + avg + ', ' + cFields.length + ' Felder)';
    });

    return 'Du bist der K AG Foresight Radar Assistent. Du analysierst strategische Handlungsfelder ' +
      'für Organisationen basierend auf dem K AG Foresight Radar.\n\n' +
      'METHODIK:\n' +
      '- 5 Bewertungsdimensionen: ' + DIMENSIONS.map(function (d) {
        return d.label + ' (' + Math.round(d.weight * 100) + '%)';
      }).join(', ') + '\n' +
      '- 4 Handlungszonen: ' + ZONES.map(function (z) {
        return z.label + ' (Score ' + z.min + '-' + z.max + ')';
      }).join(', ') + '\n' +
      '- Gewichtete Formel: Gesamtscore = Summe(Dimension * Gewicht)\n\n' +
      'CLUSTER:\n' + clusterSummary.join('\n') + '\n\n' +
      'AKTUELLE DATEN (19 Handlungsfelder):\n' +
      JSON.stringify(fieldsData, null, 0) + '\n\n' +
      'REGELN:\n' +
      '- Antworte auf Deutsch (Schweizer Stil, du-Form).\n' +
      '- Sei präzise und datenbasiert. Nenne konkrete Scores und Zonen.\n' +
      '- Keine Schmeichelei, keine Buzzwords. Kritische Analyse.\n' +
      '- Wenn du Felder vergleichst, zeige die relevanten Dimensionswerte.\n' +
      '- Readiness Gap ist die USP-Dimension: sie misst wie schlecht Organisationen vorbereitet sind.';
  }

  /* ---- OLLAMA CONNECTION ------------------------------------ */
  function checkOllama(callback) {
    fetch(OLLAMA_URL + '/api/tags', { method: 'GET' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var models = (data.models || []).map(function (m) { return m.name; });
        if (models.some(function (n) { return n.indexOf('apertus') !== -1; })) {
          var found = models.find(function (n) { return n.indexOf('apertus') !== -1; });
          resolvedModel = found;
          statusEl.textContent = 'Apertus (lokal verbunden)';
          statusEl.style.color = '#2E7D32';
          callback(true);
        } else if (models.length > 0) {
          resolvedModel = models[0];
          statusEl.textContent = resolvedModel + ' (lokal)';
          statusEl.style.color = '#E65100';
          callback(true);
        } else {
          statusEl.textContent = 'Ollama läuft, aber kein Modell geladen';
          statusEl.style.color = '#E65100';
          callback(false);
        }
      })
      .catch(function () {
        statusEl.textContent = 'Ollama nicht erreichbar (localhost:11434)';
        statusEl.style.color = '#C62828';
        callback(false);
      });
  }

  /* ---- STREAMING CHAT --------------------------------------- */
  function sendToOllama(userMsg) {
    if (isStreaming) return;
    isStreaming = true;

    messages.push({ role: 'user', content: userMsg });
    appendMessage('user', userMsg);

    var assistantEl = appendMessage('assistant', '');
    var contentEl = assistantEl.querySelector('.chat-msg-content');
    contentEl.innerHTML = '<span class="chat-typing">...</span>';

    var payload = {
      model: resolvedModel || MODEL,
      messages: [{ role: 'system', content: buildSystemPrompt() }].concat(messages),
      stream: true
    };

    fetch(OLLAMA_URL + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Ollama HTTP ' + response.status);
        var reader = response.body.getReader();
        var decoder = new TextDecoder();
        var fullText = '';
        var buffer = '';

        function processLines(lines) {
          lines.forEach(function (line) {
            if (!line.trim()) return;
            try {
              var obj = JSON.parse(line);
              if (obj.message && obj.message.content) {
                fullText += obj.message.content;
                contentEl.textContent = fullText;
                messagesEl.scrollTop = messagesEl.scrollHeight;
              }
            } catch (e) { /* incomplete line, will be buffered */ }
          });
        }

        function read() {
          reader.read().then(function (result) {
            if (result.done) {
              if (buffer.trim()) processLines([buffer]);
              messages.push({ role: 'assistant', content: fullText });
              isStreaming = false;
              sendBtn.disabled = false;
              return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            var lines = buffer.split('\n');
            buffer = lines.pop();
            processLines(lines);
            read();
          }).catch(function (err) {
            contentEl.textContent = fullText || 'Fehler beim Lesen der Antwort: ' + err.message;
            isStreaming = false;
            sendBtn.disabled = false;
          });
        }
        read();
      })
      .catch(function (err) {
        contentEl.textContent = 'Verbindungsfehler: ' + err.message + '\n\nStelle sicher, dass Ollama läuft:\n  ollama serve\n  ollama run MichelRosselli/apertus';
        isStreaming = false;
        sendBtn.disabled = false;
        messages.pop();
      });
  }

  /* ---- UI HELPERS ------------------------------------------- */
  function appendMessage(role, content) {
    var div = document.createElement('div');
    div.className = 'chat-msg chat-msg-' + role;
    var inner = document.createElement('div');
    inner.className = 'chat-msg-content';
    inner.textContent = content;
    div.appendChild(inner);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function handleSend() {
    var text = input.value.trim();
    if (!text || isStreaming) return;
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    checkOllama(function (ok) {
      if (ok) {
        sendToOllama(text);
      } else {
        appendMessage('user', text);
        appendMessage('assistant',
          'Ollama ist nicht erreichbar.\n\n' +
          'So richtest du es ein:\n' +
          '1. Ollama installieren: brew install ollama\n' +
          '2. Ollama starten: ollama serve\n' +
          '3. Apertus laden: ollama run MichelRosselli/apertus\n\n' +
          'Danach diese Seite neu laden.');
        sendBtn.disabled = false;
      }
    });
  }

  /* ---- EVENT LISTENERS -------------------------------------- */
  toggle.addEventListener('click', function () {
    panel.classList.toggle('open');
    toggle.classList.toggle('hidden');
    if (panel.classList.contains('open')) {
      input.focus();
      checkOllama(function () { });
    }
  });

  closeBtn.addEventListener('click', function () {
    panel.classList.remove('open');
    toggle.classList.remove('hidden');
  });

  sendBtn.addEventListener('click', handleSend);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  input.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

})();
