import axios from 'axios'

let params = ''

export function fetchPopularRepos(language) {
  const encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:'+language+'&sort=stars&order=desc&type=Repositories')

  return axios.get(encodedURI)
    .then(response => {
      return response.data.items
    })
}

function  getProfile(username) {
  return axios.get('https://api.github.com/users/'+username+params)
    .then(user => {
      return user.data
    })
}

function getRepos(username) {
  return axios.get('https://api.github.com/users/'+username+'/repos'+params+'?per_page=100')
    .then(user => {
      return user.data
    })
}

function getStarCount(repos) {
  return repos.reduce((count, repo) => {
    return count+repo.stargrazers_count
  },0)
}

function calculateScore(profile,repos) {
  const followers = profile.followers
  const totalStars = getStarCount(repos)||0

  return followers + totalStars
}

function handleError(err) {
  console.log(err)
  return null
}

function getUserData(player) {
  return axios.all([
    getProfile(player),
    getRepos(player)
  ]).then((data) => {
    const profile = data[0]
    const repos = data[1]

    return {
      profile: profile,
      score: calculateScore(profile, repos)
    }
  })
}

function sortPlayers(players) {
  return players.sort((a,b) => {
    return b.score-a.score
  })
}

export function battle(players) {
  return axios.all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError)
}