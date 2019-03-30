$(document).ready(function () {
  var ds = null
  var dataUrl =
    'https://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/SIA12'
  $.preloader.start({ modal: true, src: '/img/sprites.png' })
  JSONstat(dataUrl, function () {
    ds = this.Dataset(0)
    var tableObj = ds.toTable({
      type: 'arrobj'
    })

    $('#dataset-table').DataTable({
      data: tableObj,
      columns: [
        {
          data: 'Sex'
        },
        {
          data: 'Statistic'
        },
        {
          data: 'Year'
        },
        {
          data: 'value',
          render: function (data, type, row) {
            return app.common.thousandSeperator(data)
          }
        }
      ],
      order: [[0, 'desc']],
      lengthMenu: [[10, 25, 50, -1], [10, 25, 50, 'All']]
    })
    // readCounties(ds)
    $('#page-title').text(ds.label)
    var time = ds.Dimension('Year').id

    var ctx = document
      .getElementById('poverty-rates-line-chart')
      .getContext('2d')

    ctx.height = 100

    var myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      maintainAspectRatio: false,
      data: getdata(ds, time),
      options: {
        legend: {
          position: 'bottom'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 100,
                callback: function (value) {
                  return value + '%'
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Percentage'
              }
            }
          ]
        }
      }
    })

    $.preloader.stop()
    $('#main-content').fadeIn()
  })

  $('#county-select').select2({
    theme: 'classic'
  })
})

getdata = function (ds, time) {
  var dataRiskOfPoverty = []
  var deprivationRate = []
  var consistentPovertyRate = []

  $.each(time, function (index, value) {
    dataRiskOfPoverty.push(
      ds.Data({
        Statistic: 'SIA12C09',
        Sex: '-',
        Year: value
      }).value
    )

    deprivationRate.push(
      ds.Data({
        Statistic: 'SIA12C10',
        Sex: '-',
        Year: value
      }).value
    )

    consistentPovertyRate.push(
      ds.Data({
        Statistic: 'SIA12C11',
        Sex: '-',
        Year: value
      }).value
    )
  })

  var data = {
    labels: time,
    datasets: [
      {
        label: 'At Risk of Poverty: ',
        data: dataRiskOfPoverty,
        backgroundColor: '#F6C23E',
        borderColor: '#F6C23E',
        fill: false
      },
      {
        label: 'Deprivation Rate: ',
        data: deprivationRate,
        backgroundColor: '#2E59D9',
        borderColor: '#2E59D9',
        fill: false
      },
      {
        label: 'Consistent Poverty Rate: ',
        data: consistentPovertyRate,
        backgroundColor: '#17A673',
        borderColor: '#17A673',
        fill: false
      }
    ]
  }
  return data
}
