package org.meltigy.rpncalc

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.webkit.WebView

// private const val TAG = "RpnCalc"

const val RPNCALC_URI = "file:///android_asset/rpncalc.html"

class RpnCalc : AppCompatActivity() {
    private lateinit var webview: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        webview = findViewById(R.id.webview)

        val webSettings = webview.getSettings()
        webSettings.domStorageEnabled = false
        webSettings.javaScriptEnabled = true
        webSettings.allowFileAccess = false

        if (savedInstanceState != null) {
            webview.restoreState(savedInstanceState)
        }

        webview.loadUrl(RPNCALC_URI)
    }


    // Store data before pausing the activity.
    override fun onSaveInstanceState(bundle: Bundle) {
        super.onSaveInstanceState(bundle)
        webview.saveState(bundle)    // Save webview state
    }

}

//    override fun onStart() {
//        super.onStart()
//        Log.d(TAG, "onStart() called")
//    }
//
//    override fun onResume() {
//        super.onResume()
//        Log.d(TAG, "onResume() called")
//    }
//
//    override fun onPause() {
//        super.onPause()
//        Log.d(TAG, "onPause() called")
//    }
//
//    override fun onStop() {
//        super.onStop()
//        Log.d(TAG, "onStop() called")
//    }
//
//    override fun onDestroy() {
//        super.onDestroy()
//        Log.d(TAG, "onDestroy() called")
//    }
