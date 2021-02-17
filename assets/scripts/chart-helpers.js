function createChart(chartElement, labels, data, type, options = {}) {
  var chart = new Chart(chartElement, {
    // The type of chart we want to create
    type: type,

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: ['#0267c1', '#0075c4', '#efa00b', '#d65108', '#591f0a', '#fcf300', '#2f1847', '#c62e65'],
            borderColor: '#fff',
            data: data,
        }]
    },

    // Configuration options go here
    options: options || {}
});
}

export { createChart }
