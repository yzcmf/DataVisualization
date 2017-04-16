<template>
  <div id="app">
    <button @click="sortByRecent">Sort by Recent Points</button>
    <button @click="sortByAllTime">Sort by All Time Points</button>
    <table>
      <thead>
        <tr>
          <td>#</td>
          <td></td>
          <td>Username</td>
          <td :class="getActiveClass('recent')">Recent Points</td>
          <td :class="getActiveClass('allTime')">Total Points</td>
        </tr>
      </thead>
      <tr v-for="(user, index) in data">
        <td>{{index + 1}}</td>
        <td>
          <img :src="user.img">
        </td>
        <td>{{user.username}}</td>
        <td>{{user.recent}}</td>
        <td>{{user.alltime}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'

Vue.use(require('vue-resource'));

const endpoint = 'https://fcctop100.herokuapp.com/api/fccusers/top/recent'

const store = {
  state: {
    sortingBy: ''
  }
}

export default {
  data() {
    return {
      data: [],
      state: store.state
    }
  },
  mounted() {
    Vue.http.get(endpoint).then(response => {
      this.data = response.body
    }, response => {
      console.warn('There was a data error:', response)
    })
  },
  methods: {
    sortByRecent() {
      this.data = _.sortBy(this.data, 'recent').reverse()
      store.state.sortingBy = 'recentDescending'
    },
    sortByAllTime() {
      this.data = _.sortBy(this.data, 'alltime').reverse()
      store.state.sortingBy = 'allTimeDescending'
    },
    getActiveClass(string) {
      return {active: store.state.sortingBy.includes(string)}
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.active {
  font-weight: bold;
}
button {
  font-size: 20px;
}
img {
  border-radius: 50%;
  height: 30px;
  width: 30px;
}
</style>
