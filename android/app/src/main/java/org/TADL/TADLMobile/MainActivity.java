package org.TADL.TADLMobile;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    final View content = findViewById(android.R.id.content);
    if (content != null) {
      ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
        Insets topInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars());
        Insets bottomInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());

        v.setPadding(
            v.getPaddingLeft(),
            topInsets.top,
            v.getPaddingRight(),
            bottomInsets.bottom
        );

        return insets;
      });

      ViewCompat.requestApplyInsets(content);
    }
  }
}
