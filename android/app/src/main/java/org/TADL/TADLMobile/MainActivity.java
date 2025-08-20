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
    // Follow system light/dark
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // IMPORTANT: allow edge-to-edge so the Capawesome plugin can apply insets to the WebView
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    // Modern bar drawing; no legacy translucency
    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

    applyBars();
  }

  @Override public void onResume() { super.onResume(); applyBars(); }
  @Override public void onConfigurationChanged(Configuration newConfig) { super.onConfigurationChanged(newConfig); applyBars(); }
  @Override public void onWindowFocusChanged(boolean hasFocus) { super.onWindowFocusChanged(hasFocus); if (hasFocus) applyBars(); }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  /** We keep color + icon contrast correct. Plugin handles the padding/insets. */
  private void applyBars() {
    final boolean night = isNight();
    final int bg = night ? Color.parseColor("#121212") : Color.WHITE;

    // Paint the window background (this is what shows behind the transparent bar on Android 15)
    getWindow().setBackgroundDrawable(new ColorDrawable(bg));

    // Icon contrast: dark icons on light bg; light icons on dark bg
    new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView())
        .setAppearanceLightStatusBars(!night);
  }
}
