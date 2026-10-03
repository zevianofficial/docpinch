package com.zevian.docpinch;

import android.app.Activity;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;

import com.tom_roush.pdfbox.android.PDFBoxResourceLoader;
import com.tom_roush.pdfbox.io.MemoryUsageSetting;
import com.tom_roush.pdfbox.multipdf.PDFMergerUtility;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PdfMergeBridge {

    public static final int REQUEST_CODE = 45127;

    private static final String WORK_DIR_NAME =
            "docpinch_pdf_merge";

    private static final String OUTPUT_FILE_NAME =
            "DocPinch-merged-temp.pdf";

    private static final String COUNT_FILE_NAME =
            "pending-count.txt";

    private final Activity activity;
    private final WebView webView;

    private final ExecutorService executor =
            Executors.newSingleThreadExecutor();

    /*
     * Volatile because merge and download run on the executor.
     */
    private volatile File pendingMergedFile = null;
    private volatile long pendingMergedSize = 0;
    private volatile int pendingMergedFileCount = 0;

    public PdfMergeBridge(
            Activity activity,
            WebView webView
    ) {
        this.activity = activity;
        this.webView = webView;

        restorePendingMerge();
    }

    @JavascriptInterface
    public void openMergePicker() {

        try {

            Intent intent =
                    new Intent(Intent.ACTION_OPEN_DOCUMENT);

            intent.addCategory(
                    Intent.CATEGORY_OPENABLE
            );

            intent.setType(
                    "application/pdf"
            );

            intent.putExtra(
                    Intent.EXTRA_ALLOW_MULTIPLE,
                    true
            );

            intent.addFlags(
                    Intent.FLAG_GRANT_READ_URI_PERMISSION
            );

            intent.addFlags(
                    Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
            );

            activity.runOnUiThread(() ->
                    activity.startActivityForResult(
                            intent,
                            REQUEST_CODE
                    )
            );

        } catch (Exception error) {

            error.printStackTrace();

            postResult(
                    false,
                    0,
                    0,
                    error.getMessage()
            );
        }
    }

    @JavascriptInterface
    public void downloadMergedPdf() {

        executor.execute(
                this::downloadPendingMergedPdf
        );
    }

    public void handleActivityResult(
            int requestCode,
            int resultCode,
            Intent data
    ) {

        if (requestCode != REQUEST_CODE) {
            return;
        }

        if (
                resultCode != Activity.RESULT_OK
                || data == null
        ) {

            postResult(
                    false,
                    0,
                    0,
                    "PDF selection cancelled."
            );

            return;
        }

        List<Uri> selectedUris =
                collectUris(data);

        if (selectedUris.size() < 2) {

            postResult(
                    false,
                    selectedUris.size(),
                    0,
                    "Please select at least 2 PDF files."
            );

            return;
        }

        cleanupPendingMerge();

        executor.execute(() ->
                mergeSelectedPdfs(selectedUris)
        );
    }

    private List<Uri> collectUris(Intent data) {

        List<Uri> uris =
                new ArrayList<>();

        ClipData clipData =
                data.getClipData();

        if (clipData != null) {

            for (
                    int i = 0;
                    i < clipData.getItemCount();
                    i++
            ) {

                Uri uri =
                        clipData
                                .getItemAt(i)
                                .getUri();

                if (uri != null) {
                    uris.add(uri);
                }
            }

            return uris;
        }

        Uri singleUri =
                data.getData();

        if (singleUri != null) {
            uris.add(singleUri);
        }

        return uris;
    }

    private File getWorkDir() {

        return new File(
                activity.getFilesDir(),
                WORK_DIR_NAME
        );
    }

    private File getOutputFile() {

        return new File(
                getWorkDir(),
                OUTPUT_FILE_NAME
        );
    }

    private File getCountFile() {

        return new File(
                getWorkDir(),
                COUNT_FILE_NAME
        );
    }

    private void restorePendingMerge() {

        try {

            File output =
                    getOutputFile();

            if (
                    !output.exists()
                    || output.length() <= 0
            ) {

                return;
            }

            pendingMergedFile =
                    output;

            pendingMergedSize =
                    output.length();

            File countFile =
                    getCountFile();

            if (countFile.exists()) {

                try (
                        BufferedReader reader =
                                new BufferedReader(
                                        new FileReader(countFile)
                                )
                ) {

                    String value =
                            reader.readLine();

                    if (value != null) {

                        pendingMergedFileCount =
                                Integer.parseInt(
                                        value.trim()
                                );
                    }
                }
            }

        } catch (Exception error) {

            error.printStackTrace();

            pendingMergedFile = null;
            pendingMergedSize = 0;
            pendingMergedFileCount = 0;
        }
    }

    private void persistPendingMerge(
            int fileCount
    ) throws Exception {

        File workDir =
                getWorkDir();

        if (
                !workDir.exists()
                && !workDir.mkdirs()
        ) {

            throw new Exception(
                    "Could not create persistent merge workspace."
            );
        }

        File countFile =
                getCountFile();

        try (
                FileWriter writer =
                        new FileWriter(countFile)
        ) {

            writer.write(
                    String.valueOf(fileCount)
            );

            writer.flush();
        }
    }

    private void mergeSelectedPdfs(
            List<Uri> sourceUris
    ) {

        File workDir =
                getWorkDir();

        File outputTemp =
                getOutputFile();

        List<File> sourceFiles =
                new ArrayList<>();

        boolean keepOutput =
                false;

        try {

            if (
                    !workDir.exists()
                    && !workDir.mkdirs()
            ) {

                throw new Exception(
                        "Could not create merge workspace."
                );
            }

            if (outputTemp.exists()) {
                outputTemp.delete();
            }

            PDFBoxResourceLoader.init(
                    activity.getApplicationContext()
            );

            sendProgress(
                    "Preparing "
                            + sourceUris.size()
                            + " PDFs..."
            );

            for (
                    int i = 0;
                    i < sourceUris.size();
                    i++
            ) {

                sendProgress(
                        "Preparing PDF "
                                + (i + 1)
                                + " of "
                                + sourceUris.size()
                                + "..."
                );

                File sourceFile =
                        new File(
                                workDir,
                                "source_"
                                        + i
                                        + ".pdf"
                        );

                copyUriToFile(
                        sourceUris.get(i),
                        sourceFile
                );

                sourceFiles.add(
                        sourceFile
                );
            }

            sendProgress(
                    "Merging PDFs..."
            );

            PDFMergerUtility merger =
                    new PDFMergerUtility();

            for (File sourceFile : sourceFiles) {

                merger.addSource(
                        sourceFile
                );
            }

            merger.setDestinationFileName(
                    outputTemp.getAbsolutePath()
            );

            /*
             * Keep a smaller in-memory working area and
             * allow PDFBox to use temporary files for
             * the remaining merge workload.
             */
            MemoryUsageSetting memorySetting =
                    MemoryUsageSetting.setupMixed(
                            32L * 1024L * 1024L
                    );

            merger.mergeDocuments(
                    memorySetting
            );

            if (
                    !outputTemp.exists()
                    || outputTemp.length() <= 0
            ) {

                throw new Exception(
                        "Merged PDF was not created."
                );
            }

            pendingMergedFile =
                    outputTemp;

            pendingMergedSize =
                    outputTemp.length();

            pendingMergedFileCount =
                    sourceUris.size();

            persistPendingMerge(
                    sourceUris.size()
            );

            keepOutput = true;

            sendProgress(
                    "Merge complete. Ready to download."
            );

            postResult(
                    true,
                    sourceUris.size(),
                    outputTemp.length(),
                    ""
            );

            showToast(
                    "PDF merge complete"
            );

        } catch (Exception error) {

            error.printStackTrace();

            cleanupPendingMerge();

            postResult(
                    false,
                    sourceUris.size(),
                    0,
                    error.getMessage()
            );

            showToast(
                    "PDF merge failed"
            );

        } finally {

            for (File file : sourceFiles) {

                try {

                    if (file.exists()) {
                        file.delete();
                    }

                } catch (Exception ignored) {
                }
            }

            if (!keepOutput) {

                try {

                    if (outputTemp.exists()) {
                        outputTemp.delete();
                    }

                } catch (Exception ignored) {
                }

                try {

                    File countFile =
                            getCountFile();

                    if (countFile.exists()) {
                        countFile.delete();
                    }

                } catch (Exception ignored) {
                }
            }
        }
    }

    private void downloadPendingMergedPdf() {

        File source =
                pendingMergedFile;

        if (
                source == null
                || !source.exists()
                || source.length() <= 0
        ) {

            restorePendingMerge();

            source =
                    pendingMergedFile;
        }

        if (
                source == null
                || !source.exists()
                || source.length() <= 0
        ) {

            postDownloadResult(
                    false,
                    "",
                    "Merged PDF is no longer available."
            );

            return;
        }

        try {

            sendProgress(
                    "Saving merged PDF..."
            );

            Uri savedUri =
                    saveToDownloads(
                            source
                    );

            cleanupPendingMerge();

            postDownloadResult(
                    true,
                    savedUri == null
                            ? ""
                            : savedUri.toString(),
                    ""
            );

            showToast(
                    "Saved to Downloads/DocPinch"
            );

        } catch (Exception error) {

            error.printStackTrace();

            postDownloadResult(
                    false,
                    "",
                    error.getMessage()
            );

            showToast(
                    "Download failed"
            );
        }
    }

    private Uri saveToDownloads(
            File source
    ) throws Exception {

        if (
                Build.VERSION.SDK_INT
                        < Build.VERSION_CODES.Q
        ) {

            File downloads =
                    Environment
                            .getExternalStoragePublicDirectory(
                                    Environment.DIRECTORY_DOWNLOADS
                            );

            if (
                    !downloads.exists()
                    && !downloads.mkdirs()
            ) {

                throw new Exception(
                        "Could not create Downloads folder."
                );
            }

            File output =
                    new File(
                            downloads,
                            "DocPinch-merged.pdf"
                    );

            try (
                    InputStream input =
                            new FileInputStream(source);

                    OutputStream outputStream =
                            new FileOutputStream(output)
            ) {

                copyStream(
                        input,
                        outputStream
                );
            }

            return Uri.fromFile(
                    output
            );
        }

        ContentResolver resolver =
                activity.getContentResolver();

        ContentValues values =
                new ContentValues();

        values.put(
                MediaStore.Downloads.DISPLAY_NAME,
                "DocPinch-merged.pdf"
        );

        values.put(
                MediaStore.Downloads.MIME_TYPE,
                "application/pdf"
        );

        values.put(
                MediaStore.Downloads.RELATIVE_PATH,
                Environment.DIRECTORY_DOWNLOADS
                        + "/DocPinch"
        );

        values.put(
                MediaStore.Downloads.IS_PENDING,
                1
        );

        Uri uri =
                resolver.insert(
                        MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                        values
                );

        if (uri == null) {

            throw new Exception(
                    "Could not create Downloads file."
            );
        }

        try {

            OutputStream output =
                    resolver.openOutputStream(
                            uri
                    );

            if (output == null) {

                throw new Exception(
                        "Could not open Downloads output."
                );
            }

            try (
                    InputStream input =
                            new FileInputStream(source)
            ) {

                copyStream(
                        input,
                        output
                );
            }

            output.close();

            ContentValues completed =
                    new ContentValues();

            completed.put(
                    MediaStore.Downloads.IS_PENDING,
                    0
            );

            resolver.update(
                    uri,
                    completed,
                    null,
                    null
            );

            return uri;

        } catch (Exception error) {

            resolver.delete(
                    uri,
                    null,
                    null
            );

            throw error;
        }
    }

    private void copyUriToFile(
            Uri uri,
            File target
    ) throws Exception {

        ContentResolver resolver =
                activity.getContentResolver();

        try (
                InputStream input =
                        resolver.openInputStream(uri);

                OutputStream output =
                        new FileOutputStream(target)
        ) {

            if (input == null) {

                throw new Exception(
                        "Could not open selected PDF."
                );
            }

            byte[] buffer =
                    new byte[64 * 1024];

            int read;

            while (
                    (read = input.read(buffer))
                            != -1
            ) {

                output.write(
                        buffer,
                        0,
                        read
                );
            }

            output.flush();
        }
    }

    private void copyStream(
            InputStream input,
            OutputStream output
    ) throws Exception {

        byte[] buffer =
                new byte[64 * 1024];

        int read;

        while (
                (read = input.read(buffer))
                        != -1
        ) {

            output.write(
                    buffer,
                    0,
                    read
            );
        }

        output.flush();
    }

    private void sendProgress(
            String message
    ) {

        String safe =
                JSONObject.quote(
                        message
                );

        activity.runOnUiThread(() ->
                webView.evaluateJavascript(
                        "window.onNativePdfMergeProgress && "
                                + "window.onNativePdfMergeProgress("
                                + safe
                                + ");",
                        null
                )
        );
    }

    private void postResult(
            boolean success,
            int fileCount,
            long size,
            String error
    ) {

        try {

            JSONObject result =
                    new JSONObject();

            result.put(
                    "success",
                    success
            );

            result.put(
                    "fileCount",
                    fileCount
            );

            result.put(
                    "size",
                    size
            );

            result.put(
                    "error",
                    error == null
                            ? ""
                            : error
            );

            String json =
                    result.toString();

            activity.runOnUiThread(() ->
                    webView.evaluateJavascript(
                            "window.onNativePdfMergeComplete && "
                                    + "window.onNativePdfMergeComplete("
                                    + json
                                    + ");",
                            null
                    )
            );

        } catch (Exception ignored) {
        }
    }

    private void postDownloadResult(
            boolean success,
            String uri,
            String error
    ) {

        try {

            JSONObject result =
                    new JSONObject();

            result.put(
                    "success",
                    success
            );

            result.put(
                    "uri",
                    uri == null
                            ? ""
                            : uri
            );

            result.put(
                    "error",
                    error == null
                            ? ""
                            : error
            );

            String json =
                    result.toString();

            activity.runOnUiThread(() ->
                    webView.evaluateJavascript(
                            "window.onNativePdfMergeDownloadComplete && "
                                    + "window.onNativePdfMergeDownloadComplete("
                                    + json
                                    + ");",
                            null
                    )
            );

        } catch (Exception ignored) {
        }
    }

    private void cleanupPendingMerge() {

        try {

            File output =
                    getOutputFile();

            if (output.exists()) {
                output.delete();
            }

        } catch (Exception ignored) {
        }

        try {

            File countFile =
                    getCountFile();

            if (countFile.exists()) {
                countFile.delete();
            }

        } catch (Exception ignored) {
        }

        pendingMergedFile = null;
        pendingMergedSize = 0;
        pendingMergedFileCount = 0;
    }

    private void showToast(
            String message
    ) {

        new Handler(
                Looper.getMainLooper()
        ).post(
                () -> Toast.makeText(
                        activity,
                        message,
                        Toast.LENGTH_SHORT
                ).show()
        );
    }
}