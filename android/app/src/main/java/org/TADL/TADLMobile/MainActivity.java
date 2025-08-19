package org.TADL.TADLMobile;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Let Android/Capacitor inset the content. No manual padding.
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
  }
}
