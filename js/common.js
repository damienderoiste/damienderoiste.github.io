$(document).ready(function() {
  $.ajax({
    url: "includes/navigation.html",
    dataType: "html",
    success: function(data) {
      //alert(data);
      $("#sidebar").html(data);
    }
  });

  $.ajax({
    url: "includes/topbar.html",
    dataType: "html",
    success: function(data) {
      //alert(data);
      $("#topbar").html(data);
    }
  });

  $.ajax({
    url: "includes/footer.html",
    dataType: "html",
    success: function(data) {
      //alert(data);
      $("#footer").html(data);
    }
  });
});
