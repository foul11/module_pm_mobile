package net.arturka.module_pm_mobile

import android.R
import android.R.attr.mimeType
import android.app.DownloadManager
import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Context.DOWNLOAD_SERVICE
import android.content.Intent
import android.graphics.Color
import android.media.MediaScannerConnection
import android.media.MediaScannerConnection.OnScanCompletedListener
import android.net.Uri
import android.net.http.HttpResponseCache.install
import android.os.Environment
import android.util.Base64
import android.util.Log
import android.view.ViewGroup
import android.webkit.DownloadListener
import android.webkit.URLUtil
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.compose.runtime.Composable
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.app.NotificationChannelCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat.getString
import androidx.core.content.FileProvider
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream


const val TAG = "HUH";

@Composable
fun ComposeWrappedWebView() {
    AndroidView(
        factory = { context ->
            val assetLoader = WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", AssetsPathHandler(context))
                .build()

            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )

                Log.d(TAG, "loadwebview");

                fun createAndSaveFileFromBase64Url(url: String): String {
                    val path =
                        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                    val filetype = url.substring(url.indexOf("/") + 1, url.indexOf(";"))
                    val filename = System.currentTimeMillis().toString() + "." + filetype
                    val file = File(path, filename)

                    try {
                        if (!path.exists()) path.mkdirs()
                        if (!file.exists()) file.createNewFile()

                        val base64EncodedString = url.substring(url.indexOf(",") + 1)
                        val decodedBytes: ByteArray =
                            Base64.decode(base64EncodedString, Base64.DEFAULT)
                        val os: OutputStream = FileOutputStream(file)
                        os.write(decodedBytes)
                        os.close()

                        //Tell the media scanner about the new file so that it is immediately available to the user.
                        MediaScannerConnection.scanFile(
                            context,
                            arrayOf(file.toString()), null,
                            OnScanCompletedListener { path, uri ->
                                Log.i("ExternalStorage", "Scanned $path:")
                                Log.i("ExternalStorage", "-> uri=$uri")
                            })

                        //Set notification after download complete and add "click to view" action to that
                        val mimetype = url.substring(url.indexOf(":") + 1, url.indexOf("/"))
                        val intent = Intent()

                        intent.setAction(Intent.ACTION_VIEW)
                        intent.setDataAndType(FileProvider.getUriForFile(
                            context,
                            context.applicationContext
                                .packageName + ".provider", file
                        ), ("$mimetype/*"))
                        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)

//                        intent.setDataAndType(Uri.fromFile(file), ("$mimetype/*"))

                        val pIntent = PendingIntent.getActivity(context, 0, intent,
                            PendingIntent.FLAG_IMMUTABLE)

                        NotificationManagerCompat.from(context).createNotificationChannel(
                            NotificationChannelCompat.Builder("TestChannel", NotificationManagerCompat.IMPORTANCE_DEFAULT).apply {
                                setName("TestChannel")
                                setDescription("channel description")
                                setLightsEnabled(true)
                                setLightColor(Color.RED)
                                setVibrationEnabled(true)
                                setVibrationPattern(longArrayOf(100, 200, 300, 400, 500, 400, 300, 200, 400))
                            }.build()
                        )

                        val notification: Notification = NotificationCompat.Builder(context, "TestChannel")
                            .setSmallIcon(R.mipmap.sym_def_app_icon)
                            .setContentText(getString(context, R.string.ok))
                            .setContentTitle(filename)
                            .setContentIntent(pIntent)
                            .build()

                        notification.flags = notification.flags or Notification.FLAG_AUTO_CANCEL

                        val notificationId = 85851
                        val notificationManager =
                            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager?

                        notificationManager!!.notify(notificationId, notification)
                    } catch (e: IOException) {
                        Log.w("ExternalStorage", "Error writing $file", e)
                        Toast.makeText(
                            context,
                            R.string.httpErrorBadUrl,
                            Toast.LENGTH_LONG
                        ).show()
                    }

                    return file.toString()
                }

                setDownloadListener(DownloadListener() { url, userAgent, contentDisposition, mimeType, contentLength ->
                    if (url.startsWith("data:")) {  //when url is base64 encoded data
                        val path = createAndSaveFileFromBase64Url(url)
                        return@DownloadListener
                    }

                    val request = DownloadManager.Request(Uri.parse(url))

                    request.setMimeType(mimeType)
                    request.addRequestHeader("User-Agent", userAgent)
                    request.setDescription("Downloaded from <ANY NAME>")
                    request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimeType))
                    request.allowScanningByMediaScanner()

                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    request.setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_DOWNLOADS,
                        URLUtil.guessFileName(url, contentDisposition, mimeType)
                    )
                    val dm = context.getSystemService(DOWNLOAD_SERVICE) as DownloadManager

                    dm.enqueue(request)
                    Toast.makeText(
                        context.applicationContext,
                        "Downloading File",
                        Toast.LENGTH_LONG
                    ).show()
                })

//                this.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
//                    val filename = URLUtil.guessFileName(url, contentDisposition, "application/json")
//
//                    try {
//                        val request = DownloadManager.Request(Uri.parse(url));
//
//                        request.allowScanningByMediaScanner();
//                        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED); //Notify client once download is completed!
//                        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
//                        val dm = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager;
//                        dm.enqueue(request);
//
//                        Toast.makeText(context, "Downloading File...", Toast.LENGTH_LONG).show();
//                    } catch (ignored: Exception) {
//                        Toast.makeText(context, ignored.toString(), Toast.LENGTH_SHORT).show();
//                    }
//
////                        downloadFile(filename, url, userAgent)
//                })

                /**
                 * Enable JavaScript in the WebView
                 * This is required to load JS in the WebView
                 * The compiler will warn you that this can cause XSS security issues
                 * but since we are loading our own assets, this is not a concern
                 * hence the `@Suppress("SetJavaScriptEnabled")` annotation
                 */
                @Suppress("SetJavaScriptEnabled")
                settings.javaScriptEnabled = true
                settings.allowFileAccess = true;
                settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW;

                webViewClient = object : WebViewClient() {
                    override fun shouldInterceptRequest(
                        view: WebView,
                        request: WebResourceRequest
                    ): WebResourceResponse? {
                        return assetLoader.shouldInterceptRequest(request.url)
                    }

//                    override fun shouldOverrideUrlLoading(v: WebView, u: String?): Boolean {
//                        v.loadUrl(u!!)
//                        v.setDownloadListener(this)
//                        return true
//                    }
//
//                    override fun onDownloadStart(
//                        url: String,
//                        userAgent: String?,
//                        contentDisposition: String?,
//                        mimetype: String?,
//                        contentLength: Long
//                    ) {
//                        Log.i(TAG, "Download: $url")
//                        Log.i(TAG, "Length: $contentLength")
//                    }

//                    override fun onLoadResource(view: WebView?, url: String) {
//                        Log.d(TAG, url);
//
//                        if (url.endsWith(".zip")) {
//                        } else super.onLoadResource(view, url)
//                    }

//                    @SuppressLint("InlinedApi")
//                    override fun shouldOverrideUrlLoading(view: WebView, url: String?): Boolean {
//                        print("downloading")
//                        var value = true
//                        val extension = MimeTypeMap.getFileExtensionFromUrl(url)
//                        if (extension != null) {
//                            val mime = MimeTypeMap.getSingleton()
//                            val mimeType = mime.getMimeTypeFromExtension(extension)
//                            if (mimeType != null) {
//                                if (mimeType.lowercase(Locale.getDefault()).contains("video")
//                                    || extension.lowercase(Locale.getDefault()).contains("mov")
//                                    || extension.lowercase(Locale.getDefault()).contains("mp3")
//                                ) {
//                                    val manager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
//                                    val request = DownloadManager.Request(
//                                        Uri.parse(url)
//                                    )
//                                    val destinationFile = File(
//                                        Environment.getExternalStorageDirectory(),
//                                        getFileName(url)
//                                    )
//                                    request.setDescription("Downloading via Your app name..")
//                                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
//                                    request.setDestinationUri(Uri.fromFile(destinationFile))
//
//                                    manager.enqueue(request)
//                                    value = false
//                                }
//                            }
//                            if (value) {
//                                view.loadUrl(url!!)
//                            }
//                        }
//                        return value
//                    }
//                    fun getFileName(url: String?): String {
//                        var filenameWithoutExtension = ""
//                        filenameWithoutExtension = (System.currentTimeMillis()
//                            .toString() + ".mp4").toString()
//                        return filenameWithoutExtension
//                    }
                }

//                this.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
//                    val i = Intent(Intent.ACTION_VIEW)
//                    i.setData(Uri.parse(url))
//                    print(i)
////                    startActivity(i)
//                })

                /**
                 * This is the URL that will be loaded when the WebView is first
                 * The assets directory is served by a domain `https://appassets.androidplatform.net`
                 * Learn more about the WebViewAssetLoader here:
                 * https://developer.android.com/reference/androidx/webkit/WebViewAssetLoader
                 */
                loadUrl("https://appassets.androidplatform.net/assets/dist/index.html")
            }
        },
        update = {}
    )
}