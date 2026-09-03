# TRB — Audit editoriale italiano e preparazione Notion

Data: 3 settembre 2026. Branch: `develop`. Stato: **da rivedere con Francesco/Manu**, non pubblicato in Notion, nessun commit/push.

## Ambito e risultato

- Esaminate tutte le **216 stringhe** di `messages/it.json`, inclusi titoli, frammenti di titolo, corpi, CTA, etichette, alt, metadati e messaggi funzionali.
- Accorciati **9 titoli**. Modificate **15 stringhe JSON** contando anche i frammenti dei titoli e la rimozione di uno spazio finale ridondante.
- Nessun font, CSS, breakpoint, componente, immagine o comportamento modificato. Nessun nuovo `br`, `nowrap`, `line-clamp`, troncamento o ellissi.
- I titoli `title` e i relativi `titleLineOne`/`titleLineTwo` rimangono coerenti. Riutilizzata esclusivamente la composizione a righe già prevista dai componenti.
- Le altre **201 stringhe** restano identiche. I testi incompleti o fattualmente incerti hanno note di revisione nel CSV, non informazioni inventate.
- Tutte le 216 chiavi esistono anche nei JSON EN/DE/FR. Nessuna traduzione riscritta o propagata.

| Namespace | Stringhe |
|---|---:|
| Metadata | 10 |
| Navigation | 10 |
| Home | 44 |
| House | 46 |
| Guide | 35 |
| Contact | 50 |
| Availability | 12 |
| Common | 7 |
| Accessibility | 2 |

## Architettura editoriale verificata

La fonte di questo pass è il JSON italiano del repository, non una nuova traduzione degli altri locali. I namespace sono consumati tramite `next-intl`; le chiavi puntate sono l’identificatore stabile per sincronizzare i contenuti.

- `src/components/layout/page-intro.tsx`: intro House/Guide/Contact, Questrial `editorial-statement`, griglia desktop 1.65fr/1fr e righe localizzate esistenti.
- `src/components/ui/section-heading.tsx` e `src/app/globals.css`: ruoli `hero-display`, `section-display`, `editorial-statement`, misure controllate e `text-wrap: balance` già presenti.
- `src/components/sections/cinematic-hero/scenes/`: titoli cinematici, compresa la doppia battuta della spiaggia; testo cambiato senza intervenire sul movimento.
- `src/components/sections/homepage-discovery.tsx`: preview, Hospitality, CTA finale e riuso dei titoli Guide nelle card della homepage.
- `src/components/sections/house-chapter.tsx`: titoli da 36/48px nelle colonne delle card; la colonna a 1024px è più vincolante delle larghezze desktop maggiori.
- `src/app/[locale]/guide/page.tsx` e `src/features/local-guide/guide-card.tsx`: uno stesso titolo ha tre usi (card Home, card Guide, modal Guide). Il modal usa fino a 80px in una colonna relativamente stretta: non basta verificare la card.
- `src/app/[locale]/contact/page.tsx`: intro, accoglienza, richiesta, contatti e mappa. Form, calendario e relativi messaggi di sicurezza conservati.
- `src/app/[locale]/not-found.tsx`, header e footer: testi di servizio verificati; logo e copyright non sono titoli editoriali da riscrivere.

I metadati SEO non hanno una misura visiva di due righe. Alt e messaggi di validazione sono stati revisionati per significato, non abbreviati per adattarli a una regola tipografica che non li riguarda. Le etichette temporanee dei placeholder delle gallerie non sono contenuti editoriali da tradurre in questo pass.

## Titoli modificati

Le righe indicate sotto sono il massimo osservato sui viewport tablet/desktop testati (834–2560px), non una stima dal numero di caratteri.

| Chiave | Prima | Proposta applicata | Prima → dopo | Motivazione |
|---|---|---|---|---|
| Home.CinematicHero.scenes.privateBeach.lineOne | Fino alla spiaggia. | La tua spiaggia. | 3 → 2, composizione con «A piedi nudi.» | Prima battuta compatta; spiaggia privata già confermata nel contesto. |
| Home.GuidePreview.title | Tre modi per scoprire il lato più tranquillo del lago | Tre modi per vivere il lago | 3 → 2 | Elimina una perifrasi senza perdere i tre ambiti della guida. |
| House.chapters.living.title | Spazi da vivere | Spazi comuni | 3 → 2 | Riprende il significato del corpo esistente; evita la torre di parole a 1024px. |
| Guide.entries.lakeside-table.title | Un tavolo vicino all'acqua | A tavola sul lago | 3 → 2 nel modal | Più naturale e compatto; nessun nome di ristorante inventato. |
| Guide.entries.open-water.title | Trova tempo per il lago | Tempo per il lago | 3 → 2 nel modal | Taglio dell’imperativo non necessario. |
| Guide.entries.ranco-outlook.title | Inizia vicino a Ranco | Intorno a Ranco | 3 → 2 nel modal | Sintesi naturale dell’esplorazione dei dintorni. |
| Guide.cta.title | Raccontaci come ami trascorrere una giornata | Come immagini la tua giornata? | 4 → 2 | Mantiene l’invito a raccontare preferenze e ritmo. |
| Contact.hospitality.title | Il mio aiuto fa parte dell'accoglienza | Un'accoglienza personale | 3 → 2 | Preserva l’accoglienza personale; l’aiuto pratico rimane nel corpo. |
| Contact.enquiry.title | Inizia dai dettagli che contano | I dettagli che contano | 3 → 2 | Elimina l’avvio generico, conserva l’intento. |

Inoltre, `Guide.hero.titleLineOne` perde soltanto lo spazio finale; il componente aggiunge già lo spazio necessario quando le righe sono inline.

## Verifica tipografica nel browser

Misurazione sul build di produzione locale in Chromium, font caricati, tramite `Range.getBoundingClientRect()` sui caratteri e raggruppamento delle coordinate verticali. I titoli cinematici sono stati misurati nella loro geometria DOM anche quando la scena è nascosta dall’opacità; non è stato riscritto o ritestato il controller cinematico.

Viewport: 390×844, 834×1194, 1024×768, 1366×768, 1440×900, 1680×1050, 1920×1080, 2560×1440. Confronto prima/dopo: **zero variazioni del font-size calcolato**. I box con dimensionamento intrinseco possono naturalmente occupare meno larghezza dopo una frase più breve; nessuna regola di layout è stata cambiata.

### Righe effettive dopo la revisione

Il simbolo `/` nei due titoli composti sotto indica le battute/righe già presenti, non una barra aggiunta al testo del sito.

| Pagina / titolo | 390 | 834 | 1024 | 1366 | 1440 | 1680 | 1920 | 2560 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Home — Una casa sul lato tranquillo del lago | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Home — Interni | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Home — Verso il lago | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Home — La tua spiaggia. / A piedi nudi. | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Home — The Ranco Bay | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Home — Vivere il lago, da casa | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Home — Tre modi per vivere il lago | 2 | 1 | 1 | 1 | 1 | 2 | 2 | 2 |
| Home — A tavola sul lago | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Home — Tempo per il lago | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Home — Intorno a Ranco | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Home — Il lago, come lo viviamo noi | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Home — Inizia con una semplice conversazione | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| House — Una casa tra luce, / acqua e quiete | 4 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| House — Un luogo da vivere, non solo da visitare | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| House — Veranda e arrivo | 1 | 1 | 2 | 2 | 2 | 2 | 1 | 2 |
| House — Spazi comuni | 1 | 1 | 2 | 1 | 2 | 1 | 1 | 1 |
| House — Camera da letto | 1 | 1 | 2 | 2 | 2 | 2 | 1 | 2 |
| House — Dettagli | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| House — All'aperto | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| House — Spiaggia privata | 1 | 1 | 2 | 2 | 2 | 2 | 1 | 2 |
| House — Gli elementi essenziali del soggiorno | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| House — Cosa è utile sapere | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — Modi utili per vivere il Lago Maggiore | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| Guide — Mangiare | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — A tavola sul lago (card) | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — Sull'acqua | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — Tempo per il lago (card) | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — Esplorare | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — Intorno a Ranco (card) | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide — Come immagini la tua giornata? | 3 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Contact — Pianifica il tuo soggiorno | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Contact — Un'accoglienza personale | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Contact — I dettagli che contano | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Contact — Disponibilità | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Contact — The Ranco Bay a Ranco | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Contact — Posizione e mappa | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Contact — Arrivo | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| Guide modal — A tavola sul lago | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Guide modal — Tempo per il lago | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Guide modal — Intorno a Ranco | 2 | 1 | 2 | 2 | 2 | 2 | 2 | 2 |
| Not found — Pagina non trovata | 2 | 1 | — | — | 1 | — | — | 1 |

I tre modal sono stati aperti e misurati singolarmente dopo il build finale, non soltanto simulati nelle card. Il trattino nella riga Not found indica un viewport non misurato per quella pagina di servizio.

Nessun titolo delle quattro pagine supera due righe nei viewport tablet/desktop testati; nessun carattere dei titoli misurati esce orizzontalmente dal proprio box. A 390px sono ammesse le otto eccezioni da tre/quattro righe visibili nella tabella: non si è ridotto il carattere per forzare il mobile. Misure riferite a font effettivamente caricati, zoom 100%; non sono una garanzia per ogni font di fallback o ingrandimento assistivo.

## CSV e workflow Notion

File: `docs/content/trb-italian-review.csv`, UTF-8, quoting CSV per virgole/virgolette/ritorni a capo, una riga logica per chiave. Le note multilinea fanno sì che il conteggio delle righe fisiche del file sia maggiore di 217; non sono duplicati.

Nessuno schema CSV era presente nel repository. È stato consultato in sola lettura il database esistente [🏡 TRB CONTENT](https://app.notion.com/p/f6062753924140968efed618402da015), con 189 righe. Riutilizzato il suo schema, senza aggiungere colonne incompatibili:

`Name, Key, Section, Italian, English, German, French, Notes, Status, Ready to sync`

- `Key`: percorso JSON esatto, da non rinominare.
- `Name` e `Section`: valori Notion preservati per righe esistenti. Le nuove chiavi `Availability.*` usano la sezione **Contact**, già prevista dallo schema.
- `Italian`: proposta di questo pass, corrispondente al JSON locale modificato.
- `Notes`: italiano originale del repository prima del pass, pagina, sezione, tipo, ragione editoriale, verifiche di righe dove pertinenti, eventuale testo divergente in Notion e URL della riga esistente.
- `English`, `German`, `French`: valori del database preservati; celle vuote rimangono vuote. Non sono stati riempiti dai JSON del sito e non significano che il sito sia privo di traduzioni.
- `Status`: **Needs review**, opzione già esistente. `Ready to sync`: **false**, da mappare come checkbox non selezionata.
- Le righe di titolo completo e frammenti non sono duplicazioni accidentali: sono chiavi reali distinte. Approvare e sincronizzare insieme ogni gruppo `title`/`titleLineOne`/`titleLineTwo`.

### Allineamento con il database

- **187 chiavi comuni**, **29 nuove chiavi** del sito assenti dal database: 17 per campi/stati/validazione del form e 12 per Availability.
- **2 chiavi obsolete** presenti solo in Notion: `Contact.enquiry.fields.dates`, `Contact.enquiry.formStatus`. Escluse dal CSV corrente; non cancellate in Notion. Non ripristinare il messaggio che dichiara inattivo il form.
- **14 differenze preesistenti** nel testo italiano: Home spiaggia/Hospitality/HousePreview; Guide hero split; Contact hero, hospitality, enquiry split/body. Ogni conflitto è marcato in `Notes`. Il sottotitolo vuoto della scena Interni equivale alla cella Notion vuota, non è un conflitto.

**Non usare “Merge with CSV” alla cieca sul database live:** l’importazione CSV di Notion aggiunge righe, non aggiorna quelle esistenti per chiave ([documentazione Notion](https://www.notion.com/help/import-data-into-notion)). Importare prima in un database di revisione, oppure usare il workflow di sincronizzazione con confronto esatto su `Key`. Non è stato trovato un importatore Notion nel repository e non ne è stato inventato uno.

Procedura suggerita: fare un export/backup del database; rivedere le proposte e i 14 conflitti con Manu; aggiornare le 187 righe corrispondenti per `Key` e creare solo le 29 mancanti; decidere separatamente il destino delle due chiavi obsolete; approvare i gruppi di righe; soltanto dopo propagare EN/DE/FR e attivare il consueto sync. Nessuna scrittura sul database effettuata in questo pass.

## Decisioni da rivedere con Francesco / Manu

1. **Voce dell’host:** alternanza tra «noi», «ti risponderemo», «il tuo host» e «proprietaria». Scegliere una voce editoriale coerente prima della revisione completa dei corpi; non cambiare il significato della conferma finale della disponibilità.
2. **Fotografie provvisorie e biografia:** House introduction e Contact hospitality contengono avvertenze di lavorazione. Verificare i fatti prima di rimuoverle o sostituirle con promesse.
3. **Guide ancora provvisoria:** le tre descrizioni sono ingressi editoriali, non raccomandazioni reali. Servono nomi e informazioni approvati; non inventati ristoranti/itinerari.
4. **Dotazioni/capienza/regole/parcheggio:** confermare le informazioni mancanti in House amenities/practical. Non far sembrare definitive le condizioni del soggiorno.
5. **Accesso alla spiaggia:** «collega direttamente» nel capitolo All’aperto può essere frainteso; il resto del sito precisa che occorre attraversare la strada. Nota nel CSV, fatto non riscritto arbitrariamente.
6. **Copy tecnico della mappa:** proposta solo nelle note: «Consulta la mappa per orientarti a Ranco e organizzare il tuo arrivo». Nessun intervento a mappa/API o testo pubblicato in questo pass.
7. **Contatti pubblici:** ancora da confermare, mentre il form è operativo. Non inventare email/telefono da pubblicare.
8. **Corpi troppo metatestuali:** suggerimenti puntuali nelle note per veranda, camera, dettagli e intro Guide. Testi correnti mantenuti per revisione, non riscritti per semplice variazione.
9. **CTA Home:** «Scopri la casa» e «Apri la guida locale» sono attualmente collegate a `/contact` nel componente. Possibile incoerenza tra etichetta e destinazione; segnalata, non corretta perché fuori ambito navigazione.
10. **Alt legacy:** `Home.Hero.slides.*` e `Contact.location.imageAlt` richiedono controllo d’uso prima di eventuale rimozione. Nessuna cancellazione di chiavi in questo pass.

## Verifiche e confini

- `pnpm lint`: riuscito, zero errori; due warning già presenti in `site-footer.tsx` (`Link`, `navigation` inutilizzati).
- `pnpm build`: riuscito, inclusa verifica TypeScript e compilazione delle route locali.
- CSV: 216 chiavi uniche; schema a 10 colonne; rilettura del CSV con confronto esatto dei valori (accenti, virgolette e note multilinea inclusi); chiavi allineate ai quattro JSON; gruppi di titolo verificati.
- Nessun file EN/DE/FR cambiato; nessun file di CSS, layout, API, email, disponibilità o iCal modificato da questo pass.
- Le modifiche all’integrazione disponibilità già presenti nel working tree all’inizio sono state lasciate intatte. Nessun commit o push.

Skill utilizzate: ricerca documentale Notion (sola lettura, per riusare lo schema reale), Spreadsheets (creazione e verifica CSV), agent-browser / verifica browser (conteggio delle righe renderizzate).
