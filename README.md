# Portfolio FENNO

De portfoliowebsite van FENNO, regisseur. Gebouwd met [Astro](https://astro.build), te bewerken via [Pages CMS](https://pagescms.org).

Je hoeft geen code te kunnen om de site bij te houden. Projecten en social video's voeg je toe via een formulier in de browser. Daarna bouwt de site zichzelf opnieuw en staat je nieuwe werk binnen een paar minuten online.

---

## Inhoud

1. [Eenmalig: de site online zetten](#eenmalig-de-site-online-zetten)
2. [Eenmalig: de CMS koppelen](#eenmalig-de-cms-koppelen)
3. [Zo voeg je een project toe](#zo-voeg-je-een-project-toe)
4. [Zo voeg je een social video toe](#zo-voeg-je-een-social-video-toe)
5. [Naam, e-mail en agent aanpassen](#naam-e-mail-en-agent-aanpassen)
6. [Als er iets misgaat](#als-er-iets-misgaat)
7. [Tips voor je media](#tips-voor-je-media)
8. [Voor wie wél in de code duikt](#voor-wie-wel-in-de-code-duikt)

---

## Eenmalig: de site online zetten

Dit doe je één keer. Daarna hoef je er nooit meer naar om te kijken.

1. Maak een gratis account op [github.com](https://github.com).
2. Maak een nieuwe repository (een "map" voor je site), bijvoorbeeld `portfolio`, en zet alle bestanden van dit project erin.
3. Maak een gratis account op [netlify.com](https://www.netlify.com) **of** [vercel.com](https://vercel.com) en log in met je GitHub-account.
4. Kies **"Add new site" → "Import an existing project"** (Netlify) of **"Add New… → Project"** (Vercel) en selecteer je repository.
5. De instellingen worden automatisch herkend. Klik op **Deploy**.
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Na een paar minuten staat je site online. Je kunt daarna een eigen domeinnaam koppelen in de instellingen van Netlify of Vercel.
7. Open het bestand `astro.config.mjs` (op GitHub: klik erop en daarna op het potloodje) en vervang `https://www.example.com` door je echte webadres. Dat is nodig voor de previews die verschijnen als iemand je site deelt op WhatsApp, LinkedIn en dergelijke.

## Eenmalig: de CMS koppelen

1. Ga naar [app.pagescms.org](https://app.pagescms.org).
2. Log in met je GitHub-account en geef Pages CMS toegang tot je repository.
3. Kies je repository. Links zie je nu **Projecten**, **Social video's**, **Over mij**, **Site-instellingen** en **Media**.

Dat is alles. Alles wat je in de CMS opslaat, komt in je repository terecht. Netlify of Vercel zet de nieuwe versie daarna vanzelf online. Dat duurt meestal 1 à 2 minuten.

---

## Zo voeg je een project toe

### Via de CMS (aanbevolen)

1. Ga naar [app.pagescms.org](https://app.pagescms.org) en open je site.
2. Klik links op **Projecten**.
3. Klik rechtsboven op **Add an entry** (of **Nieuw**).
4. Vul het formulier in:

   | Veld | Wat vul je in? | Voorbeeld |
   |---|---|---|
   | **Titel** | De naam van het project | `Zomer aan zee` |
   | **Slug** | Het stukje van het webadres. Alleen kleine letters, cijfers en streepjes. | `zomer-aan-zee` (wordt `/portfolio/zomer-aan-zee`) |
   | **Klant** | Voor wie je het maakte | `Merknaam` |
   | **Jaar** | Het jaar | `2025` |
   | **Rol** | Wat je deed | `regie` of `regie + script` |
   | **Type** | Kies uit de lijst | Commercial, Videoclip, Short film, Branded of Documentaire |
   | **Thumbnail** | Klik en upload een afbeelding (liefst 1600 × 900 pixels) | |
   | **Preview-loop** | Optioneel: een korte mp4 van een paar seconden zonder geluid. Die speelt af als iemand met de muis over het project gaat. | |
   | **Video-link** | De link naar je video op Vimeo of YouTube | `https://vimeo.com/123456789` |
   | **Credits** | Klik op **Add** voor elke regel: een rol en een naam | `Director of Photography` / `Naam` |
   | **Volgorde** | Een getal: hoe lager, hoe eerder het project in de lijst staat | `1` |
   | **Beschrijving** | Vrije tekst over het project | |

5. Klik op **Save**.
6. Wacht 1 à 2 minuten en ververs je website. Klaar!

> **Een project weghalen?** Open het in de CMS en klik op **Delete**.

### Handmatig (via de GitHub-website)

Gebruik dit als je de CMS niet wilt gebruiken.

1. **Upload je media.** Ga op GitHub naar de map `public/media/projects`. Klik op **Add file → Upload files** en sleep je thumbnail (bijv. `zomer-aan-zee.jpg`) en eventueel je preview-loop (bijv. `zomer-aan-zee-preview.mp4`) erin. Klik op **Commit changes**.
2. **Maak het projectbestand.** Ga naar de map `src/content/projects`. Klik op **Add file → Create new file**.
3. Noem het bestand `zomer-aan-zee.md`. Gebruik dezelfde naam als de slug, met `.md` erachter.
4. Plak deze tekst erin en pas alles aan wat tussen de aanhalingstekens staat:

   ```markdown
   ---
   title: "Zomer aan zee"
   slug: "zomer-aan-zee"
   client: "Merknaam"
   year: 2025
   role: "regie + script"
   type: "commercial"
   thumbnail: "/media/projects/zomer-aan-zee.jpg"
   previewVideo: "/media/projects/zomer-aan-zee-preview.mp4"
   videoEmbed: "https://vimeo.com/123456789"
   credits:
     - role: "Director of Photography"
       name: "Naam"
     - role: "Montage"
       name: "Naam"
   order: 1
   ---

   Hier schrijf je de beschrijving van het project. Zo lang of kort als je wilt.

   Een lege regel begint een nieuwe alinea.
   ```

5. Let op deze punten:
   - Bovenaan en onderaan het blok staan precies drie streepjes: `---`.
   - `type` moet exact één van deze zijn: `commercial`, `videoclip`, `short film`, `branded`, `documentaire`.
   - De paden naar je media beginnen met `/media/projects/` en daarna de bestandsnaam die je in stap 1 uploadde.
   - Heb je geen preview-loop? Haal dan de hele regel `previewVideo: ...` weg.
   - Geen credits? Schrijf dan `credits: []`.
6. Klik op **Commit changes**. Na 1 à 2 minuten staat het project online.

---

## Zo voeg je een social video toe

### Via de CMS (aanbevolen)

1. Ga naar [app.pagescms.org](https://app.pagescms.org) en open je site.
2. Klik links op **Social video's**.
3. Klik op **Add an entry**.
4. Vul het formulier in:
   - **Video**: upload je verticale video (9:16, mp4).
   - **Poster**: upload een stilstaand beeld van dezelfde video (9:16, jpg of webp). Dit zie je voordat de video laadt en in de grid-weergave.
   - **Caption**: het tekstje bij de video.
   - **Platform**: Instagram, TikTok of YouTube.
   - **Datum**: de datum van de originele post. Nieuwste video's staan bovenaan.
   - **Link naar de originele post**: de volledige link, beginnend met `https://`.
5. Klik op **Save** en wacht 1 à 2 minuten.

### Handmatig (via de GitHub-website)

1. Ga naar de map `public/media/social` en upload je video en poster via **Add file → Upload files**, bijvoorbeeld `achter-de-schermen.mp4` en `achter-de-schermen.jpg`.
2. Ga naar de map `src/content/social` en klik op **Add file → Create new file**.
3. Noem het bestand bijvoorbeeld `2025-06-01-achter-de-schermen.md`. De naam maakt niet uit, zolang hij eindigt op `.md`.
4. Plak dit erin en pas het aan:

   ```markdown
   ---
   videoSrc: "/media/social/achter-de-schermen.mp4"
   poster: "/media/social/achter-de-schermen.jpg"
   caption: "Achter de schermen bij de draaidag."
   platform: "instagram"
   date: 2025-06-01
   link: "https://www.instagram.com/p/xxxxxxx/"
   ---
   ```

   - `platform` is `instagram`, `tiktok` of `youtube`.
   - `date` schrijf je als jaar-maand-dag: `2025-06-01`.
5. Klik op **Commit changes**.

---

## Naam, e-mail en agent aanpassen

Ga in de CMS naar **Site-instellingen**. Daar pas je aan:

- je naam (zoals hij groot in beeld en in het logo staat)
- je functie, je e-mailadres en je socials
- je **agent**: vul de gegevens in en zet "Toon agent op contactpagina" aan

Handmatig staat dit allemaal in `src/data/site.json`.

De tekst op **Over mij** bewerk je in de CMS onder **Over mij**, in het veld **Tekst**. Zet daarin `[meer]` op de plek waar de tekst moet worden afgekapt: alles daarvoor staat altijd in beeld (met "..." erachter), de rest klapt open na de knop. Ook de tekst op de knop ("meer tonen" / "minder tonen") kun je daar aanpassen. Handmatig staat alles in `src/data/over-mij.md`. Elke lege regel begint een nieuwe alinea.

---

## Als er iets misgaat

Klopt er iets niet in een project of video, bijvoorbeeld een vergeten veld of een typfout in het type? Dan bouwt de site niet opnieuw en blijft de vorige versie gewoon online staan. Er gaat dus nooit iets kapot.

Zo vind je wat er mis is:

1. Open Netlify of Vercel en klik op de mislukte "deploy" (rood).
2. Scrol in het logboek naar de foutmelding. Die is in het Nederlands en noemt het bestand en het veld, bijvoorbeeld:

   ```
   projects → zomer-aan-zee data does not match collection schema.
     client: Het veld "client" ontbreekt. Voor wie was het? Bijv. "Heineken".
     type: "reclame" is geen geldig type. Kies uit: commercial, videoclip, short film, branded, documentaire.
   ```

3. Pas het genoemde veld aan in de CMS of op GitHub en sla opnieuw op.

---

## Tips voor je media

| Wat | Formaat | Tip |
|---|---|---|
| Thumbnail | 1600 × 900, jpg of webp | Liefst kleiner dan 300 KB |
| Preview-loop | mp4, ±640 px breed, 3–5 sec, **zonder geluid** | Liefst kleiner dan 1,5 MB |
| Social video | mp4 (H.264), 1080 × 1920 | Liefst kleiner dan 10 MB |
| Social poster | 1080 × 1920, jpg of webp | |

- Video's verklein je gratis met [HandBrake](https://handbrake.fr): kies de preset **"Web → Vimeo YouTube 720p30"** of **"Fast 1080p30"**.
- Afbeeldingen verklein je gratis met [Squoosh](https://squoosh.app).
- GitHub accepteert geen bestanden groter dan 100 MB. Grote video's horen op Vimeo of YouTube. Het project linkt daar dan naartoe via "Video-link".

---

## Voor wie wél in de code duikt

### Lokaal draaien

```bash
npm install
npm run dev        # ontwikkelserver op http://localhost:4321
npm run build      # bouwt de site in de map dist/
npm run preview    # bekijk de gebouwde site
npm run media      # (opnieuw) placeholder-media genereren; vereist ffmpeg
```

### Structuur

```
src/
  content/projects/     één .md-bestand per project
  content/social/       één .md-bestand per social video
  content.config.ts     Zod-schema's (met Nederlandse foutmeldingen)
  data/site.json        naam, e-mail, socials, agent
  easter-eggs/          één bestand per easter egg + registry.ts
  pages/                de pagina's
  scripts/              cursor, smooth scroll, scroll-animaties
  styles/global.css     kleuren (CSS custom properties), fonts, basis
public/
  media/                alle geüploade media
  fonts/                zelf gehoste fonts
.pages.yml              configuratie van Pages CMS
```

### Easter eggs aan- of uitzetten

Open `src/easter-eggs/registry.ts` en zet `aan` op `false` voor de egg die je niet wilt.

Een nieuwe toevoegen gaat zo:

1. Kopieer bijvoorbeeld `console.ts` naar `mijn-egg.ts`.
2. Pas de `id`, de `description` en de `init()`-functie aan.
3. Importeer het nieuwe bestand in `registry.ts` en zet het in de lijst.

Huidige eggs (niet verder vertellen):

- 5× snel klikken op de naam
- de Konami-code
- "cut" typen
- de browserconsole openen

### De handgemaakte look

Papierkorrel, rafelige randen, handgetekende lijnen en rasterpunten staan in `src/styles/handmade.css`. Bovenin dat bestand zitten een paar knoppen:

- `--grain-opacity`: hoe sterk de papierkorrel is (0 = uit)
- `--tilt`: hoe scheef de projectkaartjes liggen (0deg = recht)

### Foto's worden vanzelf geoptimaliseerd

Bij elke build worden foto's in `public/media` die groter zijn dan 120 KB automatisch verkleind (max. 1600 px breed) en gecomprimeerd. Je hoeft ze dus niet zelf klein te maken.

### Kleuren

Alle kleuren staan als CSS custom properties bovenin `src/styles/global.css`:

- `--cream: #f3eee3`: basis
- `--blue: #1b2e5a`: Delfts blauw
- `--blue-light: #2f4c8f`: hover

### Fonts en licenties

- **Gloria Hallelujah** van Kimberly Geswein: SIL Open Font License, gratis voor commercieel gebruik. De licentie staat in `public/fonts/GloriaHallelujah-LICENSE.txt`. Dit is nu het displayfont.
- **Fraunces** (soft-variant, staat klaar als reserve: zet `--font-display` in `src/styles/global.css` terug op `'Fraunces'`) van Undercase Type: SIL Open Font License, gratis voor commercieel gebruik. De licentie staat in `public/fonts/Fraunces-LICENSE.txt`. Hoe zacht de letters zijn, stel je in met `--display-soft` in `src/styles/global.css` (0 = scherp, 100 = zacht).
- **Switzer** van Indian Type Foundry / Fontshare: ITF Free Font License, gratis voor persoonlijk en commercieel gebruik.

### Placeholder-video's in projecten

De dummy-projecten linken naar open films van de Blender Foundation (Big Buck Bunny, Sintel, Tears of Steel en Spring), zodat de videospeler meteen te testen is. Vervang ze door je eigen links.
