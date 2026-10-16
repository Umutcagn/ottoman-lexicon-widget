package com.ottomandict.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.View;
import android.widget.RemoteViews;

public class WordWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId, R.layout.widget_layout_2x1);
        }
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
        updateAppWidget(context, appWidgetManager, appWidgetId, 0);
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        updateAppWidget(context, appWidgetManager, appWidgetId, 0);
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId, int forcedLayoutId) {
        String[] prefNames = new String[]{
            "CapacitorPreferences",
            "CapacitorStorage",
            context.getPackageName() + "_preferences"
        };

        String wordTr = "Mütefekkir";
        String wordOttoman = "متفكر";
        String wordMeaning = "Düşünür. Çok düşünen, derin düşüncelere dalan kimse.";
        String wordExample = "Akşamın hüznü çöktü şehrin damlarına.";
        String theme = "glass";

        // Merge preferences across all stores WITHOUT breaking early
        for (String prefName : prefNames) {
            try {
                SharedPreferences sharedPref = context.getSharedPreferences(prefName, Context.MODE_PRIVATE);
                if (sharedPref != null) {
                    if (sharedPref.contains("widget_theme")) {
                        theme = sharedPref.getString("widget_theme", theme);
                    }
                    if (sharedPref.contains("widget_tr")) {
                        wordTr = sharedPref.getString("widget_tr", wordTr);
                    }
                    if (sharedPref.contains("widget_ottoman")) {
                        wordOttoman = sharedPref.getString("widget_ottoman", wordOttoman);
                    }
                    if (sharedPref.contains("widget_meaning")) {
                        wordMeaning = sharedPref.getString("widget_meaning", wordMeaning);
                    }
                    if (sharedPref.contains("widget_example")) {
                        wordExample = sharedPref.getString("widget_example", wordExample);
                    }
                }
            } catch (Exception e) {
                // ignore
            }
        }

        int layoutId = forcedLayoutId;
        if (layoutId == 0) {
            layoutId = R.layout.widget_layout_2x1;
            try {
                if (appWidgetManager.getAppWidgetInfo(appWidgetId) != null && appWidgetManager.getAppWidgetInfo(appWidgetId).provider != null) {
                    String className = appWidgetManager.getAppWidgetInfo(appWidgetId).provider.getClassName();
                    if (className.contains("2x2") || className.contains("Small")) {
                        layoutId = R.layout.widget_layout_small;
                    } else if (className.contains("3x2") || className.contains("Large")) {
                        layoutId = R.layout.widget_layout_large;
                    } else {
                        layoutId = R.layout.widget_layout_2x1;
                    }
                }
            } catch (Exception e) {
                layoutId = R.layout.widget_layout_2x1;
            }
        }

        RemoteViews views = new RemoteViews(context.getPackageName(), layoutId);
        views.setTextViewText(R.id.widget_tr, wordTr);
        views.setTextViewText(R.id.widget_ottoman, wordOttoman);
        views.setTextViewText(R.id.widget_meaning, wordMeaning);
        views.setTextViewText(R.id.widget_example, "“" + wordExample + "”");

        Bundle options = appWidgetManager.getAppWidgetOptions(appWidgetId);
        if (options != null) {
            int minWidth = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 110);
            if (minWidth >= 220) {
                views.setTextViewTextSize(R.id.widget_tr, TypedValue.COMPLEX_UNIT_SP, 18);
                views.setTextViewTextSize(R.id.widget_ottoman, TypedValue.COMPLEX_UNIT_SP, 28);
                views.setTextViewTextSize(R.id.widget_meaning, TypedValue.COMPLEX_UNIT_SP, 11);
                views.setInt(R.id.widget_meaning, "setMaxLines", 2);
            }
            if (minWidth >= 280) {
                views.setTextViewTextSize(R.id.widget_tr, TypedValue.COMPLEX_UNIT_SP, 22);
                views.setTextViewTextSize(R.id.widget_ottoman, TypedValue.COMPLEX_UNIT_SP, 32);
                views.setTextViewTextSize(R.id.widget_meaning, TypedValue.COMPLEX_UNIT_SP, 12);
                views.setInt(R.id.widget_meaning, "setMaxLines", 3);
            }
        }

        // Default theme is transparent glass ("glass")
        int bgResId = R.drawable.widget_bg_glass;
        int trColor = android.graphics.Color.parseColor("#FFFFFF");
        int ottomanColor = android.graphics.Color.parseColor("#FDE68A");
        int meaningColor = android.graphics.Color.parseColor("#E5E7EB");

        if ("parchment".equals(theme)) {
            bgResId = R.drawable.widget_bg_parchment;
            trColor = android.graphics.Color.parseColor("#451A03");
            ottomanColor = android.graphics.Color.parseColor("#78350F");
            meaningColor = android.graphics.Color.parseColor("#92400E");
        } else if ("aurora".equals(theme)) {
            bgResId = R.drawable.widget_bg_aurora;
            trColor = android.graphics.Color.parseColor("#FFFFFF");
            ottomanColor = android.graphics.Color.parseColor("#D8B4FE");
            meaningColor = android.graphics.Color.parseColor("#E9D5FF");
        } else if ("midnight".equals(theme)) {
            bgResId = R.drawable.widget_background;
            trColor = android.graphics.Color.parseColor("#FFFFFF");
            ottomanColor = android.graphics.Color.parseColor("#FFB300");
            meaningColor = android.graphics.Color.parseColor("#CCCCCC");
        }


        views.setInt(R.id.widget_container, "setBackgroundResource", bgResId);
        views.setViewVisibility(R.id.widget_container, View.VISIBLE);
        views.setTextColor(R.id.widget_tr, trColor);
        views.setTextColor(R.id.widget_ottoman, ottomanColor);
        views.setTextColor(R.id.widget_meaning, meaningColor);

        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    public static void triggerUpdate(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);

        // 1. Update 2x1 widgets
        ComponentName cn2x1 = new ComponentName(context, WordWidgetProvider2x1.class);
        int[] ids2x1 = appWidgetManager.getAppWidgetIds(cn2x1);
        if (ids2x1 != null && ids2x1.length > 0) {
            for (int id : ids2x1) {
                updateAppWidget(context, appWidgetManager, id, R.layout.widget_layout_2x1);
            }
            Intent intent = new Intent(context, WordWidgetProvider2x1.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids2x1);
            context.sendBroadcast(intent);
        }

        // 2. Update 2x2 widgets
        ComponentName cn2x2 = new ComponentName(context, WordWidgetProvider2x2.class);
        int[] ids2x2 = appWidgetManager.getAppWidgetIds(cn2x2);
        if (ids2x2 != null && ids2x2.length > 0) {
            for (int id : ids2x2) {
                updateAppWidget(context, appWidgetManager, id, R.layout.widget_layout_small);
            }
            Intent intent = new Intent(context, WordWidgetProvider2x2.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids2x2);
            context.sendBroadcast(intent);
        }

        // 3. Update 3x2 widgets
        ComponentName cn3x2 = new ComponentName(context, WordWidgetProvider3x2.class);
        int[] ids3x2 = appWidgetManager.getAppWidgetIds(cn3x2);
        if (ids3x2 != null && ids3x2.length > 0) {
            for (int id : ids3x2) {
                updateAppWidget(context, appWidgetManager, id, R.layout.widget_layout_large);
            }
            Intent intent = new Intent(context, WordWidgetProvider3x2.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids3x2);
            context.sendBroadcast(intent);
        }

        // 4. Update base provider
        ComponentName cnBase = new ComponentName(context, WordWidgetProvider.class);
        int[] idsBase = appWidgetManager.getAppWidgetIds(cnBase);
        if (idsBase != null && idsBase.length > 0) {
            for (int id : idsBase) {
                updateAppWidget(context, appWidgetManager, id, R.layout.widget_layout_2x1);
            }
            Intent intent = new Intent(context, WordWidgetProvider.class);
            intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idsBase);
            context.sendBroadcast(intent);
        }
    }
}
