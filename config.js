/* ===== Einstellungen der Website – HIER deine eigenen Werte eintragen =====
   Solange SUPABASE_URL leer ist, läuft die Website im Demo-Modus (nur im Browser, ohne KI). */
window.LP_CONFIG={
  APP_NAME:"Lernwerk",          // Name deiner Website
  SUPABASE_URL:"",              // z. B. "https://abcdefgh.supabase.co"  (Supabase → Project Settings → API)
  SUPABASE_ANON_KEY:"",         // der «anon public» Schlüssel (darf öffentlich sein)
  KI:true,                      // false = ohne KI: gratis, keine Anthropic-Konto nötig, aber einfachere Aufgaben
  MAX_TEXT_CHARS:40000          // längste erlaubte Zusammenfassung (muss zur Server-Einstellung passen)
};
