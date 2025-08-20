package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.os.Bundle;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Do NOT draw behind the system bars (no overlay)
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    // Make sure system draws an opaque status bar we can color via the theme
    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

    applyStatusBarIcons();
  }

  @Override
  public void onResume() {
    super.onResume();
    applyStatusBarIcons();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    applyStatusBarIcons();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) applyStatusBarIcons();
  }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  private void applyStatusBarIcons() {
    // Theme provides background color. We provide icon contrast only.
    final boolean night = isNight();
    WindowInsetsControllerCompat controller =
        new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    // true => dark icons (for light background); false => light icons (for dark background)
    controller.setAppearanceLightStatusBars(!night);
  }
}
