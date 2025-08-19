package org.TADL.TADLMobile;

import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    // Follow system Day/Night so uiMode is accurate
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // Content sits below the status bar; we control the bar appearance ourselves
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    applyStatusBarAppearance();
  }

  @Override
  public void onResume() {
    super.onResume();
    applyStatusBarAppearance();
  }

  @Override
  public void onConfigurationChanged(android.content.res.Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // Re-apply on theme switches (you already have uiMode in configChanges)
    applyStatusBarAppearance();
  }

  private boolean isNight() {
    int mode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    return mode == Configuration.UI_MODE_NIGHT_YES;
  }

  private void applyStatusBarAppearance() {
    final boolean night = isNight();
    final int lightColor = 0xFFFFFFFF; // white
    final int darkColor  = 0xFF121212; // dark gray/near black

    if (Build.VERSION.SDK_INT >= 30) {
      WindowInsetsController c = getWindow().getInsetsController();
      if (c != null) {
        if (night) {
          // Dark bar, LIGHT icons
          getWindow().setStatusBarColor(darkColor);
          c.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS);
        } else {
          // Light bar, DARK icons
          getWindow().setStatusBarColor(lightColor);
          c.setSystemBarsAppearance(WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS,
                                    WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS);
        }
      }
    } else {
      // Pre-Android 11
      View decor = getWindow().getDecorView();
      int flags = decor.getSystemUiVisibility();
      if (night) {
        // Dark bar, LIGHT icons
        getWindow().setStatusBarColor(darkColor);
        flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
      } else {
        // Light bar, DARK icons
        getWindow().setStatusBarColor(lightColor);
        flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
      }
      decor.setSystemUiVisibility(flags);
    }
  }
}
