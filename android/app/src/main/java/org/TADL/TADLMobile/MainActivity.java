package org.TADL.TADLMobile;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Follow system Light/Dark so uiMode is accurate
    AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    super.onCreate(savedInstanceState);

    // IMPORTANT: enable edge-to-edge so the Capawesome plugin can apply insets to the WebView
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    // Do NOT set status bar color or icon style here; JS will handle colors/icons.
  }
}
