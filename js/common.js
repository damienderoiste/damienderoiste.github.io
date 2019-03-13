$(document).ready(function() {
  $.ajax({
    url: "navigation/navigation.html",
    dataType: "html",
    success: function(data) {
      //alert(data);
      $("#sidebar").html(data);
    }
  });
});
