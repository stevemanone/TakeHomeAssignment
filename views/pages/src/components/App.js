import React, { Component } from 'react';
import Header from './header'
import data from '../testData'
import ContestList from './ContestList'

const pushState = (obj, url) =>
window.history.pushState(obj, '', url);

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      pageHeader: 'Naming Contests',
      contests: this.props.initialContests
    };
  }

fetchContest = (contestId) => {
  pushState(
    { currentContestId: contestId },
    `/contest/${contestId}`
  )
}

  render() {
  return(
    <div>
      <Header message = {this.state.pageHeader}/>

    <ContestList
      onContestClick = {this.fetchContest}
    contest = {this.state.contests} />

    </div>
  )
}
}

export default App;
