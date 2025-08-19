package org.TADL.TADLMobile;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Let content extend to the edges; we will add exact insets as padding on the WebView.
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    final View webView = getBridge() != null ? getBridge().getWebView() : null;
    if (webView != null) {
      ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
        Insets status = insets.getInsets(WindowInsetsCompat.Type.statusBars());
        Insets nav    = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
        // Top padding = status bar/cutout height; bottom padding = nav bar height
        v.setPadding(v.getPaddingLeft(), status.top, v.getPaddingRight(), nav.bottom);
        return insets; // don't consume; let child views handle if they want
      });
      ViewCompat.requestApplyInsets(webView);
    }
  }
}
