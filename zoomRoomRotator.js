// ==UserScript==
// @name         ZoomRoomRotator
// @namespace    http://tampermonkey.net/
// @version      2026-03-25
// @description  Rotate breakoutrooms in Zoom webclient
// @author       tailkauh
// @match        https://app.zoom.us/*ref_from=launch&fromPWA=1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// ==/UserScript==
'use strict';
console.log("hello", document.URL);

// Viite pääikkunaan ja välitetään asioita pääikkunan konsolin kautta käytettäväksi
const W = document.defaultView;
W.firstRoom;
W.lastRoom;
W.roomInterval = 10;
W.pause = false;
W.intervalId;
W.excludeRooms = [];

W.start = start;
W.joinRoom = joinRoom;

// pausen käyttäminen painamalla Alt+k
document.getElementById("webclient").contentWindow.addEventListener("keyup", (keyEv)=> {
    if (keyEv.altKey && keyEv.key === "k") {
        W.pause = !W.pause;
    }
})


/**
 * Aloittaa huoneissa kiertämisen
 * @param {Number} firstRoom huone, josta aloitetaan
 * @param {Number} lastRoom last kierroksen viimeinen huone
 * @param {Array} exclude poisjätettävien huoneiden numerot
 */
function start(firstRoom, lastRoom, exclude = []) {
    // Alustetaan kiertämiseen liittyvät tiedot
    let counter = 0;
    let roomSequence = generateSequence(firstRoom, lastRoom, exclude);
    let currentRoom = roomSequence.shift();
    W.firstRoom = firstRoom;
    W.lastRoom = lastRoom;
    W.pause = false;
    W.excludeRooms = exclude;

    // sekunnin välein suoritettava funktio, joka tutkii onko aika vaihtaa huonetta
    const countdown = () => {
        if (W.pause) {
            W.console.log("timer: paused at " + (W.roomInterval-counter) + " s");
            return;
        }

        counter++;
        console.log("timer: " + (W.roomInterval - counter) + "s");
        if (counter >= W.roomInterval) {

            if (roomSequence.length === 0) {
                roomSequence = generateSequence(firstRoom, lastRoom, W.excludeRooms);
            }
            currentRoom = roomSequence.shift();
            joinRoom(currentRoom);
            counter = 0;
        }
    }

    // ajastetun kiertämisen aloitus
    clearInterval(W.intervalId);
    W.intervalId = setInterval(countdown, 1000);
    joinRoom(firstRoom);
}


/**
 * Liittyy Breakout-huoneeseen
 * @param {Number} roomNumber huoneen numero
 */
function joinRoom(roomNumber) {
    const timeout = 10;
    const wcDoc = W.document.getElementById("webclient").contentDocument;
    const clickSequence = [
        "#moreButton button",
        "a[aria-label=\"Breakout Rooms\"]",
        "div[aria-label^=\"Room "+ roomNumber + ":\"] button",
        "div.confirm-tip button"
    ]

    const clicker = () => {
        if (clickSequence.length == 0) return;
        const nextBtn = clickSequence.shift();
        wcDoc.querySelector(nextBtn).click();
        setTimeout(clicker, timeout);
    }

    clicker();
}


/**
 * Kokonaislukujen jono
 * @param {Number} a alku
 * @param {Number} b loppu
 * @param {Array} exclude poisjätettävät luvut
 * @returns lukujono taulukkona
 */
function generateSequence(a, b, exclude) {
    const sequence = [];
    for (let i = a; i <= b; i++) {
        if (exclude && exclude.includes(i)) continue;

        sequence.push(i);
    }
    return sequence;
}