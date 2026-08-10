const btnNama = document.getElementById('btnNama');
const btnTTL = document.getElementById('btnTTL');
const btnAlamat = document.getElementById('btnAlamat');

const infoNama = document.getElementById('infoNama');
const infoTTL = document.getElementById('infoTTL');
const infoAlamat = document.getElementById('infoAlamat');

const semuaTombol = [btnNama, btnTTL, btnAlamat];

function toggleInfo(tombolAktif, infoAktif) {
  infoAktif.classList.toggle('hidden');

  const sedangTampil = !infoAktif.classList.contains('hidden');

  semuaTombol.forEach(function (tombol) {
    if (tombol !== tombolAktif) {
      tombol.disabled = sedangTampil;
    }
  });
}

btnNama.addEventListener('click', function () {
  toggleInfo(btnNama, infoNama);
});

btnTTL.addEventListener('click', function () {
  toggleInfo(btnTTL, infoTTL);
});

btnAlamat.addEventListener('click', function () {
  toggleInfo(btnAlamat, infoAlamat);
});