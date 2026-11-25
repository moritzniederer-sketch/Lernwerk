# Lernwerk – so stellst du deine Lernplattform online

Lernwerk ist eine Website, auf der man ein Konto erstellt, eine Zusammenfassung hochlädt und daraus Übungen, Probeprüfungen und Lernspiele bekommt. In den Einstellungen wählt jede Person selbst, ob sie Probeprüfungen, Aufgaben zu jedem Lernziel und den spielerischen Modus (XP, Ränge, Spiele) möchte.

> Den Namen «Lernwerk» kannst du in `js/config.js` ändern.

## 0. Zuerst ausprobieren (Demo-Modus)

Ohne Einrichtung läuft die Website im **Demo-Modus**: Konten und Daten bleiben nur im eigenen Browser, und die Aufgaben werden ohne KI erstellt (einfacher).

- Ordner entpacken und `index.html` im Browser öffnen (am besten Chrome, Edge oder Firefox).
- Funktioniert das Hochladen von Word/PDF nicht, kopiere den Text ins Feld.

## Ganz ohne KI und ohne Kosten

Wenn du kein Anthropic-Konto willst: In `js/config.js` `KI:false` eintragen. Dann brauchst du nur **Supabase** (gratis) und **GitHub Pages oder Netlify** (gratis). Schritt 3 fällt weg, und von Schritt 4 lädst du nur `konto-loeschen` hoch.
Die Aufgaben werden dann direkt im Browser nach festen Regeln erstellt – sie sind einfacher (am besten mit «Begriff: Erklärung»-Zeilen und Überschriften mit Aufzählungen). Später kannst du jederzeit auf `KI:true` wechseln.

## Was du für die echte Website brauchst

| Was | Wofür | Kosten |
|---|---|---|
| **Supabase** (supabase.com) | Konten, Datenbank, Server-Funktionen | gratis (Free-Plan) |
| **Anthropic** (console.anthropic.com) | die KI, die die Aufgaben erstellt | du bezahlst pro Nutzung (Guthaben aufladen) |
| **Netlify** (netlify.com) oder GitHub Pages | die Website selbst | gratis |

⚠️ Für ein Konto bei Anthropic (und für bezahlte Dienste) muss man **volljährig** sein. Wenn du noch nicht 18 bist, eröffnet ein Elternteil das Konto.

## 1. Supabase-Projekt erstellen

1. Auf supabase.com ein Konto erstellen → **New project**.
2. Name: z. B. `lernwerk`. Ein sicheres Datenbank-Passwort wählen und aufschreiben.
3. **Region: eine in Europa** wählen (z. B. Frankfurt oder Zürich, falls angeboten) – wichtig für den Datenschutz.
4. Warten, bis das Projekt bereit ist.

## 2. Datenbank einrichten

1. Links **SQL Editor** → **New query**.
2. Den ganzen Inhalt von `supabase/migrations/20261125000000_init.sql` einfügen → **Run**.
3. Es sollte «Success» erscheinen. Unter **Table Editor** siehst du jetzt `profiles`, `summaries` und `generation_log`.

Die Datenbank ist so eingestellt, dass jede Person **nur ihre eigenen Daten** sehen und ändern kann (Row Level Security).

## 3. Anthropic-Schlüssel holen

1. Auf console.anthropic.com ein Konto erstellen und **Guthaben** aufladen (z. B. 10 Dollar zum Starten).
2. **Unbedingt ein Ausgabenlimit setzen** (unter *Limits* bzw. *Billing*), damit nie mehr ausgegeben wird als du willst.
3. **API Keys** → **Create Key** → den Schlüssel (beginnt mit `sk-ant-…`) kopieren. **Diesen Schlüssel niemals in die Website-Dateien schreiben oder jemandem zeigen!** Er kommt nur in Supabase (Schritt 4).

Kosten: Pro Lernset ruft die Website die KI mehrmals auf (1 × Lernziele + 1 × pro zwei Lernziele). Grobe Schätzung (Preise Stand November 2026, aktuelle Preise auf claude.com/pricing): mit Sonnet ca. 0.30–0.50 Dollar pro Lernset, mit Haiku ca. 1–3 Rappen. Nur das Erstellen kostet – Üben, Prüfungen und Spiele sind gratis. Probiere es mit einer Zusammenfassung aus und schau danach in der Anthropic-Konsole unter *Usage*, was es gekostet hat. Mit `MODEL=claude-haiku-5-5` (Schritt 4) wird es deutlich günstiger und schneller, die Aufgaben sind dafür etwas einfacher.

## 4. Server-Funktionen hochladen

**Variante A – im Browser (am einfachsten):**

1. In Supabase links **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Name: `generate` → den Inhalt von `supabase/functions/generate/index.ts` einfügen → **Deploy**.
3. Nochmals: Name `konto-loeschen` → Inhalt von `supabase/functions/konto-loeschen/index.ts` → **Deploy**.
4. **Edge Functions → Secrets** (oder *Manage secrets*) → hinzufügen:
   - `ANTHROPIC_API_KEY` = dein Schlüssel aus Schritt 3
   - optional `MODEL` = `claude-haiku-5-5` (günstiger) – Standard ist `claude-sonnet-5-5`
   - optional `DAILY_LIMIT` = wie viele neue Lernsets eine Person pro Tag erstellen darf (Standard 5)
   - später (Schritt 7) `ALLOWED_ORIGIN` = die Adresse deiner Website

**Variante B – mit der Kommandozeile** (wenn du Node.js hast):

```bash
npx supabase login
npx supabase link --project-ref DEINE-PROJEKT-ID
npx supabase functions deploy generate
npx supabase functions deploy konto-loeschen
npx supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

## 5. Website mit Supabase verbinden

1. In Supabase: **Project Settings → API** (bzw. *Data API*).
2. Kopiere die **Project URL** und den **anon public** Schlüssel (der darf öffentlich sein – die Daten schützt die Datenbank selbst).
3. Öffne `js/config.js` und trage beide ein:

```js
SUPABASE_URL:"https://abcdefgh.supabase.co",
SUPABASE_ANON_KEY:"eyJhbGciOi...",
```

Den `service_role`-Schlüssel **niemals** in `config.js` eintragen!

## 6. Website online stellen (Netlify)

1. Auf app.netlify.com/drop gehen.
2. Den ganzen Ordner `lernwerk` (mit `index.html` darin) ins Fenster ziehen.
3. Du bekommst eine Adresse wie `https://irgendwas.netlify.app`. Unter *Site settings* kannst du den Namen ändern, z. B. `lernwerk-moritz.netlify.app`.

## 6b. Oder: Website mit GitHub Pages online stellen

1. Auf github.com ein Konto erstellen → oben rechts **+** → **New repository**.
2. Name: `lernwerk`, **Public** auswählen → **Create repository**.
3. Auf **uploading an existing file** klicken und den **Inhalt** des Ordners `lernwerk` hineinziehen (also `index.html`, `css`, `js`, `legal` … – nicht den Ordner selbst) → **Commit changes**.
4. **Settings → Pages** → bei *Source* «Deploy from a branch» → Branch `main`, Ordner `/ (root)` → **Save**.
5. Nach 1–2 Minuten ist die Seite unter `https://DEIN-NAME.github.io/lernwerk/` erreichbar.

Bei Schritt 7 trägst du dann ein:
- Site URL und Redirect URLs: `https://DEIN-NAME.github.io/lernwerk/`
- `ALLOWED_ORIGIN`: `https://DEIN-NAME.github.io` (nur bis `.io`, ohne `/lernwerk`)

⚠️ Auf GitHub ist alles öffentlich. Der `anon public`-Schlüssel in `config.js` darf öffentlich sein – den **Anthropic-Schlüssel** und den **service_role**-Schlüssel aber **niemals** hochladen!

## 7. Adresse in Supabase eintragen

1. Supabase → **Authentication → URL Configuration**:
   - **Site URL** = deine Netlify-Adresse
   - **Redirect URLs** = deine Netlify-Adresse (für Bestätigungs- und Passwort-Mails)
2. Supabase → **Authentication → Providers → Email**: «Confirm email» eingeschaltet lassen.
3. Bei den Secrets (Schritt 4) `ALLOWED_ORIGIN` = deine Netlify-Adresse setzen (ohne `/` am Schluss).

Optional: Unter **Authentication → Email Templates** kannst du die Mails auf Deutsch übersetzen.

## 8. Rechtstexte ausfüllen

In `legal/` liegen drei **Vorlagen**: Impressum, Datenschutzerklärung, Nutzungsbedingungen. Ersetze alles in eckigen Klammern `[…]` und entferne den gelben Vorlagen-Hinweis oben. Die Vorlagen sind **keine Rechtsberatung** – lass sie wenn möglich von einer Fachperson prüfen, besonders bevor viele Leute die Seite nutzen.

## 9. Testen

1. Website öffnen → Konto erstellen → Bestätigungsmail anklicken → anmelden.
2. Einstellungen wählen → Zusammenfassung hochladen → «Lernset erstellen». Das dauert 1–3 Minuten.
3. Klappt es nicht: Supabase → **Edge Functions → generate → Logs** zeigt den Fehler.

## Sicherheit und Kosten im Griff behalten

- **Ausgabenlimit** bei Anthropic setzen (Schritt 3).
- `DAILY_LIMIT` klein halten. Jede Person kann höchstens 50 Zusammenfassungen mit je höchstens 40 000 Zeichen speichern.
- In Supabase siehst du in der Tabelle `generation_log`, wie oft die KI benutzt wurde (inkl. Tokens).
- Wenn die Kosten zu hoch werden: `MODEL=claude-haiku-5-5` setzen oder `DAILY_LIMIT` senken.

## Aufbau der Dateien

```
index.html                 Startseite (lädt alles)
css/                       Aussehen
js/config.js               DEINE Einstellungen (Supabase-Adresse, Name)
js/app.js                  Konto, Übersicht, Hochladen, Einstellungen
js/api.js                  Verbindung zu Supabase bzw. Demo-Modus
js/data.js                 prüft die KI-Antwort und baut daraus Lernziele und Prüfungen
js/spiele.js               XP, Ränge, Blitzrunde, Memory, Wer bin ich?, Zeitreise, Wort-Rätsel
js/engine/                 Übungs- und Prüfungs-Engine (aus deinen Trainern)
supabase/migrations/       Datenbank
supabase/functions/        Server-Funktionen (KI-Aufruf, Konto löschen)
legal/                     Impressum, Datenschutz, Nutzungsbedingungen (Vorlagen)
```

## Gut zu wissen

- Die KI kann Fehler machen. Die Website prüft jede Aufgabe auf das richtige Format und wirft kaputte weg, aber den Inhalt kann sie nicht prüfen.
- Fotos von Heftseiten werden noch nicht unterstützt – nur Text, Word (.docx) und PDF mit auswählbarem Text.
- Schriften: Die Website verwendet die Systemschrift des Geräts (keine Google Fonts → besser für den Datenschutz).
- Die Programmbibliothek von Supabase wird von jsDelivr geladen. Wer ganz ohne fremde Server auskommen will, lädt `supabase.min.js` herunter, legt sie in `js/` und passt den Link in `index.html` an.
