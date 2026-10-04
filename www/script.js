
/* ==========================================================
 * DOCPINCH FINAL NAVIGATION CORE
 * Single Back destination for all tools.
 * ========================================================== */
(function () {
    "use strict";

    function dpGoToTools() {

        var targetUrl =
            new URL(
                "index.html",
                document.baseURI
            );

        /*
         * Keep the tools section as the destination and add a
         * unique query value so Android WebView performs a fresh
         * document navigation every time.
         */
        targetUrl.searchParams.set(
            "nav",
            "tools"
        );

        targetUrl.searchParams.set(
            "dp",
            String(Date.now())
        );

        targetUrl.hash = "tools";

        window.location.href =
            targetUrl.href;
    }

    window.dpGoToTools =
        dpGoToTools;

})();

// DocPinch - PDF & Image Tools
// Clean Full Version
// =====================================================


// =====================================================
// MAIN TOOL BUTTONS
// =====================================================

const buttons = document.querySelectorAll(".tools button");

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const text = button.innerText;

        if (text.includes("Compress PDF")) {

            openPDFCompressor();

        } else if (text.includes("Compress Image")) {

            openImageCompressor();

        } else if (text.includes("PDF \u2192 JPG/PNG")) {

            openPDFToImage();

        } else if (text.includes("JPG/PNG")) {

            openImageToPDF();

        } else if (text.includes("Merge PDF")) {

            openPDFMerger();

        } else if (text.includes("Document Scanner")) {

            openDocumentScanner();

        } else if (text.includes("Document Enhance")) {

            openDocumentEnhance();

        } else if (text.includes("Resize Image")) {

            openImageResizer();

        } else if (text.includes("Crop Image")) {

            openImageCropper();

        } else if (text.includes("Rotate Image")) {

            openImageRotator();

        } else {

            alert(text + " - Coming Soon!");

        }

    });

});


// =====================================================
// FILE SIZE FORMAT
// =====================================================

function formatBytes(bytes) {

    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const i = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    const index = Math.min(
        i,
        units.length - 1
    );

    return (
        parseFloat(
            (bytes / Math.pow(1024, index)).toFixed(2)
        ) +
        " " +
        units[index]
    );
}


// =====================================================
// DOCPINCH — COMMON PROCESSING SYSTEM
// STEP 94
// =====================================================

function showProcessing(
    button,
    message = "⏳ Processing..."
) {

    if (!button) return;

    if (!button.dataset.originalText) {
        button.dataset.originalText =
            button.innerHTML;
    }

    button.disabled = true;

    button.classList.add(
        "processing-button"
    );

    button.innerHTML = `
        <span class="dp-spinner"></span>
        ${message}
    `;

}


function hideProcessing(button) {

    if (!button) return;

    button.disabled = false;

    button.classList.remove(
        "processing-button"
    );

    if (button.dataset.originalText) {

        button.innerHTML =
            button.dataset.originalText;

        delete button.dataset.originalText;

    }

}


function showProcessingBox(
    container,
    message = "⏳ Processing..."
) {

    if (!container) return;

    container.innerHTML = `

        <div class="dp-processing-box">

            <div class="dp-spinner dp-spinner-large"></div>

            <strong>
                ${message}
            </strong>

            <span>
                Please wait...
            </span>

        </div>

    `;

}

// =====================================================
// IMAGE COMPRESSOR
// =====================================================

function openImageCompressor() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">

            <h2>🖼️ Image Compressor</h2>

            <p>
                Select an image and reduce its file size.
            </p>

            <br>

            <input
                type="file"
                id="imageInput"
                accept="image/*"
            >

            <br><br>

            <label>
                Quality:
                <strong id="qualityValue">70%</strong>
            </label>

            <br>

            <input
                type="range"
                id="quality"
                min="10"
                max="100"
                value="70"
            >

            <br><br>

            <button id="compressBtn">
                ⚡ Compress Image
            </button>

            <div id="result"></div>

            <br>

            <button id="backBtn">
                ← Back to Tools
            </button>

        </div>
    `;

    const imageInput =
        document.getElementById("imageInput");

    const quality =
        document.getElementById("quality");

    const qualityValue =
        document.getElementById("qualityValue");

    const compressBtn =
        document.getElementById("compressBtn");

    const result =
        document.getElementById("result");

    const backBtn =
        document.getElementById("backBtn");


    quality.addEventListener("input", () => {

        qualityValue.textContent =
            quality.value + "%";

    });


    compressBtn.addEventListener("click", () => {

        const file = imageInput.files[0];

        if (!file) {

            alert(
                "Please select an image first."
            );

            return;
        }


        showProcessing(
            compressBtn,
            "Compressing Image..."
        );


        const reader =
            new FileReader();


        reader.onload = function (event) {

            const img =
                new Image();


            img.onload = function () {

                const canvas =
                    document.createElement("canvas");

                const ctx =
                    canvas.getContext("2d");


                canvas.width =
                    img.width;

                canvas.height =
                    img.height;


                ctx.drawImage(
                    img,
                    0,
                    0
                );


                const compressedData =
                    canvas.toDataURL(
                        "image/jpeg",
                        Number(quality.value) / 100
                    );


                const base64 =
                    compressedData.split(",")[1] || "";

                const compressedSize =
                    Math.max(
                        0,
                        Math.round(
                            (base64.length * 3) / 4
                        )
                    );


                const savedBytes =
                    Math.max(
                        0,
                        file.size - compressedSize
                    );


                let compressionPercent = 0;


                if (file.size > 0) {

                    compressionPercent =
                        Math.max(
                            0,
                            Math.round(
                                (savedBytes / file.size) * 100
                            )
                        );

                }


                hideProcessing(compressBtn);

                result.innerHTML = `
                    <div class="result-box">

                        <h3>
                            ✅ Compression Complete
                        </h3>

                        <p>
                            <strong>Original Size:</strong>
                            ${formatBytes(file.size)}
                        </p>

                        <p>
                            <strong>Compressed Size:</strong>
                            ${formatBytes(compressedSize)}
                        </p>

                        <p>
                            <strong>Saved:</strong>
                            ${compressionPercent}%
                        </p>

                        <p>
                            <strong>Output File:</strong>
                            DocPinch-compressed.jpg
                        </p>

                        <br>

                        <img
                            src="${compressedData}"
                            class="preview"
                            alt="Compressed image preview"
                        >

                        <br><br>

                        <a
                            href="${compressedData}"
                            download="DocPinch-compressed.jpg"
                        >⬇️ Download Image</a>

                        <br><br>

                        <button
                            onclick="openImageCompressor()"
                        >
                            🔄 Compress Another
                        </button>

                    </div>
                `;

            };
loadOrientedImageFromFile(file).then(function(orientedImg){ img.src=orientedImg.src; }).catch(function(error){ console.error("Image orientation error:",error); alert("Unable to process this image."); });
        };


        reader.onerror = function () {

            hideProcessing(
                compressBtn
            );

            result.innerHTML =
                "";

            alert(
                "Unable to read the selected image."
            );

        };


        reader.readAsDataURL(file);

    });


    backBtn.addEventListener("click", () => {

        dpGoToTools();

    });

}


// =====================================================
// JPG / PNG → PDF
// =====================================================

function openImageToPDF() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">
        <h2>🔄 JPG/PNG → PDF</h2>

        <p style="margin:15px 0;">
            Select one or multiple images to create a PDF.
        </p>

        <div style="margin:25px 0;">

            <input
                type="file"
                id="imageToPDFInput"
                accept="image/jpeg,image/png"
                multiple
            >

            <br><br>

            <button id="createPDFBtn">
                📄 Create PDF
            </button>

            <p
                id="imagePDFStatus"
                style="margin-top:20px;"
            ></p>

        </div>

        <div id="imagePDFResult"></div>

        <br>

        <button id="imagePDFBackBtn">
            ⬅️ Back
        </button>
    
        </div>
    `;


    document
        .getElementById("createPDFBtn")
        .addEventListener(
            "click",
            createPDF
        );


    document
        .getElementById("imagePDFBackBtn")
        .addEventListener(
            "click",
            () => {
                dpGoToTools();
            }
        );


    async function createPDF() {

        const input =
            document.getElementById(
                "imageToPDFInput"
            );

        const status =
            document.getElementById(
                "imagePDFStatus"
            );

        const result =
            document.getElementById(
                "imagePDFResult"
            );


        const createBtn =
            document.getElementById(
                "createPDFBtn"
            );


        if (!input.files.length) {

            alert(
                "Please select at least one image."
            );

            return;
        }


        showProcessing(
            createBtn,
            "Creating PDF..."
        );


        status.innerText =
            "⏳ Creating PDF...";

        result.innerHTML = "";


        try {

            const jsPDF =
                window.jspdf?.jsPDF;


            if (!jsPDF) {

                throw new Error(
                    "jsPDF library is not available."
                );

            }


            let pdf = null;


            for (
                let i = 0;
                i < input.files.length;
                i++
            ) {

                const file =
                    input.files[i];


                status.innerText =
                    `⏳ Adding image ${i + 1} of ${input.files.length}...`;


                const imageURL =
                    await readImageAsDataURL(file);


                const image =
                    await loadImage(imageURL);


                const orientation =
                    image.width > image.height
                        ? "landscape"
                        : "portrait";


                if (i === 0) {

                    pdf = new jsPDF({
                        orientation,
                        unit: "pt",
                        format: "a4"
                    });

                } else {

                    pdf.addPage(
                        "a4",
                        orientation
                    );

                }


                const pageWidth =
                    pdf.internal.pageSize.getWidth();

                const pageHeight =
                    pdf.internal.pageSize.getHeight();


                const margin = 20;


                const maxWidth =
                    pageWidth - (margin * 2);

                const maxHeight =
                    pageHeight - (margin * 2);


                const ratio =
                    Math.min(
                        maxWidth / image.width,
                        maxHeight / image.height
                    );


                const imageWidth =
                    image.width * ratio;

                const imageHeight =
                    image.height * ratio;


                const x =
                    (pageWidth - imageWidth) / 2;

                const y =
                    (pageHeight - imageHeight) / 2;


                const format =
                    file.type === "image/png"
                        ? "PNG"
                        : "JPEG";


                pdf.addImage(
                    imageURL,
                    format,
                    x,
                    y,
                    imageWidth,
                    imageHeight
                );

            }


            const pdfBlob =
                pdf.output("blob");


            const downloadURL =
                URL.createObjectURL(
                    pdfBlob
                );


            status.innerText =
                "✅ PDF created successfully!";


            hideProcessing(createBtn);

            result.innerHTML = `
                <div
                    style="
                        background:white;
                        padding:25px;
                        margin-top:20px;
                        border-radius:15px;
                        box-shadow:0 4px 15px rgba(0,0,0,0.08);
                    "
                >

                    <h3>
                        📄 PDF Ready
                    </h3>

                    <p style="margin-top:15px;">
                        <strong>Images:</strong>
                        ${input.files.length}
                    </p>

                    <p>
                        <strong>PDF Pages:</strong>
                        ${input.files.length}
                    </p>

                    <p>
                        <strong>PDF Size:</strong>
                        ${formatBytes(pdfBlob.size)}
                    </p>

                    <br>

                    <a
                        href="${downloadURL}"
                        download="DocPinch-images.pdf"
                        style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#111827;
                            color:white;
                            text-decoration:none;
                            border-radius:10px;
                            font-weight:bold;
                        "
                    >
                        ⬇️ Download PDF
                    </a>

                    <br><br>

                    <button
                        onclick="openImageToPDF()"
                    >
                        🔄 Create Another PDF
                    </button>

                </div>
            `;

        } catch (error) {
            hideProcessing(createBtn);


            console.error(error);

            status.innerText =
                "❌ PDF creation failed.";

            alert(
                "Could not create PDF. Please try again."
            );

        }

    }


    function readImageAsDataURL(file) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload =
                    () => resolve(
                        reader.result
                    );


                reader.onerror =
                    () => reject(
                        reader.error
                    );


                reader.readAsDataURL(file);

            }
        );

    }


    function loadImage(src) {

        return new Promise(
            (resolve, reject) => {

                const image =
                    new Image();


                image.onload =
                    () => resolve(image);


                image.onerror =
                    () => reject(
                        new Error(
                            "Image could not be loaded."
                        )
                    );


                image.src =
                    src;

            }
        );

    }

}


// =====================================================
/* =====================================================
 * DOCPINCH COMMON IMAGE ORIENTATION NORMALIZER
 * STEP 4.4
 *
 * Uses EXIF orientation when supported by the browser.
 * Returns a normal HTMLImageElement for downstream tools.
 * ===================================================== */

async function loadOrientedImageFromFile(
    file,
    targetWidth = null,
    targetHeight = null
) {

    if (!file) {
        throw new Error(
            "No image file was provided."
        );
    }

    if (
        !file.type ||
        !file.type.startsWith("image/")
    ) {
        throw new Error(
            "The selected file is not an image."
        );
    }

    if (
        typeof window.createImageBitmap ===
        "function"
    ) {

        try {

            const hasTargetSize =
                Number(targetWidth) > 0 &&
                Number(targetHeight) > 0;

            const bitmapOptions = {
                imageOrientation:
                    "from-image"
            };

            if (hasTargetSize) {

                bitmapOptions.resizeWidth =
                    Math.round(
                        Number(targetWidth)
                    );

                bitmapOptions.resizeHeight =
                    Math.round(
                        Number(targetHeight)
                    );

                bitmapOptions.resizeQuality =
                    "high";

            }

            const bitmap =
                await window.createImageBitmap(
                    file,
                    bitmapOptions
                );

            const canvas =
                document.createElement(
                    "canvas"
                );

            canvas.width =
                bitmap.width;

            canvas.height =
                bitmap.height;

            const ctx =
                canvas.getContext(
                    "2d"
                );

            if (!ctx) {

                if (
                    typeof bitmap.close ===
                    "function"
                ) {
                    bitmap.close();
                }

                throw new Error(
                    "Canvas is not supported."
                );

            }

            ctx.drawImage(
                bitmap,
                0,
                0
            );

            const dataUrl =
                canvas.toDataURL(
                    "image/png"
                );

            if (
                typeof bitmap.close ===
                "function"
            ) {
                bitmap.close();
            }

            return await new Promise(
                (resolve, reject) => {

                    const img =
                        new Image();

                    img.onload =
                        function() {
                            resolve(img);
                        };

                    img.onerror =
                        function() {
                            reject(
                                new Error(
                                    "Normalized image could not be loaded."
                                )
                            );
                        };

                    img.src =
                        dataUrl;

                }
            );

        }
        catch (error) {

            console.warn(
                "EXIF orientation normalization failed. Using fallback.",
                error
            );

        }

    }

    return await new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload =
                function(event) {

                    const img =
                        new Image();

                    img.onload =
                        function() {
                            resolve(img);
                        };

                    img.onerror =
                        function() {
                            reject(
                                new Error(
                                    "Image could not be loaded."
                                )
                            );
                        };

                    img.src =
                        event.target.result;

                };

            reader.onerror =
                function() {

                    reject(
                        reader.error ||
                        new Error(
                            "Unable to read image file."
                        )
                    );

                };

            reader.readAsDataURL(
                file
            );

        }
    );

}

// IMAGE RESIZER
// =====================================================

function openImageResizer() {

    const main =
        document.querySelector("main");

    main.innerHTML = `

        <div class="compressor resize-tool">

            <div class="resize-header">

                <span class="resize-icon">
                    📏
                </span>

                <div>
                    <h2>
                        Resize Image
                    </h2>

                    <p>
                        Change image width and height while
                        keeping the correct aspect ratio.
                    </p>
                </div>

            </div>


            <div class="resize-upload-card">

                <label
                    for="resizeInput"
                    class="resize-file-label"
                >

                    <span class="resize-upload-icon">
                        🖼️
                    </span>

                    <strong>
                        Choose Image
                    </strong>

                    <span>
                        JPG, JPEG, PNG or WebP
                    </span>

                </label>

                <input
                    type="file"
                    id="resizeInput"
                    accept="image/jpeg,image/png,image/webp"
                >

            </div>


            <div
                id="resizeOriginalInfo"
                class="resize-original-info"
                hidden
            >

                <div>
                    <span>Original Size</span>
                    <strong id="resizeOriginalSize">—</strong>
                </div>

                <div>
                    <span>File</span>
                    <strong id="resizeFileName">—</strong>
                </div>

            </div>


            <div class="resize-controls">

                <div class="resize-field">
                    <label for="resizeWidth">
                        Width (px)
                    </label>

                    <input
                        type="number"
                        id="resizeWidth"
                        placeholder="Width"
                        min="1"
                        inputmode="numeric"
                    >
                </div>


                <div class="resize-field">
                    <label for="resizeHeight">
                        Height (px)
                    </label>

                    <input
                        type="number"
                        id="resizeHeight"
                        placeholder="Height"
                        min="1"
                        inputmode="numeric"
                    >
                </div>

            </div>


            <label
                class="resize-ratio-option"
                for="keepRatio"
            >

                <input
                    type="checkbox"
                    id="keepRatio"
                    checked
                >

                <span>
                    Keep aspect ratio
                </span>

            </label>


            <button
                type="button"
                id="resizeBtn"
                class="resize-primary-btn"
            >
                📏 Resize Image
            </button>


            <div
                id="resizeStatus"
                class="resize-status"
                hidden
            ></div>


            <div
                id="resizeResult"
                class="resize-result"
            ></div>


            <button
                type="button"
                id="resizeBackBtn"
                class="resize-back-btn"
            >
                ← Back to Tools
            </button>

        </div>

    `;

    const input =
        document.getElementById("resizeInput");

    const widthInput =
        document.getElementById("resizeWidth");

    const heightInput =
        document.getElementById("resizeHeight");

    const keepRatio =
        document.getElementById("keepRatio");

    const resizeBtn =
        document.getElementById("resizeBtn");

    const result =
        document.getElementById("resizeResult");

    const backBtn =
        document.getElementById("resizeBackBtn");

    const originalInfo =
        document.getElementById("resizeOriginalInfo");

    const originalSize =
        document.getElementById("resizeOriginalSize");

    const fileName =
        document.getElementById("resizeFileName");

    const status =
        document.getElementById("resizeStatus");


    let originalRatio = 1;
    let originalWidth = 0;
    let originalHeight = 0;
    let selectedFile = null;


    function setStatus(
        message,
        type = "info"
    ) {

        status.hidden = false;
        status.className =
            "resize-status " + type;
        status.textContent = message;

    }


    function clearStatus() {

        status.hidden = true;
        status.textContent = "";

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];

            if (!file) {

                selectedFile = null;
                originalInfo.hidden = true;
                widthInput.value = "";
                heightInput.value = "";
                result.innerHTML = "";
                clearStatus();

                return;

            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image file."
                );

                input.value = "";
                selectedFile = null;

                return;

            }


            selectedFile = file;

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const img =
                        new Image();


                    img.onload =
                        function() {

                            originalWidth =
                                img.naturalWidth;

                            originalHeight =
                                img.naturalHeight;

                            if (
                                originalWidth <= 0 ||
                                originalHeight <= 0
                            ) {

                                alert(
                                    "Unable to read image dimensions."
                                );

                                return;

                            }


                            originalRatio =
                                originalWidth /
                                originalHeight;


                            widthInput.value =
                                originalWidth;

                            heightInput.value =
                                originalHeight;


                            originalInfo.hidden =
                                false;

                            originalSize.textContent =
                                `${originalWidth} × ${originalHeight} px`;

                            fileName.textContent =
                                file.name;

                            result.innerHTML =
                                "";

                            clearStatus();

                        };


                    img.onerror =
                        function() {

                            alert(
                                "Unable to read this image."
                            );

                        };
img.src = event.target.result;
                };


            reader.onerror =
                function() {

                    alert(
                        "Unable to read the selected file."
                    );

                };


            reader.readAsDataURL(file);

        }
    );


    widthInput.addEventListener(
        "input",
        () => {

            if (
                !keepRatio.checked ||
                !originalRatio ||
                widthInput.value === ""
            ) {
                return;
            }


            const width =
                Number(widthInput.value);


            if (
                Number.isFinite(width) &&
                width > 0
            ) {

                heightInput.value =
                    Math.max(
                        1,
                        Math.round(
                            width /
                            originalRatio
                        )
                    );

            }

        }
    );


    heightInput.addEventListener(
        "input",
        () => {

            if (
                !keepRatio.checked ||
                !originalRatio ||
                heightInput.value === ""
            ) {
                return;
            }


            const height =
                Number(heightInput.value);


            if (
                Number.isFinite(height) &&
                height > 0
            ) {

                widthInput.value =
                    Math.max(
                        1,
                        Math.round(
                            height *
                            originalRatio
                        )
                    );

            }

        }
    );


    resizeBtn.addEventListener(
        "click",
        () => {

            const currentInputFile =
    input.files && input.files.length > 0
        ? input.files[0]
        : null;

if (currentInputFile) {
    selectedFile = currentInputFile;
}

if (!selectedFile) {

    alert(
        "Please select an image first."
    );

    return;

}


            const newWidth =
                parseInt(
                    widthInput.value,
                    10
                );

            const newHeight =
                parseInt(
                    heightInput.value,
                    10
                );


            if (
                !Number.isFinite(newWidth) ||
                !Number.isFinite(newHeight) ||
                newWidth <= 0 ||
                newHeight <= 0
            ) {

                alert(
                    "Please enter valid width and height."
                );

                return;

            }


            showProcessing(
                resizeBtn,
                "Resizing Image..."
            );

            setStatus(
                "⏳ Resizing image...",
                "processing"
            );

            showProcessingBox(
                result,
                "Creating resized image..."
            );


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const img =
                        new Image();


                    img.onload =
                        function() {

                            try {

                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );

                                const ctx =
                                    canvas.getContext(
                                        "2d"
                                    );


                                if (!ctx) {
                                    throw new Error(
                                        "Canvas is not supported."
                                    );
                                }


                                canvas.width =
                                    newWidth;

                                canvas.height =
                                    newHeight;


                                ctx.imageSmoothingEnabled =
                                    true;

                                ctx.imageSmoothingQuality =
                                    "high";


                                ctx.drawImage(
                                    img,
                                    0,
                                    0,
                                    newWidth,
                                    newHeight
                                );


                                const resizedImage =
                                    canvas.toDataURL(
                                        "image/jpeg",
                                        0.92
                                    );


                                result.innerHTML = `

                                    <div class="resize-result-card">

                                        <div
                                            class="resize-result-header"
                                        >

                                            <div>

                                                <span
                                                    class="resize-success-badge"
                                                >
                                                    ✓ Complete
                                                </span>

                                                <h3>
                                                    ✅ Image Resized Successfully!
                                                </h3>

                                            </div>

                                            <span
                                                class="resize-result-size"
                                            >
                                                ${newWidth} × ${newHeight} px
                                            </span>

                                        </div>


                                        <div
                                            class="resize-preview-frame"
                                        >

                                            <img
                                                src="${resizedImage}"
                                                class="resize-output-preview"
                                                alt="Resized image preview"
                                            >

                                        </div>


                                        <div
                                            class="resize-result-info"
                                        >

                                            <div>
                                                <span>Original</span>

                                                <strong>
                                                    ${originalWidth}
                                                    ×
                                                    ${originalHeight}
                                                    px
                                                </strong>
                                            </div>

                                            <div>
                                                <span>New Size</span>

                                                <strong>
                                                    ${newWidth}
                                                    ×
                                                    ${newHeight}
                                                    px
                                                </strong>
                                            </div>

                                        </div>


                                        <div
                                            class="resize-result-actions"
                                        >

                                            <a
                                                href="${resizedImage}"
                                                download="DocPinch-resized.jpg"
                                                class="resize-download-btn"
                                            >
                                                ⬇️ Download Resized Image
                                            </a>


                                            <button
                                                type="button"
                                                id="resizeAnotherBtn"
                                                class="resize-another-btn"
                                            >
                                                🔄 Resize Another
                                            </button>

                                        </div>

                                    </div>

                                `;


                                hideProcessing(resizeBtn);

                                setStatus(
                                    "✅ Resize complete.",
                                    "success"
                                );


                                document
                                    .getElementById(
                                        "resizeAnotherBtn"
                                    )
                                    .addEventListener(
                                        "click",
                                        () => {

                                            input.value = "";
                                            widthInput.value = "";
                                            heightInput.value = "";

                                            originalInfo.hidden =
                                                true;

                                            result.innerHTML =
                                                "";

                                            selectedFile =
                                                null;

                                            originalWidth =
                                                0;

                                            originalHeight =
                                                0;

                                            originalRatio =
                                                1;

                                            clearStatus();

                                        }
                                    );

                            } catch (error) {

                                console.error(error);

                                hideProcessing(resizeBtn);

                                result.innerHTML =
                                    "";

                                setStatus(
                                    "❌ Unable to resize this image.",
                                    "error"
                                );

                            }

                        };


                    img.onerror =
                        function() {

                            hideProcessing(resizeBtn);

                            result.innerHTML =
                                "";

                            setStatus(
                                "❌ Unable to process this image.",
                                "error"
                            );

                        };
img.src = event.target.result;
                };


            reader.onerror =
                function() {

                    hideProcessing(resizeBtn);

                    result.innerHTML =
                        "";

                    setStatus(
                        "❌ Unable to read the selected file.",
                        "error"
                    );

                };


            reader.readAsDataURL(
                selectedFile
            );

        }
    );


    backBtn.addEventListener(
    "click",
    () => {

        dpGoToTools();

    }
);

}

// =====================================================
// IMAGE CROP
// =====================================================

function openImageCropper() {

    const main =
        document.querySelector("main");


    main.innerHTML = `

        <div class="compressor cropper-tool">

            <h2>✂️ Crop Image</h2>

            <p>
                Select your image, drag the crop area and
                adjust the corners.
            </p>


            <input
                type="file"
                id="cropInput"
                accept="image/*"
            >


            <div
                id="cropWorkspace"
                hidden
            >

                <div
                    class="crop-editor"
                    id="cropEditor"
                >

                    <img
                        id="cropImagePreview"
                        class="crop-image-preview"
                        alt="Image crop preview"
                    >

                    <div
                        id="cropSelection"
                        class="crop-selection"
                    >

                        <div
                            class="crop-handle crop-handle-nw"
                            data-handle="nw"
                        ></div>

                        <div
                            class="crop-handle crop-handle-ne"
                            data-handle="ne"
                        ></div>

                        <div
                            class="crop-handle crop-handle-sw"
                            data-handle="sw"
                        ></div>

                        <div
                            class="crop-handle crop-handle-se"
                            data-handle="se"
                        ></div>

                    </div>

                </div>


                <div class="crop-info">

                    <div>

                        <span>
                            Original
                        </span>

                        <strong
                            id="cropOriginalSize"
                        >
                            —
                        </strong>

                    </div>


                    <div>

                        <span>
                            Selected
                        </span>

                        <strong
                            id="cropSelectedSize"
                        >
                            —
                        </strong>

                    </div>

                </div>


                <button
                    type="button"
                    id="cropBtn"
                >
                    ✂️ Crop Image
                </button>

            </div>


            <div
                id="cropResult"
                class="crop-result"
            ></div>


            <button
                type="button"
                id="cropBackBtn"
            >
                ← Back to Tools
            </button>

        </div>

    `;


    const input =
        document.getElementById(
            "cropInput"
        );

    const workspace =
        document.getElementById(
            "cropWorkspace"
        );

    const editor =
        document.getElementById(
            "cropEditor"
        );

    const image =
        document.getElementById(
            "cropImagePreview"
        );

    const selection =
        document.getElementById(
            "cropSelection"
        );

    const cropButton =
        document.getElementById(
            "cropBtn"
        );

    const result =
        document.getElementById(
            "cropResult"
        );

    const backButton =
        document.getElementById(
            "cropBackBtn"
        );

    const originalSize =
        document.getElementById(
            "cropOriginalSize"
        );

    const selectedSize =
        document.getElementById(
            "cropSelectedSize"
        );


    const handles =
        selection.querySelectorAll(
            ".crop-handle"
        );


    let naturalWidth = 0;
    let naturalHeight = 0;

    let displayWidth = 0;
    let displayHeight = 0;

    let crop = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    let action = null;

    let outputURL = null;


    // -------------------------------------------------
    // UPDATE INFO + SELECTION
    // -------------------------------------------------

    function updateSelection() {

        selection.style.left =
            `${crop.x}px`;

        selection.style.top =
            `${crop.y}px`;

        selection.style.width =
            `${crop.width}px`;

        selection.style.height =
            `${crop.height}px`;


        const sourceWidth =
            Math.max(
                1,
                Math.round(
                    crop.width *
                    naturalWidth /
                    displayWidth
                )
            );

        const sourceHeight =
            Math.max(
                1,
                Math.round(
                    crop.height *
                    naturalHeight /
                    displayHeight
                )
            );


        selectedSize.textContent =
            `${sourceWidth} × ${sourceHeight} px`;

    }


    // -------------------------------------------------
    // LOAD IMAGE
    // -------------------------------------------------

    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];

            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image file."
                );

                input.value = "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    image.onload =
    function() {

        /*
         * IMPORTANT:
         * Show the workspace BEFORE measuring the image.
         * Otherwise getBoundingClientRect() returns 0.
         */
        workspace.hidden =
            false;

        result.innerHTML =
            "";

        requestAnimationFrame(
            function() {

                naturalWidth =
                    image.naturalWidth;

                naturalHeight =
                    image.naturalHeight;

                displayWidth =
                    image.getBoundingClientRect()
                        .width;

                displayHeight =
                    image.getBoundingClientRect()
                        .height;

                if (
                    displayWidth <= 0 ||
                    displayHeight <= 0
                ) {

                    requestAnimationFrame(
                        setupCrop
                    );

                } else {

                    setupCrop();

                }

            }
        );

    };


loadOrientedImageFromFile(file).then(function(orientedImg){ image.src=orientedImg.src; }).catch(function(error){ console.error("Crop orientation error:",error); alert("Unable to process this image."); });

                };


            reader.onerror =
                function() {

                    alert(
                        "Unable to read the selected image."
                    );

                };


            reader.readAsDataURL(file);

        }
    );


    function setupCrop() {

        displayWidth =
            image.getBoundingClientRect()
                .width;

        displayHeight =
            image.getBoundingClientRect()
                .height;


        if (
            displayWidth <= 0 ||
            displayHeight <= 0
        ) {

            return;

        }


        const marginX =
            displayWidth * 0.08;

        const marginY =
            displayHeight * 0.08;


        crop = {

            x: marginX,

            y: marginY,

            width:
                Math.max(
                    30,
                    displayWidth -
                    marginX * 2
                ),

            height:
                Math.max(
                    30,
                    displayHeight -
                    marginY * 2
                )

        };


        originalSize.textContent =
            `${naturalWidth} × ${naturalHeight} px`;


        workspace.hidden =
            false;


        result.innerHTML =
            "";


        updateSelection();

    }


    // -------------------------------------------------
    // POINT CLAMPING
    // -------------------------------------------------

    function clampCrop() {

        const minSize =
            Math.min(
                30,
                Math.min(
                    displayWidth,
                    displayHeight
                )
            );


        crop.width =
            Math.max(
                minSize,
                Math.min(
                    crop.width,
                    displayWidth -
                    crop.x
                )
            );

        crop.height =
            Math.max(
                minSize,
                Math.min(
                    crop.height,
                    displayHeight -
                    crop.y
                )
            );


        crop.x =
            Math.max(
                0,
                Math.min(
                    crop.x,
                    displayWidth -
                    crop.width
                )
            );

        crop.y =
            Math.max(
                0,
                Math.min(
                    crop.y,
                    displayHeight -
                    crop.height
                )
            );

    }


    // -------------------------------------------------
    // START MOVE / RESIZE
    // -------------------------------------------------

    function startAction(
        event,
        mode
    ) {

        event.preventDefault();

        event.stopPropagation();


        action = {

            mode,

            startX:
                event.clientX,

            startY:
                event.clientY,

            startCrop:
                {
                    x: crop.x,
                    y: crop.y,
                    width: crop.width,
                    height: crop.height
                }

        };


        if (
            event.pointerId !== undefined
        ) {

            try {
                event.target.setPointerCapture(
                    event.pointerId
                );
            } catch (_) {
                // Ignore unsupported capture.
            }

        }

    }


    function moveAction(event) {

        if (!action) {
            return;
        }


        const dx =
            event.clientX -
            action.startX;

        const dy =
            event.clientY -
            action.startY;


        const start =
            action.startCrop;


        if (action.mode === "move") {

            crop.x =
                start.x + dx;

            crop.y =
                start.y + dy;

        }


        if (action.mode === "nw") {

            crop.x =
                start.x + dx;

            crop.y =
                start.y + dy;

            crop.width =
                start.width - dx;

            crop.height =
                start.height - dy;

        }


        if (action.mode === "ne") {

            crop.y =
                start.y + dy;

            crop.width =
                start.width + dx;

            crop.height =
                start.height - dy;

        }


        if (action.mode === "sw") {

            crop.x =
                start.x + dx;

            crop.width =
                start.width - dx;

            crop.height =
                start.height + dy;

        }


        if (action.mode === "se") {

            crop.width =
                start.width + dx;

            crop.height =
                start.height + dy;

        }


        clampCrop();

        updateSelection();

    }


    function stopAction() {

        action = null;

    }


    selection.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.target.closest(
                    ".crop-handle"
                )
            ) {
                return;
            }

            startAction(
                event,
                "move"
            );

        }
    );


    handles.forEach(
        (handle) => {

            handle.addEventListener(
                "pointerdown",
                (event) => {

                    const mode =
                        handle.dataset.handle;

                    startAction(
                        event,
                        mode
                    );

                }
            );

        }
    );


    window.addEventListener(
        "pointermove",
        moveAction
    );


    window.addEventListener(
        "pointerup",
        stopAction
    );


    window.addEventListener(
        "pointercancel",
        stopAction
    );


    // -------------------------------------------------
    // WINDOW RESIZE
    // -------------------------------------------------

    let lastDisplayWidth = 0;
    let lastDisplayHeight = 0;


    function preserveCropAfterResize() {

        if (
            !naturalWidth ||
            !naturalHeight ||
            !displayWidth ||
            !displayHeight
        ) {

            return;

        }


        const newWidth =
            image.getBoundingClientRect()
                .width;

        const newHeight =
            image.getBoundingClientRect()
                .height;


        if (
            !newWidth ||
            !newHeight
        ) {
            return;
        }


        if (
            lastDisplayWidth &&
            lastDisplayHeight
        ) {

            const scaleX =
                newWidth /
                lastDisplayWidth;

            const scaleY =
                newHeight /
                lastDisplayHeight;


            crop.x *= scaleX;
            crop.y *= scaleY;
            crop.width *= scaleX;
            crop.height *= scaleY;

        }


        displayWidth =
            newWidth;

        displayHeight =
            newHeight;

        lastDisplayWidth =
            newWidth;

        lastDisplayHeight =
            newHeight;


        clampCrop();
        updateSelection();

    }


    window.addEventListener(
        "resize",
        () => {

            if (
                !workspace.hidden
            ) {

                preserveCropAfterResize();

            }

        }
    );


    // -------------------------------------------------
    // CROP
    // -------------------------------------------------

    cropButton.addEventListener(
        "click",
        () => {

            if (
                !naturalWidth ||
                !naturalHeight ||
                !displayWidth ||
                !displayHeight
            ) {

                alert(
                    "Please select an image first."
                );

                return;

            }


            showProcessing(
                cropButton,
                "Cropping Image..."
            );

            result.innerHTML = "";

            showProcessingBox(
                result,
                "Creating cropped image..."
            );


            const scaleX =
                naturalWidth /
                displayWidth;

            const scaleY =
                naturalHeight /
                displayHeight;


            const sx =
                Math.max(
                    0,
                    Math.round(
                        crop.x *
                        scaleX
                    )
                );

            const sy =
                Math.max(
                    0,
                    Math.round(
                        crop.y *
                        scaleY
                    )
                );

            const sw =
                Math.max(
                    1,
                    Math.min(
                        naturalWidth - sx,
                        Math.round(
                            crop.width *
                            scaleX
                        )
                    )
                );

            const sh =
                Math.max(
                    1,
                    Math.min(
                        naturalHeight - sy,
                        Math.round(
                            crop.height *
                            scaleY
                        )
                    )
                );


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                sw;

            canvas.height =
                sh;


            const ctx =
                canvas.getContext(
                    "2d"
                );


            if (!ctx) {

                hideProcessing(cropButton);

                result.innerHTML =
                    "";

                alert(
                    "Canvas is not supported by this browser."
                );

                return;

            }


            ctx.imageSmoothingEnabled =
                true;

            ctx.imageSmoothingQuality =
                "high";


            ctx.drawImage(
                image,
                sx,
                sy,
                sw,
                sh,
                0,
                0,
                sw,
                sh
            );


            canvas.toBlob(
                (blob) => {

                    if (!blob) {

                        hideProcessing(
                            cropButton
                        );

                        result.innerHTML =
                            "";

                        alert(
                            "Unable to create the cropped image."
                        );

                        return;

                    }


                    if (outputURL) {

                        URL.revokeObjectURL(
                            outputURL
                        );

                    }


                    outputURL =
                        URL.createObjectURL(
                            blob
                        );


                    result.innerHTML = `

                        <div class="crop-result-box">

                            <h3>
                                ✅ Image Cropped Successfully!
                            </h3>

                            <p>
                                <strong>
                                    New Size:
                                </strong>
                                ${sw} × ${sh} px
                            </p>


                            <img
                                src="${outputURL}"
                                class="crop-output-preview"
                                alt="Cropped image preview"
                            >


                            <div
                                class="crop-result-actions"
                            >

                                <a
    href="${outputURL}"
    download="DocPinch-cropped.jpg"
    class="crop-download-btn"
>
    ⬇️ Download Cropped Image
</a>


                                <button
                                    type="button"
                                    id="cropAnotherBtn"
                                >
                                    🔄 Crop Another
                                </button>

                            </div>

                        </div>

                    `;


                    hideProcessing(
                        cropButton
                    );


                    document
                        .getElementById(
                            "cropAnotherBtn"
                        )
                        .addEventListener(
                            "click",
                            () => {

                                input.value =
                                    "";

                                workspace.hidden =
                                    true;

                                result.innerHTML =
                                    "";

                                naturalWidth =
                                    0;

                                naturalHeight =
                                    0;

                                displayWidth =
                                    0;

                                displayHeight =
                                    0;

                            }
                        );

                },
                "image/jpeg",
                0.92
            );

        }
    );


    backButton.addEventListener(
        "click",
        () => {

            if (outputURL) {

                URL.revokeObjectURL(
                    outputURL
                );

                outputURL = null;

            }

            dpGoToTools();

        }
    );

}

// =====================================================
// IMAGE ROTATOR
// =====================================================

function openImageRotator() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">

            <h2>🔃 Rotate Image</h2>

            <p>
                Select an image and choose rotation.
            </p>

            <br>

            <input
                type="file"
                id="rotateInput"
                accept="image/*"
            >

            <br><br>

            <button id="rotate90">
                ↻ Rotate 90°
            </button>

            <button id="rotate180">
                ↻ Rotate 180°
            </button>

            <button id="rotate270">
                ↻ Rotate 270°
            </button>

            <div id="rotateResult"></div>

            <br>

            <button id="rotateBackBtn">
                ← Back to Tools
            </button>

        </div>
    `;


    const input =
        document.getElementById(
            "rotateInput"
        );

    const result =
        document.getElementById(
            "rotateResult"
        );

    const backBtn =
        document.getElementById(
            "rotateBackBtn"
        );


    function rotateImage(degrees) {

        const file =
            input.files[0];


        if (!file) {

            alert(
                "Please select an image first."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const img =
                    new Image();


                img.onload =
                    function () {

                        const canvas =
                            document.createElement(
                                "canvas"
                            );

                        const ctx =
                            canvas.getContext(
                                "2d"
                            );


                        const radians =
                            degrees * Math.PI / 180;


                        if (
                            degrees === 90 ||
                            degrees === 270
                        ) {

                            canvas.width =
                                img.height;

                            canvas.height =
                                img.width;

                        } else {

                            canvas.width =
                                img.width;

                            canvas.height =
                                img.height;

                        }


                        ctx.translate(
                            canvas.width / 2,
                            canvas.height / 2
                        );


                        ctx.rotate(
                            radians
                        );


                        ctx.drawImage(
                            img,
                            -img.width / 2,
                            -img.height / 2
                        );


                        const rotatedImage =
                            canvas.toDataURL(
                                "image/jpeg",
                                0.92
                            );


                        result.innerHTML = `
                            <div class="result-box">

                                <h3>
                                    ✅ Image Rotated Successfully!
                                </h3>

                                <p>
                                    <strong>Rotation:</strong>
                                    ${degrees}°
                                </p>

                                <br>

                                <img
                                    src="${rotatedImage}"
                                    class="preview"
                                    alt="Rotated image preview"
                                >

                                <br><br>

                                <a
                                    href="${rotatedImage}"
                                    download="DocPinch-rotated.jpg"
                                >⬇️ Download Rotated Image</a>

                                <br><br>

                                <button
                                    onclick="openImageRotator()"
                                >
                                    🔄 Rotate Another
                                </button>

                            </div>
                        `;

                    };


                img.src =
                    event.target.result;

            };


        reader.readAsDataURL(file);

    }


    document
        .getElementById("rotate90")
        .addEventListener(
            "click",
            () => rotateImage(90)
        );


    document
        .getElementById("rotate180")
        .addEventListener(
            "click",
            () => rotateImage(180)
        );


    document
        .getElementById("rotate270")
        .addEventListener(
            "click",
            () => rotateImage(270)
        );


    backBtn.addEventListener(
        "click",
        () => {
            dpGoToTools();
        }
    );

}


// =====================================================
// PDF COMPRESSOR
// =====================================================

function openPDFCompressor() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">
        <h2>📄 Compress PDF</h2>

        <div style="margin:25px 0;">

            <input
                type="file"
                id="pdfInput"
                accept="application/pdf"
            >

            <br><br>

            <label>
                Compression Quality:
                <strong id="pdfQualityValue">
                    65%
                </strong>
            </label>

            <br>

            <input
                type="range"
                id="pdfQuality"
                min="30"
                max="90"
                value="65"
            >

            <br><br>

            <button id="compressPDFBtn">
                Compress PDF
            </button>

            <p
                id="pdfStatus"
                style="margin-top:20px;"
            ></p>

            <div class="dp-progress-wrap">
                <progress
                    id="pdfCompressionProgress"
                    max="100"
                    value="0"
                ></progress>

                <span id="pdfCompressionProgressValue">
                    0%
                </span>
            </div>

        </div>

        <div id="pdfResult"></div>

        <br>

        <button id="pdfBackBtn">
            ⬅️ Back
        </button>
    
        </div>
    `;


    const qualitySlider =
        document.getElementById(
            "pdfQuality"
        );

    const qualityValue =
        document.getElementById(
            "pdfQualityValue"
        );


    qualitySlider.addEventListener(
        "input",
        () => {

            qualityValue.innerText =
                qualitySlider.value + "%";

        }
    );


    document
        .getElementById("compressPDFBtn")
        .addEventListener(
            "click",
            compressPDF
        );


    document
        .getElementById("pdfBackBtn")
        .addEventListener(
            "click",
            () => {
                dpGoToTools();
            }
        );


    async function compressPDF() {

        const input =
            document.getElementById(
                "pdfInput"
            );

        const status =
            document.getElementById(
                "pdfStatus"
            );

        const result =
            document.getElementById(
                "pdfResult"
            );


        if (!input.files.length) {

            alert(
                "Please select a PDF file."
            );

            return;
        }


        if (
            typeof pdfjsLib === "undefined" ||
            !window.jspdf?.jsPDF
        ) {

            alert(
                "PDF engine is not ready. Please wait a few seconds and try again."
            );

            return;
        }


        const file =
            input.files[0];

        const compressBtn =
            document.getElementById(
                "compressPDFBtn"
            );


        showProcessing(
            compressBtn,
            "Compressing PDF..."
        );


        status.innerText =
            "⏳ Compressing PDF...";


        result.innerHTML = "";


        try {

            const arrayBuffer =
                await file.arrayBuffer();


            const pdf =
                await pdfjsLib
                    .getDocument({
                        data: arrayBuffer
                    })
                    .promise;


            const totalPages =
                pdf.numPages;

            const progressBar =
                document.getElementById(
                    "pdfCompressionProgress"
                );

            const progressValue =
                document.getElementById(
                    "pdfCompressionProgressValue"
                );

            progressBar.max =
                totalPages;

            progressBar.value =
                0;

            progressValue.innerText =
                "0%";


            const jsPDF =
                window.jspdf.jsPDF;


            let outputPDF = null;


            const quality =
                parseInt(
                    qualitySlider.value,
                    10
                ) / 100;


            for (
                let pageNumber = 1;
                pageNumber <= totalPages;
                pageNumber++
            ) {

                const progressPercent =
                    Math.round(
                        (pageNumber / totalPages) * 100
                    );

                status.innerText =
                    `Compressing page ${pageNumber} of ${totalPages} (${progressPercent}%)...`;

                progressBar.value =
                    pageNumber;

                progressValue.innerText =
                    progressPercent + "%";


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const viewport =
                    page.getViewport({
                        scale: 1.2
                    });


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                const context =
                    canvas.getContext(
                        "2d"
                    );


                canvas.width =
                    Math.ceil(
                        viewport.width
                    );

                canvas.height =
                    Math.ceil(
                        viewport.height
                    );


                await page.render({
                    canvasContext: context,
                    viewport
                }).promise;


                const imageData =
                    canvas.toDataURL(
                        "image/jpeg",
                        quality
                    );


                const orientation =
                    viewport.width > viewport.height
                        ? "landscape"
                        : "portrait";


                if (!outputPDF) {

                    outputPDF =
                        new jsPDF({
                            orientation,
                            unit: "pt",
                            format: "a4",
                            compress: true
                        });

                } else {

                    outputPDF.addPage(
                        "a4",
                        orientation
                    );

                }


                const pageWidth =
                    outputPDF.internal
                        .pageSize
                        .getWidth();


                const pageHeight =
                    outputPDF.internal
                        .pageSize
                        .getHeight();


                const ratio =
                    Math.min(
                        pageWidth / viewport.width,
                        pageHeight / viewport.height
                    );


                const imageWidth =
                    viewport.width * ratio;

                const imageHeight =
                    viewport.height * ratio;


                const x =
                    (pageWidth - imageWidth) / 2;


                const y =
                    (pageHeight - imageHeight) / 2;


                outputPDF.addImage(
                    imageData,
                    "JPEG",
                    x,
                    y,
                    imageWidth,
                    imageHeight,
                    undefined,
                    "FAST"
                );

            }


            const compressedBlob =
                outputPDF.output(
                    "blob"
                );


            const originalSize =
                file.size;


            const compressedSize =
                compressedBlob.size;


            let savedPercent = 0;


            if (originalSize > 0) {

                savedPercent =
                    (
                        (
                            originalSize -
                            compressedSize
                        ) /
                        originalSize
                    ) * 100;

            }


            const downloadURL =
                URL.createObjectURL(
                    compressedBlob
                );


            status.innerText =
                "✅ PDF Compression Complete!";


            hideProcessing(compressBtn);

            result.innerHTML = `
                <div
                    class="result-box"
                >

                    <h3>
                        📊 Compression Result
                    </h3>

                    <p>
                        <strong>Original Size:</strong>
                        ${formatBytes(originalSize)}
                    </p>

                    <p>
                        <strong>Compressed Size:</strong>
                        ${formatBytes(compressedSize)}
                    </p>

                    <p>
                        <strong>Saved:</strong>
                        ${
                            savedPercent > 0
                                ? savedPercent.toFixed(1) + "%"
                                : "0%"
                        }
                    </p>

                    <p>
                        <strong>PDF Pages:</strong>
                        ${totalPages}
                    </p>

                    <p>
                        <strong>Output File:</strong>
                        DocPinch-compressed.pdf
                    </p>

                    <br>

                    <a
                        href="${downloadURL}"
                        download="DocPinch-compressed.pdf"
                    >⬇️ Download Compressed PDF</a>

                    <br><br>

                    <button
                        onclick="openPDFCompressor()"
                    >
                        🔄 Compress Another PDF
                    </button>

                </div>
            `;

        } catch (error) {
            hideProcessing(compressBtn);


            console.error(error);

            status.innerText =
                "❌ Error while compressing PDF.";

            alert(
                "PDF compression failed. Please try another PDF."
            );

        }

    }

}


// =====================================================
// PDF MERGER
// =====================================================

async function openPDFMerger() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">

            <h2>🔗 Merge PDF</h2>

            <p style="margin:15px 0;">
                Select multiple PDF files and combine them into one PDF.
            </p>

            <div style="margin:25px 0;">

                <input
                    type="file"
                    id="mergePDFInput"
                    accept="application/pdf"
                    multiple
                >

                <br><br>

                <button id="mergePDFBtn">
                    🔗 Merge PDF
                </button>

                <p
                    id="mergeStatus"
                    style="margin-top:20px;"
                ></p>

            </div>

            <div id="mergeResult"></div>

            <br>

            <button id="mergeBackBtn">
                ⬅️ Back
            </button>

        </div>
    `;

    const input =
        document.getElementById("mergePDFInput");

    const mergeBtn =
        document.getElementById("mergePDFBtn");

    const status =
        document.getElementById("mergeStatus");

    const result =
        document.getElementById("mergeResult");

    const nativeMergeAvailable =
        typeof window.DocPinchPdfMerge !== "undefined"
        &&
        typeof window.DocPinchPdfMerge.openMergePicker === "function";


    /*
     * Android native merge mode
     */
    if (nativeMergeAvailable) {

        input.style.display = "none";

        status.innerText =
            "📱 Android mode: tap Merge PDF to select multiple PDFs.";

    }


    document
        .getElementById("mergePDFBtn")
        .addEventListener(
            "click",
            mergePDFs
        );


    document
        .getElementById("mergeBackBtn")
        .addEventListener(
            "click",
            () => {
                dpGoToTools();
            }
        );


    /*
     * Native Android progress callback
     */
    window.onNativePdfMergeProgress =
    function (message) {

        const currentStatus =
            document.getElementById(
                "mergeStatus"
            );

        const currentResult =
            document.getElementById(
                "mergeResult"
            );

        const currentButton =
            document.getElementById(
                "mergePDFBtn"
            );


        /*
         * Keep ONE processing button.
         */
        if (currentButton) {

            showProcessing(
                currentButton,
                "Merging PDFs..."
            );

        }


        /*
         * Keep ONE visible progress message.
         */
        if (currentStatus) {

            currentStatus.innerText =
                message ||
                "⏳ Merging PDFs...";

        }


        /*
         * Do not repeat progress inside result box.
         * Result box is reserved for final output.
         */
        if (currentResult) {

            currentResult.innerHTML =
                "";

        }

    };
/*
     * Native Android completion callback
     */
    window.onNativePdfMergeComplete =
    function (payload) {

        const currentStatus =
            document.getElementById(
                "mergeStatus"
            );

        const currentResult =
            document.getElementById(
                "mergeResult"
            );

        const currentButton =
            document.getElementById(
                "mergePDFBtn"
            );


        try {

            const data =
                typeof payload === "string"
                    ? JSON.parse(payload)
                    : payload;


            if (currentButton) {

                hideProcessing(
                    currentButton
                );

            }


            if (
                !data ||
                !data.success
            ) {

                if (currentStatus) {

                    currentStatus.innerText =
                        "❌ PDF Merge Failed";

                }


                if (currentResult) {

                    currentResult.innerHTML = `
                        <div class="result-box">

                            <h3>
                                ❌ Merge Failed
                            </h3>

                            <p>
                                ${
                                    data?.error ||
                                    "Unable to merge the selected PDF files."
                                }
                            </p>

                            <br>

                            <button
                                type="button"
                                onclick="openPDFMerger()"
                            >
                                🔄 Try Again
                            </button>

                        </div>
                    `;

                }

                return;

            }


            if (currentStatus) {

                currentStatus.innerText =
                    "✅ PDF Merge Complete!";

            }


            if (currentResult) {

                currentResult.innerHTML = `
                    <div class="result-box">

                        <h3>
                            ✅ Merge Complete
                        </h3>

                        <p>
                            <strong>
                                PDF Files:
                            </strong>
                            ${data.fileCount || 0}
                        </p>

                        <p>
                            <strong>
                                Output Size:
                            </strong>
                            ${formatBytes(data.size || 0)}
                        </p>

                        <br>

                        <button
                            type="button"
                            onclick="downloadNativeMergedPDF()"
                        >
                            ⬇️ Download Merged PDF
                        </button>

                        <br><br>

                        <button
                            type="button"
                            onclick="openPDFMerger()"
                        >
                            🔄 Merge More PDFs
                        </button>

                    </div>
                `;

            }

        }
        catch (error) {

            console.error(
                "Native PDF merge callback error:",
                error
            );


            if (currentButton) {

                hideProcessing(
                    currentButton
                );

            }


            if (currentStatus) {

                currentStatus.innerText =
                    "❌ PDF Merge Failed";

            }


            if (currentResult) {

                currentResult.innerHTML = `
                    <div class="result-box">

                        <h3>
                            ❌ Merge Failed
                        </h3>

                        <p>
                            ${error?.message ||
                            "Unable to display the merge result."}
                        </p>

                    </div>
                `;

            }

        }

    };
/*
     * Native Android download callback
     */
    window.onNativePdfMergeDownloadComplete =
        function (payload) {

            try {

                const data =
                    typeof payload === "string"
                        ? JSON.parse(payload)
                        : payload;

                const currentStatus =
                    document.getElementById(
                        "mergeStatus"
                    );

                const currentResult =
                    document.getElementById(
                        "mergeResult"
                    );

                const currentButton =
                    document.getElementById(
                        "mergePDFBtn"
                    );


                if (currentButton) {

                    hideProcessing(
                        currentButton
                    );
                }


                if (data && data.success) {

                    if (currentStatus) {

                        currentStatus.innerText =
                            "PDF downloaded successfully.";
                    }


                    if (currentResult) {

                        currentResult.innerHTML = `
                            <div class="result-box">

                                <h3>
                                    Merge Complete
                                </h3>

                                <p>
                                    Your merged PDF has been saved to:
                                </p>

                                <p>
                                    <strong>
                                        Downloads/DocPinch
                                    </strong>
                                </p>

                                <br>

                                <button
                                    onclick="openPDFMerger()"
                                >
                                    Merge More PDFs
                                </button>

                            </div>
                        `;
                    }

                } else {

                    const errorMessage =
                        data && data.error
                            ? data.error
                            : "Download failed.";

                    if (currentStatus) {

                        currentStatus.innerText =
                            "Download failed.";
                    }

                    if (currentResult) {

                        currentResult.innerHTML = `
                            <div class="result-box">

                                <h3>
                                    Download Failed
                                </h3>

                                <p>
                                    ${errorMessage}
                                </p>

                                <br>

                                <button
                                    type="button"
                                    onclick="downloadNativeMergedPDF()"
                                >
                                    Download Again
                                </button>

                            </div>
                        `;
                    }

                }

            } catch (error) {

                console.error(
                    "Native PDF download callback error:",
                    error
                );

                alert(
                    "Download result could not be displayed."
                );
            }
        };


    /*
     * Native Android download button handler
     */
    window.downloadNativeMergedPDF =
        function () {

            const mergeBtn =
                document.getElementById(
                    "mergePDFBtn"
                );

            const result =
                document.getElementById(
                    "mergeResult"
                );

            const status =
                document.getElementById(
                    "mergeStatus"
                );


            const nativeDownloadAvailable =
                typeof window.DocPinchPdfMerge !== "undefined"
                &&
                typeof window.DocPinchPdfMerge.downloadMergedPdf === "function";


            if (!nativeDownloadAvailable) {

                alert(
                    "Native download is not available."
                );

                return;
            }


            if (mergeBtn) {

                showProcessing(
                    mergeBtn,
                    "Downloading..."
                );
            }


            if (status) {

                status.innerText =
                    "Saving merged PDF...";
            }


            if (result) {

                showProcessingBox(
                    result,
                    "Saving merged PDF to Downloads/DocPinch..."
                );
            }


            try {

                window.DocPinchPdfMerge
                    .downloadMergedPdf();

            } catch (error) {

                console.error(
                    "Native PDF download error:",
                    error
                );

                if (mergeBtn) {
                    hideProcessing(
                        mergeBtn
                    );
                }

                alert(
                    "Could not download the merged PDF."
                );
            }
        };
    async function mergePDFs() {


        /*
         * ANDROID:
         * Use native PDFBox merge.
         */
        if (nativeMergeAvailable) {

            showProcessing(
                mergeBtn,
                "Selecting PDFs..."
            );status.innerText =
                "⏳ Select your PDFs...";

            try {

                window.DocPinchPdfMerge
                    .openMergePicker();

            } catch (error) {

                console.error(
                    "Native PDF picker error:",
                    error
                );

                hideProcessing(
                    mergeBtn
                );

                status.innerText =
                    "❌ Could not open PDF picker.";

                result.innerHTML = "";

                alert(
                    "Could not open PDF picker."
                );
            }

            return;
        }


        /*
         * WEBSITE / BROWSER:
         * Keep existing pdf-lib merge.
         */
        if (input.files.length < 2) {

            alert(
                "Please select at least 2 PDF files."
            );

            return;
        }


        if (
            !window.PDFLib?.PDFDocument
        ) {

            alert(
                "PDF merge engine is not ready. Please wait a few seconds and try again."
            );

            return;
        }


        showProcessing(
            mergeBtn,
            "Merging PDFs..."
        );status.innerText =
            "⏳ Merging PDFs...";

        result.innerHTML = "";


        let currentMergeFileName = "";


        try {

            const mergedPdf =
                await PDFLib.PDFDocument.create();


            for (
                let i = 0;
                i < input.files.length;
                i++
            ) {

                status.innerText =
                    `⏳ Adding PDF ${i + 1} of ${input.files.length}...`;


                const file =
                    input.files[i];

                currentMergeFileName =
                    file.name;


                const arrayBuffer =
                    await file.arrayBuffer();


                const sourcePdf =
                    await Promise.race([
                        PDFLib.PDFDocument.load(
                            arrayBuffer,
                            {
                                ignoreEncryption: true,
                                throwOnInvalidObject: false,
                                updateMetadata: false
                            }
                        ),
                        new Promise(
                            (_, reject) =>
                                setTimeout(
                                    () =>
                                        reject(
                                            new Error(
                                                "PDF processing timed out after 60 seconds."
                                            )
                                        ),
                                    60000
                                )
                        )
                    ]);


                const pages =
                    await mergedPdf.copyPages(
                        sourcePdf,
                        sourcePdf.getPageIndices()
                    );


                pages.forEach(
                    (page) => {
                        mergedPdf.addPage(page);
                    }
                );
            }


            status.innerText =
                "⏳ Creating merged PDF...";


            const mergedBytes =
                await mergedPdf.save();


            const blob =
                new Blob(
                    [mergedBytes],
                    {
                        type: "application/pdf"
                    }
                );


            const downloadURL =
                URL.createObjectURL(
                    blob
                );


            status.innerText =
                "✅ PDFs merged successfully!";


            hideProcessing(
                mergeBtn
            );


            result.innerHTML = `
                <div class="result-box">

                    <h3>
                        ✅ Merge Complete
                    </h3>

                    <p>
                        <strong>PDF Files:</strong>
                        ${input.files.length}
                    </p>

                    <p>
                        <strong>Total Pages:</strong>
                        ${mergedPdf.getPageCount()}
                    </p>

                    <p>
                        <strong>Output Size:</strong>
                        ${formatBytes(blob.size)}
                    </p>

                    <br>

                    <a
                        href="${downloadURL}"
                        download="DocPinch-merged.pdf"
                    >
                        ⬇️ Download Merged PDF
                    </a>

                    <br><br>

                    <button
                        onclick="openPDFMerger()"
                    >
                        🔄 Merge More PDFs
                    </button>

                </div>
            `;

        } catch (error) {

            hideProcessing(
                mergeBtn
            );

            console.error(error);

            status.innerText =
                "❌ Error while merging PDFs.";

            alert(
                "PDF merge failed. Please check your PDF files."
            );
        }
    }
}

// =====================================================
// PDF → JPG / PNG
// =====================================================

function openPDFToImage() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">

            <h2>🖼️ PDF &rarr; JPG/PNG</h2>

            <p style="margin:15px 0;">
                Convert PDF pages into JPG or PNG images.
            </p>

            <div style="margin:25px 0;">

                <input
                    type="file"
                    id="pdfToImageInput"
                    accept="application/pdf"
                >

                <br><br>

                <label for="pdfImageFormat">
                    Output Format:
                </label>

                <select id="pdfImageFormat">
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                </select>

                <br><br>

                <label for="pdfImageQuality">
                    JPG Quality:
                    <strong id="pdfImageQualityValue">
                        80%
                    </strong>
                </label>

                <br>

                <input
                    type="range"
                    id="pdfImageQuality"
                    min="40"
                    max="100"
                    value="80"
                >

                <br><br>

                <button id="convertPDFBtn">
                    🖼️ Convert PDF
                </button>

                <p
                    id="pdfToImageStatus"
                    style="margin-top:20px;"
                ></p>

            </div>

            <div id="pdfToImageResult"></div>

            <br>

            <button id="pdfToImageBackBtn">
                ⬅️ Back
            </button>

        </div>
    `;


    const qualitySlider =
        document.getElementById(
            "pdfImageQuality"
        );

    const qualityValue =
        document.getElementById(
            "pdfImageQualityValue"
        );

    const formatSelect =
        document.getElementById(
            "pdfImageFormat"
        );


    qualitySlider.addEventListener(
        "input",
        () => {

            qualityValue.innerText =
                qualitySlider.value + "%";

        }
    );


    formatSelect.addEventListener(
        "change",
        () => {

            qualityValue.parentElement.style.opacity =
                formatSelect.value === "png"
                    ? "0.55"
                    : "1";

        }
    );


    document
        .getElementById("convertPDFBtn")
        .addEventListener(
            "click",
            convertPDF
        );


    document
        .getElementById("pdfToImageBackBtn")
        .addEventListener(
            "click",
            () => {
                dpGoToTools();
            }
        );


    async function convertPDF() {

        const input =
            document.getElementById(
                "pdfToImageInput"
            );

        const status =
            document.getElementById(
                "pdfToImageStatus"
            );

        const result =
            document.getElementById(
                "pdfToImageResult"
            );

        const format =
            formatSelect.value;


        if (!input.files.length) {

            alert(
                "Please select a PDF file."
            );

            return;
        }


        if (
            typeof pdfjsLib === "undefined"
        ) {

            alert(
                "PDF engine is not ready. Please wait a few seconds and try again."
            );

            return;
        }


        const convertBtn =
            document.getElementById(
                "convertPDFBtn"
            );


        showProcessing(
            convertBtn,
            "Converting PDF..."
        );

        status.innerText =
            "Loading PDF...";

        result.innerHTML = "";


        try {

            const file =
                input.files[0];

            const arrayBuffer =
                await file.arrayBuffer();

            const pdf =
                await pdfjsLib
                    .getDocument({
                        data: arrayBuffer
                    })
                    .promise;


            const quality =
                parseInt(
                    qualitySlider.value,
                    10
                ) / 100;


            result.innerHTML = `
                <div class="result-box">

                    <h3>
                        📄 PDF Pages (${pdf.numPages})
                    </h3>

                    <button
                        id="pdfDownloadAllBtn"
                        type="button"
                    >
                        ⬇️ Download All Pages
                    </button>

                    <div
                        id="pdfPages"
                        class="pdf-pages-grid"
                    ></div>

                </div>
            `;


            const pagesContainer =
                document.getElementById(
                    "pdfPages"
                );

            const downloadItems = [];


            for (
                let pageNumber = 1;
                pageNumber <= pdf.numPages;
                pageNumber++
            ) {

                status.innerText =
                    `Converting page ${pageNumber} of ${pdf.numPages}...`;


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const viewport =
                    page.getViewport({
                        scale: 1.5
                    });


                const canvas =
                    document.createElement(
                        "canvas"
                    );

                const context =
                    canvas.getContext(
                        "2d"
                    );


                canvas.width =
                    Math.ceil(
                        viewport.width
                    );

                canvas.height =
                    Math.ceil(
                        viewport.height
                    );


                await page.render({
                    canvasContext: context,
                    viewport
                }).promise;


                const mimeType =
                    format === "png"
                        ? "image/png"
                        : "image/jpeg";

                const extension =
                    format === "png"
                        ? "png"
                        : "jpg";


                const imageURL =
                    canvas.toDataURL(
                        mimeType,
                        quality
                    );


                const fileName =
                    `DocPinch-page-${pageNumber}.${extension}`;


                downloadItems.push({
                    url: imageURL,
                    name: fileName
                });


                const pageBox =
                    document.createElement(
                        "div"
                    );

                pageBox.className =
                    "pdf-page-card";


                pageBox.innerHTML = `

                    <div class="pdf-page-number">
                        Page ${pageNumber}
                    </div>

                    <img
                        src="${imageURL}"
                        alt="PDF page ${pageNumber}"
                        loading="lazy"
                    >

                    <a
                        href="${imageURL}"
                        download="${fileName}"
                    >
                        ⬇️ Download Page ${pageNumber}
                    </a>

                `;


                pagesContainer.appendChild(
                    pageBox
                );

            }


            const downloadAllBtn =
                document.getElementById(
                    "pdfDownloadAllBtn"
                );


            downloadAllBtn.addEventListener(
                "click",
                async () => {

                    if (!downloadItems.length) {
                        return;
                    }

                    downloadAllBtn.disabled =
                        true;

                    downloadAllBtn.innerText =
                        "⬇️ Starting downloads...";


                    for (
                        let i = 0;
                        i < downloadItems.length;
                        i++
                    ) {

                        const downloadLink =
                            document.createElement(
                                "a"
                            );

                        downloadLink.href =
                            downloadItems[i].url;

                        downloadLink.download =
                            downloadItems[i].name;

                        downloadLink.style.display =
                            "none";

                        document.body.appendChild(
                            downloadLink
                        );

                        downloadLink.click();

                        downloadLink.remove();

                        await new Promise(
                            resolve =>
                                setTimeout(
                                    resolve,
                                    250
                                )
                        );

                    }


                    downloadAllBtn.disabled =
                        false;

                    downloadAllBtn.innerText =
                        "⬇️ Download All Pages";

                    status.innerText =
                        `✅ ${downloadItems.length} page download requests started.`;

                }
            );


            hideProcessing(
                convertBtn
            );

            status.innerText =
                `✅ PDF converted successfully! ${pdf.numPages} pages ready.`;

        } catch (error) {

            hideProcessing(
                document.getElementById(
                    "convertPDFBtn"
                )
            );

            console.error(error);

            status.innerText =
                "❌ Conversion failed.";

            alert(
                "PDF conversion failed. Please try another PDF."
            );

        }

    }

}
// =====================================================
// DOCUMENT SCANNER
// =====================================================

function openDocumentScanner() {

    document.querySelector("main").innerHTML = `
        <div class="compressor">

            <h2>📐 Document Scanner</h2>

            <p>
                Upload a document, set 4 corners and scan.
            </p>

            <br>

            <input
                type="file"
                id="scannerInput"
                accept="image/*"
            >

            <br><br>

            <div
                id="scannerWorkspace"
                style="display:none;"
            >

                <p style="margin-bottom:15px;">
                    🔵 Drag the 4 blue points to the document corners.
                </p>

                <div
    id="scannerCanvasBox"
    style="
        position:relative !important;
        display:block !important;
        width:100% !important;
        max-width:760px !important;
        margin:20px auto !important;
        padding:0 !important;
        overflow:hidden !important;
        border-radius:12px !important;
        background:#f3f4f6 !important;
        line-height:0 !important;
    "
>

    <!-- VISIBLE ORIGINAL IMAGE -->
    <img
        id="scannerPreviewImage"
        alt="Document preview"
        style="
            position:relative !important;
            z-index:1 !important;
            display:block !important;
            width:100% !important;
            max-width:none !important;
            height:auto !important;
            margin:0 !important;
            padding:0 !important;
            border:0 !important;
            border-radius:12px !important;
            object-fit:contain !important;
        "
    >

    <!-- HIDDEN SOURCE CANVAS FOR OPENCV -->
    <canvas
        id="scannerCanvas"
        style="
            display:none !important;
        "
    ></canvas>

    <!-- 4-POINT OVERLAY -->
    <canvas
        id="scannerOverlay"
        style="
            position:absolute !important;
            z-index:3 !important;
            left:0 !important;
            top:0 !important;
            width:100% !important;
            height:100% !important;
            max-width:none !important;
            margin:0 !important;
            padding:0 !important;
            border:0 !important;
            background:transparent !important;
            touch-action:none !important;
            cursor:crosshair !important;
        "
    ></canvas>

</div>

<br><br>

                <button id="processScannerBtn">
                    📐 Scan Document
                </button>

                <p
                    id="scannerStatus"
                    style="margin-top:15px;"
                ></p>

            </div>

            <div id="scannerResult"></div>

            <br>

            <button id="scannerBackBtn">
                ⬅️ Back to Tools
            </button>

        </div>
    `;


    const input =
        document.getElementById(
            "scannerInput"
        );

    const workspace =
        document.getElementById(
            "scannerWorkspace"
        );

    const canvas =
        document.getElementById(
            "scannerCanvas"
        );

    const overlay =
        document.getElementById(
            "scannerOverlay"
        );

    const previewImage =
        document.getElementById(
            "scannerPreviewImage"
        );

    const ctx =
        canvas.getContext(
            "2d"
        );

    const overlayCtx =
        overlay.getContext(
            "2d"
        );

    const result =
        document.getElementById(
            "scannerResult"
        );

    const status =
        document.getElementById(
            "scannerStatus"
        );


    let image = null;
    let points = [];
    let activePoint = -1;


    // -------------------------------------------------
    // LOAD IMAGE
    // -------------------------------------------------

    input.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    image =
                        new Image();

                    


                    image.onload =
                        function () {

                            canvas.width =
                                image.naturalWidth;

                            canvas.height =
                                image.naturalHeight;


                            overlay.width =
                                canvas.width;

                            overlay.height =
                                canvas.height;


                            ctx.clearRect(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            ctx.imageSmoothingEnabled =
                                true;


                            ctx.imageSmoothingQuality =
                                "high";


                            ctx.drawImage(
                                image,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            const marginX =
                                canvas.width * 0.08;


                            const marginY =
                                canvas.height * 0.08;


                            points = [

                                {
                                    x: marginX,
                                    y: marginY
                                },

                                {
                                    x: canvas.width - marginX,
                                    y: marginY
                                },

                                {
                                    x: canvas.width - marginX,
                                    y: canvas.height - marginY
                                },

                                {
                                    x: marginX,
                                    y: canvas.height - marginY
                                }

                            ];


                            workspace.style.display =
    "block";

result.innerHTML =
    "";

status.innerText =
    "✅ Image loaded. Adjust the 4 corners, then scan.";


/*
 * Make sure the visible image is loaded first.
 */



previewImage.onload =
    function () {

        requestAnimationFrame(
            function () {

                syncScannerOverlay();

            }
        );

    };


requestAnimationFrame(
    function () {

        syncScannerOverlay();

    }
);

                        };


                    loadOrientedImageFromFile(file).then(function(orientedImg){ image.src=orientedImg.src; previewImage.src=orientedImg.src; }).catch(function(error){ console.error("Scanner orientation error:",error); alert("Unable to process this image."); });

                };


            reader.readAsDataURL(file);

        }
    );


        // -------------------------------------------------
    // SYNC IMAGE + OVERLAY
    // -------------------------------------------------

    function syncScannerOverlay() {

        if (!previewImage || !overlay) {
            return;
        }

        const rect =
            previewImage.getBoundingClientRect();

        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {
            return;
        }

        overlay.style.left = "0px";
        overlay.style.top = "0px";

        overlay.style.width =
            rect.width + "px";

        overlay.style.height =
            rect.height + "px";

        drawOverlay();
    }


    window.addEventListener(
        "resize",
        syncScannerOverlay
    );


    // -------------------------------------------------
    // DRAW OVERLAY
    // -------------------------------------------------

    function drawOverlay() {

        overlayCtx.clearRect(
            0,
            0,
            overlay.width,
            overlay.height
        );


        if (points.length !== 4) {
            return;
        }


        overlayCtx.beginPath();

        overlayCtx.moveTo(
            points[0].x,
            points[0].y
        );

        overlayCtx.lineTo(
            points[1].x,
            points[1].y
        );

        overlayCtx.lineTo(
            points[2].x,
            points[2].y
        );

        overlayCtx.lineTo(
            points[3].x,
            points[3].y
        );

        overlayCtx.closePath();


        overlayCtx.fillStyle =
            "rgba(37,99,235,0.12)";

        overlayCtx.fill();


        overlayCtx.strokeStyle =
            "#2563eb";


        overlayCtx.lineWidth =
            Math.max(
                4,
                canvas.width * 0.004
            );


        overlayCtx.stroke();


        points.forEach(
            (point, index) => {

                overlayCtx.beginPath();


                overlayCtx.arc(
                    point.x,
                    point.y,
                    Math.max(
                        14,
                        canvas.width * 0.012
                    ),
                    0,
                    Math.PI * 2
                );


                overlayCtx.fillStyle =
                    activePoint === index
                        ? "#dc2626"
                        : "#2563eb";


                overlayCtx.fill();


                overlayCtx.strokeStyle =
                    "white";


                overlayCtx.lineWidth =
                    4;


                overlayCtx.stroke();


                overlayCtx.fillStyle =
                    "white";


                overlayCtx.font =
                    "bold 14px Arial";


                overlayCtx.textAlign =
                    "center";


                overlayCtx.textBaseline =
                    "middle";


                overlayCtx.fillText(
                    index + 1,
                    point.x,
                    point.y
                );

            }
        );

    }


    // -------------------------------------------------
    // POINTER POSITION
    // -------------------------------------------------

    function getPointerPosition(event) {

        const rect =
            overlay.getBoundingClientRect();


        if (!rect.width || !rect.height) {

            return {
                x: 0,
                y: 0
            };

        }


        const scaleX =
            overlay.width /
            rect.width;


        const scaleY =
            overlay.height /
            rect.height;


        const clientX =
            event.touches
                ? event.touches[0].clientX
                : event.clientX;


        const clientY =
            event.touches
                ? event.touches[0].clientY
                : event.clientY;


        return {

            x:
                (clientX - rect.left) *
                scaleX,

            y:
                (clientY - rect.top) *
                scaleY

        };

    }


    // -------------------------------------------------
    // FIND CORNER
    // -------------------------------------------------

    function findNearestPoint(position) {

        let nearest = -1;

        let nearestDistance =
            Infinity;


        points.forEach(
            (point, index) => {

                const distance =
                    Math.hypot(
                        point.x - position.x,
                        point.y - position.y
                    );


                if (
                    distance <
                    nearestDistance
                ) {

                    nearestDistance =
                        distance;

                    nearest =
                        index;

                }

            }
        );


        const maxDistance =
            Math.max(
                40,
                canvas.width * 0.04
            );


        return nearestDistance <=
            maxDistance
            ? nearest
            : -1;

    }


    // -------------------------------------------------
    // START DRAG
    // -------------------------------------------------

    function startDrag(event) {

        event.preventDefault();


        const position =
            getPointerPosition(
                event
            );


        activePoint =
            findNearestPoint(
                position
            );


        drawOverlay();

    }


    // -------------------------------------------------
    // DRAG
    // -------------------------------------------------

    function drag(event) {

        if (
            activePoint === -1
        ) {
            return;
        }


        event.preventDefault();


        const position =
            getPointerPosition(
                event
            );


        points[activePoint].x =
            Math.max(
                0,
                Math.min(
                    canvas.width,
                    position.x
                )
            );


        points[activePoint].y =
            Math.max(
                0,
                Math.min(
                    canvas.height,
                    position.y
                )
            );


        drawOverlay();

    }


    // -------------------------------------------------
    // STOP DRAG
    // -------------------------------------------------

    function stopDrag() {

        activePoint =
            -1;


        drawOverlay();

    }


    overlay.addEventListener(
        "mousedown",
        startDrag
    );

    overlay.addEventListener(
        "mousemove",
        drag
    );

    window.addEventListener(
        "mouseup",
        stopDrag
    );


    overlay.addEventListener(
        "touchstart",
        startDrag,
        {
            passive: false
        }
    );

    overlay.addEventListener(
        "touchmove",
        drag,
        {
            passive: false
        }
    );

    window.addEventListener(
        "touchend",
        stopDrag
    );


    // -------------------------------------------------
    // SCAN BUTTON
    // -------------------------------------------------

    document
        .getElementById(
            "processScannerBtn"
        )
        .addEventListener(
            "click",
            scanDocument
        );


    function scanDocument() {

        if (
            !image ||
            points.length !== 4
        ) {

            alert(
                "Please select a document image first."
            );

            return;
        }


        if (
            typeof cv === "undefined" ||
            !cv ||
            !cv.getPerspectiveTransform
        ) {

            alert(
                "Scanner engine is loading. Please wait a few seconds and try again."
            );

            return;
        }


        status.innerText =
            "⏳ Processing document...";


        result.innerHTML =
            "";


        try {

            const tl =
                points[0];

            const tr =
                points[1];

            const br =
                points[2];

            const bl =
                points[3];


            const topWidth =
                Math.hypot(
                    tr.x - tl.x,
                    tr.y - tl.y
                );


            const bottomWidth =
                Math.hypot(
                    br.x - bl.x,
                    br.y - bl.y
                );


            const leftHeight =
                Math.hypot(
                    bl.x - tl.x,
                    bl.y - tl.y
                );


            const rightHeight =
                Math.hypot(
                    br.x - tr.x,
                    br.y - tr.y
                );


            const outputWidth =
                Math.max(
                    1,
                    Math.round(
                        Math.max(
                            topWidth,
                            bottomWidth
                        )
                    )
                );


            const outputHeight =
                Math.max(
                    1,
                    Math.round(
                        Math.max(
                            leftHeight,
                            rightHeight
                        )
                    )
                );


            const src =
                cv.imread(canvas);


            const srcPoints =
                cv.matFromArray(
                    4,
                    1,
                    cv.CV_32FC2,
                    [
                        tl.x,
                        tl.y,

                        tr.x,
                        tr.y,

                        br.x,
                        br.y,

                        bl.x,
                        bl.y
                    ]
                );


            const dstPoints =
                cv.matFromArray(
                    4,
                    1,
                    cv.CV_32FC2,
                    [
                        0,
                        0,

                        outputWidth - 1,
                        0,

                        outputWidth - 1,
                        outputHeight - 1,

                        0,
                        outputHeight - 1
                    ]
                );


            const transform =
                cv.getPerspectiveTransform(
                    srcPoints,
                    dstPoints
                );


            const dst =
                new cv.Mat();


            cv.warpPerspective(
                src,
                dst,
                transform,
                new cv.Size(
                    outputWidth,
                    outputHeight
                ),
                cv.INTER_CUBIC,
                cv.BORDER_CONSTANT,
                new cv.Scalar(
                    255,
                    255,
                    255,
                    255
                )
            );


            const outputCanvas =
                document.createElement(
                    "canvas"
                );


            outputCanvas.width =
                outputWidth;

            outputCanvas.height =
                outputHeight;


            cv.imshow(
                outputCanvas,
                dst
            );


            src.delete();
            srcPoints.delete();
            dstPoints.delete();
            transform.delete();
            dst.delete();


            const scannedURL =
                outputCanvas.toDataURL(
                    "image/jpeg",
                    0.98
                );


            status.innerText =
                "✅ Document scanned successfully!";


            result.innerHTML = `
                <div class="result-box">

                    <h3>
                        ✅ Document Scanned
                    </h3>

                    <p>
                        Perspective corrected successfully.
                    </p>

                    <br>

                    <img
                        src="${scannedURL}"
                        alt="Scanned document result"
                        style="
                            max-width:100%;
                            border-radius:10px;
                            border:1px solid #ddd;
                        "
                    >

                    <br><br>

                    <a
                        href="${scannedURL}"
                        download="DocPinch-scanned-document.jpg"
                    >⬇️ Download Document</a>

                    <br><br>

                    <button
                        onclick="openDocumentScanner()"
                    >
                        🔄 Scan Another
                    </button>

                </div>
            `;

        } catch (error) {

            console.error(error);

            status.innerText =
                "❌ Scanner failed.";

            alert(
                "Document scanning failed. Please try again."
            );

        }

    }


    // -------------------------------------------------
    // BACK
    // -------------------------------------------------

    document
        .getElementById(
            "scannerBackBtn"
        )
        .addEventListener(
            "click",
            () => {
                dpGoToTools();
            }
        );

}


// =====================================================
// DOCUMENT ENHANCE
// =====================================================

function openDocumentEnhance() {

    const main =
        document.querySelector("main");


    main.innerHTML = `<div class="compressor">


        <div
            class="compressor"
            style="
                max-width:760px;
                text-align:center;
            "
        >

            <div
                style="
                    display:flex;
                    align-items:flex-start;
                    gap:14px;
                    text-align:left;
                    margin-bottom:22px;
                "
            >

                <div
                    style="
                        width:48px;
                        height:48px;
                        flex:0 0 48px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        border-radius:12px;
                        background:#eef6ff;
                        font-size:24px;
                    "
                >
                    ✨
                </div>


                <div>

                    <h2
                        style="
                            margin:0 0 6px;
                        "
                    >
                        Document Enhance
                    </h2>

                    <p
                        style="
                            margin:0;
                            color:#64748b;
                        "
                    >
                        Improve document images with clean white,
                        black-and-white and original preview options.
                    </p>

                </div>

            </div>


            <label
                for="enhanceInput"
                style="
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    min-height:145px;
                    padding:24px;
                    border:2px dashed #cbd5e1;
                    border-radius:16px;
                    background:#fbfdff;
                    cursor:pointer;
                "
            >

                <span
                    style="
                        font-size:30px;
                        margin-bottom:8px;
                    "
                >
                    🖼️
                </span>

                <strong
                    style="
                        color:#002B54;
                        font-size:17px;
                    "
                >
                    Choose Document Image
                </strong>

                <span
                    style="
                        margin-top:5px;
                        color:#64748b;
                        font-size:14px;
                    "
                >
                    JPG, JPEG, PNG or WebP
                </span>

            </label>


            <input
                type="file"
                id="enhanceInput"
                accept="image/*"
                style="
                    position:absolute;
                    width:1px;
                    height:1px;
                    opacity:0;
                    pointer-events:none;
                "
            >


            <div
                id="enhanceFileInfo"
                hidden
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(2,minmax(0,1fr));
                    gap:12px;
                    margin-top:18px;
                    text-align:left;
                "
            >

                <div
                    style="
                        padding:13px;
                        border:1px solid #e2e8f0;
                        border-radius:10px;
                        background:#f8fafc;
                    "
                >

                    <span
                        style="
                            display:block;
                            margin-bottom:4px;
                            color:#64748b;
                            font-size:12px;
                        "
                    >
                        File
                    </span>

                    <strong
                        id="enhanceFileName"
                    >
                        —
                    </strong>

                </div>


                <div
                    style="
                        padding:13px;
                        border:1px solid #e2e8f0;
                        border-radius:10px;
                        background:#f8fafc;
                    "
                >

                    <span
                        style="
                            display:block;
                            margin-bottom:4px;
                            color:#64748b;
                            font-size:12px;
                        "
                    >
                        Dimensions
                    </span>

                    <strong
                        id="enhanceDimensions"
                    >
                        —
                    </strong>

                </div>

            </div>


            <div
                id="enhanceWorkspace"
                hidden
                style="
                    margin-top:20px;
                    padding:18px;
                    border:1px solid #e2e8f0;
                    border-radius:14px;
                    background:#ffffff;
                "
            >

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:10px;
                        margin-bottom:12px;
                    "
                >

                    <strong
                        style="
                            color:#002B54;
                        "
                    >
                        Preview
                    </strong>

                    <span
                        id="enhanceStatusBadge"
                        style="
                            padding:5px 9px;
                            border-radius:999px;
                            background:#eef6ff;
                            color:#002B54;
                            font-size:12px;
                            font-weight:700;
                        "
                    >
                        Original
                    </span>

                </div>


                <div
                    style="
                        display:flex;
                        justify-content:center;
                        align-items:center;
                        min-height:240px;
                        max-height:600px;
                        padding:15px;
                        overflow:auto;
                        border:1px solid #e2e8f0;
                        border-radius:12px;
                        background:#f8fafc;
                    "
                >

                    <img
                        id="enhancePreview"
                        alt="Document enhancement preview"
                        style="
                            display:block;
                            width:auto;
                            max-width:100%;
                            max-height:560px;
                            height:auto;
                            object-fit:contain;
                            border-radius:9px;
                            background:#ffffff;
                        "
                    >

                </div>


                <div
                    id="enhanceActions"
                    style="
                        display:flex;
                        flex-wrap:wrap;
                        justify-content:center;
                        gap:10px;
                        margin-top:16px;
                    "
                >

                    <button
                        type="button"
                        id="cleanWhiteBtn"
                    >
                        ✨ Clean White / Enhance
                    </button>


                    <button
                        type="button"
                        id="bwDocumentBtn"
                    >
                        🖤 B&W Document
                    </button>


                    <button
                        type="button"
                        id="originalDocumentBtn"
                    >
                        🖼️ Original
                    </button>

                </div>


                <div
                    id="enhanceProcessing"
                    hidden
                    style="
                        margin-top:16px;
                        padding:14px;
                        border-radius:10px;
                        background:#f8fafc;
                        color:#002B54;
                        font-weight:700;
                    "
                ></div>


                <div
                    id="enhanceResult"
                    style="
                        margin-top:18px;
                    "
                ></div>

            </div>


            <button
                type="button"
                id="enhanceBackBtn"
                style="
                    margin-top:20px;
                "
            >
                ← Back to Tools
            </button>

        </div>


</div>`;


    const input =
        document.getElementById(
            "enhanceInput"
        );

    const fileInfo =
        document.getElementById(
            "enhanceFileInfo"
        );

    const fileName =
        document.getElementById(
            "enhanceFileName"
        );

    const dimensions =
        document.getElementById(
            "enhanceDimensions"
        );

    const workspace =
        document.getElementById(
            "enhanceWorkspace"
        );

    const preview =
        document.getElementById(
            "enhancePreview"
        );

    const statusBadge =
        document.getElementById(
            "enhanceStatusBadge"
        );

    const processing =
        document.getElementById(
            "enhanceProcessing"
        );

    const result =
        document.getElementById(
            "enhanceResult"
        );

    const cleanWhiteBtn =
        document.getElementById(
            "cleanWhiteBtn"
        );

    const bwDocumentBtn =
        document.getElementById(
            "bwDocumentBtn"
        );

    const originalDocumentBtn =
        document.getElementById(
            "originalDocumentBtn"
        );

    const backBtn =
        document.getElementById(
            "enhanceBackBtn"
        );


    let currentImage = null;
    let currentFile = null;
    let resultURL = null;


    function setProcessing(
        message
    ) {

        processing.hidden =
            false;

        processing.innerHTML = `

            <span
                style="
                    display:inline-flex;
                    align-items:center;
                    gap:8px;
                "
            >

                <span
                    class="dp-spinner dp-spinner-large"
                    style="
                        width:20px;
                        height:20px;
                        flex:0 0 20px;
                        border-width:2px;
                    "
                ></span>

                ${message}

            </span>

        `;

    }


    function clearProcessing() {

        processing.hidden =
            true;

        processing.innerHTML =
            "";

    }


    function clearResultURL() {

        if (resultURL) {

            URL.revokeObjectURL(
                resultURL
            );

            resultURL = null;

        }

    }


    function setActionState(
        disabled
    ) {

        cleanWhiteBtn.disabled =
            disabled;

        bwDocumentBtn.disabled =
            disabled;

        originalDocumentBtn.disabled =
            disabled;

    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];

            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image file."
                );

                input.value = "";

                return;

            }


            currentFile =
                file;

            clearResultURL();
            clearProcessing();

            result.innerHTML =
                "";

            statusBadge.textContent =
                "Original";


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const img =
                        new Image();


                    img.onload =
                        function() {

                            currentImage =
                                img;


                            preview.src = img.src;


                            fileName.textContent =
                                file.name;

                            dimensions.textContent =
                                `${img.naturalWidth} × ${img.naturalHeight} px`;


                            fileInfo.hidden =
                                false;

                            workspace.hidden =
                                false;

                        };


                    img.onerror =
                        function() {

                            currentImage =
                                null;

                            alert(
                                "Unable to load this image."
                            );

                        };


                    loadOrientedImageFromFile(file).then(function(orientedImg){ img.src=orientedImg.src; }).catch(function(error){ console.error("Enhance orientation error:",error); alert("Unable to process this image."); });

                };


            reader.onerror =
                function() {

                    alert(
                        "Unable to read the selected file."
                    );

                };


            reader.readAsDataURL(file);

        }
    );


    function processEnhancement(
        mode
    ) {

        if (!currentImage) {

            alert(
                "Please select an image first."
            );

            return;

        }


        setActionState(true);


        const title =
            mode === "bw"
                ? "B&W Document"
                : "Clean White / Enhanced";


        setProcessing(
            `Processing ${title}...`
        );


        result.innerHTML =
            "";


        requestAnimationFrame(
            () => {

                try {

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        currentImage.naturalWidth;

                    canvas.height =
                        currentImage.naturalHeight;


                    const ctx =
                        canvas.getContext(
                            "2d"
                        );


                    if (!ctx) {
                        throw new Error(
                            "Canvas is not supported."
                        );
                    }


                    ctx.drawImage(
                        currentImage,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );


                    const imageData =
                        ctx.getImageData(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );


                    const data =
                        imageData.data;


                    for (
                        let i = 0;
                        i < data.length;
                        i += 4
                    ) {

                        let r =
                            data[i];

                        let g =
                            data[i + 1];

                        let b =
                            data[i + 2];


                        if (
                            mode === "enhance"
                        ) {

                            r =
                                (r - 128) *
                                1.20 +
                                145;

                            g =
                                (g - 128) *
                                1.20 +
                                145;

                            b =
                                (b - 128) *
                                1.20 +
                                145;


                            r =
                                Math.max(
                                    0,
                                    Math.min(
                                        255,
                                        r
                                    )
                                );

                            g =
                                Math.max(
                                    0,
                                    Math.min(
                                        255,
                                        g
                                    )
                                );

                            b =
                                Math.max(
                                    0,
                                    Math.min(
                                        255,
                                        b
                                    )
                                );

                        }


                        if (
                            mode === "bw"
                        ) {

                            const gray =
                                0.299 * r +
                                0.587 * g +
                                0.114 * b;


                            const value =
                                gray > 145
                                    ? 255
                                    : 0;


                            r = value;
                            g = value;
                            b = value;

                        }


                        data[i] =
                            r;

                        data[i + 1] =
                            g;

                        data[i + 2] =
                            b;

                    }


                    ctx.putImageData(
                        imageData,
                        0,
                        0
                    );


                    canvas.toBlob(
                        (blob) => {

                            if (!blob) {

                                throw new Error(
                                    "Unable to create output image."
                                );

                            }


                            clearResultURL();

                            resultURL =
                                URL.createObjectURL(
                                    blob
                                );


                            statusBadge.textContent =
                                title;


                            result.innerHTML = `

                                <div
                                    style="
                                        margin-top:4px;
                                        padding:16px;
                                        border:1px solid #e2e8f0;
                                        border-radius:12px;
                                        background:#f8fafc;
                                    "
                                >

                                    <h3
                                        style="
                                            margin:0 0 12px;
                                            color:#002B54;
                                        "
                                    >
                                        ✅ ${title}
                                    </h3>


                                    <img
                                        src="${resultURL}"
                                        alt="${title} result"
                                        style="
                                            display:block;
                                            width:auto;
                                            max-width:100%;
                                            max-height:560px;
                                            height:auto;
                                            margin:0 auto 15px;
                                            border-radius:9px;
                                            background:white;
                                            border:1px solid #e2e8f0;
                                        "
                                    >


                                    <div
                                        style="
                                            display:flex;
                                            flex-wrap:wrap;
                                            justify-content:center;
                                            gap:10px;
                                        "
                                    >

                                        <a
                                            href="${resultURL}"
                                            download="DocPinch-enhanced-document.jpg"
                                            style="
                                                display:inline-flex;
                                                align-items:center;
                                                justify-content:center;
                                                min-height:44px;
                                                padding:10px 16px;
                                                border-radius:10px;
                                                background:#002B54;
                                                color:white;
                                                text-decoration:none;
                                                font-weight:700;
                                            "
                                        >
                                            ⬇️ Download Document
                                        </a>

                                    </div>

                                </div>

                            `;


                            clearProcessing();

                            setActionState(false);

                        }
                    );

                } catch (error) {

                    console.error(error);

                    clearProcessing();

                    result.innerHTML = `

                        <div
                            style="
                                padding:14px;
                                border-radius:10px;
                                background:#fef2f2;
                                color:#b91c1c;
                                font-weight:700;
                            "
                        >
                            ❌ Unable to process this image.
                        </div>

                    `;

                    setActionState(false);

                }

            }
        );

    }


    function showOriginal() {

        if (!currentImage) {

            alert(
                "Please select an image first."
            );

            return;

        }


        clearResultURL();
        clearProcessing();


        statusBadge.textContent =
            "Original";


        result.innerHTML = `

            <div
                style="
                    margin-top:4px;
                    padding:16px;
                    border:1px solid #e2e8f0;
                    border-radius:12px;
                    background:#f8fafc;
                "
            >

                <h3
                    style="
                        margin:0 0 12px;
                        color:#002B54;
                    "
                >
                    🖼️ Original Document
                </h3>


                <div
                    style="
                        display:flex;
                        justify-content:center;
                        padding:10px;
                    "
                >

                    <img
                        src="${currentImage.src}"
                        alt="Original document"
                        style="
                            display:block;
                            width:auto;
                            max-width:100%;
                            max-height:560px;
                            height:auto;
                            border-radius:9px;
                            background:white;
                            border:1px solid #e2e8f0;
                        "
                    >

                </div>

            </div>

        `;

    }


    cleanWhiteBtn.addEventListener(
        "click",
        () => {

            processEnhancement(
                "enhance"
            );

        }
    );


    bwDocumentBtn.addEventListener(
        "click",
        () => {

            processEnhancement(
                "bw"
            );

        }
    );


    originalDocumentBtn.addEventListener(
        "click",
        showOriginal
    );


    backBtn.addEventListener(
        "click",
        () => {

            clearResultURL();

            dpGoToTools();

        }
    );

}

// =====================================================
// DOCPINCH — STEP 90
// GLOBAL NAVIGATION FIX
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    const isHomePage =
        currentPath.endsWith("/") ||
        currentPath.endsWith("/index.html");

    const navbarLinks =
        document.querySelectorAll(".navbar a");


    // =================================================
    // NAVIGATION LINKS
    // =================================================

    navbarLinks.forEach((link) => {

        const text =
            link.textContent
                .trim()
                .toLowerCase();


        // =============================================
        // HOME
        // =============================================

        if (text === "home") {

            link.href = "index.html";

        }


        // =============================================
        // TOOLS
        // =============================================

        else if (text === "tools") {

            link.href = isHomePage
                ? "#tools"
                : "index.html?nav=tools#tools";

        }


        // =============================================
        // ABOUT
        // =============================================

        else if (text === "about") {

            link.href = isHomePage
                ? "#about"
                : "index.html#about";

        }

    });


    // =================================================
    // ACTIVE NAVIGATION
    // =================================================

    function updateActiveNavigation() {

        navbarLinks.forEach((link) => {

            link.classList.remove("active");

            link.removeAttribute("aria-current");

        });


        let activeLink = null;


        // =============================================
        // HOMEPAGE
        // =============================================

        if (isHomePage) {

            if (window.location.hash === "#about") {

                activeLink =
                    Array.from(navbarLinks)
                        .find((link) =>
                            link.textContent
                                .trim()
                                .toLowerCase() === "about"
                        );

            }

            else {

                activeLink =
                    Array.from(navbarLinks)
                        .find((link) =>
                            link.textContent
                                .trim()
                                .toLowerCase() === "home"
                        );

            }

        }


        // =============================================
        // TOOL / DEDICATED PAGE
        // =============================================

        else {

            activeLink =
                Array.from(navbarLinks)
                    .find((link) =>
                        link.textContent
                            .trim()
                            .toLowerCase() === "tools"
                    );

        }


        // =============================================
        // APPLY ACTIVE STATE
        // =============================================

        if (activeLink) {

            activeLink.classList.add("active");

            activeLink.setAttribute(
                "aria-current",
                "page"
            );

        }

    }


    // Initial state
    updateActiveNavigation();


    // Update when hash changes
    window.addEventListener(
        "hashchange",
        updateActiveNavigation
    );


    // =================================================
    // SMOOTH SCROLL ON HOMEPAGE
    // =================================================

    if (isHomePage) {

        navbarLinks.forEach((link) => {

            link.addEventListener("click", (event) => {

                const href =
                    link.getAttribute("href");


                if (
                    href === "#tools" ||
                    href === "#about"
                ) {

                    event.preventDefault();

                    const targetId =
                        href.substring(1);

                    const target =
                        document.getElementById(
                            targetId
                        );


                    if (target) {

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });


                        history.replaceState(
                            null,
                            "",
                            href
                        );

                        updateActiveNavigation();

                    }

                }

            });

        });

    }

});
/* ==========================================================
   DOCPINCH ANDROID NATIVE DOWNLOAD BRIDGE
   Handles data: and blob: URLs from all tool download links.
   ========================================================== */

(function installDocPinchNativeDownloads() {

    if (window.__docPinchNativeDownloadsInstalled) {
        return;
    }

    window.__docPinchNativeDownloadsInstalled = true;


    function getBridge() {

        const bridge =
            window.DocPinchDownload;

        if (
            !bridge ||
            typeof bridge.saveFile !== "function"
        ) {

            throw new Error(
                "Native download bridge unavailable."
            );

        }

        return bridge;
    }


    function saveBase64File(
        base64,
        mimeType,
        fileName
    ) {

        if (!base64) {
            throw new Error(
                "Empty file data."
            );
        }

        const bridge =
            getBridge();

        const savedPath =
            bridge.saveFile(
                base64,
                mimeType ||
                    "application/octet-stream",
                fileName ||
                    "DocPinch-file"
            );

        if (!savedPath) {
            throw new Error(
                "Native save returned no path."
            );
        }

        console.log(
            "DocPinch native save:",
            savedPath
        );

        return savedPath;
    }


    function saveDataUrl(
        dataUrl,
        fileName
    ) {

        const commaIndex =
            dataUrl.indexOf(",");

        if (commaIndex < 0) {
            throw new Error(
                "Invalid data URL."
            );
        }


        const header =
            dataUrl.substring(
                0,
                commaIndex
            );

        const body =
            dataUrl.substring(
                commaIndex + 1
            );


        const mimeMatch =
            header.match(
                /^data:([^;,]+)/i
            );

        const mimeType =
            mimeMatch
                ? mimeMatch[1]
                : "application/octet-stream";


        if (
            !/;base64/i.test(header)
        ) {

            throw new Error(
                "Non-base64 data URL is not supported."
            );

        }


        return saveBase64File(
            body,
            mimeType,
            fileName
        );
    }


    function blobToBase64(
        blob
    ) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        const dataUrl =
                            String(
                                reader.result || ""
                            );

                        const commaIndex =
                            dataUrl.indexOf(",");

                        if (
                            commaIndex < 0
                        ) {

                            reject(
                                new Error(
                                    "Could not encode file."
                                )
                            );

                            return;
                        }


                        resolve(
                            dataUrl.substring(
                                commaIndex + 1
                            )
                        );

                    };


                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "FileReader failed."
                            )
                        );

                    };


                reader.readAsDataURL(
                    blob
                );

            }
        );
    }


    async function saveHref(
        href,
        fileName
    ) {

        if (
            href.startsWith("data:")
        ) {

            return saveDataUrl(
                href,
                fileName
            );

        }


        const response =
            await fetch(href);


        if (!response.ok) {

            throw new Error(
                "Could not read generated file."
            );

        }


        const blob =
            await response.blob();


        if (
            !blob ||
            blob.size === 0
        ) {

            throw new Error(
                "Generated file is empty."
            );

        }


        const base64 =
            await blobToBase64(
                blob
            );


        return saveBase64File(
            base64,
            blob.type ||
                "application/octet-stream",
            fileName
        );

    }


    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target;


            const link =
                target &&
                target.closest
                    ? target.closest(
                        "a[download]"
                    )
                    : null;


            if (!link) {
                return;
            }


            const href =
                link.getAttribute(
                    "href"
                ) || "";


            if (
                !href ||
                href.startsWith("#") ||
                href.startsWith("javascript:")
            ) {

                return;
            }


            const bridge =
                window.DocPinchDownload;


            /*
             * Normal browser website:
             * keep normal download behavior.
             */
            if (
                !bridge ||
                typeof bridge.saveFile !==
                    "function"
            ) {

                return;
            }


            if (
                link.dataset
                    .dpNativeDownloadBusy === "1"
            ) {

                return;
            }


            link.dataset
                .dpNativeDownloadBusy = "1";


            event.preventDefault();
            event.stopPropagation();


            const fileName =
                link.getAttribute(
                    "download"
                ) ||
                "DocPinch-file";


            saveHref(
                href,
                fileName
            )

                .then(
                    function (savedPath) {

                        console.log(
                            "Download saved:",
                            savedPath
                        );

                    }
                )

                .catch(
                    function (error) {

                        console.error(
                            "DocPinch download error:",
                            error
                        );

                        alert(
                            "❌ Download failed. Please try again."
                        );

                    }
                )

                .finally(
                    function () {

                        delete link.dataset
                            .dpNativeDownloadBusy;

                    }
                );

        },
        true
    );

})();

/* =====================================================
 * DOCPINCH SEO TOOL ROUTER
 * ===================================================== */
(function(){
    const tool=new URLSearchParams(window.location.search).get("tool");
    const routes={
        "compress-pdf":openPDFCompressor,
        "compress-image":openImageCompressor,
        "jpg-png-to-pdf":openImageToPDF,
        "merge-pdf":openPDFMerger,
        "pdf-to-image":openPDFToImage,
        "document-scanner":openDocumentScanner,
        "document-enhance":openDocumentEnhance,
        "resize-image":function(){window.openImageResizer();},
        "crop-image":openImageCropper,
        "rotate-image":openImageRotator
    };
    if(tool&&routes[tool]){window.requestAnimationFrame(function(){routes[tool]();});}
})();


/* DOCPINCH_FINAL_RESIZER_NAV_FIX_START */
(function () {
  "use strict";

  function dpMain() {
    return document.querySelector("main") || document.body;
  }

  function dpSafeFileName(name) {
    return (name || "resized-image").replace(/\.[^.]+$/, "") || "resized-image";
  }

  function dpResizeImage(file, targetW, targetH, quality) {
    return new Promise(async function (resolve, reject) {
      try {
        if (!file) throw new Error("Please select an image.");
        if (!targetW || !targetH || targetW < 1 || targetH < 1) {
          throw new Error("Enter valid width and height.");
        }

        var bitmap = null;
        var canvas = document.createElement("canvas");
        var ctx = null;

        // Decode directly at the target size. This is substantially lighter
        // than decoding a huge phone photo at full resolution first.
        if (window.createImageBitmap) {
          try {
            bitmap = await createImageBitmap(file, {
              imageOrientation: "from-image",
              resizeWidth: Math.round(targetW),
              resizeHeight: Math.round(targetH),
              resizeQuality: quality || "high"
            });
          } catch (e1) {
            bitmap = null;
          }
        }

        if (bitmap) {
          canvas.width = Math.round(targetW);
          canvas.height = Math.round(targetH);
          ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          if (bitmap.close) bitmap.close();
        } else {
          var url = URL.createObjectURL(file);
          try {
            var img = new Image();
            img.decoding = "async";
            await new Promise(function (res, rej) {
              img.onload = res;
              img.onerror = function () { rej(new Error("Image decode failed.")); };
              img.src = url;
            });

            canvas.width = Math.round(targetW);
            canvas.height = Math.round(targetH);
            ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } finally {
            URL.revokeObjectURL(url);
          }
        }

        var mime = /^image\/(png|webp)$/i.test(file.type || "") ? (file.type || "image/jpeg") : "image/jpeg";
        var qualityValue = Math.max(0.55, Math.min(0.92, Number(quality) || 0.86));

        canvas.toBlob(function (blob) {
          if (!blob) {
            reject(new Error("Could not create the resized image."));
            return;
          }
          resolve({
            blob: blob,
            mime: mime,
            width: canvas.width,
            height: canvas.height
          });
        }, mime, qualityValue);
      } catch (err) {
        reject(err);
      }
    });
  }

  window.openImageResizer = function () {
    var main = dpMain();

    main.innerHTML = `
      <div class="compressor" style="max-width:900px;margin:0 auto;">
        <h2>📏 Resize Image</h2>
        <p>Select an image, enter the output size, then resize.</p>

        <input id="dpResizeInput" type="file" accept="image/*"
          style="width:100%;padding:12px;margin:12px 0;">

        <div id="dpResizeMeta" style="display:none;margin:10px 0;"></div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0;">
          <div>
            <label for="dpResizeW">Width (px)</label>
            <input id="dpResizeW" type="number" min="1" step="1"
              style="width:100%;padding:10px;margin-top:5px;">
          </div>
          <div>
            <label for="dpResizeH">Height (px)</label>
            <input id="dpResizeH" type="number" min="1" step="1"
              style="width:100%;padding:10px;margin-top:5px;">
          </div>
        </div>

        <label style="display:flex;align-items:center;gap:8px;margin:10px 0;">
          <input id="dpResizeLock" type="checkbox" checked>
          Keep aspect ratio
        </label>

        <button id="dpResizeBtn" type="button"
          style="width:100%;padding:13px;margin-top:8px;">
          Resize Image
        </button>

        <div id="dpResizeStatus" style="margin:12px 0;"></div>
        <div id="dpResizeResult" style="margin-top:12px;"></div>

        <button
          type="button"
          class="dp-resize-bottom-back"
          onclick="dpGoToTools(); return false;"
          style="
            display:block;
            width:100%;
            box-sizing:border-box;
            margin-top:20px;
            padding:13px;
          "
        >&larr; Back to Tools</button>

        


      </div>
    `;

    var input = document.getElementById("dpResizeInput");
    var w = document.getElementById("dpResizeW");
    var h = document.getElementById("dpResizeH");
    var lock = document.getElementById("dpResizeLock");
    var meta = document.getElementById("dpResizeMeta");
    var btn = document.getElementById("dpResizeBtn");
    var status = document.getElementById("dpResizeStatus");
    var result = document.getElementById("dpResizeResult");

    window.selectedFile = null;
    var originalW = 0;
    var originalH = 0;

    input.addEventListener("change", async function () {
      var file = input.files && input.files[0];
      if (!file) return;

      window.selectedFile = file;
      status.textContent = "Reading image…";
      result.innerHTML = "";

      try {
        var url = URL.createObjectURL(file);
        try {
          var img = new Image();
          img.decoding = "async";
          await new Promise(function (resolve, reject) {
            img.onload = resolve;
            img.onerror = function () { reject(new Error("Image could not be opened.")); };
            img.src = url;
          });
          originalW = img.naturalWidth || img.width;
          originalH = img.naturalHeight || img.height;
        } finally {
          URL.revokeObjectURL(url);
        }

        w.value = originalW;
        h.value = originalH;
        meta.style.display = "block";
        meta.textContent =
          "Original: " + originalW + " × " + originalH + " px • " +
          Math.max(1, Math.round(file.size / 1024)) + " KB";
        status.textContent = "";
      } catch (err) {
        window.selectedFile = null;
        status.textContent = "❌ " + (err.message || "Could not read image.");
      }
    });

    function syncHeightFromWidth() {
      if (!lock.checked || !originalW || !originalH) return;
      var newW = Number(w.value);
      if (newW > 0) h.value = Math.max(1, Math.round(newW * originalH / originalW));
    }

    function syncWidthFromHeight() {
      if (!lock.checked || !originalW || !originalH) return;
      var newH = Number(h.value);
      if (newH > 0) w.value = Math.max(1, Math.round(newH * originalW / originalH));
    }

    w.addEventListener("input", syncHeightFromWidth);
    h.addEventListener("input", syncWidthFromHeight);

    btn.addEventListener("click", async function () {
      var file = window.selectedFile || (input.files && input.files[0]);
      var targetW = Number(w.value);
      var targetH = Number(h.value);

      if (!file) {
        status.textContent = "❌ Please select an image first.";
        return;
      }
      if (!Number.isFinite(targetW) || !Number.isFinite(targetH) ||
          targetW < 1 || targetH < 1) {
        status.textContent = "❌ Enter valid width and height.";
        return;
      }

      if (targetW > 10000 || targetH > 10000) {
        status.textContent = "❌ Maximum supported size is 10000 × 10000 px.";
        return;
      }

      btn.disabled = true;
      btn.textContent = "Resizing…";
      status.textContent = "Processing…";
      result.innerHTML = "";

      var started = Date.now();
      try {
        var output = await Promise.race([
          dpResizeImage(file, targetW, targetH, "high"),
          new Promise(function (_, reject) {
            setTimeout(function () {
              reject(new Error("Processing took too long. Try a smaller output size."));
            }, 45000);
          })
        ]);

        var ext = output.mime === "image/png" ? "png" :
                  output.mime === "image/webp" ? "webp" : "jpg";
        var outName = dpSafeFileName(file.name) + "-resized." + ext;
        var url = URL.createObjectURL(output.blob);

        result.innerHTML = `
          <div style="margin-bottom:10px;">
            <strong>Done:</strong> ${output.width} × ${output.height} px
            • ${Math.max(1, Math.round(output.blob.size / 1024))} KB
            • ${(Date.now() - started) / 1000 | 0}s
          </div>
          <img src="${url}" alt="Resized preview"
            style="max-width:100%;height:auto;display:block;margin:10px 0;border-radius:8px;">
          <a download="${outName}" href="${url}"
            style="display:inline-block;padding:12px 16px;text-decoration:none;">
            ⬇️ Download Resized Image
          </a>
        `;

        status.textContent = "✅ Resize complete.";
      } catch (err) {
        status.textContent = "❌ " + (err.message || "Resize failed.");
      } finally {
        btn.disabled = false;
        btn.textContent = "Resize Image";
      }
    });
  };


})();

/* DOCPINCH_FINAL_RESIZER_NAV_FIX_END */
/* DOCPINCH APP PLUGIN ANDROID BACK FIX */
(function () {

    if (
        typeof capacitorApp === "undefined" ||
        !capacitorApp.App ||
        typeof capacitorApp.App.addListener !== "function"
    ) {
        console.warn(
            "DocPinch: capacitorApp.App not available."
        );
        return;
    }

    capacitorApp.App.addListener(
        "backButton",
        function () {

            var isTool =
                !document.querySelector(
                    "main .tools"
                );

            if (isTool) {

                /* Tool -> DocPinch Home */
                window.location.replace(
                    "index.html"
                );

                return;
            }

            /* Home -> Phone Home */
            capacitorApp.App.minimizeApp();

        }
    );

})();
/* DOCPINCH TOOLS ABOUT CAPTURE NAV FINAL */
(function () {

    document.addEventListener(
        "click",
        function (event) {

            var link =
                event.target &&
                event.target.closest
                    ? event.target.closest(
                        "header a, .navbar a"
                    )
                    : null;

            if (!link) {
                return;
            }

            var label =
                (link.textContent || "")
                    .trim()
                    .toLowerCase();

            if (
                label === "tools" ||
                label === "about"
            ) {

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (label === "tools") {

                    window.location.assign(
                        "index.html?nav=tools#tools"
                    );

                } else {

                    window.location.assign(
                        "index.html?nav=about#about"
                    );

                }
            }

        },
        true
    );

})();

/* =====================================================
 * DOCPINCH MASTER STABILITY FIX 2026-10-04
 * ===================================================== */
(function () {
    "use strict";

    function dpNavLabel(link) {
        return (
            link.textContent ||
            link.innerText ||
            ""
        )
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();
    }

    function dpNavigate(mode) {
        if (mode === "home") {
            window.location.assign("index.html");
            return;
        }

        if (mode === "tools") {
            window.location.assign(
                "index.html?nav=tools#tools"
            );
            return;
        }

        if (mode === "about") {
            window.location.assign(
                "index.html?nav=about#about"
            );
        }
    }

    function dpIsToolView() {
        const main = document.querySelector("main");
        return !!(
            main &&
            main.querySelector(".compressor")
        );
    }

    function dpUpdateActiveNav() {
        const links = Array.from(
            document.querySelectorAll(
                "header .navbar a, header nav a, .navbar a"
            )
        );

        if (!links.length) {
            return;
        }

        links.forEach(function (link) {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        });

        const params = new URLSearchParams(
            window.location.search
        );

        let mode = params.get("nav") || "";

        if (dpIsToolView()) {
            mode = "tools";
        }
        else if (window.location.hash === "#about") {
            mode = "about";
        }
        else if (
            window.location.hash === "#tools" ||
            mode === "tools"
        ) {
            mode = "tools";
        }
        else {
            mode = "home";
        }

        const active = links.find(function (link) {
            return dpNavLabel(link) === mode;
        });

        if (active) {
            active.classList.add("active");
            active.setAttribute(
                "aria-current",
                "page"
            );
        }
    }

    function dpToolAction(button) {
        const text = (
            button.innerText ||
            button.textContent ||
            ""
        )
            .trim()
            .toLowerCase();

        if (
            text.indexOf("compress pdf") !== -1
        ) {
            openPDFCompressor();
            return true;
        }

        if (
            text.indexOf("compress image") !== -1
        ) {
            openImageCompressor();
            return true;
        }

        const jpgPngPos = text.indexOf("jpg/png");
        const pdfPos = text.indexOf("pdf");

        if (
            jpgPngPos !== -1 &&
            pdfPos !== -1 &&
            jpgPngPos < pdfPos
        ) {
            openImageToPDF();
            return true;
        }

        if (
            jpgPngPos !== -1 &&
            pdfPos !== -1 &&
            pdfPos < jpgPngPos
        ) {
            openPDFToImage();
            return true;
        }

        if (
            text.indexOf("merge pdf") !== -1
        ) {
            openPDFMerger();
            return true;
        }

        if (
            text.indexOf("document scanner") !== -1
        ) {
            openDocumentScanner();
            return true;
        }

        if (
            text.indexOf("document enhance") !== -1
        ) {
            openDocumentEnhance();
            return true;
        }

        if (
            text.indexOf("resize image") !== -1
        ) {
            openImageResizer();
            return true;
        }

        if (
            text.indexOf("crop image") !== -1
        ) {
            openImageCropper();
            return true;
        }

        if (
            text.indexOf("rotate image") !== -1
        ) {
            openImageRotator();
            return true;
        }

        return false;
    }

    document.addEventListener(
        "click",
        function (event) {
            const target =
                event.target &&
                event.target.closest
                    ? event.target.closest(
                        "a, button"
                    )
                    : null;

            if (!target) {
                return;
            }

            const text = (
                target.innerText ||
                target.textContent ||
                ""
            )
                .trim()
                .replace(/\s+/g, " ");

            const lower = text.toLowerCase();

            /* HEADER: Home / Tools / About */
            if (
                target.tagName === "A" &&
                target.closest("header")
            ) {
                const label = dpNavLabel(target);

                if (
                    label === "home" ||
                    label === "tools" ||
                    label === "about"
                ) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    dpNavigate(label);
                    return;
                }
            }

            /* DYNAMIC TOOL BACK BUTTONS */
            if (
                target.closest("main .compressor") &&
                !target.hasAttribute("download") &&
                (
                    target.classList.contains("back-btn") ||
                    target.classList.contains("dp-final-back") ||
                    lower.indexOf("back to tools") !== -1 ||
                    /^back\b/.test(lower) ||
                    lower.indexOf(" back") !== -1
                )
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();
                dpNavigate("tools");
                return;
            }

            /* HOME TOOL GRID - delegated routing */
            if (
                target.tagName === "BUTTON" &&
                target.closest(".tools") &&
                !target.closest("main .compressor")
            ) {
                if (dpToolAction(target)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    dpUpdateActiveNav();
                }
            }
        },
        true
    );

    function dpInstallObservers() {
        dpUpdateActiveNav();

        const main = document.querySelector("main");

        if (
            main &&
            !main.__dpMasterObserverInstalled
        ) {
            main.__dpMasterObserverInstalled = true;

            const observer =
                new MutationObserver(function () {
                    window.requestAnimationFrame(
                        dpUpdateActiveNav
                    );
                });

            observer.observe(main, {
                childList: true,
                subtree: false
            });
        }
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            dpInstallObservers
        );
    }
    else {
        dpInstallObservers();
    }

    window.addEventListener(
        "hashchange",
        dpUpdateActiveNav
    );

    window.addEventListener(
        "popstate",
        dpUpdateActiveNav
    );
})();

/* DOCPINCH MASTER STABILITY FIX END */
