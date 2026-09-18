// =====================================================
// NAVIGATION & DASHBOARD
// =====================================================

function goToTools() {
    document.querySelector("main").innerHTML = `
        <div class="tools-grid">
            <div class="tool-card" onclick="openImageCompressor()">
                <h3>🗜️ Image Compressor</h3>
                <p>Reduce image size without losing quality.</p>
            </div>
            <div class="tool-card" onclick="openImageResizer()">
                <h3>📐 Image Resizer</h3>
                <p>Change dimensions (px or %) easily.</p>
            </div>
            <div class="tool-card" onclick="openImageCropper()">
                <h3>✂️ Image Cropper</h3>
                <p>Crop images to exact dimensions.</p>
            </div>
            <div class="tool-card" onclick="openImageRotator()">
                <h3>🔄 Image Rotator</h3>
                <p>Rotate photos 90°, 180°, or 270°.</p>
            </div>
            <div class="tool-card" onclick="openPDFCompressor()">
                <h3>📄 PDF Compressor</h3>
                <p>Compress PDF file size online.</p>
            </div>
            <div class="tool-card" onclick="openPDFToImage()">
                <h3>🖼️ PDF to JPG/PNG</h3>
                <p>Convert PDF pages to images.</p>
            </div>
            <div class="tool-card" onclick="openPDFMerger()">
                <h3>📑 Merge PDF</h3>
                <p>Combine multiple PDFs into one.</p>
            </div>
            <div class="tool-card" onclick="openDocumentScanner()">
                <h3>📱 Document Scanner</h3>
                <p>Scan documents using your camera.</p>
            </div>
            <div class="tool-card" onclick="openDocumentEnhance()">
                <h3>✨ Document Enhancer</h3>
                <p>Enhance readability of scanned docs.</p>
            </div>
        </div>
    `;
}

// Initial dashboard view on load
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("main") && !document.querySelector("main").innerHTML.trim()) {
        goToTools();
    }
});

// =====================================================
// 1. IMAGE COMPRESSOR
// =====================================================

function openImageCompressor() {
    document.querySelector("main").innerHTML = `
        <div class="compressor">
            <h2>🗜️ Image Compressor</h2>
            <p>Compress JPG, PNG, or WebP images while maintaining quality.</p>
            <br>
            <input type="file" id="compressInput" accept="image/*">
            <br><br>
            <label for="qualityRange">Quality: <span id="qualityVal">80</span>%</label>
            <br>
            <input type="range" id="qualityRange" min="10" max="100" value="80">
            <br><br>
            <button type="button" id="compressBtn">⚡ Compress Image</button>
            <div id="compressResult"></div>
            <br>
            <button type="button" id="compressBackBtn">← Back to Tools</button>
        </div>
    `;

    const input = document.getElementById("compressInput");
    const qualityRange = document.getElementById("qualityRange");
    const qualityVal = document.getElementById("qualityVal");
    const compressBtn = document.getElementById("compressBtn");
    const result = document.getElementById("compressResult");
    const backBtn = document.getElementById("compressBackBtn");

    qualityRange.addEventListener("input", (e) => {
        qualityVal.textContent = e.target.value;
    });

    compressBtn.addEventListener("click", () => {
        const file = input.files[0];
        if (!file) {
            alert("Please select an image file first.");
            return;
        }

        const quality = parseFloat(qualityRange.value) / 100;
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const compressedData = canvas.toDataURL("image/jpeg", quality);

                result.innerHTML = `
                    <div class="result-box">
                        <h3>✅ Compression Complete!</h3>
                        <p><strong>Original Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                        <br>
                        <img src="${compressedData}" class="preview" alt="Compressed preview">
                        <br><br>
                        <a href="${compressedData}" download="DocPinch-compressed.jpg">
                            <button type="button">⬇️ Download Compressed Image</button>
                        </a>
                        <br><br>
                        <button type="button" onclick="openImageCompressor()">🔄 Compress Another</button>
                    </div>
                `;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    backBtn.addEventListener("click", goToTools);
}

// =====================================================
// 2. IMAGE RESIZER
// =====================================================

function openImageResizer() {
    document.querySelector("main").innerHTML = `
        <div class="compressor">
            <h2>📐 Image Resizer</h2>
            <p>Resize images by custom width and height in pixels.</p>
            <br>
            <input type="file" id="resizeInput" accept="image/*">
            <br><br>
            <label>Width (px):</label>
            <input type="number" id="resizeWidth" placeholder="e.g. 800" min="1">
            <br><br>
            <label>Height (px):</label>
            <input type="number" id="resizeHeight" placeholder="e.g. 600" min="1">
            <br><br>
            <button type="button" id="resizeBtn">📐 Resize Image</button>
            <div id="resizeResult"></div>
            <br>
            <button type="button" id="resizeBackBtn">← Back to Tools</button>
        </div>
    `;

    const input = document.getElementById("resizeInput");
    const widthInput = document.getElementById("resizeWidth");
    const heightInput = document.getElementById("resizeHeight");
    const resizeBtn = document.getElementById("resizeBtn");
    const result = document.getElementById("resizeResult");
    const backBtn = document.getElementById("resizeBackBtn");

    resizeBtn.addEventListener("click", () => {
        const file = input.files[0];
        const width = parseInt(widthInput.value, 10);
        const height = parseInt(heightInput.value, 10);

        if (!file) {
            alert("Please select an image file.");
            return;
        }
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert("Please enter valid width and height values.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const resizedData = canvas.toDataURL("image/jpeg", 0.92);

                result.innerHTML = `
                    <div class="result-box">
                        <h3>✅ Image Resized!</h3>
                        <p><strong>New Dimensions:</strong> ${width} × ${height} px</p>
                        <br>
                        <img src="${resizedData}" class="preview" alt="Resized preview">
                        <br><br>
                        <a href="${resizedData}" download="DocPinch-resized.jpg">
                            <button type="button">⬇️ Download Resized Image</button>
                        </a>
                        <br><br>
                        <button type="button" onclick="openImageResizer()">🔄 Resize Another</button>
                    </div>
                `;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    backBtn.addEventListener("click", goToTools);
}

// =====================================================
// 3. IMAGE CROPPER
// =====================================================

function openImageCropper() {
    document.querySelector("main").innerHTML = `
        <div class="compressor">
            <h2>✂️ Image Cropper</h2>
            <p>Crop specific areas of an image by specifying offsets and dimensions.</p>
            <br>
            <input type="file" id="cropInput" accept="image/*">
            <br><br>
            <label>Start X (px):</label>
            <input type="number" id="cropX" placeholder="0" min="0" value="0">
            <br><br>
            <label>Start Y (px):</label>
            <input type="number" id="cropY" placeholder="0" min="0" value="0">
            <br><br>
            <label>Width (px):</label>
            <input type="number" id="cropWidth" placeholder="300" min="1">
            <br><br>
            <label>Height (px):</label>
            <input type="number" id="cropHeight" placeholder="300" min="1">
            <br><br>
            <button type="button" id="cropBtn">✂️ Crop Image</button>
            <div id="cropResult"></div>
            <br>
            <button type="button" id="cropBackBtn">← Back to Tools</button>
        </div>
    `;

    const input = document.getElementById("cropInput");
    const cropX = document.getElementById("cropX");
    const cropY = document.getElementById("cropY");
    const cropWidth = document.getElementById("cropWidth");
    const cropHeight = document.getElementById("cropHeight");
    const cropBtn = document.getElementById("cropBtn");
    const result = document.getElementById("cropResult");
    const backBtn = document.getElementById("cropBackBtn");

    cropBtn.addEventListener("click", () => {
        const file = input.files[0];
        const x = parseInt(cropX.value, 10) || 0;
        const y = parseInt(cropY.value, 10) || 0;
        const width = parseInt(cropWidth.value, 10);
        const height = parseInt(cropHeight.value, 10);

        if (!file) {
            alert("Please select an image file first.");
            return;
        }

        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || x < 0 || y < 0) {
            alert("Please enter valid crop parameters.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                if (x + width > img.width || y + height > img.height) {
                    alert("Crop dimensions exceed original image size.");
                    return;
                }

                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(
                    img,
                    x, y, width, height,
                    0, 0, width, height
                );

                const croppedData = canvas.toDataURL("image/jpeg", 0.92);

                result.innerHTML = `
                    <div class="result-box">
                        <h3>✅ Image Cropped Successfully!</h3>
                        <p><strong>Size:</strong> ${width} × ${height} px</p>
                        <br>
                        <img src="${croppedData}" class="preview" alt="Cropped image preview">
                        <br><br>
                        <a href="${croppedData}" download="DocPinch-cropped.jpg">
                            <button type="button">⬇️ Download Cropped Image</button>
                        </a>
                        <br><br>
                        <button type="button" onclick="openImageCropper()">🔄 Crop Another</button>
                    </div>
                `;
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    backBtn.addEventListener("click", goToTools);
}

// =====================================================
// 4. IMAGE ROTATOR
// =====================================================

function openImageRotator() {
    document.querySelector("main").innerHTML = `
        <div class="compressor">
            <h2>🔄 Rotate Image</h2>
            <p>Rotate JPG and PNG images easily.</p>
            <br>
            <input type="file" id="rotateInput" accept="image/*">
            <br><br>
            <label>Rotation Angle:</label>
            <br>
            <select id="rotateAngle">
                <option value="90">90° Clockwise</option>
                <option value="180">180°</option>
                <option value="270">270° (90° Counter-Clockwise)</option>
            </select>
            <br><br>
            <button type="button" id="rotateBtn">🔄 Rotate Image</button>
            <div id="rotateResult"></div>
            <br>
            <button type="button" id="rotateBackBtn">← Back to Tools</button>
        </div>
    `;

    const input = document.getElementById("rotateInput");
    const angleSelect = document.getElementById("rotateAngle");
    const rotateBtn = document.getElementById("rotateBtn");
    const result = document.getElementById("rotateResult");
    const backBtn = document.getElementById("rotateBackBtn");

    rotateBtn.addEventListener("click", () => {
        const file = input.files[0];
        if (!file) {
            alert("Please select an image first.");
            return;
        }

        const angle = parseInt(angleSelect.value, 10);
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                if (angle === 90 || angle === 270) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((angle * Math.PI) / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);

                const rotatedData = canvas.toDataURL("image/jpeg", 0.92);

                result.innerHTML = `
                    <div class="result-box">
                        <h3>✅ Image Rotated!</h3>
                        <br>
                        <img src="${rotatedData}" class="preview" alt="Rotated image preview">
                        <br><br>
                        <a href="${rotatedData}" download="DocPinch-rotated.jpg">
                            <button type="button">⬇️ Download Image</button>
                        </a>
                        <br><br>
                        <button type="button" onclick="openImageRotator()">🔄 Rotate Another</button>
                    </div>
                `;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    backBtn.addEventListener("click", goToTools);
}

// =====================================================
// 5. FEATURE STUBS (PDF & DOC TOOLS)
// =====================================================

function openPDFCompressor() {
    alert("PDF Compressor feature coming soon!");
    goToTools();
}

function openPDFToImage() {
    alert("PDF → JPG/PNG feature coming soon!");
    goToTools();
}

function openPDFMerger() {
    alert("Merge PDF feature coming soon!");
    goToTools();
}

function openDocumentScanner() {
    alert("Document Scanner feature coming soon!");
    goToTools();
}

function openDocumentEnhance() {
    alert("Document Enhance feature coming soon!");
    goToTools();
}


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DocPinch – Free PDF & Image Tools</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
</head>
<body>

    <header class="navbar">
        <div class="logo-container">
            <img src="logo.svg" alt="DocPinch Logo" class="logo-img">
            <span class="logo-text">DocPinch</span>
        </div>
    </header>

    <main class="container">
        <div class="hero">
            <h1>Free Online PDF & Image Tools</h1>
            <p>Compress, convert, merge, resize, crop, rotate, scan, and enhance documents easily from your browser.</p>
        </div>

        <div class="tools-grid">
            <div class="tool-card" onclick="location.href='compress-image.html'">
                <div class="icon">🗜️</div>
                <h3>Image Compressor</h3>
                <p>Reduce image file size without losing quality.</p>
            </div>
            <div class="tool-card" onclick="location.href='resize-image.html'">
                <div class="icon">📐</div>
                <h3>Image Resizer</h3>
                <p>Resize JPG and PNG dimensions in pixels.</p>
            </div>
            <div class="tool-card" onclick="location.href='crop-image.html'">
                <div class="icon">✂️</div>
                <h3>Image Cropper</h3>
                <p>Crop images to exact dimensions.</p>
            </div>
            <div class="tool-card" onclick="location.href='rotate-image.html'">
                <div class="icon">🔄</div>
                <h3>Image Rotator</h3>
                <p>Rotate photos 90°, 180°, or 270° online.</p>
            </div>
            <div class="tool-card" onclick="location.href='compress-pdf.html'">
                <div class="icon">📄</div>
                <h3>PDF Compressor</h3>
                <p>Compress PDF files for easy sharing.</p>
            </div>
            <div class="tool-card" onclick="location.href='pdf-to-image.html'">
                <div class="icon">🖼️</div>
                <h3>PDF to JPG/PNG</h3>
                <p>Convert PDF pages into image files.</p>
            </div>
            <div class="tool-card" onclick="location.href='jpg-png-to-pdf.html'">
                <div class="icon">📑</div>
                <h3>JPG/PNG to PDF</h3>
                <p>Convert images into PDF documents.</p>
            </div>
            <div class="tool-card" onclick="location.href='merge-pdf.html'">
                <div class="icon">🧩</div>
                <h3>Merge PDF</h3>
                <p>Combine multiple PDFs into a single file.</p>
            </div>
        </div>

        <section class="about-section">
            <h2>About DocPinch</h2>
            <p>DocPinch is a free online platform providing client-side document and image processing utilities. All operations are processed locally in your web browser for total privacy.</p>
        </section>
    </main>

    <footer>
        <p>© 2026 DocPinch. All Rights Reserved.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
