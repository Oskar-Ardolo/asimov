// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Area Chart Example
var ctx = document.getElementById("Chart");
var data = JSON.parse(document.currentScript.getAttribute('data'));

if (data) {
  var label = Object.keys(data);
  label.push("Général");

  var values = [];
  var conteneur = 0;
  var cpt = 0;
  for (let items in data) {
    conteneur += parseInt(data[items].notes);
    values.push(data[items].notes);
    cpt ++
  }

  values.push((conteneur/cpt).toFixed(2));

  console.log(values, cpt, conteneur)
}

var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: label,
    datasets: [{
      label: "Moyenne",
      lineTension: 0.3,
      backgroundColor: "rgba(2,117,216,0.2)",
      borderColor: "rgba(2,117,216,1)",
      pointRadius: 5,
      pointBackgroundColor: "rgba(2,117,216,1)",
      pointBorderColor: "rgba(255,255,255,0.8)",
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(2,117,216,1)",
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: values,
    }],
  },
  options: {
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 20,
          maxTicksLimit: 5
        },
        gridLines: {
          color: "rgba(0, 0, 0, .125)",
        }
      }],
    },
    legend: {
      display: false
    }
  }
});
