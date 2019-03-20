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

  $('#county-select').select2({
    theme: "classic"
  });
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
  $("#page-title").text(ds.label);
  var time = ds.Dimension('Census Year').id
  $('#bar-chart-card')
    .find('.card-header')
    .find('h6')
    .text(
      $('#county-select option:selected').text()
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

  var data = {
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
  }

  var ctx = document
    .getElementById('population-by-county-bar-chart')
    .getContext('2d')

  ctx.height = 100;
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
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
