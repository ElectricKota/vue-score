<script lang="ts">
import LangService from './services/LangService'
import { MessageConstants } from './services/CZ/messages'
import { ref } from 'vue';

type Player = {
  name: string;
  score: number;
  rounds: number;
};
type Time = {
  hours: number;
  minutes: number;
  seconds: number;
}
export default {
  components: {

  },
  data() {
    return {
      translate: {} as MessageConstants,
      timerId: 0 as number | undefined,
      elapsedTime: { hours: 0, minutes: 0, seconds: 0 } as Time,
      players: new Array<Player>,
      settings: {
        rounds: 0 as number,
        mainRounds: 1 as number,
        playerCount: 2 as number,
        actualPoints: 0 as number,
        closedSettings: false as boolean,
        lang: 'cz' as string,
      }

    }
  },
  created() {
    this.loadData();

  },
  mounted() {
    this.loadConstants();
    if (this.settings.lang === 'cz') {
      document.querySelector('.lang-switch')?.classList.toggle('switched');
    }
    if (this.settings.closedSettings) {
      document.querySelector(`#nastaveni`)?.classList.add('hide');
      document.querySelector(`#nastaveni-toggler`)?.classList.add('down');
    }
    this.startTimer();
  },
  methods: {
    hidePlaceholderButton(event: Event) {
      // Access the button reference
      const target = event.target as HTMLElement;
      if (target) target.classList.toggle('hide');
      // Call your method with the item and event
      // You can also use buttonElement.value to access the actual DOM element
      // and perform operations like buttonElement.value.innerHTML = 'New Content';
      // console.log('Item:', item);
      setTimeout(() => {
        target.classList.toggle('hide');
      }, 1500)
    },
    startTimer(): void {
      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(() => {
        // Zvýšení uběhlého času
        this.elapsedTime.seconds++;

        // Přesunutí do minut
        if (this.elapsedTime.seconds === 60) {
          this.elapsedTime.seconds = 0;
          this.elapsedTime.minutes++;
        }

        // Přesunutí do hodin
        if (this.elapsedTime.minutes === 60) {
          this.elapsedTime.minutes = 0;
          this.elapsedTime.hours++;
        }

        // Rekurzivní spuštění timeru
        this.startTimer();
      }, 1000); // Aktualizace každou vteřinu
    },
    // Funkce pro pozastavení timeru
    pauseTimer(): void {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = undefined;
      }
    },
    getFormattedTime(time: Time): string {
      return `${time.hours.toString().padStart(2, "0")} : ${time.minutes.toString().padStart(2, "0")} : ${time.seconds.toString().padStart(2, "0")}`;
    },
    // Funkce pro resetování timeru
    resetTimer(): void {
      this.elapsedTime = { hours: 0, minutes: 0, seconds: 0 };
      this.pauseTimer();
    },

    toggleLang() {
      if (this.settings.lang === 'cz' || this.settings.lang === 'CZ') this.settings.lang = 'en';
      else this.settings.lang = 'cz';
      this.saveData(); //uloží se nová hosnota jazyka do settings

    },
    changeLanguage() {
      this.toggleLang();
      document.querySelector('.lang-switch')?.classList.toggle('switched');
      this.loadConstants();
    },
    loadConstants() {
      this.translate = LangService.getConstantsByLanguage(this.settings.lang);

    },
    resetgame() {
      this.resetTimer();
      this.settings.rounds = 0;
      this.settings.mainRounds = 1;
      this.settings.actualPoints = this.settings.playerCount;
      this.players.forEach(element => {
        element.score = 0;
        element.rounds = 0;
      });
      this.startTimer();
    },
    changeNuberOfPlayers(increase: boolean) {
      if (increase) {
        if (this.settings.playerCount < 8) this.settings.playerCount++;
      }
      else {
        if (this.settings.playerCount > 2) this.settings.playerCount--;
      }
      this.createEmptyPlayers();
    },
    newPlayer(name: string, score: number, rounds: number): void {
      const player: Player = {
        name: name,
        score: score,
        rounds: rounds,
      };
      this.players.push(player);
    },
    createEmptyPlayers() {
      this.resetgame();
      if (this.settings.playerCount > 8) {
        this.settings.playerCount = 8
      }
      if (this.settings.playerCount < 2) {
        this.settings.playerCount = 2
      }// ochrana aby nebyl počet hgráčů mimo rozsah 2 - 8

      const number = this.settings.playerCount;
      if (this.players.length > this.settings.playerCount) {
        this.players.length = this.settings.playerCount
      }
      else {

        for (let index = this.players.length; index < number; index++) {
          this.newPlayer(`Hráč č.${index + 1}`, 0, 0);
        }
      }
      this.settings.actualPoints = this.settings.playerCount;
      // console.log(this.players);
    },
    changeName(index: number) {
      // this.players[index].name = 'sdfsdf';
      // console.log(`Nové jméno pro hráče na indexu ${index}: ${this.players[index].name}`);
    },
    assignPoints(index: number) {
      // Metoda pro přiřazení bodů
      const setScore = this.settings.actualPoints;

      this.players[index].score += setScore;
      this.players[index].rounds++;
      // console.log(`Hráči ${this.players[index].name} bylo přiřazeno ${setScore} bodů.`);

      this.settings.actualPoints--;
      if (this.settings.actualPoints < 1) {
        this.settings.actualPoints = this.settings.playerCount;
      }
      this.newRound();
    },
    newRound() {
      let newRound = 0;
      this.players.forEach(element => {
        if (element.rounds === this.settings.mainRounds) newRound++;
      });
      // console.log('porovnávám ++ a mainRound a playerCount', newRound, this.settings.mainRounds, this.settings.playerCount);

      if (newRound === this.settings.playerCount) {
        this.settings.rounds = this.settings.playerCount;
        this.settings.mainRounds++;
        // console.log('Nové kolo!', this.settings.rounds, this.settings.mainRounds);
        this.saveData();
      }
      // console.log(this.players);
    },
    updateScore(): Array<Player> {
      const sorted: Array<Player> = this.players.slice();
      sorted.sort((a, b) => b.score - a.score);
      // console.log('původní pole:', this.players);
      // console.log('seřazené pole:', sorted);
      return sorted;
    },
    toggleHide(id: string) {
      this.settings.closedSettings = !this.settings.closedSettings;
      document.querySelector(`#${id}`)?.classList.toggle('hide');
      document.querySelector(`#${id}-toggler`)?.classList.toggle('down');
    },
    saveData() {
      localStorage.setItem('PLAYERS', JSON.stringify(this.players));
      localStorage.setItem('SETTINGS', JSON.stringify(this.settings));
      console.log('ukládám data');
    },
    loadData() {
      let playersLoaded = null;
      let settingsLoaded = null;
      const playersJSON = localStorage.getItem("PLAYERS");
      const settingsJSON = localStorage.getItem("SETTINGS");
      if (playersJSON === null || settingsJSON === null) {
        console.log('Data nenačtena');

      }
      else {
        try {
          playersLoaded = JSON.parse(playersJSON);
        } catch (err: any) {
          playersLoaded = null;
          console.error('chyba při parsování JSONU players');
        }
        try {
          settingsLoaded = JSON.parse(settingsJSON);
        } catch (err: any) {
          settingsLoaded = null;
          console.error('chyba při parsování JSONU settings');
        }
      }
      if (settingsLoaded === null || playersLoaded === null) {
        console.log('Vytvářím empty players');
        this.createEmptyPlayers()
        return;
      }
      console.log('Data načtena, kopíruji data z úložiště');
      this.players = playersLoaded;
      this.settings = settingsLoaded;
      console.log('loaded Players', playersLoaded);
      console.log('loaded Settings', settingsLoaded);

    }

  }
}
</script>

<template>
  <div class="main">

    <header class="header">
      <div class="lang-switch switched" @click="changeLanguage">
        <div class="lang-switch__toggler"> </div>
        <span class="lang-switch__lang">
          CZ
        </span>

        <span class="lang-switch__lang">EN
        </span>
      </div>

      <div class="header__inner">
        <h1>Score</h1>
        <p>by <a href="www.michalkotek.tech">MichalKotek.tech</a></p>
        <p class="time-stamp">{{ getFormattedTime(elapsedTime) }}</p>

      </div>
    </header>
    <main class="container">
      <section class="sidebar ">
        <h1>{{ translate.HEADING_ORDER }}</h1>
        <!-- <button @click="updateScore()">Update</button> -->
        <main class="score-list">
          <div class="score-list__line">
            <th class="score-list__head">{{ translate.TABLE_ORDER }}</th>
            <th class="score-list__head">{{ translate.TABLE_NAME }}</th>
            <th class="score-list__head">{{ translate.TABLE_SCORE }}</th>
          </div>
          <template v-for="(score, index) in updateScore()" :key="index">
            <div class="score-list__line score-list__line--winners">
              <td class="score-list__item">{{ index + 1 }}.</td>
              <td class="score-list__item--name">{{ score.name }}</td>
              <td class="score-list__item--score">{{ score.score }}</td>
            </div>
          </template>
        </main>
      </section>


      <section class="sidebar">
        <h1>{{ translate.HEADING_POINTS }}</h1>
        <p>{{ translate.POINTS_ROUND }} <strong style="font-size:17px">{{ translate.POINTS_ROUND_NO }} {{ settings.mainRounds }}</strong></p>
        <p><strong style="font-size:19px">{{ settings.actualPoints }}</strong> {{ translate.POINTS_ASSIGN_POINTS }}</p>
        <section class="players">
          <template v-for="(player, index) in players" :key="index">
            <div class="players__item players__item--points points" v-if="players[index].rounds !== settings.mainRounds">
              <span class="points__name">{{ player.name }}</span>
              <span class="points__fake" @click="hidePlaceholderButton($event)">+{{ settings.actualPoints }}</span>

              <div class=" points__send" @click="assignPoints(index)">{{ translate.POINTS_ASSIGN_CONFIRM }}</div>
            </div>
          </template>
        </section>
      </section>

      <section class="sidebar">
        <div class="sidebar__header">
          <h1>{{ translate.HEADING_SETTINGS }}</h1>
          <span class="toggler" id="nastaveni-toggler" @click="toggleHide('nastaveni')" title="Zavřít nastavení"></span>
        </div>
        <div class="hide-section" id="nastaveni">
          <div class="hide-section__inner">
            <div class="sidebar__inner">
              <span class="button" @click="resetgame()">{{ translate.SETTINGS_RESET }}</span>
            </div>
            <div class="sidebar__inner">

              <h2>{{ translate.HEADING_SETTINGS_PLAYERS }}</h2>
              <label>{{ translate.SETTINGS_PLAYER_NO }}: <span class="spinner"><span @click="changeNuberOfPlayers(false)" class="spinner__item spinner__item--minus">-</span><input type="number" min="2" max="8" pattern="\d*" @change="createEmptyPlayers()" v-model="settings.playerCount"><span @click="changeNuberOfPlayers(true)" class="spinner__item spinner__item--plus">+</span></span></label>
              <section class="players">
                <div v-for="(player, index) in players" :key="index" class="players__item">
                  <label :for="'playerInput_' + index">{{ translate.PLAYER_NO }}{{ index + 1 }} | {{ translate.SETTINGS_POINTS }}: {{ player.score }} | {{ translate.SETTINGS_ROUNDS }}: {{ player.rounds }}</label>
                  <input :id="'playerInput_' + index" type="text" v-model="player.name" @input="changeName(index)" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

    </main>

  </div>
</template>