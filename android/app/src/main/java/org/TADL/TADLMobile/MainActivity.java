package org.TADL.TADLMobile;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    if (Build.VERSION.SDK_INT >= 21) {
      getWindow().setStatusBarColor(0xFFFFFFFF);
    }

    View webView = getBridge() != null ? getBridge().getWebView() : null;
    if (webView != null) {
      webView.setFitsSystemWindows(true);
    }
  }
}
