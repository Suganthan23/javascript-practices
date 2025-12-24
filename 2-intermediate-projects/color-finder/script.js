const PALETTE = [
    { name: 'Red', hex: '#ff0000' },
    { name: 'Orange', hex: '#ff7f00' },
    { name: 'Gold', hex: '#ffd700' },
    { name: 'Yellow', hex: '#ffff00' },
    { name: 'Lime', hex: '#00ff00' },
    { name: 'Green', hex: '#2ecc71' },
    { name: 'Teal', hex: '#008080' },
    { name: 'Cyan', hex: '#00ffff' },
    { name: 'SkyBlue', hex: '#87ceeb' },
    { name: 'Blue', hex: '#0000ff' },
    { name: 'Indigo', hex: '#4b0082' },
    { name: 'Violet', hex: '#8a2be2' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Magenta', hex: '#ff00ff' },
    { name: 'Pink', hex: '#ffc0cb' },
    { name: 'Salmon', hex: '#fa8072' },
    { name: 'Coral', hex: '#ff7f50' },
    { name: 'Tomato', hex: '#ff6347' },
    { name: 'Brown', hex: '#a52a2a' },
    { name: 'Chocolate', hex: '#d2691e' },
    { name: 'Olive', hex: '#808000' },
    { name: 'Khaki', hex: '#f0e68c' },
    { name: 'Gray', hex: '#808080' },
    { name: 'SlateGray', hex: '#708090' },
    { name: 'Silver', hex: '#c0c0c0' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' }
];

function normalizeHex(input) {
    const m = /^#?([0-9a-fA-F]{6})$/.exec(String(input).trim());
    return m ? '#' + m[1].toLowerCase() : null;
}

function rgbToHex(r, g, b) {
    const to2 = (n) => Math.max(0, Math.min(255, n | 0)).toString(16).padStart(2, '0');
    return '#' + to2(r) + to2(g) + to2(b);
}

function cssColorToHex(name) {
  const el = document.createElement('div');

  el.style.color = '';
  el.style.color = String(name).trim();
  if (!el.style.color) return null;

  document.body.appendChild(el);
  const cs = getComputedStyle(el).color; 
  document.body.removeChild(el);

  const m = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/.exec(cs);
  return m ? rgbToHex(+m[1], +m[2], +m[3]) : null;
}

const paletteEl = document.getElementById('palette');
const previewEl = document.getElementById('preview');
const currentEl = document.getElementById('current');
const hexInput = document.getElementById('hexInput');
const applyHex = document.getElementById('applyHex');
const nameInput = document.getElementById('nameInput');
const nameToHex = document.getElementById('nameToHex');
const nameHex = document.getElementById('nameHex');


function setPreview(hex) {
    previewEl.style.background = hex;
    currentEl.textContent = `Current: ${hex}`;
}

function renderPalette() {
    paletteEl.innerHTML = '';
    for (const c of PALETTE) {
        const card = document.createElement('button');
        card.className = 'swatch';
        card.type = 'button';
        card.dataset.hex = c.hex;

        const box = document.createElement('div');
        box.className = 'box';
        box.style.background = c.hex;

        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = c.name;

        const hex = document.createElement('div');
        hex.className = 'hex';
        hex.textContent = c.hex;

        card.append(box, name, hex);
        paletteEl.appendChild(card);
    }
}

paletteEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.swatch');
    if(!btn) return;
    setPreview(btn.dataset.hex);
});

applyHex.addEventListener('click', () => {
    const hex = normalizeHex(hexInput.value);
    if(!hex){
        alert("Enter a valid 6 digit hex like #ff6600");
        return;
    }
    setPreview(hex);
});

nameToHex.addEventListener('click', () =>{
    const hex = cssColorToHex(nameInput.value);
    if(!hex){
        nameHex.textContent = "Invalid Color Name";
        nameHex.style.color = "#c0392b";
        return;
    }
    nameHex.textContent = hex;
    nameHex.style.color =  '#2c3e50';
    setPreview(hex);
})

renderPalette();
setPreview(PALETTE[0].hex);