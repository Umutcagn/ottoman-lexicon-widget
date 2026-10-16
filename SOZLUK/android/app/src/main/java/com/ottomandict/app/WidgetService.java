package com.ottomandict.app;

import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import java.util.ArrayList;
import java.util.List;

public class WidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new WidgetFactory(this.getApplicationContext());
    }
}

class WidgetFactory implements RemoteViewsService.RemoteViewsFactory {
    private Context context;
    private List<WordsData.WordItem> wordsList = new ArrayList<>();

    public WidgetFactory(Context context) {
        this.context = context;
    }

    @Override
    public void onCreate() {
        populateList();
    }

    @Override
    public void onDataSetChanged() {
        populateList();
    }

    private void populateList() {
        wordsList.clear();
        for (WordsData.WordItem item : WordsData.words) {
            wordsList.add(item);
        }
    }

    @Override
    public void onDestroy() {
        wordsList.clear();
    }

    @Override
    public int getCount() {
        return wordsList.size();
    }

    @Override
    public RemoteViews getViewAt(int position) {
        if (position < 0 || position >= wordsList.size()) return null;

        WordsData.WordItem word = wordsList.get(position);

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_item);
        views.setTextViewText(R.id.widget_tr, word.tr);
        views.setTextViewText(R.id.widget_ottoman, word.ottoman);
        views.setTextViewText(R.id.widget_meaning, word.meaning);

        // Fill-in intent to launch application with selected word
        Intent fillInIntent = new Intent();
        fillInIntent.putExtra("word_id", word.id);
        views.setOnClickFillInIntent(R.id.widget_item_container, fillInIntent);

        return views;
    }

    @Override
    public RemoteViews getLoadingView() {
        return null;
    }

    @Override
    public int getViewTypeCount() {
        return 1;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }
}
