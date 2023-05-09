package com.b2b_new_theme;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import android.content.res.Configuration;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
      super.onConfigurationChanged(newConfig);
      Intent intent = new Intent("onConfigurationChanged");       
      intent.putExtra("newConfig", newConfig);       
      this.sendBroadcast(intent);
  }

  @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

  protected String getMainComponentName() {
    return "B2B_NEW_THEME";
  }
}
