function createChart(chartElement, labels, data, type, options = {}, color = null) {
  var chart = new Chart(chartElement, {
    // The type of chart we want to create
    type: type,

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: color || ['#003652', '#fdbe12', '#ff7236', '#54b247', '#591f0a', '#006599', '#004765', '#cf343f', '#f7976e'],
            borderColor: '#fff',
            data: data,
        }]
    },

    // Configuration options go here
    options: {scaleBeginAtZero: true} || {}
});
}

function createLineChart(chartElement, data) {
  const chart = new Chart(chartElement, {
    type: 'line',
    data: {
      labels: data.timeLabels,
      datasets: data.datasets,
    },
  });
}

export { createChart, createLineChart }
