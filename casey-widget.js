// Casey AI Mouse – Electric AI Lab
(function() {
  function drawCasey(ctx, w=70, h=70) {
    ctx.clearRect(0, 0, w, h);
    // head
    ctx.fillStyle = "#2c2e3f";
    ctx.beginPath();
    ctx.ellipse(w/2, h*0.55, w*0.35, h*0.4, 0, 0, Math.PI*2);
    ctx.fill();
    // face
    ctx.fillStyle = "#e0b0ff";
    ctx.beginPath();
    ctx.ellipse(w/2, h*0.45, w*0.3, h*0.35, 0, 0, Math.PI*2);
    ctx.fill();
    // eyes (cool anime style)
    ctx.fillStyle = "#141824";
    ctx.beginPath();
    ctx.ellipse(w*0.35, h*0.4, 4, 6, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w*0.65, h*0.4, 4, 6, 0, 0, Math.PI*2);
    ctx.fill();
    // blush / tech marking
    ctx.fillStyle = "#ff66cc";
    ctx.beginPath();
    ctx.arc(w*0.5, h*0.6, 6, 0, Math.PI*2);
    ctx.fill();
    // ears
    ctx.fillStyle = "#2c2e3f";
    ctx.beginPath();
    ctx.ellipse(w*0.2, h*0.2, 12, 16, -0.3, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w*0.8, h*0.2, 12, 16, 0.3, 0, Math.PI*2);
    ctx.fill();
    // glow bolt
    ctx.fillStyle = "#0ff";
    ctx.font = `bold ${w*0.2}px monospace`;
    ctx.fillText("⚡", w*0.45, h*0.75);
    // glasses / tech style
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w*0.35, h*0.42, 8, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w*0.65, h*0.42, 8, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w*0.43, h*0.42);
    ctx.lineTo(w*0.57, h*0.42);
    ctx.stroke();
  }

  // widget
  const widget = document.createElement('div');
  widget.style.position = 'fixed';
  widget.style.bottom = '24px';
  widget.style.right = '24px';
  widget.style.zIndex = '9999';
  widget.style.cursor = 'pointer';
  widget.style.filter = 'drop-shadow(0 0 8px #00E5FF)';
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

  // modal
  const modal = document.createElement('div');
  modal.id = 'caseyModal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
  modal.style.backdropFilter = 'blur(8px)';
  modal.style.display = 'none';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '10000';
  modal.innerHTML = `
    <div style="max-width:500px; width:90%; background:#111827; border-radius:2rem; border:1px solid #00E5FF; padding:1.5rem;">
      <h2 style="display:flex; gap:0.5rem;"><i class="fas fa-mouse"></i> Casey Prompt Fixer</h2>
      <p>Paste your prompt → Casey will improve it using <strong>READY + FOCUS</strong>.</p>
      <textarea id="caseyPromptInput" rows="4" style="width:100%; background:#0B0F1A; border:1px solid #00E5FF; border-radius:1rem; padding:0.75rem; color:white;"></textarea>
      <button id="caseyFixBtn" class="btn" style="margin-top:1rem;">✨ Fix with Casey</button>
      <div id="caseyResult" style="margin-top:1rem; background:#0B0F1A; border-radius:1rem; padding:0.75rem;"></div>
      <button id="closeCaseyModal" style="margin-top:1rem; background:none; border:1px solid #00E5FF; border-radius:2rem; padding:0.5rem 1rem;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  widget.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
  document.getElementById('closeCaseyModal').addEventListener('click', () => {
    modal.style.display = 'none';
  });
  document.getElementById('caseyFixBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('caseyPromptInput').value;
    if (!prompt.trim()) {
      document.getElementById('caseyResult').innerHTML = 'Please enter a prompt.';
      return;
    }
    const resultDiv = document.getElementById('caseyResult');
    resultDiv.innerHTML = '🧀 Casey is thinking...';
    try {
      const res = await fetch('/.netlify/functions/casey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) resultDiv.innerHTML = `⚠️ ${data.error}`;
      else resultDiv.innerHTML = `<pre style="white-space:pre-wrap;">${data.improved}</pre>`;
    } catch (err) {
      resultDiv.innerHTML = '❌ Could not reach Casey. Make sure you are online.';
      console.error(err);
    }
  });
})();
