package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Do NOT draw behind system bars; Android will inset content for us
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    // Optional extra guard (some OEMs): ensure the WebView honors insets
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

    // Solid bar color (works when not edge-to-edge)
    getWindow().setStatusBarColor(night ? Color.parseColor("#121212") : Color.WHITE);
  }
}
