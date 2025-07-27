let currentRotation = 0;
// Page transitions
document.querySelector(".logout-btn").addEventListener("click", () => {
  const loader = document.getElementById("loading-screen");
  loader.classList.add("show");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
});

const homeBtn = document.getElementById("home-btn");
const loader = document.getElementById("loading-screen");

homeBtn.addEventListener("click", () => {
  loader.classList.add("show");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 900);
});



// Main Filters Logic
function updateFilters() {
  const brightness = document.getElementById("brightness").value;
  const contrast = document.getElementById("contrast").value;
  const saturation = document.getElementById("saturation").value;
  const blur = document.getElementById("blur").value;
  const grayscale = document.getElementById("grayscale").value;
  const invert = document.getElementById("invert").value;
  const sepia = document.getElementById("sepia").value;
  const hue = document.getElementById("hue").value;

  document.getElementById("brightness-value").innerText = brightness + "%";
  document.getElementById("contrast-value").innerText = contrast + "%";
  document.getElementById("saturation-value").innerText = saturation + "%";
  document.getElementById("blur-value").innerText = blur + "px";
  document.getElementById("grayscale-value").innerText = grayscale + "%";
  document.getElementById("invert-value").innerText = invert + "%";
  document.getElementById("sepia-value").innerText = sepia + "%";
  document.getElementById("hue-value").innerText = hue + "°";

  applyCustomFilters();
}

function applyCustomFilters() {
  const uploadedImg = document.getElementById("uploaded-image");
  if (!uploadedImg || uploadedImg.style.display === "none") return;

  const brightness = document.getElementById("brightness").value;
  const contrast = document.getElementById("contrast").value;
  const saturation = document.getElementById("saturation").value;
  const blur = document.getElementById("blur").value;
  const grayscale = document.getElementById("grayscale").value;
  const invert = document.getElementById("invert").value;
  const sepia = document.getElementById("sepia").value;
  const hue = document.getElementById("hue").value;

  let extraFilter = "";
  if (document.getElementById("cool-tone-btn")?.classList.contains("applied")) {
    extraFilter += " hue-rotate(190deg) brightness(1.1) saturate(1.2)";
  }

  uploadedImg.style.filter = `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
    blur(${blur}px)
    grayscale(${grayscale}%)
    invert(${invert}%)
    sepia(${sepia}%)
    hue-rotate(${hue}deg)
    ${extraFilter}
  `.trim();
}

// Upload Photo Logic
document.getElementById("photo-input").addEventListener("change", function () {
  const file = this.files[0];
  const uploadedImage = document.getElementById("uploaded-image");
  const importLabel = document.getElementById("import-label");
  const downloadBtn = document.getElementById("download-btn");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = "block";
      importLabel.style.display = "none";
      downloadBtn.style.display = "inline-block";

      document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('applied'));
      uploadedImage.style.boxShadow = "none";

      updateFilters();
    };
    reader.readAsDataURL(file);
  }
});

// Download Button Logic
document.getElementById("download-btn").addEventListener("click", () => {
  const imageElement = document.getElementById("uploaded-image");

  if (!imageElement || imageElement.style.display === "none") {
    alert("Please upload a photo first.");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = imageElement.naturalWidth;
  const height = imageElement.naturalHeight;

  const frameThickness = 50; // You can adjust this
  canvas.width = width + frameThickness * 2;
  canvas.height = height + frameThickness * 2;

  const filter = window.getComputedStyle(imageElement).filter;
  ctx.filter = filter;

  // Draw frame color
  if (currentFrame === "black") {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (currentFrame === "white") {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const tempImg = new Image();
  tempImg.crossOrigin = "anonymous";
  tempImg.onload = function () {
    ctx.drawImage(tempImg, frameThickness, frameThickness, width, height);

    const link = document.createElement("a");
    link.download = "EduLiner.png"; // depends on you what you wanna download jpg or png 
    link.href = canvas.toDataURL("image/png"); // depends on you what you wanna download jpg or png 
    link.click();
  };
  tempImg.src = imageElement.src;
});


// Toggle Tool Buttons
const glowBtn = document.querySelector('.tool-btn:nth-of-type(1)');
const coolToneBtn = document.querySelector('.tool-btn:nth-of-type(2)');
glowBtn.id = "glow-btn";
coolToneBtn.id = "cool-tone-btn";

glowBtn.addEventListener("click", () => {
  const img = document.getElementById("uploaded-image");
  if (!img.src) return;

  glowBtn.classList.toggle("applied");
  if (glowBtn.classList.contains("applied")) {
    img.style.boxShadow = "0 0 40px rgba(0, 255, 150, 0.5)";
  } else {
    img.style.boxShadow = "none";
  }
});

coolToneBtn.addEventListener("click", () => {
  if (!document.getElementById("uploaded-image").src) return;

  coolToneBtn.classList.toggle("applied");
  applyCustomFilters(); // Refresh all filters including cool tone
});

// VINTAGE LOOK 
const vintageBtn = document.getElementById("vintage-btn");

vintageBtn.addEventListener("click", function () {
  const img = document.getElementById("uploaded-image");
  if (!img || img.style.display === "none") return;

  this.classList.toggle("applied");

  if (this.classList.contains("applied")) {
    img.style.filter += " sepia(0.4) contrast(110%) brightness(0.95)";
    this.style.boxShadow = "0 0 10px #c38753"; // golden glow
    this.style.border = "2px solid black";
  } else {
    updateFilters(); // reset filters
    this.style.boxShadow = "none";
    this.style.border = "none";
  }
});


// FRAME BUTTON 
const frameBtn = document.getElementById("frame-btn");
const uploadedImg = document.getElementById("uploaded-image");

let currentFrame = "none"; // Track current frame mode

frameBtn.addEventListener("click", () => {
  if (!uploadedImg || uploadedImg.style.display === "none") return;

  // Cycle through frame styles
  if (currentFrame === "none") {
    uploadedImg.style.border = "12px solid black";
    currentFrame = "black";
    frameBtn.classList.add("applied");
    frameBtn.innerText = "🖤 Black Frame";
  } else if (currentFrame === "black") {
    uploadedImg.style.border = "12px solid white";
    currentFrame = "white";
    frameBtn.classList.add("applied");
    frameBtn.innerText = "🤍 White Frame";
  } else {
    uploadedImg.style.border = "none";
    currentFrame = "none";
    frameBtn.classList.remove("applied");
    frameBtn.innerText = "🖼️ Add Frame";
  }
});



