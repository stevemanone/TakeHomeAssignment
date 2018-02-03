import React from 'react';
import ContestPreview from './ContestPreview'
import PropTypes from 'prop-types';


const ContestList = ({contest, onContestClick}) => (
<div>
{contest.map(contest =>
  <ContestPreview
    onClick = {onContestClick}
    key = {contest.id} {...contest}/>
)}
</div>
)

export default ContestList
