package com.ottomandict.app;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.os.Bundle;

public class WordWidgetProvider2x1 extends WordWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId, R.layout.widget_layout_2x1);
        }
    }

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
        updateAppWidget(context, appWidgetManager, appWidgetId, R.layout.widget_layout_2x1);
    }
}
