package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Follow system dark/light
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Draw edge-to-edge; bars are effectively transparent on Android 15+
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    // Ensure system draws bars (not translucent legacy)
    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

    // Pad the WebView by real system insets so header is ALWAYS below the bar
    final View webView = getBridge() != null ? getBridge().getWebView() : null;
    if (webView != null) {
      ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
        Insets status = insets.getInsets(WindowInsetsCompat.Type.statusBars());
        Insets nav    = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
        v.setPadding(v.getPaddingLeft(), status.top, v.getPaddingRight(), nav.bottom);
        // We are handling layout; consume so nothing else double-applies
        return WindowInsetsCompat.CONSUMED;
      });
      webView.post(() -> ViewCompat.requestApplyInsets(webView));
    }

    applyBars();
  }

  @Override
  public void onResume() {
    super.onResume();
    applyBars();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    applyBars();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) applyBars();
  }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  private void applyBars() {
    final boolean night = isNight();
    final int bg = night ? Color.parseColor("#121212") : Color.WHITE;

    // Paint the WINDOW background; this is what shows behind the transparent bar on API 35
    getWindow().setBackgroundDrawable(new ColorDrawable(bg));

    // Icon/text contrast: dark icons in light mode; light icons in dark mode
    WindowInsetsControllerCompat controller =
        new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    controller.setAppearanceLightStatusBars(!night);
  }
}
