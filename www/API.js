var UrlApi = ''; //tambahkan URL API Server

var level = GetURLParameter('level');
var namalogin = GetURLParameter('namalogin');
var user = namalogin.replace('%20', '');

var sendUrl = '?namalogin=' + user + '&level=' + level;
document.addEventListener('backbutton', function (e) {
  e.preventDefault();
});

function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

// Fungsi untuk menampilkan loading
function showLoading() {
  document.getElementById('loading-overlay').style.display = 'block';
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}
