package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.graphics.Color;
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

    // Do NOT draw behind system bars; let Android inset content
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    // Clear any lingering layout flags (prevents accidental fullscreen/overlay)
    getWindow().getDecorView().setSystemUiVisibility(0);

    // Extra guard: ensure the root content gets at least status-bar padding
    final View root = findViewById(android.R.id.content);
    if (root != null) {
      ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
        Insets sb = insets.getInsets(WindowInsetsCompat.Type.statusBars());
        int wantTop = sb.top;
        int haveTop = v.getPaddingTop();
        // Only increase padding if it's less than the inset (avoid double padding)
        if (haveTop < wantTop) {
          v.setPadding(v.getPaddingLeft(), wantTop, v.getPaddingRight(), v.getPaddingBottom());
        }
        return insets; // don't consume; let children handle if desired
      });
      ViewCompat.requestApplyInsets(root);
    }

    // Also ensure the WebView itself participates in insets
    if (getBridge() != null && getBridge().getWebView() != null) {
      getBridge().getWebView().setFitsSystemWindows(true);
    }

    applyStatusBarAppearance();
  }

  @Override
  public void onResume() {
    super.onResume();
    applyStatusBarAppearance();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    applyStatusBarAppearance();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) applyStatusBarAppearance();
  }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  private void applyStatusBarAppearance() {
    final boolean night = isNight();

    // Icon/text contrast (Compat works API 21–35)
    WindowInsetsControllerCompat controller =
        new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    controller.setAppearanceLightStatusBars(!night); // dark icons in light mode; light in dark

    // Solid bar color (since we're not drawing edge-to-edge)
    getWindow().setStatusBarColor(night ? Color.parseColor("#121212") : Color.WHITE);
  }
}
