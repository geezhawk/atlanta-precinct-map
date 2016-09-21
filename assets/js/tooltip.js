import $ from 'jquery';

export default function(props) {
  try {
    var totalVotes = props.dem_v + props.rep_v;

    function getCandResults(party, numVotes) { 
      return `
          <tr class="eln-row">
            <td>
              <div class="${party}-party-tag"></div>
              <span class="candidate-name">${party === 'dem' ? 'Clinton' : 'Trump'}</span>
            </td>
            <td>${numVotes}</td>
            <td>${parseInt((numVotes / totalVotes) * 100)}%</td> 
          </tr>
      `
    }

    var winner;
    var loser;

    if (props.dem_v > props.rep_v) {
      winner = getCandResults('dem', props.dem_v)
      loser = getCandResults('gop', props.rep_v)
    }
    else {
      winner = getCandResults('gop', props.rep_v)
      loser = getCandResults('dem', props.dem_v)
    }

    $('#info-data').html(`
      <h4 class="tooltip-title">Precinct ${props.PRECINCT_I} (${props.COUNTY_NAM})</h4>
      <table class="tooltip-table">
        <thead class="eln-header">
          <tr>
            <th>Candidates</th>
            <th>Votes</th>
            <th>Pct.</th>
          </tr>
        </thead>
        <tbody>
          ${winner}
          ${loser}
        </tbody>
      
      </table>
    `);
  }
  catch (TypeError) {
    $('#info-data').html = '<h1>Hover over a precinct to see details</h1>'
  }
};