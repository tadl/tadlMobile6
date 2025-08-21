package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Follow system Light/Dark so uiMode is accurate
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Edge-to-edge ON so Capawesome can apply insets to the WebView
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    applyStatusBarIconContrast();
  }

  @Override
  public void onResume() {
    super.onResume();
    applyStatusBarIconContrast();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    applyStatusBarIconContrast();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) applyStatusBarIconContrast();
  }

  private boolean isNight() {
    int mask = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mask == Configuration.UI_MODE_NIGHT_YES;
  }

  /** Let Capawesome handle padding/background; we only ensure icon contrast. */
  private void applyStatusBarIconContrast() {
    boolean night = isNight();
    // APPEARANCE_LIGHT_STATUS_BARS = dark icons on a light background
    new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView())
        .setAppearanceLightStatusBars(!night); // dark icons in light mode, light icons in dark mode
  }
}
