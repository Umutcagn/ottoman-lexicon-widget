package com.ottomandict.app;

public class WordsData {
    public static class WordItem {
        public String id;
        public String tr;
        public String ottoman;
        public String meaning;

        public WordItem(String id, String tr, String ottoman, String meaning) {
            this.id = id;
            this.tr = tr;
            this.ottoman = ottoman;
            this.meaning = meaning;
        }
    }

    public static final WordItem[] words = new WordItem[] {
        new WordItem("gonul", "Gönül", "كوڭل", "Kalpten gelen his; sevgi, istek ve duyguların merkezi olarak düşünülen manevi yön."),
        new WordItem("muhabbet", "Muhabbet", "محبت", "Sevgi, dostluk; içten söyleşi, tatlı sohbet."),
        new WordItem("huzun", "Hüzün", "حزن", "İç sıkıntısı, gam; tatlı bir kederle karışık derin üzüntü."),
        new WordItem("vuslat", "Vuslat", "وصلt", "Kavuşma; sevgiliye ya da özlenene erişme."),
        new WordItem("hasret", "Hasret", "حسرت", "Özlem, bir şeye kavuşamamaktan doğan derin istek ve acı."),
        new WordItem("kader", "Kader", "قدر", "Alın yazısı; olacakların önceden takdir edildiğine dair inanç."),
        new WordItem("mutaassip", "Mutaassıp", "متعصب", "Bir görüşe aşırı bağlı, hoşgörüsüz; taassup sahibi."),
        new WordItem("tabip", "Tabip", "طبیب", "Hekim, doktor; hastalıkları tedavi eden kimse."),
        new WordItem("sevda", "Sevda", "سودا", "Güçlü aşk, tutku; insanı saran derin sevgi."),
        new WordItem("vefa", "Vefa", "وفا", "Sözünde durma, bağlılık; sevgi ve dostlukta sadakat."),
        new WordItem("firkat", "Firkat", "فرقت", "Ayrılık; sevgiliden ya da yârdan uzak düşme."),
        new WordItem("nazar", "Nazar", "نظر", "Bakış, göz atma; ayrıca kötü bakışın verdiğine inanılan zarar."),
        new WordItem("meshk", "Meşk", "مشق", "Alıştırma yaparak öğrenme; özellikle hat ve müzik talimi."),
        new WordItem("yar", "Yâr", "یار", "Sevgili, dost; en yakın ve sevilen kimse."),
        new WordItem("cefa", "Cefa", "جفا", "Eziyet, sıkıntı; sevgilinin verdiği üzüntü."),
        new WordItem("zaman", "Zaman", "زمان", "Vakit, çağ; olayların içinde aktığı süreç.")
    };
}
