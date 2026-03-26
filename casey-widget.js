// Casey AI Mouse – Electric AI Lab
(function() {
  // ---------- Casey drawing (cool manga mouse) ----------
  function drawCasey(ctx, width=80, height=80) {
    ctx.clearRect(0,0,width,height);
    // head base
    ctx.fillStyle = "#2c2e3f";
    ctx.beginPath();
    ctx.ellipse(width/2, height*0.55, width*0.35, height*0.4, 0, 0, Math.PI*2);
    ctx.fill();
    // face
    ctx.fillStyle = "#e0b0ff";
    ctx.beginPath();
    ctx.ellipse(width/2, height*0.45, width*0.3, height*0.35, 0, 0, Math.PI*2);
    ctx.fill();
    // eyes
    ctx.fillStyle = "#141824";
    ctx.beginPath();
    ctx.ellipse(width*0.35, height*0.4, 4, 6, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width*0.65, height*0.4, 4, 6, 0, 0, Math.PI*2);
    ctx.fill();
    // blush / cool marking
    ctx.fillStyle = "#ff66cc";
    ctx.beginPath();
    ctx.arc(width*0.5, height*0.6, 6, 0, Math.PI*2);
    ctx.fill();
    // ears
    ctx.fillStyle = "#2c2e3f";
    ctx.beginPath();
    ctx.ellipse(width*0.2, height*0.2, 12, 16, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width*0.8, height*0.2, 12, 16, 0.3, 0, Math.PI*2);
    ctx.fill();
    // glow effect
    ctx.fillStyle = "#0ff";
    ctx.font = `bold ${width*0.2}px monospace`;
    ctx.fillText("⚡", width*0.45, height*0.75);
    // glasses / style
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width*0.35, height*0.42, 8, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width*0.65, height*0.42, 8, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width*0.43, height*0.42);
    ctx.lineTo(width*0.57, height*0.42);
    ctx.stroke();
  }

  // ---------- auto-prompt fix using READY+FOCUS ----------
  function fixPromptWithCasey(rawPrompt) {
    if (!rawPrompt.trim()) return "Please enter a prompt to improve.";
    return `🧀 **Casey's Enhanced Prompt** (READY + FOCUS)\n\n` +
      `[READY Framework]\n` +
      `• **Role**: Expert Prompt Engineer\n` +
      `• **Expertise**: Advanced frameworks (FOCUS, READY)\n` +
      `• **Action**: Refine the original prompt\n` +
      `• **Details**: ${rawPrompt.substring(0,120)}…\n` +
      `• **Yield**: Clear, actionable, high‑quality result.\n\n` +
      `[FOCUS Adaptation]\n` +
      `• **Frame**: ${rawPrompt.substring(0,80)}\n` +
      `• **Objective**: Deliver optimal, structured response\n` +
      `• **Context**: User needs instant improvement\n` +
      `• **User**: Learner / Educator\n` +
      `• **Success**: Ready‑to‑use final answer.`;
  }

  // ---------- build the floating widget ----------
  const widget = document.createElement('div');
  widget.id = "casey-widget";
  widget.style.position = "fixed";
  widget.style.bottom = "24px";
  widget.style.right = "24px";
  widget.style.zIndex = "9999";
  widget.style.cursor = "pointer";
  widget.style.filter = "drop-shadow(0 0 8px #00E5FF)";
  widget.innerHTML = `
    <div style="width:80px; height:80px; background:#111827; border-radius:50%; border:2px solid #00E5FF; display:flex; align-items:center; justify-content:center;">
      <canvas id="caseyCanvas" width="70" height="70"></canvas>
    </div>
    <div id="caseyTooltip" style="position:absolute; bottom:90px; right:0; background:#111827cc; backdrop-filter:blur(12px); border:1px solid #00E5FF; border-radius:1rem; padding:0.75rem; width:240px; font-size:0.8rem; display:none;">
      ⚡ Casey AI Mouse: click to fix any prompt! I teach READY+FOCUS instantly.
    </div>
  `;
  document.body.appendChild(widget);

  const canvas = widget.querySelector('#caseyCanvas');
  const ctx = canvas.getContext('2d');
  drawCasey(ctx, 70, 70);
  widget.addEventListener('mouseenter', () => {
    document.getElementById('caseyTooltip').style.display = 'block';
  });
  widget.addEventListener('mouseleave', () => {
    document.getElementById('caseyTooltip').style.display = 'none';
  });

  // modal for prompt fixing
  const modal = document.createElement('div');
  modal.id = "caseyModal";
  modal.style.position = "fixed";
  modal.style.top = "0"; modal.style.left = "0";
  modal.style.width = "100%"; modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.8)";
  modal.style.backdropFilter = "blur(8px)";
  modal.style.display = "none";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "10000";
  modal.innerHTML = `
    <div style="max-width:500px; width:90%; background:#111827; border-radius:2rem; border:1px solid #00E5FF; padding:1.5rem;">
      <h2 style="display:flex; gap:0.5rem;"><i class="fas fa-mouse"></i> Casey Prompt Fixer</h2>
      <p>Paste your prompt → auto‑detect & improve with <strong>READY + FOCUS</strong></p>
      <textarea id="caseyPromptInput" rows="4" style="width:100%; background:#0B0F1A; border:1px solid #00E5FF; border-radius:1rem; padding:0.75rem; color:white;"></textarea>
      <button id="caseyFixBtn" class="btn" style="margin-top:1rem;">✨ Fix with Casey</button>
      <div id="caseyResult" style="margin-top:1rem; background:#0B0F1A; border-radius:1rem; padding:0.75rem;"></div>
      <button id="closeCaseyModal" style="margin-top:1rem; background:none; border:1px solid #00E5FF; border-radius:2rem; padding:0.5rem 1rem;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  widget.addEventListener('click', () => {
    modal.style.display = "flex";
  });
  document.getElementById('closeCaseyModal').addEventListener('click', () => {
    modal.style.display = "none";
  });
  document.getElementById('caseyFixBtn').addEventListener('click', () => {
    const input = document.getElementById('caseyPromptInput').value;
    const improved = fixPromptWithCasey(input);
    document.getElementById('caseyResult').innerHTML = `<pre style="white-space:pre-wrap;">${improved}</pre>`;
  });

  // ----- FOCUS Prompt Builder (drag & fill) -----
  // This will be called if the page has a .focus-builder container
  function initFocusBuilder() {
    const builder = document.querySelector('.focus-builder');
    if (!builder) return;
    // simple drag components
    const components = ['Frame', 'Objective', 'Context', 'User', 'Success'];
    const dragArea = document.createElement('div');
    dragArea.className = 'drag-items';
    dragArea.innerHTML = `<h3><i class="fas fa-arrows-alt"></i> Drag & Fill</h3>`;
    components.forEach(comp => {
      const el = document.createElement('div');
      el.draggable = true;
      el.textContent = comp;
      el.style.background = '#1e2a4a';
      el.style.margin = '0.5rem';
      el.style.padding = '0.5rem';
      el.style.borderRadius = '2rem';
      el.style.display = 'inline-block';
      el.style.border = '1px solid #00E5FF';
      el.setAttribute('data-comp', comp);
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', comp);
      });
      dragArea.appendChild(el);
    });
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.style.background = '#03060c88';
    dropZone.style.minHeight = '150px';
    dropZone.style.border = '2px dashed cyan';
    dropZone.style.borderRadius = '1rem';
    dropZone.style.padding = '1rem';
    dropZone.innerHTML = '<p>Drop components here →</p><div id="builderPreview"></div>';
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      const comp = e.dataTransfer.getData('text/plain');
      const preview = dropZone.querySelector('#builderPreview');
      const newSpan = document.createElement('span');
      newSpan.textContent = comp;
      newSpan.style.background = '#0ff3';
      newSpan.style.borderRadius = '20px';
      newSpan.style.padding = '4px 8px';
      newSpan.style.margin = '4px';
      newSpan.style.display = 'inline-block';
      preview.appendChild(newSpan);
    });
    builder.appendChild(dragArea);
    builder.appendChild(dropZone);
    // build button
    const buildBtn = document.createElement('button');
    buildBtn.textContent = 'Generate FOCUS Prompt';
    buildBtn.className = 'btn';
    buildBtn.style.marginTop = '1rem';
    buildBtn.addEventListener('click', () => {
      const preview = dropZone.querySelector('#builderPreview');
      const selected = Array.from(preview.children).map(s => s.textContent);
      let prompt = "FOCUS Prompt:\n";
      components.forEach(c => {
        if (selected.includes(c)) {
          prompt += `• ${c}: [fill here]\n`;
        }
      });
      prompt += "\n(Use the input fields below to add specifics)";
      const outputArea = document.getElementById('focusOutput') || (() => {
        const out = document.createElement('textarea');
        out.id = 'focusOutput';
        out.rows = 5;
        out.style.width = '100%';
        out.style.marginTop = '1rem';
        out.style.background = '#0B0F1A';
        out.style.border = '1px solid cyan';
        out.style.borderRadius = '1rem';
        out.style.padding = '0.75rem';
        out.style.color = 'white';
        builder.appendChild(out);
        return out;
      })();
      outputArea.value = prompt;
    });
    builder.appendChild(buildBtn);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFocusBuilder);
  } else {
    initFocusBuilder();
  }
})();