package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
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

    // Do NOT draw behind system bars; let Android inset content
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    // Ensure system draws the bar and it’s not translucent
    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

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
    final int lightBg = Color.WHITE;
    final int darkBg  = Color.parseColor("#121212");

    // Paint the WINDOW background that sits behind the bar (fixes white strip on Pixel 9 dark)
    getWindow().setBackgroundDrawable(new ColorDrawable(night ? darkBg : lightBg));

    // Icon/text contrast (Compat works API 21–35)
    WindowInsetsControllerCompat controller =
        new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    controller.setAppearanceLightStatusBars(!night); // dark icons in light mode; light in dark

    // Solid bar color when not edge-to-edge; harmless if the bar is transparent on newer APIs
    getWindow().setStatusBarColor(night ? darkBg : lightBg);
  }
}
