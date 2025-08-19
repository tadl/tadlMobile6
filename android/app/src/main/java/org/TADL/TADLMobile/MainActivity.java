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
    // Follow system day/night so uiMode is correct
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Inset content below system bars (no overlay)
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    applyStatusBarAppearance();
  }

  @Override
  public void onResume() {   // <-- must be public
    super.onResume();
    applyStatusBarAppearance();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    applyStatusBarAppearance();
  }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  private void applyStatusBarAppearance() {
    final boolean night = isNight();

    // Background color
    final int lightColor = Color.WHITE;                // light mode bar
    final int darkColor  = Color.parseColor("#121212"); // dark mode bar

    getWindow().setStatusBarColor(night ? darkColor : lightColor);

    // Icon/text contrast (Compat API works on API 21–35)
    WindowInsetsControllerCompat controller =
        new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    controller.setAppearanceLightStatusBars(!night); // dark icons in light mode; light icons in dark mode
  }
}
