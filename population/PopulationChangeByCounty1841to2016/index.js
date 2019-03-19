$(document).ready(function () {
  var ds = null
  $.preloader.start({ modal: true, src: '/img/sprites.png' })
  JSONstat(
    'https://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/EY001',
    function () {
      ds = this.Dataset(0)
      displayResults(ds)
    }
  )

  $('#county-select').change(function () {
    renderBarChart(ds)
  })
})

displayResults = function (ds) {
  var counties = ds.Dimension('County').id
  $.each(counties, function (index, value) {
    $('#county-select').append(
      $('<option>', {
        value: value,
        text: ds.Dimension('County').Category(index).label
      })
    )
  })

  renderBarChart(ds)
}

renderBarChart = function (ds) {
  var time = ds.Dimension('Census Year').id
  $('#bar-chart-card')
    .find('.card-header')
    .find('h6')
    .text(
      'Population Change : ' +
        $('#county-select option:selected').text() +
        ' ' +
        time[0] +
        ' to ' +
        time[time.length - 1]
    )

  var dataMales = []
  var dataFemales = []

  $.each(time, function (index, value) {
    dataMales.push(
      ds.Data({
        Statistic: 'EY001C01',
        County: $('#county-select option:selected').val(),
        Sex: '1',
        'Census Year': value
      }).value
    )

    dataFemales.push(
      ds.Data({
        Statistic: 'EY001C01',
        County: $('#county-select option:selected').val(),
        Sex: '2',
        'Census Year': value
      }).value
    )
  })

  var ctx = document
    .getElementById('population-by-county-bar-chart')
    .getContext('2d')
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: time,
      datasets: [
        {
          label: 'Males: ',
          data: dataMales,
          backgroundColor: 'rgba(173,216,230)', // version >2 useus background color
          borderWidth: 1
        },
        {
          label: 'Females: ',
          data: dataFemales,
          backgroundColor: 'rgba(255,192,203)', // version >2 useus background color
          borderWidth: 1
        }
      ]
    },
    options: {
      tooltips: {
        mode: 'label',
        callbacks: {
          title: function (tooltipItem, data) {
            var total = ds.Data({
              Statistic: 'EY001C01',
              County: $('#county-select option:selected').val(),
              Sex: '-',
              'Census Year': tooltipItem[0].label
            }).value
            return tooltipItem[0].label + ' Total: ' + total
          },

          label: function (tooltipItem, data) {
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ': ' +
              tooltipItem.yLabel
            )
          }
        }
      },

      scales: {
        xAxes: [{ stacked: true }],
        yAxes: [{ stacked: true }]
      }
    }
  })
  $.preloader.stop()
}
