package com.zevian.docpinch;

import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        WebView webView =
                getBridge().getWebView();

        webView.addJavascriptInterface(
                new DownloadBridge(this),
                "DocPinchDownload"
        );
    }
}
