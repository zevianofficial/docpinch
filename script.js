// =====================================================
// DocPinch - PDF & Image Tools
// Final Clean Version
// =====================================================


// =====================================================
// MAIN TOOL BUTTONS
// =====================================================

const buttons = document.querySelectorAll(".tools button");

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        if (button.innerText.includes("Compress PDF")) {
            openPDFCompressor();
        }

        else if (button.innerText.includes("Compress Image")) {
            openImageCompressor();
        }

        // IMPORTANT:
        // PDF → JPG/PNG must come before generic JPG/PNG
        else if (button.innerText.includes("PDF → JPG/PNG")) {
            openPDFToImage();
        }

        else if (button.innerText.includes("JPG/PNG")) {
            openImageToPDF();
        }

        else if (button.innerText.includes("Merge PDF")) {
            openPDFMerger();
        }

        else if (button.innerText.includes("Document Scanner")) {
            openDocumentScanner();
        }

        else if (button.innerText.includes("Document Enhance")) {
            openDocumentEnhance();
        }

        else if (button.innerText.includes("Resize Image")) {
            openImageResizer();
        }

        else if (button.innerText.includes("Crop Image")) {
            openImageCropper();
        }

        else if (button.innerText.includes("Rotate Image")) {
            openImageRotator();
        }

        else {
            alert(button.innerText + " - Coming Soon!");
        }

    });

});


// =====================================================
// FILE SIZE FORMAT
// =====================================================

function formatBytes(bytes) {

    if (bytes === 0) {
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

    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, i)
            ).toFixed(2)
        ) +
        " " +
        units[i]
    );

}


// =====================================================
// IMAGE COMPRESSOR
// =====================================================

function openImageCompressor() {

    document.querySelector("main").innerHTML = `

        <div class="compressor">

            <h2>🖼️ Image Compressor</h2>

            <p>
                Compress JPG and PNG images online
                and reduce their file size.
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


    quality.addEventListener(
        "input",
        () => {

            qualityValue.textContent =
                quality.value + "%";

        }
    );


    compressBtn.addEventListener(
        "click",
        () => {

            const file =
                imageInput.files[0];


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
                                    quality.value / 100
                                );


                            const compressedSize =
                                Math.round(
                                    (
                                        compressedData.length *
                                        3
                                    ) / 4
                                );


                            const savedBytes =
                                file.size -
                                compressedSize;


                            let compressionPercent =
                                0;


                            if (
                                file.size > 0
                            ) {

                                compressionPercent =
                                    Math.max(
                                        0,
                                        Math.round(
                                            (
                                                savedBytes /
                                                file.size
                                            ) * 100
                                        )
                                    );

                            }


                            result.innerHTML = `

                                <div class="result-box">

                                    <h3>
                                        ✅ Compression Complete
                                    </h3>

                                    <p>
                                        <strong>
                                            Original Size:
                                        </strong>
                                        ${formatBytes(file.size)}
                                    </p>

                                    <p>
                                        <strong>
                                            Compressed Size:
                                        </strong>
                                        ${formatBytes(compressedSize)}
                                    </p>

                                    <p>
                                        <strong>
                                            Saved:
                                        </strong>
                                        ${compressionPercent}%
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
                                    >
                                        <button type="button">
                                            ⬇️ Download Image
                                        </button>
                                    </a>

                                    <br><br>

                                    <button
                                        type="button"
                                        onclick="openImageCompressor()"
                                    >
                                        🔄 Compress Another
                                    </button>

                                </div>

                            `;

                        };


                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(file);

        }
    );


    backBtn.addEventListener(
        "click",
        () => {
            location.reload();
        }
    );

}


// =====================================================
// JPG / PNG → PDF
// =====================================================

function openImageToPDF() {

    document.querySelector("main").innerHTML = `

        <h2>🔄 JPG/PNG → PDF</h2>

        <p style="margin:15px 0;">
            Select one or multiple images to create
            a multi-page PDF.
        </p>

        <div style="margin:25px 0;">

            <input
                type="file"
                id="imageToPDFInput"
                accept="image/jpeg,image/png"
                multiple
            >

            <br><br>

            <button
                type="button"
                id="createPDFBtn"
            >
                📄 Create PDF
            </button>

            <p
                id="imagePDFStatus"
                style="margin-top:20px;"
            ></p>

        </div>

        <div id="imagePDFResult"></div>

        <br>

        <button
            type="button"
            id="imagePDFBackBtn"
        >
            ⬅️ Back
        </button>

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
                location.reload();
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


        if (!input.files.length) {

            alert(
                "Please select at least one image."
            );

            return;

        }


        status.innerText =
            "⏳ Creating PDF...";


        result.innerHTML =
            "";


        try {

            if (
                !window.jspdf ||
                !window.jspdf.jsPDF
            ) {

                throw new Error(
                    "jsPDF library is not loaded."
                );

            }


            const { jsPDF } =
                window.jspdf;


            let pdf =
                null;


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
                    await readImageAsDataURL(
                        file
                    );


                const image =
                    await loadImage(
                        imageURL
                    );


                const orientation =
                    image.width > image.height
                        ? "landscape"
                        : "portrait";


                if (i === 0) {

                    pdf =
                        new jsPDF({
                            orientation:
                                orientation,
                            unit:
                                "pt",
                            format:
                                "a4"
                        });

                }

                else {

                    pdf.addPage(
                        "a4",
                        orientation
                    );

                }


                const pageWidth =
                    pdf.internal.pageSize.getWidth();


                const pageHeight =
                    pdf.internal.pageSize.getHeight();


                const margin =
                    20;


                const maxWidth =
                    pageWidth -
                    margin * 2;


                const maxHeight =
                    pageHeight -
                    margin * 2;


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
                    (
                        pageWidth -
                        imageWidth
                    ) / 2;


                const y =
                    (
                        pageHeight -
                        imageHeight
                    ) / 2;


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


            result.innerHTML = `

                <div class="result-box">

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
                        type="button"
                        onclick="openImageToPDF()"
                    >
                        🔄 Create Another PDF
                    </button>

                </div>

            `;

        }

        catch (error) {

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


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    function loadImage(src) {

        return new Promise(
            (resolve, reject) => {

                const image =
                    new Image();


                image.onload =
                    () => resolve(
                        image
                    );


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
// IMAGE RESIZER
// =====================================================

function openImageResizer() {

    document.querySelector("main").innerHTML = `

        <div class="compressor">

            <h2>📏 Image Resizer</h2>

            <p>
                Resize JPG and PNG images online.
            </p>

            <br>

            <input
                type="file"
                id="resizeInput"
                accept="image/*"
            >

            <br><br>

            <label>
                Width (px)
            </label>

            <br>

            <input
                type="number"
                id="resizeWidth"
                placeholder="Enter width"
                min="1"
            >

            <br><br>

            <label>
                Height (px)
            </label>

            <br>

            <input
                type="number"
                id="resizeHeight"
                placeholder="Enter height"
                min="1"
            >

            <br><br>

            <label>

                <input
                    type="checkbox"
                    id="keepRatio"
                    checked
                >

                Keep aspect ratio

            </label>

            <br><br>

            <button
                type="button"
                id="resizeBtn"
            >
                📏 Resize Image
            </button>

            <div id="resizeResult"></div>

            <br>

            <button
                type="button"
                id="resizeBackBtn"
            >
                ← Back to Tools
            </button>

        </div>
    `;


    const input =
        document.getElementById(
            "resizeInput"
        );


    const widthInput =
        document.getElementById(
            "resizeWidth"
        );


    const heightInput =
        document.getElementById(
            "resizeHeight"
        );


    const keepRatio =
        document.getElementById(
            "keepRatio"
        );


    const resizeBtn =
        document.getElementById(
            "resizeBtn"
        );


    const result =
        document.getElementById(
            "resizeResult"
        );


    const backBtn =
        document.getElementById(
            "resizeBackBtn"
        );


    let originalRatio =
        1;


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            widthInput.value =
                                img.width;


                            heightInput.value =
                                img.height;


                            originalRatio =
                                img.width /
                                img.height;

                        };


                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    widthInput.addEventListener(
        "input",
        () => {

            if (
                keepRatio.checked &&
                widthInput.value &&
                originalRatio
            ) {

                heightInput.value =
                    Math.round(
                        widthInput.value /
                        originalRatio
                    );

            }

        }
    );


    heightInput.addEventListener(
        "input",
        () => {

            if (
                keepRatio.checked &&
                heightInput.value &&
                originalRatio
            ) {

                widthInput.value =
                    Math.round(
                        heightInput.value *
                        originalRatio
                    );

            }

        }
    );


    resizeBtn.addEventListener(
        "click",
        () => {

            const file =
                input.files[0];


            if (!file) {

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
                !newWidth ||
                !newHeight ||
                newWidth <= 0 ||
                newHeight <= 0
            ) {

                alert(
                    "Please enter valid width and height."
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


                            canvas.width =
                                newWidth;


                            canvas.height =
                                newHeight;


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

                                <div class="result-box">

                                    <h3>
                                        ✅ Image Resized Successfully!
                                    </h3>

                                    <p>
                                        <strong>
                                            New Size:
                                        </strong>
                                        ${newWidth} × ${newHeight} px
                                    </p>

                                    <br>

                                    <img
                                        src="${resizedImage}"
                                        class="preview"
                                        alt="Resized image preview"
                                    >

                                    <br><br>

                                    <a
                                        href="${resizedImage}"
                                        download="DocPinch-resized.jpg"
                                    >
                                        <button type="button">
                                            ⬇️ Download Resized Image
                                        </button>
                                    </a>

                                    <br><br>

                                    <button
                                        type="button"
                                        onclick="openImageResizer()"
                                    >
                                        🔄 Resize Another
                                    </button>

                                </div>

                            `;

                        };


                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    backBtn.addEventListener(
        "click",
        () => {
            location.reload();
        }
    );

}


// =====================================================
// IMAGE CROP
// =====================================================

function openImageCropper() {

    document.querySelector("main").innerHTML = `

        <div class="compressor">

            <h2>✂️ Image Crop</h2>

            <p>
                Crop an image using pixel coordinates.
            </p>

            <br>

            <input
                type="file"
                id="cropInput"
                accept="image/*"
            >

            <br><br>

            <label>
                Crop X (px)
            </label>

            <br>

            <input
                type="number"
                id="cropX"
                value="0"
                min="0"
            >

            <br><br>

            <label>
                Crop Y (px)
            </label>

            <br>

            <input
                type="number"
                id="cropY"
                value="0"
                min="0"
            >

            <br><br>

            <label>
                Crop Width (px)
            </label>

            <br>

            <input
                type="number"
                id="cropWidth"
                min="1"
            >

            <br><br>

            <label>
                Crop Height (px)
            </label>

            <br>

            <input
                type="number"
                id="cropHeight"
                min="1"
            >

            <br><br>

            <button
                type="button"
                id="cropBtn"
            >
                ✂️ Crop Image
            </button>

            <div id="cropResult"></div>

            <br>

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


    const cropX =
        document.getElementById(
            "cropX"
        );


    const cropY =
        document.getElementById(
            "cropY"
        );


    const cropWidth =
        document.getElementById(
            "cropWidth"
        );


    const cropHeight =
        document.getElementById(
            "cropHeight"
        );


    const cropBtn =
        document.getElementById(
            "cropBtn"
        );


    const result =
        document.getElementById(
            "cropResult"
        );


    const backBtn =
        document.getElementById(
            "cropBackBtn"
        );


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];


            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            cropWidth.value =
                                img.width;


                            cropHeight.value =
                                img.height;

                        };


                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    cropBtn.addEventListener(
        "click",
        () => {

            const file =
                input.files[0];


            if (!file) {

                alert(
                    "Please select an image first."
                );

                return;

            }


            const x =
                parseInt(
                    cropX.value,
                    10
                ) || 0;


            const y =
                parseInt(
                    cropY.value,
                    10
                ) || 0;


            const width =
                parseInt(
                    cropWidth.value,
                    10
                );


            const height =
                parseInt(
                    cropHeight.value,
                    10
                );


            if (
                width <= 0 ||
                height <= 0 ||
                x < 0 ||
                y < 0
            ) {

                alert(
                    "Please enter valid crop values."
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

                            if (
                                x + width >
                                img.width ||
                                y + height >
                                img.height
                            ) {

                                alert(
                                    "Crop area is outside the image."
                                );

                                return;

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            ctx.drawImage(
                                img,
                                x,
                                y,
                                width,
                                height,
                                0,
                                0,
                                width,
                                height
                            );


                            const croppedImage =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.92
                                );


                            result.innerHTML = `

                                <div class="result-box">

                                    <h3>
                                        ✅ Image Cropped Successfully!
                                    </h3>

                                    <p>
                                        <strong>
                                            New Size:
                                        </strong>
                                        ${width} × ${height} px
                                    </p>

                                    <br>

                                    <img
                                        src="${croppedImage}"
                                        class="preview"
                                        alt="Cropped image preview"
                                    >

                                    <br><br>

                                    <a
                                        href="${croppedImage}"
                                        download="DocPinch-cropped.jpg"
                                    >
                                        <button type="button">
                                            ⬇️ Download Cropped Image
                                        </button>
                                    </a>

                                    <br><br>

                                    <button
                                        type="button"
                                        onclick="openImageCropper()"
                                    >
                                        🔄 Crop Another
                                    </button>

                                </div>

                            `;

                        };


                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    backBtn.addEventListener(
        "click",
        () => {
            location.reload();
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

            <button
                type="button"
                id="rotate90"
            >
                ↻ Rotate 90°
            </button>

            <button
                type="button"
                id="rotate180"
            >
                ↻ Rotate 180°
            </button>

            <button
                type="button"
                id="rotate270"
            >
                ↻ Rotate 270°
            </button>

            <div id="rotateResult"></div>

            <br>

            <button
                type="button"
                id="rotateBackBtn"
            >
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
                            degrees *
                            Math.PI /
                            180;


                        if (
                            degrees === 90 ||
                            degrees === 270
                        ) {

                            canvas.width =
                                img.height;

                            canvas.height =
                                img.width;

                        }

                        else {

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
                                    <strong>
                                        Rotation:
                                    </strong>
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
                                >
                                    <button type="button">
                                        ⬇️ Download Rotated Image
                                    </button>
                                </a>

                                <br><br>

                                <button
                                    type="button"
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


        reader.readAsDataURL(
            file
        );

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
            location.reload();
        }
    );

}


// =====================================================
// PDF COMPRESSOR
// =====================================================

function openPDFCompressor() {

    document.querySelector("main").innerHTML = `

        <h2>📄 Compress PDF</h2>

        <p style="margin:15px 0;">
            Reduce the size of a PDF document online.
        </p>

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

            <button
                type="button"
                id="compressPDFBtn"
            >
                Compress PDF
            </button>

            <p
                id="pdfStatus"
                style="margin-top:20px;"
            ></p>

        </div>

        <div id="pdfResult"></div>

        <br>

        <button
            type="button"
            id="pdfBackBtn"
        >
            ⬅️ Back
        </button>

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
                qualitySlider.value +
                "%";

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
                location.reload();
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


        const file =
            input.files[0];


        status.innerText =
            "⏳ Compressing PDF...";


        result.innerHTML =
            "";


        try {

            if (
                typeof pdfjsLib === "undefined"
            ) {

                throw new Error(
                    "PDF.js library is not loaded."
                );

            }


            if (
                !window.jspdf ||
                !window.jspdf.jsPDF
            ) {

                throw new Error(
                    "jsPDF library is not loaded."
                );

            }


            const arrayBuffer =
                await file.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({
                    data:
                        arrayBuffer
                }).promise;


            const totalPages =
                pdf.numPages;


            const { jsPDF } =
                window.jspdf;


            let outputPDF =
                null;


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

                status.innerText =
                    `⏳ Compressing page ${pageNumber} of ${totalPages}...`;


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const viewport =
                    page.getViewport({
                        scale:
                            1.2
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
                    viewport.width;


                canvas.height =
                    viewport.height;


                await page.render({
                    canvasContext:
                        context,
                    viewport:
                        viewport
                }).promise;


                const imageData =
                    canvas.toDataURL(
                        "image/jpeg",
                        quality
                    );


                const orientation =
                    viewport.width >
                    viewport.height
                        ? "landscape"
                        : "portrait";


                if (!outputPDF) {

                    outputPDF =
                        new jsPDF({
                            orientation:
                                orientation,
                            unit:
                                "pt",
                            format:
                                "a4",
                            compress:
                                true
                        });

                }

                else {

                    outputPDF.addPage(
                        "a4",
                        orientation
                    );

                }


                const pageWidth =
                    outputPDF.internal.pageSize.getWidth();


                const pageHeight =
                    outputPDF.internal.pageSize.getHeight();


                const ratio =
                    Math.min(
                        pageWidth /
                            viewport.width,

                        pageHeight /
                            viewport.height
                    );


                const imageWidth =
                    viewport.width *
                    ratio;


                const imageHeight =
                    viewport.height *
                    ratio;


                const x =
                    (
                        pageWidth -
                        imageWidth
                    ) / 2;


                const y =
                    (
                        pageHeight -
                        imageHeight
                    ) / 2;


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


            let savedPercent =
                0;


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


            result.innerHTML = `

                <div class="result-box">

                    <h3>
                        📊 Compression Result
                    </h3>

                    <p style="margin-top:15px;">
                        <strong>
                            Original Size:
                        </strong>
                        ${formatBytes(originalSize)}
                    </p>

                    <p>
                        <strong>
                            Compressed Size:
                        </strong>
                        ${formatBytes(compressedSize)}
                    </p>

                    <p>
                        <strong>
                            Saved:
                        </strong>
                        ${
                            savedPercent > 0
                                ? savedPercent.toFixed(1) + "%"
                                : "0%"
                        }
                    </p>

                    <br>

                    <a
                        href="${downloadURL}"
                        download="DocPinch-compressed.pdf"
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
                        ⬇️ Download Compressed PDF
                    </a>

                    <br><br>

                    <button
                        type="button"
                        onclick="openPDFCompressor()"
                    >
                        🔄 Compress Another PDF
                    </button>

                </div>

            `;

        }

        catch (error) {

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

function openPDFMerger() {

    document.querySelector("main").innerHTML = `

        <h2>🔗 Merge PDF</h2>

        <p style="margin:15px 0;">
            Select multiple PDF files and combine them
            into one PDF.
        </p>

        <div style="margin:25px 0;">

            <input
                type="file"
                id="mergePDFInput"
                accept="application/pdf"
                multiple
            >

            <br><br>

            <button
                type="button"
                id="mergePDFBtn"
            >
                🔗 Merge PDF
            </button>

            <p
                id="mergeStatus"
                style="margin-top:20px;"
            ></p>

        </div>

        <div id="mergeResult"></div>

        <br>

        <button
            type="button"
            id="mergeBackBtn"
        >
            ⬅️ Back
        </button>

    `;


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
                location.reload();
            }
        );


    async function mergePDFs() {

        const input =
            document.getElementById(
                "mergePDFInput"
            );


        const status =
            document.getElementById(
                "mergeStatus"
            );


        const result =
            document.getElementById(
                "mergeResult"
            );


        if (input.files.length < 2) {

            alert(
                "Please select at least 2 PDF files."
            );

            return;

        }


        status.innerText =
            "⏳ Merging PDFs...";


        result.innerHTML =
            "";


        try {

            if (
                !window.PDFLib
            ) {

                throw new Error(
                    "PDF-LIB library is not loaded."
                );

            }


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


                const arrayBuffer =
                    await file.arrayBuffer();


                const sourcePdf =
                    await PDFLib.PDFDocument.load(
                        arrayBuffer
                    );


                const pages =
                    await mergedPdf.copyPages(
                        sourcePdf,
                        sourcePdf.getPageIndices()
                    );


                pages.forEach(
                    (page) => {
                        mergedPdf.addPage(
                            page
                        );
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
                        type:
                            "application/pdf"
                    }
                );


            const downloadURL =
                URL.createObjectURL(
                    blob
                );


            status.innerText =
                "✅ PDFs merged successfully!";


            result.innerHTML = `

                <div class="result-box">

                    <h3>
                        ✅ Merge Complete
                    </h3>

                    <p style="margin-top:15px;">
                        <strong>
                            PDF Files:
                        </strong>
                        ${input.files.length}
                    </p>

                    <p>
                        <strong>
                            Total Pages:
                        </strong>
                        ${mergedPdf.getPageCount()}
                    </p>

                    <p>
                        <strong>
                            Output Size:
                        </strong>
                        ${formatBytes(blob.size)}
                    </p>

                    <br>

                    <a
                        href="${downloadURL}"
                        download="DocPinch-merged.pdf"
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
                        ⬇️ Download Merged PDF
                    </a>

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

        catch (error) {

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

        <h2>🖼️ PDF → JPG/PNG</h2>

        <p style="margin:15px 0;">
            Convert PDF pages into JPG images.
        </p>

        <div style="margin:25px 0;">

            <input
                type="file"
                id="pdfToImageInput"
                accept="application/pdf"
            >

            <br><br>

            <label>
                Output Quality:
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

            <button
                type="button"
                id="convertPDFBtn"
            >
                🖼️ Convert PDF
            </button>

            <p
                id="pdfToImageStatus"
                style="margin-top:20px;"
            ></p>

        </div>

        <div id="pdfToImageResult"></div>

        <br>

        <button
            type="button"
            id="pdfToImageBackBtn"
        >
            ⬅️ Back
        </button>

    `;


    const qualitySlider =
        document.getElementById(
            "pdfImageQuality"
        );


    const qualityValue =
        document.getElementById(
            "pdfImageQualityValue"
        );


    qualitySlider.addEventListener(
        "input",
        () => {

            qualityValue.innerText =
                qualitySlider.value +
                "%";

        }
    );


    document
        .getElementById("convertPDFBtn")
        .addEventListener(
            "click",
            convertPDF
        );


    document
        .getElementById(
            "pdfToImageBackBtn"
        )
        .addEventListener(
            "click",
            () => {
                location.reload();
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


        if (!input.files.length) {

            alert(
                "Please select a PDF file."
            );

            return;

        }


        status.innerText =
            "⏳ Loading PDF...";


        result.innerHTML =
            "";


        try {

            if (
                typeof pdfjsLib === "undefined"
            ) {

                throw new Error(
                    "PDF.js library is not loaded."
                );

            }


            const file =
                input.files[0];


            const arrayBuffer =
                await file.arrayBuffer();


            const pdf =
                await pdfjsLib.getDocument({
                    data:
                        arrayBuffer
                }).promise;


            const quality =
                parseInt(
                    qualitySlider.value,
                    10
                ) / 100;


            result.innerHTML = `

                <div class="result-box">

                    <h3>
                        📄 PDF Pages
                    </h3>

                    <div id="pdfPages"></div>

                </div>

            `;


            const pagesContainer =
                document.getElementById(
                    "pdfPages"
                );


            for (
                let pageNumber = 1;
                pageNumber <= pdf.numPages;
                pageNumber++
            ) {

                status.innerText =
                    `⏳ Converting page ${pageNumber} of ${pdf.numPages}...`;


                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const viewport =
                    page.getViewport({
                        scale:
                            1.5
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
                    viewport.width;


                canvas.height =
                    viewport.height;


                await page.render({

                    canvasContext:
                        context,

                    viewport:
                        viewport

                }).promise;


                const imageURL =
                    canvas.toDataURL(
                        "image/jpeg",
                        quality
                    );


                const pageBox =
                    document.createElement(
                        "div"
                    );


                pageBox.style.margin =
                    "25px 0";


                pageBox.innerHTML = `

                    <p>
                        <strong>
                            Page ${pageNumber}
                        </strong>
                    </p>

                    <img
                        src="${imageURL}"
                        alt="PDF page ${pageNumber} preview"
                        style="
                            max-width:100%;
                            border-radius:8px;
                            margin:10px 0;
                            box-shadow:
                                0 3px 10px
                                rgba(0,0,0,0.15);
                        "
                    >

                    <br>

                    <a
                        href="${imageURL}"
                        download="DocPinch-page-${pageNumber}.jpg"
                        style="
                            display:inline-block;
                            padding:10px 18px;
                            background:#111827;
                            color:white;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                        "
                    >
                        ⬇️ Download Page ${pageNumber}
                    </a>

                `;


                pagesContainer.appendChild(
                    pageBox
                );

            }


            status.innerText =
                "✅ PDF converted successfully!";

        }

        catch (error) {

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
                Upload a document, adjust 4 corners
                and scan it.
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
                    🔵 Drag the 4 blue points to the
                    document corners.
                </p>

                <div
                    id="scannerCanvasBox"
                    style="
                        position:relative;
                        display:inline-block;
                        max-width:100%;
                    "
                >

                    <canvas
                        id="scannerCanvas"
                        style="
                            max-width:100%;
                            height:auto;
                            display:block;
                            border-radius:10px;
                        "
                    ></canvas>

                    <canvas
                        id="scannerOverlay"
                        style="
                            position:absolute;
                            left:0;
                            top:0;
                            width:100%;
                            height:100%;
                            touch-action:none;
                            cursor:crosshair;
                        "
                    ></canvas>

                </div>

                <br><br>

                <button
                    type="button"
                    id="processScannerBtn"
                >
                    📐 Scan Document
                </button>

                <p
                    id="scannerStatus"
                    style="margin-top:15px;"
                ></p>

            </div>

            <div id="scannerResult"></div>

            <br>

            <button
                type="button"
                id="scannerBackBtn"
            >
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


    let image =
        null;


    let points =
        [];


    let activePoint =
        -1;


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
                                canvas.width *
                                0.08;


                            const marginY =
                                canvas.height *
                                0.08;


                            points = [

                                {
                                    x:
                                        marginX,
                                    y:
                                        marginY
                                },

                                {
                                    x:
                                        canvas.width -
                                        marginX,
                                    y:
                                        marginY
                                },

                                {
                                    x:
                                        canvas.width -
                                        marginX,
                                    y:
                                        canvas.height -
                                        marginY
                                },

                                {
                                    x:
                                        marginX,
                                    y:
                                        canvas.height -
                                        marginY
                                }

                            ];


                            workspace.style.display =
                                "block";


                            result.innerHTML =
                                "";


                            status.innerText =
                                "";


                            drawOverlay();

                        };


                    image.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
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


        if (
            points.length !== 4
        ) {
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
                    "#ffffff";


                overlayCtx.lineWidth =
                    4;


                overlayCtx.stroke();


                overlayCtx.fillStyle =
                    "#ffffff";


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


        if (
            !rect.width ||
            !rect.height
        ) {

            return {
                x:
                    0,
                y:
                    0
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
                (
                    clientX -
                    rect.left
                ) * scaleX,

            y:
                (
                    clientY -
                    rect.top
                ) * scaleY

        };

    }


    // -------------------------------------------------
    // FIND CORNER
    // -------------------------------------------------

    function findNearestPoint(position) {

        let nearest =
            -1;


        let nearestDistance =
            Infinity;


        points.forEach(
            (point, index) => {

                const distance =
                    Math.hypot(
                        point.x -
                            position.x,

                        point.y -
                            position.y
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


        points[
            activePoint
        ].x =
            Math.max(
                0,
                Math.min(
                    canvas.width,
                    position.x
                )
            );


        points[
            activePoint
        ].y =
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
            passive:
                false
        }
    );


    overlay.addEventListener(
        "touchmove",
        drag,
        {
            passive:
                false
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
                    tr.x -
                        tl.x,

                    tr.y -
                        tl.y
                );


            const bottomWidth =
                Math.hypot(
                    br.x -
                        bl.x,

                    br.y -
                        bl.y
                );


            const leftHeight =
                Math.hypot(
                    bl.x -
                        tl.x,

                    bl.y -
                        tl.y
                );


            const rightHeight =
                Math.hypot(
                    br.x -
                        tr.x,

                    br.y -
                        tr.y
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
                cv.imread(
                    canvas
                );


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

                    <p
                        style="
                            margin-top:15px;
                        "
                    >
                        Perspective corrected successfully.
                    </p>

                    <br>

                    <img
                        src="${scannedURL}"
                        alt="Scanned document preview"
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
                        ⬇️ Download Document
                    </a>

                    <br><br>

                    <button
                        type="button"
                        onclick="
                            openDocumentScanner()
                        "
                    >
                        🔄 Scan Another
                    </button>

                </div>

            `;

        }

        catch (error) {

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
                location.reload();
            }
        );

}


// =====================================================
// DOCUMENT ENHANCE
// =====================================================

function openDocumentEnhance() {

    document.querySelector("main").innerHTML = `

        <div class="compressor">

            <h2>✨ Document Enhance</h2>

            <p>
                Clean white and improve document readability.
            </p>

            <br>

            <input
                type="file"
                id="enhanceInput"
                accept="image/*"
            >

            <br><br>

            <div
                id="enhanceWorkspace"
            ></div>

            <br>

            <button
                type="button"
                id="enhanceBackBtn"
            >
                ⬅️ Back to Tools
            </button>

        </div>

    `;


    const input =
        document.getElementById(
            "enhanceInput"
        );


    const workspace =
        document.getElementById(
            "enhanceWorkspace"
        );


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

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            workspace.innerHTML = `

                                <div
                                    class="result-box"
                                    style="
                                        background:white;
                                        padding:20px;
                                        border-radius:15px;
                                        box-shadow:
                                            0 4px 15px
                                            rgba(0,0,0,0.08);
                                    "
                                >

                                    <h3>
                                        🖼️ Select Enhancement
                                    </h3>

                                    <br>

                                    <img
                                        src="${event.target.result}"
                                        id="enhancePreview"
                                        alt="Document preview"
                                        style="
                                            max-width:100%;
                                            max-height:500px;
                                            border-radius:10px;
                                            border:1px solid #ddd;
                                        "
                                    >

                                    <br><br>

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

                                    <div
                                        id="enhanceResult"
                                        style="
                                            margin-top:25px;
                                        "
                                    ></div>

                                </div>

                            `;


                            document
                                .getElementById(
                                    "cleanWhiteBtn"
                                )
                                .addEventListener(
                                    "click",
                                    () => {

                                        processEnhancement(
                                            img,
                                            "enhance"
                                        );

                                    }
                                );


                            document
                                .getElementById(
                                    "bwDocumentBtn"
                                )
                                .addEventListener(
                                    "click",
                                    () => {

                                        processEnhancement(
                                            img,
                                            "bw"
                                        );

                                    }
                                );


                            document
                                .getElementById(
                                    "originalDocumentBtn"
                                )
                                .addEventListener(
                                    "click",
                                    () => {

                                        showOriginal(
                                            img
                                        );

                                    }
                                );

                        };


                    img.src =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    // -------------------------------------------------
    // PROCESS ENHANCEMENT
    // -------------------------------------------------

    function processEnhancement(
        img,
        mode
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            img.naturalWidth;


        canvas.height =
            img.naturalHeight;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.drawImage(
            img,
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
                    (
                        r -
                        128
                    ) *
                    1.20 +
                    145;


                g =
                    (
                        g -
                        128
                    ) *
                    1.20 +
                    145;


                b =
                    (
                        b -
                        128
                    ) *
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


                r =
                    value;


                g =
                    value;


                b =
                    value;

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


        const outputURL =
            canvas.toDataURL(
                "image/jpeg",
                0.97
            );


        const result =
            document.getElementById(
                "enhanceResult"
            );


        const title =
            mode === "bw"
                ? "🖤 B&W Document"
                : "✨ Clean White / Enhanced";


        result.innerHTML = `

            <div
                class="result-box"
                style="
                    background:#f8fafc;
                    padding:20px;
                    border-radius:12px;
                "
            >

                <h3>
                    ✅ ${title}
                </h3>

                <br>

                <img
                    src="${outputURL}"
                    alt="Enhanced document preview"
                    style="
                        max-width:100%;
                        max-height:600px;
                        border-radius:10px;
                        border:1px solid #ddd;
                    "
                >

                <br><br>

                <a
                    href="${outputURL}"
                    download="DocPinch-enhanced-document.jpg"
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
                    ⬇️ Download Document
                </a>

            </div>

        `;

    }


    // -------------------------------------------------
    // SHOW ORIGINAL
    // -------------------------------------------------

    function showOriginal(img) {

        const result =
            document.getElementById(
                "enhanceResult"
            );


        const originalURL =
            img.src;


        result.innerHTML = `

            <div
                class="result-box"
                style="
                    background:#f8fafc;
                    padding:20px;
                    border-radius:12px;
                "
            >

                <h3>
                    🖼️ Original Document
                </h3>

                <br>

                <img
                    src="${originalURL}"
                    alt="Original document preview"
                    style="
                        max-width:100%;
                        max-height:600px;
                        border-radius:10px;
                        border:1px solid #ddd;
                    "
                >

                <br><br>

                <a
                    href="${originalURL}"
                    download="DocPinch-original-document.jpg"
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
                    ⬇️ Download Original
                </a>

            </div>

        `;

    }


    // -------------------------------------------------
    // BACK
    // -------------------------------------------------

    document
        .getElementById(
            "enhanceBackBtn"
        )
        .addEventListener(
            "click",
            () => {
                location.reload();
            }
        );

}
