
# Schweizer Volksabstimmungen

In dieser Übung geht es darum eine Karte der Schweiz zu erstellen, die Volksabstimmungsresultate zeigt.

https://abstimmungen.tagesanzeiger.ch/2019-05-19/1-steuerreform-und-ahv-finanzierung
http://www.geo.uzh.ch/microsite/giva/projects2013/group6/

Die Basiskarte (Kantone) ist bereits vorgegeben. Bei der Volksabstimmung handelt es sich um das "Bundesgesetz über Radio und Fernsehen". Es wurde mit 50.8% angenommen. Du kannst eine andere Abstimmung wählen.

https://www.atlas.bfs.admin.ch/maps/12/de/12344_12343_5401_259/20368.html

## Aufgabe

1. Erstelle eine Karte in einem passenden Format (z.B. 1:1 — 800x800, 4:3 — 800x600), die auf die Schweiz fokussiert ist (siehe Hinweis 1).

2. Färbe die Kantone nach Abstimmungsresultaten ein (siehe Hinweis 2).

3. Erstelle eine Legende für die Farben in der Karte.

4. Gib der Karte einen Titel. Überleg dir ob die Karte etwas besonderes zeigt. Gibt es Tendenzen? Gibt es hier eine Story?

5. Füge Anmerkungen, disclaimer, und Datenquellen hinzu, wo nötig.

6. Mache deine Karte interaktiv mit einem Tooltip.

7. Exportiere die Karte aus dem Browser und bereite eine Version für Twitter (Karte mit Titel, Visualisierung, Legende, Anmerkungen als jpeg).

## Hinweise

#### 1. Kartenprojektion

Da wir hier d3 und d3 Projektionen verwenden, werden wir eine spezielle Version der Albers projektion verwenden. Die Albers Kartenprojektion ist flächetreu, also geeignet für eine Choroplethenkarte.

```js
const projection = d3.geoAlbers()
  .center([0, 46.7])
  .rotate([-9, 0, 0])
  .parallels([40, 50])
  .scale(12500)
```

#### 2. Colorscales

Um die Abstimmungsresultate auf der Karte zu zeigen kannst du eine Threshold-Skala benutzen. Sie unterteilt die Daten in Segmente. Die Skala hier ist ähnlich wie die aus dem [Tagesanzeiger Beispiel](https://abstimmungen.tagesanzeiger.ch/2019-05-19/1-steuerreform-und-ahv-finanzierung).

```js
const colorScale = d3.scaleThreshold()
  .domain([30,35,40,45,50,55,60,65,70,100])
  .range(["#d0001b", "#e0513c", "#ee7e5f", "#f7a684", "#fdceaa", "#d0e0af", "#a6c185", "#7da35b", "#538633", "#256900"])

```
