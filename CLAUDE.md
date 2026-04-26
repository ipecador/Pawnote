# Pawnote — instructions Claude

## Contexte upstream

Ce répertoire est un fork de Pawnote (`LiterateInk/Pawnote.js`).
L'upstream a depuis migré vers Radicle
(`rad:z252zKnhJrntJAd6Spt6CYdqRxAXr`, seed `seed.vexcited.com`) et
réécrit une v2 dans `src-new`. Notre fork **ne suit ni Radicle ni
v2** : il reste sur le dernier état GitHub upstream (commit
`00dd285`, sur la base de v1.6.2).

Quand on parle de "l'upstream" dans ce package, la référence est
l'état GitHub à `00dd285`.

## Règles de modification

- **Respecter les conventions des auteurs upstream** — style, nommage,
  structure. Ne pas imposer d'autres préférences sur le fork.
- **Éviter de modifier les fichiers upstream existants** — préférer
  ajouter un nouveau fichier dédié au fork.
- **Demander confirmation avant toute modification d'un fichier
  upstream**, en expliquant pourquoi le contournement via un
  nouveau fichier ne convient pas.

## Layout

```
src/
├── api/            Endpoints publics — un fichier = un endpoint.
│   ├── helpers/    Utilitaires exposés (login, session-handle…).
│   └── private/    Helpers internes, jamais ré-exportés.
├── core/           Moteur requête/réponse (RequestFN). Touché rarement.
├── decoders/       Réponse PRONOTE brute → modèle typé. Un par modèle.
├── encoders/       Construction de payloads sortants. Un par forme.
├── models/         Types et enums TS. Un concept par fichier.
│   └── errors/     Classes d'erreur custom.
└── index.ts        Surface publique. Ne ré-exporte que api + models.
```

`decoders/`, `encoders/` et `core/` sont **internes** : ne jamais
les ré-exporter depuis `src/index.ts`.

## Un concept par fichier

Règle stricte sur les **exports** :

- Un fichier `models/` déclare **un** type ou enum.
- Un fichier `decoders/` exporte **une** fonction `decodeXxx`.
- Un fichier `encoders/` exporte **une** fonction `encodeXxx`.
- Un fichier `api/` exporte **une** fonction d'endpoint.

Un helper privé non exporté dans le même fichier est OK.

## Nommage

| Cible                       | Convention             | Exemple              |
| --------------------------- | ---------------------- | -------------------- |
| Fichier / dossier           | `kebab-case`           | `gradebook-pdf.ts`   |
| Fonction, variable, param   | `camelCase`            | `decodeGradeBook`    |
| Type, classe, enum          | `PascalCase`           | `GradeBookSubject`   |
| Membre d'enum               | `SCREAMING_SNAKE_CASE` | `AccountKind.STUDENT`|

- Fichier d'endpoint nommé d'après l'endpoint, fonction homonyme :
  `src/api/gradebook.ts` → `export const gradebook = …`.
- Fichier de modèle nommé d'après le type : `src/models/grade.ts` →
  `export type Grade = …`.
- Décodeur = `decode<ModelName>`, encodeur = `encode<Thing>`.

## Style de code

Géré par ESLint (`@stylistic/eslint-plugin`, `eslint.config.js`
fait foi). Points clés :

- Indent 2 espaces, double quotes, semicolons, newline en fin de fichier.
- Pas de trailing space, pas de trailing comma.
- Brace style stroustrup (`else`/`catch` sur une nouvelle ligne).
- `(x) => …` toujours avec parens autour des paramètres.

Conventions visibles dans le code :

- `type` plutôt que `interface` pour les shapes d'objets.
- `Readonly<{ … }>` pour les modèles immuables (réponses).
- `import type { … }` pour les imports type-only.
- Alias `~/` pour les imports cross-directory
  (`import … from "~/models"`). Imports relatifs (`./subject`) pour
  les voisins du même dossier.

## Pattern : ajouter un endpoint

Reproduire la structure des endpoints existants
(cf. `src/api/gradebook.ts`, `src/api/account.ts`) :

1. Modèle(s) dans `src/models/<name>.ts` + ré-export depuis
   `src/models/index.ts`.
2. Si payload non trivial : encoder dans `src/encoders/<name>.ts`.
3. Décodeur dans `src/decoders/<name>.ts` : `(rawData) => Model`.
4. Endpoint dans `src/api/<name>.ts` :
   - premier argument `session: SessionHandle`,
   - `apiProperties(session)` pour les clés versionnées,
   - `new RequestFN(session, "<PageName>", { … })`,
   - `await request.send()` puis décodeur sur
     `response.data[properties.data]`.
5. Ré-export depuis `src/api/index.ts`.
6. Exemple runnable dans `examples/<name>.ts` si utile.

## Documentation

JSDoc concis sur les fonctions publiques et types exportés
(une phrase suffit). Le repo publie une référence TypeDoc — c'est
de la doc utilisateur.

## Tests

Bun test runner. Fichiers `*.test.ts` co-localisés à côté du
fichier testé :

```ts
import { it, expect, describe } from "bun:test";
```

Run : `bun test`.

## Examples

Scripts runnables dans `examples/`, pattern IIFE :

```ts
void async function main () { … }();
```

Credentials via `examples/_credentials.ts` (depuis `examples/.env`).

## Commits (côté pawnote)

Conventional Commits : `<type>(<scope>): <résumé>`. Types utilisés :
`feat`, `fix`, `chore`, `docs`, `refactor`. Scope optionnel et libre.
Résumé en anglais, lowercase, impératif, < 70 caractères.

## Checks pré-PR

Mêmes commandes que la CI upstream
(`.github/workflows/checks.yml`) :

```bash
bun install --frozen-lockfile
bun eslint
bun test
bun tsc
```
