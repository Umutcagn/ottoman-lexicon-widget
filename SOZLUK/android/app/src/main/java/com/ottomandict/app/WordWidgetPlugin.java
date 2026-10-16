package com.ottomandict.app;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WordWidget")
public class WordWidgetPlugin extends Plugin {

    @PluginMethod
    public void updateWidget(PluginCall call) {
        try {
            String tr = call.getString("tr");
            String ottoman = call.getString("ottoman");
            String meaning = call.getString("meaning");
            String example = call.getString("example");
            String theme = call.getString("theme");

            String[] prefNames = new String[]{
                "CapacitorStorage",
                "CapacitorPreferences",
                getContext().getPackageName() + "_preferences"
            };

            for (String prefName : prefNames) {
                SharedPreferences sharedPref = getContext().getSharedPreferences(prefName, Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPref.edit();
                if (tr != null) editor.putString("widget_tr", tr);
                if (ottoman != null) editor.putString("widget_ottoman", ottoman);
                if (meaning != null) editor.putString("widget_meaning", meaning);
                if (example != null) editor.putString("widget_example", example);
                if (theme != null) editor.putString("widget_theme", theme);
                editor.commit();
            }

            WordWidgetProvider.triggerUpdate(getContext());
            call.resolve();
        } catch (Exception e) {
            call.reject("Widget güncellenemedi: " + e.getMessage());
        }
    }
}
