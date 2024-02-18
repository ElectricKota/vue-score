<script lang="ts">
import { ref } from 'vue';

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
      rounds: 0 as number,
      mainRounds: 1 as number,
      players: new Array<Player>,
      playerCount: 2 as number,
      actualPoints: 0 as number,
    }
  },
  created() {
    this.createEmptyPlayers()
  },
  mounted() {

  },
  methods: {
    resetgame() {
      this.rounds = 0;
      this.mainRounds = 1;
      this.actualPoints = this.playerCount;
      this.players.forEach(element => {
        element.score = 0;
        element.rounds = 0;
      });
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
      const number = this.playerCount;
      if (this.players.length > this.playerCount) {
        this.players.length = this.playerCount
      }
      else {

        for (let index = this.players.length; index < number; index++) {
          this.newPlayer(`Hráč č.${index + 1}`, 0, 0);
        }
      }
      this.actualPoints = this.playerCount;
      console.log(this.players);
    },
    changeName(index: number) {
      // this.players[index].name = 'sdfsdf';
      // console.log(`Nové jméno pro hráče na indexu ${index}: ${this.players[index].name}`);
    },
    assignPoints(index: number) {
      // Metoda pro přiřazení bodů
      const setScore = this.actualPoints;

      this.players[index].score += setScore;
      this.players[index].rounds++;
      console.log(`Hráči ${this.players[index].name} bylo přiřazeno ${setScore} bodů.`);

      this.actualPoints--;
      if (this.actualPoints < 1) {
        this.actualPoints = this.playerCount;
      }
      this.newRound();
    },
    newRound() {
      let newRound = 0;
      this.players.forEach(element => {
        if (element.rounds === this.mainRounds) newRound++;
      });
      console.log('porovnávám ++ a mainRound a playerCount', newRound, this.mainRounds, this.playerCount);

      if (newRound === this.playerCount) {
        this.rounds = this.playerCount;
        this.mainRounds++;
        console.log('Nové kolo!', this.rounds, this.mainRounds);
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
      document.querySelector(`#${id}`)?.classList.toggle('hide');
      document.querySelector(`#${id}-toggler`)?.classList.toggle('down');
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
          <button class="toggler" id="nastaveni-toggler" @click="toggleHide('nastaveni')">X</button>
        </div>
        <div class="hide-section" id="nastaveni">
          <div class="hide-section__inner">
            <div class="sidebar__inner">
              <button @click="resetgame()">Reset</button>
            </div>
            <div class="sidebar__inner">

              <h2>Hráči</h2>
              <label>Počet hráčů: <input type="number" min="2" max="6" @change="createEmptyPlayers()" v-model="playerCount"></label>
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
        <p>Hrajeme kolo č. {{ mainRounds }}</p>
        <p>{{ actualPoints }} body udělíme hráči</p>
        <section class="players">
          <template v-for="(player, index) in players" :key="index">
            <div class="players__item players__item--points" v-if="players[index].rounds !== mainRounds">
              <label :for="'playerInput_' + index">{{ player.name }}</label>
              <button @click="assignPoints(index)">Přiřadit body</button>
            </div>
          </template>
        </section>
      </section>
    </main>

  </div>
</template>

<!-- <style scoped lang="scss" src="./assets/scss/main.scss"></style> -->
./ts/CZ/messages./assets/ts/LangService