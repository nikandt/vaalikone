# Vaalikone

Tämä on vaalikone, joka hyödyntää Manhattan-etäisyysalgoritmia arvioidakseen käyttäjien vastausten perusteella heidän yhteensopivuuttaan ehdokkaiden kanssa. Lisäksi ohjelma laskee vaalikonevastausten perusteella optimaalisen istumajärjestyksen tapahtumia varten.

Tämä [Next.js](https://nextjs.org) projekti on luotu käyttäen CRA:ta ([`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)).

## Työkalut

- **React ja Next.js**: Käyttöliittymä
- **Material-UI**: Käyttöliittymäkomponentit ja responsiivisuus
- **Firebase**: Käyttäjien tunnistautuminen ja tietojen tallennus

## Asennus

1. Kloonaa tämä repositorio:
   ```bash
   git clone https://github.com/nikandt/vaalikone.git
   ```

2. Asenna riippuvuudet:
   ```bash
   npm install
   ```

3. Luo `.env.local`-tiedosto projektin juureen ja lisää sinne Firebase-ympäristömuuttujat:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<API_KEY>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<AUTH_DOMAIN>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<PROJECT_ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<STORAGE_BUCKET>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<MESSAGING_SENDER_ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<APP_ID>
```

4. Käynnistä kehityspalvelin:

   ```bash
   npm run dev
   ```
