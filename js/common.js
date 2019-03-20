$(document).ready(function () {
  $.ajax({
    url: '/includes/navigation.html',
    dataType: 'html',
    success: function (data) {
      // alert(data);
      $('#sidebar').html(data)
    }
  })

  $.ajax({
    url: '/includes/topbar.html',
    dataType: 'html',
    success: function (data) {
      // alert(data);
      $('#topbar').html(data)
    }
  })

  $.ajax({
    url: '/includes/footer.html',
    dataType: 'html',
    success: function (data) {
      // alert(data);
      $('#footer').html(data)
    }
  })
})

app = {}
app.common = {}

app.common.thousandSeperator = function (int) {
  int += ''
  x = int.split('.')
  x1 = x[0]
  x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}
