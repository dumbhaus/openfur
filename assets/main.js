'use strict';

fetch('assets/report.json').then((response) => {
  response.json().then(main)
});

function main(report) {
  Chart.defaults.global.plugins = {
    datalabels: {
      formatter: (value, ctx) => {
        let datasets = ctx.chart.data.datasets;

        if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
          let sum = datasets[0].data.reduce((a, b) => a + b, 0);
          let percentage = Math.round((value / sum) * 100) + '%';
          return percentage;
        } else {
          return percentage;
        }
      },
      color: '#fff',
    }
  };
  
  Chart.defaults.global.legend.position = 'bottom';
  
  var ratingsData = {
    datasets: [{
      data: [report.general.total, report.mature.total, report.adult.total],
      backgroundColor: ['#8be3e3', '#e3b78b', '#e38b8b']
    }],
    labels: ['General', 'Mature', 'Adult'],
  };
  
  document.querySelector('#general-count').innerText = report.general.total;
  document.querySelector('#mature-count').innerText = report.mature.total;
  document.querySelector('#adult-count').innerText = report.adult.total;
  document.querySelector('#total-count').innerText = report.all.total;
  document.querySelector('#general-percentage').innerText = Math.round(report.general.total / report.all.total * 100) + '%';
  document.querySelector('#mature-percentage').innerText = Math.round(report.mature.total / report.all.total * 100) + '%';
  document.querySelector('#adult-percentage').innerText = Math.round(report.adult.total / report.all.total * 100) + '%';
  
  var contentRatings = new Chart(document.querySelector('#content-ratings'), {type: 'pie', data: ratingsData});
  
  var generalNsfwData = {
    datasets: [{
      data: [(report.general.total - report.general.nsfwTotal), report.general.nsfwTotal],
      backgroundColor: ['#8be3e3', '#e38b8b']
    }],
    labels: ['Regular Content', 'Sexual Content']
  };
  
  document.querySelector('#general-regular-total').innerText = (report.general.total - report.general.nsfwTotal);
  document.querySelector('#general-sexual-total').innerText = report.general.nsfwTotal;
  document.querySelector('#general-total').innerText = report.general.total;
  document.querySelector('#general-regular-percentage').innerText = Math.round((report.general.total - report.general.nsfwTotal) / report.general.total * 100) + '%';
  document.querySelector('#general-sexual-percentage').innerText = Math.round(report.general.nsfwTotal / report.general.total * 100) + '%';

  var generalNsfw = new Chart(document.querySelector('#general-nsfw'), {type: 'pie', data: generalNsfwData});
  
  var matureNsfwData = {
    datasets: [{
      data: [report.mature.total - report.mature.nsfwTotal, report.mature.nsfwTotal],
      backgroundColor: ['#8be3e3', '#e38b8b']
    }],
    labels: ['Regular Content', 'Sexual Content']
  };
  
  document.querySelector('#mature-regular-total').innerText = (report.mature.total - report.mature.nsfwTotal);
  document.querySelector('#mature-sexual-total').innerText = report.mature.nsfwTotal;
  document.querySelector('#mature-total').innerText = report.mature.total;
  document.querySelector('#mature-regular-percentage').innerText = Math.round((report.mature.total - report.mature.nsfwTotal) / report.mature.total * 100) + '%';
  document.querySelector('#mature-sexual-percentage').innerText = Math.round(report.mature.nsfwTotal / report.mature.total * 100) + '%';
  
  var matureNsfw = new Chart(document.querySelector('#mature-nsfw'), {type: 'pie', data: matureNsfwData});
  
  var totalNsfwData = {
    datasets: [{
      data: [report.all.total - report.all.nsfwTotal, report.general.nsfwTotal, report.mature.nsfwTotal, report.adult.total],
      backgroundColor: ['#8be3e3', '#b78be3', '#e3cd8b', '#e3a18b']
    }],
    labels: ['Regular Content', '[General] Sexual Content', '[Mature] Sexual Content', '[Adult] Sexual Content']
  };
  
  document.querySelector('#total-regular-total').innerText = report.all.total - report.all.nsfwTotal;
  document.querySelector('#total-general-sexual-total').innerText = report.general.nsfwTotal;
  document.querySelector('#total-mature-sexual-total').innerText = report.mature.nsfwTotal;
  document.querySelector('#total-adult-sexual-total').innerText = report.adult.nsfwTotal;
  document.querySelector('#total-content').innerText = report.all.total;
  document.querySelector('#total-regular-percentage').innerText = Math.round((report.all.total - report.all.nsfwTotal) / report.all.total * 100) + '%';
  document.querySelector('#total-general-sexual-percentage').innerText = Math.round(report.general.nsfwTotal / report.all.total * 100) + '%';
  document.querySelector('#total-mature-sexual-percentage').innerText = Math.round(report.mature.nsfwTotal / report.all.total * 100) + '%';
  document.querySelector('#total-adult-sexual-percentage').innerText = Math.round(report.adult.nsfwTotal / report.all.total * 100) + '%';
  
  var totalNsfw = new Chart(document.querySelector('#total-nsfw'), {type: 'pie', data: totalNsfwData});
  
  var nsfwTypesData = {
    datasets: [{data: [], backgroundColor: '#8be3e3', fillColor: "#ffffff"}],
    labels: []
  };
  
  let nsfwTbody = document.querySelector('#nsfw-tbody');
  
  for (let i = 0; i < report.all.nsfwTypes.length; i++) {
    let nsfwType = report.all.nsfwTypes[i];
    
    nsfwTypesData.datasets[0].data.push(nsfwType.total);
    nsfwTypesData.labels.push(nsfwType.nsfwType);
    
    let row = document.createElement('tr');
    let cell1 = document.createElement('td');
    let cell2 = document.createElement('td');
    
    cell1.innerText = nsfwType.nsfwType;
    cell2.innerText = nsfwType.total;
    row.appendChild(cell1);
    row.appendChild(cell2);
    nsfwTbody.appendChild(row);
  }
  
  var nsfwTypes = new Chart(document.querySelector('#nsfw-types'), {
    type: 'bar',
    data: nsfwTypesData,
    options: {
      legend: {display: false},
      plugins: {
        datalabels: {
          color: '#fff',
          formatter: null
        }
      }
    }
  });
  
  document.querySelector('#loading').style.display = 'none';
  document.querySelectorAll('.requires-data').forEach((section) => {
    section.classList.toggle('requires-data');
  });
}
