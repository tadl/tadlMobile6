package org.TADL.TADLMobile;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Do NOT draw behind system bars; inset content (keeps taps sane if bars reappear)
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

    // Make sure the window isn’t translucent; color is irrelevant when hidden
    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    if (Build.VERSION.SDK_INT >= 21) {
      getWindow().setStatusBarColor(0xFF000000);
    }

    hideStatusBar();
  }

  @Override
  protected void onResume() {
    super.onResume();
    hideStatusBar();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      hideStatusBar();
    }
  }

  private void hideStatusBar() {
    if (Build.VERSION.SDK_INT >= 30) {
      final WindowInsetsController controller = getWindow().getInsetsController();
      if (controller != null) {
        // Let users swipe to *temporarily* reveal bars; they’ll auto-hide again
        controller.setSystemBarsBehavior(
            WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
        controller.hide(WindowInsets.Type.statusBars());
      }
    } else {
      final View decor = getWindow().getDecorView();
      int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY; // transient reveal, then auto-hide
      decor.setSystemUiVisibility(flags);
    }
  }
}
