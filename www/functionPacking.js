let jumlah = 0;
var scan = 0;
var user = GetURLParameter('namalogin');
var so = GetURLParameter('so');
var level = GetURLParameter('level');
var packingIndex = '';
// var UrlApi = 'http://zeppy2.ath.cx:5101';
// var UrlApi = 'http://zeppy2.ath.cx:5104'; //server mulai2
var UrlApi = 'http://localhost:3305';
// var UrlApi = "http://192.168.14.137:3301"; //mulai2 3301
document.addEventListener('deviceready', onDeviceReady, false);
document.addEventListener('backbutton', function (e) {
  e.preventDefault();
});

function onDeviceReady() {
  document.getElementById('valueSO').innerHTML = `SO : ${so}`;
  const inputScanValue = document.getElementById('inputScanValue');
  inputScanValue.value = '';
  document.getElementById('inputBarcode').disabled = true;
  showLoading();
  getNomerPacking();
}
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

//----------------------------------------------------------------------------------------------------------------------------------------

function getNomerPacking() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', UrlApi + '/nug_api/getNomerPacking?noso=' + so);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  let data = '';
  ////console.log(data)
  xhr.send(data);
  xhr.onload = function () {
    console.log(this.responseText);
    var obj = JSON.parse(this.responseText);
    var getData = obj.data.rows;
    var getDataTotal = getData[0]['stat1'];
    document.getElementById('userpick').innerHTML =
      'User Picking : ' + getData[0]['stat2'];
    if (getDataTotal == '') {
      packingIndex = 1;
      document.getElementById(
        'idIndex',
      ).innerHTML = `Nomer Packing Sekarang ${parseInt(packingIndex)}`;
      document.getElementById('inputBarcode').disabled = false;
      hideLoading();
      return;
    }
    var getData = obj.data.rows;
    packingIndex = getData[0]['stat1'];

    document.getElementById(
      'idIndex',
    ).innerHTML = `Nomer Packing Sekarang ${parseInt(packingIndex)}`;
    document.getElementById('inputBarcode').disabled = false;
    hideLoading();
  };
}

function exeScan() {
  document.getElementById('inputBarcode').disabled = true;
  scan = document.getElementById('inputBarcode').value;
  //  console.log("------------ ", scan);
  if (scan == '') {
    alert('Scan Barcode Kosong [!]');
    document.getElementById('inputBarcode').disabled = false;
  } else {
    getJumlah();
    return;
  }
}

function getJumlah() {
  //  console.log("========== ", scan);
  let xhr = new XMLHttpRequest();
  xhr.open('GET', UrlApi + '/nug_api/barangdet?kodebrg=' + scan);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  let data = 'kodebrg=' + scan;
  xhr.send(data);
  xhr.onload = function () {
    //  console.log(this.responseText);
    var obj = JSON.parse(this.responseText);
    var dataMain = obj.data.rows;
    if (dataMain.length == 0) {
      document.getElementById('inputBarcode').disabled = false;
      alert('Barcode Tidak Ada');
      clearBarcode();
      return;
    } else {
      jumlah = dataMain[0]['jumlah'];
      //  console.log(jumlah);

      putPacking();
    }
    return;
  };
}

function putPacking() {
  //  console.log(">>>>>>>>>>>> ", scan);
  let xhr = new XMLHttpRequest();
  xhr.open(
    'PUT',
    UrlApi +
      '/nug_api/getDSOCheck?noso=' +
      so +
      '&barScan=' +
      scan +
      '&checker=' +
      user +
      '&jumlah=' +
      jumlah +
      '&index=' +
      packingIndex,
  );
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  let data =
    'noso=' +
    so +
    '&barScan=' +
    scan +
    '&checker=' +
    user +
    '&jumlah=' +
    jumlah +
    '&index=' +
    packingIndex;
  xhr.send(data);
  xhr.onload = function () {
    //  console.log(this.responseText);
    var obj = JSON.parse(this.responseText);
    var err = obj.error;
    var msg = obj.msg;
    if (err == 'true') {
      alert(msg);
      document.getElementById('inputBarcode').disabled = false;
      document.getElementById('inputScanValue').disabled = false;
      document.getElementById('inputBarcode').focus();
      clearBarcode();
      return;
    }
    var dataMain = obj.data.rows;
    var namabarang = dataMain[0]['nama_barang'];
    var barcode = scan;
    var picking = dataMain[0]['total_brg'];
    var packing = dataMain[0]['noPack'];
    console.log(packing);
    var sisa = dataMain[0]['sisa'];
    var satuan = dataMain[0]['satuan'];
    if (dataMain.length == 0) {
      document.getElementById('inputBarcode').disabled = false;
      alert('Barcode Tidak Dalam Daftar SO');
      myFocus();
      clearBarcode();
      return;
    } else {
      document.getElementById('idNamaBarang').innerHTML = `${namabarang}`;
      document.getElementById('idBarcode').innerHTML = `${barcode}`;
      document.getElementById('idPicking').innerHTML = `Picking : ${picking}`;
      document.getElementById('idNoPax').innerHTML = `No Pax :  ${packing}`;

      document.getElementById('idSisa1').innerHTML = `SISA `;
      document.getElementById('idSisa').innerHTML = ` ${sisa}`;
      document.getElementById('idSisa2').innerHTML = ` ${satuan}`;
      document.getElementById(
        'idIndex',
      ).innerHTML = `Nomer Packing Sekarang ${parseInt(packingIndex)}`;
      document.getElementById('inputBarcode').disabled = false;
      if (sisa == 0) {
        document.getElementById('inputBarcode').focus();
        document.getElementById('inputScanValue').disabled = false;
        clearBarcode();
        return;
      } else {
        myFocus();
        clearBarcode();
        return;
      }
    }
  };
}

function myFocus() {
  document.getElementById('inputScanValue').disabled = false;
  document.getElementById('inputScanValue').focus();
}

function lanjutPacking() {
  let xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    UrlApi + '/nug_api/getDSOPack?noso=' + so + '&nopack=' + packingIndex,
  );
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  let data = 'noso=' + so + '&nopack=' + packingIndex;
  xhr.send(data);
  xhr.onload = function () {
    ////console.log(this.responseText);
    var obj = JSON.parse(this.responseText);
    var dataMain = obj.data.rows;
    var validasiNoPak = obj.data.total;
    ////console.log(validasiNoPak);
    if (validasiNoPak == '0') {
      alert(
        'Pakai Nomor Pakcing Sekarang, Karna Masih Belum Diisi \nLanjut Scan Barang',
      );
      return;
    } else {
      packingIndex++;
      ////console.log(packingIndex);
      alert('Nomor Packing Baru : ' + packingIndex);
      document.getElementById(
        'idNoPax',
      ).innerHTML = `No Pax :  ${packingIndex}`;
      document.getElementById(
        'idIndex',
      ).innerHTML = `Nomer Packing Sekarang ${parseInt(packingIndex)}`;
    }
  };
}

function selesaiPacking() {
  // alert("Packing Selesai");
  // location.href = "packing_scanSO.html?namalogin=" + user + "&level=" + level;
  let xhr = new XMLHttpRequest();
  xhr.open('GET', UrlApi + '/nug_api/getDSOCheckFull?noso=' + so);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  let data = 'noso=' + so;
  xhr.send(data);
  xhr.onload = function () {
    //  console.log(this.responseText);
    var obj = JSON.parse(this.responseText);
    var dataMain = obj.data.rows;
    var validasiNoPak = obj.error;
    ////console.log(validasiNoPak);
    if (validasiNoPak == 'false') {
      alert('Packing Selesai');
      location.href =
        'packing_scanSO.html?namalogin=' + user + '&level=' + level;
      return;
    } else {
      alert('Packing Belum Selesai ');
      return;
    }
  };
}

function addJumlahText() {
  document.getElementById('inputScanValue').disabled = true;
  var inputScanValue = document.getElementById('inputScanValue').value;
  jumlah = inputScanValue;
  document.getElementById('inputScanValue').innerHTML = `${jumlah}`;
  ////console.log(jumlah);
  //document.getElementById('inputBarcode').focus();
  putPacking();
}

function clearBarcode() {
  ////console.log("CLEAR BARCODE");
  document.getElementById('inputBarcode').value = '';
  document.getElementById('inputScanValue').value = '';
}

function exeDashboard() {
  location.href = 'dashboard.html?namalogin=' + user + '&level=' + level;
}
function exeHome() {
  location.href = 'packing_scanSO.html?namalogin=' + user + '&level=' + level;
}
function exeBack() {
  location.href = 'packing_scanSO.html?namalogin=' + user + '&level=' + level;
}
function exeRefresh() {
  //location.href="scan_barang.html?namalogin="+user+"&level="+level
  document.location.reload(true);
}

// Fungsi untuk menampilkan loading
function showLoading() {
  document.getElementById('loading-overlay').style.display = 'block';
}

// Fungsi untuk menyembunyikan loading
function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

const getModalData = () => {
  const url = UrlApi + '/nug_api/getCekSO?noso=' + so;

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Terjadi kesalahan dalam respons.');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      var err = data.error;
      var msg = data.msg;
      if (err == 'true') {
        Swal.fire({
          title: 'Oops...',
          text: msg,
          icon: 'warning',
          confirmButtonText: 'Back',
        });
        return;
      }
      getDataModal = data.data.rows;
      viewModal();
      // Lakukan sesuatu dengan getData
    })
    .catch((error) => {
      alert('Request Error');
      console.error('Terjadi kesalahan:', error);
    });
};

const viewModal = () => {
  const l = document.querySelector('#bodyListSO2');
  l.innerHTML = '';
  getDataModal.forEach((item, i) => {
    var row = document.createElement('tr'),
      cell1 = document.createElement('td'),
      cell2 = document.createElement('td'),
      cell3 = document.createElement('td'),
      cell4 = document.createElement('td'),
      cell5 = document.createElement('td');
    cell1.innerHTML = item.namabarang;
    cell2.innerHTML = item.jumlahbarang;
    cell3.innerHTML = item.jml1;
    cell4.innerHTML = item.jml2;
    cell5.innerHTML = item.koli;
    cell1.style.verticalAlign = 'middle';
    cell1.style.color = 'black';
    cell1.style.fontWeight = '800';
    cell1.style.fontSize = '18px';
    cell2.style.textAlign = 'center';
    cell2.style.verticalAlign = 'middle';
    cell2.style.color = 'black';
    cell2.style.fontWeight = '800';
    cell2.style.fontSize = '18px';
    cell3.style.textAlign = 'center';
    cell3.style.verticalAlign = 'middle';
    cell3.style.color = 'black';
    cell3.style.fontWeight = '800';
    cell3.style.fontSize = '18px';
    cell4.style.textAlign = 'center';
    cell4.style.verticalAlign = 'middle';
    cell4.style.color = 'black';
    cell4.style.fontWeight = '800';
    cell4.style.fontSize = '18px';
    cell5.style.textAlign = 'center';
    cell5.style.verticalAlign = 'middle';
    cell5.style.color = 'black';
    cell5.style.fontWeight = '800';
    cell5.style.fontSize = '18px';

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);
    row.appendChild(cell4);
    row.appendChild(cell5);
    l.appendChild(row);
  });
};
