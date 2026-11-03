# FG SSD Portal

Ein professionelles, responsives MVP für den Schulsanitätsdienst des FG.

## Überblick

Dieses Repository enthält eine vollständige Frontend-Demo mit institutioneller, sachlicher Gestaltung und echten Formularen für:

- Dashboard mit Rollenwechsel
- Abwesenheitsmanagement
- Dienstplanung
- Meldungen / interne Alarmierung
- Materialverwaltung
- Mitteilungen

Die Anwendung arbeitet lokal in `localStorage` und ist für eine spätere Anbindung an Supabase vorbereitet.

## Geplante Produkt-Architektur

- Frontend: HTML5, CSS3, JavaScript
- Backend: Supabase + PostgreSQL
- Auth: Supabase Auth
- RLS: Row Level Security
- PWA/Capacitor: für spätere mobile App vorbereitet

## Projektstruktur

- `index.html` – Hauptseite mit allen Portalsektionen
- `styles.css` – professionelle UI-Stylesheet
- `app.js` – Interaktive Logik, Rollenwechsel, Formulare, Mock-Daten
- `supabase/schema.sql` – Datenbankmodell und Grundstruktur für Supabase
- `README.md` – Installations- und Nutzungshinweise

## Starten

### Option 1: Direkt im Browser

1. Repository klonen oder lokal öffnen.
2. `index.html` im Browser öffnen.
3. Die Anwendung funktioniert ohne zusätzliche Installation.

### Option 2: Lokaler Webserver

```bash
cd /pfad/zum/repo
python -m http.server 8000
```

Dann im Browser öffnen:

```text
http://localhost:8000
```

## Hinweise zur Qualität

- Die Oberfläche ist bewusst sachlich und professionell gestaltet.
- Keine offiziellen Logos oder Markenverwendungen.
- Die Alarmierungsfunktion ist als interne Verwaltungsfunktion konzipiert und ersetzt keinen Notruf.
- Die Meldung "Notruf 112" bleibt bewusst sichtbar, um die organisatorische Klarheit zu sichern.
- Die Anwendung ist als MVP ausgewiesen und kann mit Supabase vollständig abgesichert werden.

## Supabase-Plan

Die Datei `supabase/schema.sql` enthält das Basis-Schema für:

- `profiles`
- `roles`
- `absences`
- `service_assignments`
- `incidents`
- `materials`
- `messages`
- `notifications`

Dazu gehören Grund-Policies und ein strukturierter Startpunkt für Row Level Security.

## Designprinzipien

- Weißer und anthrazitfarbener Stil
- Dunkles Rettungsdienst-Rot als Akzent
- Professionelle Tabellen statt Karten-Overkill
- Mobile-first, responsive, sachlich

## Wichtiger Hinweis

Das vorliegende Projekt ist ein funktionales Frontend-MVP. Eine echte Backend-Anbindung an Supabase ist vorbereitet, aber noch nicht mit echten Nutzerdaten verbunden.
