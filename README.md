# zoomRoomRotator
Ajastettu breakout-huoneiden kiertely Zoom web clientissä

## Ohje

- Koodin voi ajaa suoraan selaimen konsolissa tai [Tampermonkey](https://www.tampermonkey.net/)-lisäosaa käyttäen.

- Toistaiseksi ohjaaminen tapahtuu suurimmaksi osaksi kirjoittamalla komentoja selaimen konsoliin:
```Javascript
// Käynnistä kiertely huoneissa 1-15
start(1, 15)

// Käynnistä kiertely huoneissa 1-15, mutta jätä joitan huoneita välistä
start(1, 15, [3, 6, 9])

// Asetusten muokkaaminen
roomInterval = 50     // Vaihdetaan huonetta 50 sekunnin välein
excludeRooms.push(10) // Lisätään Room 10 väliin jätettävien listalle (muutos tulee voimaan vasta seuraavalla kierroksella)
```
- Käynnistetyn kiertelyn voi pysäyttää väliaikaisesti näppäinyhdistelmällä `Alt + k`.
Saman näppäinyhdistelmän painaminen uudestaan jatkaa kiertelyä pysäytetystä kohdasta.
