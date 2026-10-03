package com.zevian.docpinch;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private PdfMergeBridge pdfMergeBridge;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        WebView webView =
                getBridge().getWebView();

        /*
         * Existing native download bridge
         */
        webView.addJavascriptInterface(
                new DownloadBridge(this),
                "DocPinchDownload"
        );

        /*
         * Native PDF merge bridge
         */
        pdfMergeBridge =
                new PdfMergeBridge(
                        this,
                        webView
                );

        webView.addJavascriptInterface(
                pdfMergeBridge,
                "DocPinchPdfMerge"
        );

        /*
         * =====================================================
         * DOCPINCH DOM NATIVE BACK FINAL
         * =====================================================
         *
         * Tool -> DocPinch Home
         * Home -> Phone Home
         *
         * Tool detection is based on the real Home DOM.
         * The Home screen contains main .tools.
         */
        getOnBackPressedDispatcher().addCallback(
                this,
                new OnBackPressedCallback(true) {

                    @Override
                    public void handleOnBackPressed() {

                        WebView currentWebView =
                                getBridge().getWebView();

                        if (currentWebView == null) {

                            moveTaskToBack(true);

                            return;
                        }

                        currentWebView.evaluateJavascript(
                                "(document.querySelector('main .tools') ? 'HOME' : 'TOOL')",
                                value -> {

                                    if ("\"TOOL\"".equals(value)) {

                                        /*
                                         * Tool -> DocPinch Home
                                         */
                                        currentWebView.evaluateJavascript(
                                                "window.location.replace('index.html');",
                                                null
                                        );

                                        return;
                                    }

                                    /*
                                     * Home -> Phone Home
                                     */
                                    moveTaskToBack(true);
                                }
                        );
                    }
                }
        );
    }

    @Override
    protected void onActivityResult(
            int requestCode,
            int resultCode,
            Intent data
    ) {

        /*
         * DocPinch PDF Merge owns request code 45127.
         * Handle it here first and do NOT forward it to
         * Capacitor, because it is not a Capacitor plugin request.
         */
        if (requestCode == PdfMergeBridge.REQUEST_CODE) {

            if (pdfMergeBridge != null) {

                pdfMergeBridge.handleActivityResult(
                        requestCode,
                        resultCode,
                        data
                );
            }

            return;
        }

        /*
         * All other activity results continue through Capacitor.
         */
        super.onActivityResult(
                requestCode,
                resultCode,
                data
        );
    }
}