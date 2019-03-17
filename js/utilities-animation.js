$(document).ready(function() {
  $.preloader.start({ modal: true, src: "img/sprites.png" });
  JSONstat(
    "https://www.cso.ie/StatbankServices/StatbankServices.svc/jsonservice/responseinstance/E2001",
    function() {
      var ds = this.Dataset(0);
      displayResults(ds);
    }
  );
});

displayResults = function(ds) {
  var num = ds.Data({
    Statistic: "E2001C01",
    County: "01",
    Sex: "-",
    "Census Year": "2016"
  }).value;

  $("#result").text(num);
  $.preloader.stop();
  // alert( num );
};
