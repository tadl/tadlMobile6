package org.TADL.TADLMobile;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.core.view.WindowCompat;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Do NOT draw behind the status bar; inset the content instead
    WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
  }
}
