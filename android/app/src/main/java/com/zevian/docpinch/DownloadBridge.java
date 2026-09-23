package com.zevian.docpinch;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class DownloadBridge {

    private final Context context;

    public DownloadBridge(Context context) {
        this.context = context.getApplicationContext();
    }

    @JavascriptInterface
    public String saveFile(
            String base64Data,
            String mimeType,
            String fileName
    ) {

        try {

            if (base64Data == null || base64Data.trim().isEmpty()) {
                throw new IllegalArgumentException("Empty file data");
            }

            String safeMimeType =
                    (mimeType == null || mimeType.trim().isEmpty())
                            ? "application/octet-stream"
                            : mimeType.trim();

            String safeFileName =
                    sanitizeFileName(fileName);

            byte[] fileBytes =
                    Base64.decode(
                            base64Data,
                            Base64.DEFAULT
                    );

            if (fileBytes.length == 0) {
                throw new IllegalArgumentException(
                        "File contains no data"
                );
            }

            /*
             * Android 10+:
             * Save into public Downloads using MediaStore.
             */
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {

                ContentResolver resolver =
                        context.getContentResolver();

                ContentValues values =
                        new ContentValues();

                values.put(
                        MediaStore.Downloads.DISPLAY_NAME,
                        safeFileName
                );

                values.put(
                        MediaStore.Downloads.MIME_TYPE,
                        safeMimeType
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
                    throw new IllegalStateException(
                            "Could not create Downloads file"
                    );
                }

                try (
                        OutputStream output =
                                resolver.openOutputStream(uri)
                ) {

                    if (output == null) {
                        throw new IllegalStateException(
                                "Could not open output stream"
                        );
                    }

                    output.write(fileBytes);
                    output.flush();
                }

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

                showToast(
                        "✅ Saved to Downloads/DocPinch"
                );

                return uri.toString();
            }

            /*
             * Android 9 and below fallback.
             */
            File downloadsDirectory =
                    Environment.getExternalStoragePublicDirectory(
                            Environment.DIRECTORY_DOWNLOADS
                    );

            if (!downloadsDirectory.exists()
                    && !downloadsDirectory.mkdirs()) {

                throw new IllegalStateException(
                        "Could not create Downloads folder"
                );
            }

            File outputFile =
                    new File(
                            downloadsDirectory,
                            uniqueFileName(
                                    downloadsDirectory,
                                    safeFileName
                            )
                    );

            try (
                    FileOutputStream output =
                            new FileOutputStream(outputFile)
            ) {

                output.write(fileBytes);
                output.flush();
            }

            MediaScannerConnection.scanFile(
                    context,
                    new String[]{
                            outputFile.getAbsolutePath()
                    },
                    new String[]{
                            safeMimeType
                    },
                    null
            );

            showToast(
                    "✅ Saved to Downloads"
            );

            return outputFile.getAbsolutePath();

        } catch (Exception error) {

            error.printStackTrace();

            showToast(
                    "❌ Download failed: "
                            + error.getMessage()
            );

            return "";
        }
    }


    private String sanitizeFileName(
            String fileName
    ) {

        if (fileName == null
                || fileName.trim().isEmpty()) {

            return "DocPinch-file";
        }

        String cleaned =
                fileName
                        .replaceAll(
                                "[\\\\/:*?\"<>|]",
                                "_"
                        )
                        .trim();

        if (cleaned.isEmpty()) {
            cleaned = "DocPinch-file";
        }

        if (cleaned.length() > 120) {
            cleaned =
                    cleaned.substring(
                            0,
                            120
                    );
        }

        return cleaned;
    }


    private String uniqueFileName(
            File directory,
            String originalName
    ) {

        File original =
                new File(
                        directory,
                        originalName
                );

        if (!original.exists()) {
            return originalName;
        }

        int dot =
                originalName.lastIndexOf(".");

        String base;
        String extension;

        if (dot > 0) {

            base =
                    originalName.substring(
                            0,
                            dot
                    );

            extension =
                    originalName.substring(dot);

        } else {

            base = originalName;
            extension = "";
        }

        int counter = 1;

        while (true) {

            String candidate =
                    base
                            + "_"
                            + counter
                            + extension;

            File candidateFile =
                    new File(
                            directory,
                            candidate
                    );

            if (!candidateFile.exists()) {
                return candidate;
            }

            counter++;
        }
    }


    private void showToast(
            String message
    ) {

        new Handler(
                Looper.getMainLooper()
        ).post(
                () -> Toast.makeText(
                        context,
                        message,
                        Toast.LENGTH_SHORT
                ).show()
        );
    }
}
