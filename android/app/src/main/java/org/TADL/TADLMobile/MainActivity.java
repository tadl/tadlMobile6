package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;

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
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Draw edge-to-edge; bars are transparent on API 35
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    applyStatusBarAppearance();

    final View webView = getBridge() != null ? getBridge().getWebView() : null;
    if (webView != null) {
      ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
        Insets top = insets.getInsets(WindowInsetsCompat.Type.statusBars());
        v.setPadding(v.getPaddingLeft(), top.top, v.getPaddingRight(), v.getPaddingBottom());
        return insets;
      });
      webView.post(() -> ViewCompat.requestApplyInsets(webView));
    }
  }

  @Override public void onResume() { super.onResume(); applyStatusBarAppearance(); }
  @Override public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    applyStatusBarAppearance();
  }
  @Override public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) applyStatusBarAppearance();
  }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  private void applyStatusBarAppearance() {
    final boolean night = isNight();
    final int lightBg = Color.WHITE;
    final int darkBg  = Color.parseColor("#121212");

    // Paint behind the transparent status bar (API 35 way)
    getWindow().setBackgroundDrawable(new ColorDrawable(night ? darkBg : lightBg));

    // Icon contrast: dark icons in light mode, light icons in dark mode
    WindowInsetsControllerCompat c =
        new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    c.setAppearanceLightStatusBars(!night);
  }
}
