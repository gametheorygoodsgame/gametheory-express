Game Theory Express Server
==========================

Dieses Projekt implementiert einen Express-Server für ein Spieltheorie-Anwendungssystem. Der Server bietet Endpunkte für Spiele, Spieler und Spielzüge und verwendet Firebase für die Authentifizierung.

Setup
-----

1.  Firebase-Konfiguration: Stelle sicher, dass deine Firebase-Servicekontodaten in der Datei `utils/firebase.ts` richtig konfiguriert sind.

2.  Installationsanleitung:

    -   Installiere die Abhängigkeiten mit dem Befehl `npm install`.
    -   Starte den Server mit `npm start`.
3.  Serverkonfiguration:

    -   Der Server läuft standardmäßig auf Port 30167.
    -   Die Endpunkte für Spiele, Spieler und Spielzüge sind unter `/games`, `/players` und `/moves` verfügbar.

Serverstruktur
--------------

-   `server.ts`: Die Hauptdatei, die den Express-Server konfiguriert und startet.
-   `middleware`: Enthält Middleware-Funktionen für die Authentifizierung (`authenticate.ts`), Logging (`morgan.ts`), UUID-Validierung (`uuid.ts`) sowie Validierung von Spielzustand, Spielzug, Spieler und NumRedCards (`validateGame.ts`, `validateMove.ts`, `validatePlayer.ts`, `validateNumRedCards.ts`).
-   `models`: Enthält die Logik für den Spielzustand (`gameState.ts`), einschließlich Funktionen zum Hinzufügen/Löschen von Spielen, Spielern, Zügen usw.
-   `routes`: Definiert Express-Routen für Spiele, Spieler und Spielzüge (`games.ts`, `players.ts`, `moves.ts`).
-   `utils`: Enthält Hilfsfunktionen wie Logger, Fehlerbehandlung (`handleErrors.ts`), und Firebase-Konfiguration (`firebase.ts`).
-   `validationError.ts`: Definiert eine benutzerdefinierte Fehlerklasse für Validierungsfehler.

Endpunkte
---------

-   Spiele (`/games`):

    -   `GET /`: Ruft alle Spiele ab.
    -   `GET /:gameId`: Ruft ein Spiel anhand der Game-ID ab.
    -   `POST /`: Fügt ein neues Spiel hinzu.
    -   `DELETE /:gameId`: Löscht ein Spiel anhand der Game-ID.
    -   `PATCH /:gameId`: Aktualisiert ein Spiel für den nächsten Zug.
-   Spieler (`/players`):

    -   `GET /:gameId/players`: Ruft alle Spieler eines Spiels ab.
    -   `POST /:gameId/players`: Fügt einen neuen Spieler hinzu.
-   Spielzüge (`/moves`):

    -   `POST /:gameId/players/:playerId/moves`: Fügt einen neuen Zug für einen Spieler in einem Spiel hinzu.

Fehlerbehandlung
----------------

Das System enthält eine zentrale Fehlerbehandlung in der Datei `utils/handleErrors.ts`, die spezifische Fehlerklassen wie `GameNotFoundError` und `PlayerNotFoundError` identifiziert und entsprechende HTTP-Statuscodes zurückgibt.

Bitte beachte, dass diese README als grundlegende Einführung dient und detailliertere Informationen in den entsprechenden Codekommentaren und Dateien gefunden werden können.
