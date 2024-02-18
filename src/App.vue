<script lang="ts">

type Player = {
  name: string;
  score: number;
  rounds: number;
};
export default {
  components: {

  },
  data() {
    return {
      players: new Array<Player>,
      settings: {
        rounds: 0 as number,
        mainRounds: 1 as number,
        playerCount: 2 as number,
        actualPoints: 0 as number,
        closedSettings: false as boolean
      }

    }
  },
  created() {
    this.loadData();

  },
  mounted() {
    if (this.settings.closedSettings) {
      console.log('kurva!', this.settings.closedSettings);
      let sdf = document.querySelector(`#nastaveni`)?.classList.add('hide');
      document.querySelector(`#nastaveni-toggler`)?.classList.add('down');
    }
  },
  methods: {
    resetgame() {
      this.settings.rounds = 0;
      this.settings.mainRounds = 1;
      this.settings.actualPoints = this.settings.playerCount;
      this.players.forEach(element => {
        element.score = 0;
        element.rounds = 0;
      });
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
      console.log(this.players);
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
      console.log(`Hráči ${this.players[index].name} bylo přiřazeno ${setScore} bodů.`);

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
      console.log('porovnávám ++ a mainRound a playerCount', newRound, this.settings.mainRounds, this.settings.playerCount);

      if (newRound === this.settings.playerCount) {
        this.settings.rounds = this.settings.playerCount;
        this.settings.mainRounds++;
        console.log('Nové kolo!', this.settings.rounds, this.settings.mainRounds);
        this.saveData();
      }
      console.log(this.players);
    },
    updateScore(): Array<Player> {
      const sorted: Array<Player> = this.players.slice();
      sorted.sort((a, b) => b.score - a.score);
      console.log('původní pole:', this.players);
      console.log('seřazené pole:', sorted);
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
      <div class="header__inner">
        <h1>Score</h1>
        <p>by <a href="www.michalkotek.tech">MichalKotek.tech</a></p>
        <!-- <div class="lang-switch">
          <div class="lang-switch__toggler"> </div>
          <span class="lang-switch__lang">
            CZ
          </span>

          <span class="lang-switch__lang">EN
          </span>
        </div> -->

      </div>
    </header>
    <main class="container">
      <section class="sidebar ">
        <h1>Průběžné pořadí hry</h1>
        <!-- <button @click="updateScore()">Update</button> -->
        <main class="score-list">
          <div class="score-list__line">
            <th class="score-list__head">#</th>
            <th class="score-list__head">Jméno</th>
            <th class="score-list__head">Score</th>
          </div>
          <template v-for="(score, index) in updateScore()" :key="index">
            <div class="score-list__line">
              <th class="score-list__item">{{ index + 1 }}.</th>
              <th class="score-list__item--name">{{ score.name }}</th>
              <th class="score-list__item--score">{{ score.score }}</th>
            </div>
          </template>
        </main>
      </section>
      <section class="sidebar">
        <div class="sidebar__header">
          <h1>Nastavení</h1>
          <span class="toggler" id="nastaveni-toggler" @click="toggleHide('nastaveni')" title="Zavřít nastavení"></span>
        </div>
        <div class="hide-section" id="nastaveni">
          <div class="hide-section__inner">
            <div class="sidebar__inner">
              <button @click="resetgame()">Reset</button>
            </div>
            <div class="sidebar__inner">

              <h2>Hráči</h2>
              <label>Počet hráčů: <span class="spinner"><span @click="changeNuberOfPlayers(false)" class="spinner__item spinner__item--minus">-</span><input type="number" min="2" max="8" pattern="\d*" @change="createEmptyPlayers()" v-model="settings.playerCount"><span @click="changeNuberOfPlayers(true)" class="spinner__item spinner__item--plus">+</span></span></label>
              <section class="players">
                <div v-for="(player, index) in players" :key="index" class="players__item">
                  <label :for="'playerInput_' + index">Hráč č.{{ index + 1 }} | Bodů: {{ player.score }} | Kol: {{ player.rounds }}</label>
                  <input :id="'playerInput_' + index" type="text" v-model="player.name" @input="changeName(index)" />
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <section class="sidebar">
        <h1>Příkazy</h1>
        <p>Hrajeme kolo <strong>č. {{ settings.mainRounds }}</strong></p>
        <p><strong>{{ settings.actualPoints }}</strong> body udělíme hráči</p>
        <section class="players">
          <template v-for="(player, index) in players" :key="index">
            <div class="players__item players__item--points" v-if="players[index].rounds !== settings.mainRounds">
              <label>{{ player.name }}</label>
              <div class="button" @click="assignPoints(index)">Přiřadit body</div>
            </div>
          </template>
        </section>
      </section>
    </main>

  </div>
</template>