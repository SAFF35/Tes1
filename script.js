document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil nilai input
    const kodeid = document.getElementById("kodeid").value.trim();
    const password = document.getElementById("password").value.trim();

    if (kodeid === "" || password === "") {
      alert("Kode ID dan Password harus diisi!");
      return;
    }

    // Ganti URL berikut dengan URL Web App Google Apps Script Anda
    const scriptURL = "https://script.google.com/macros/s/AKfycbyqa3H9xysGUj3quFv53palb3a4XErvKmyiJHgTJX2MkmjDhP9do78M3OdSrqBzOT1M/exec";

    // Susun URL dengan parameter action, kodeid, dan password
    const url = scriptURL +
      "?action=login&kodeid=" + encodeURIComponent(kodeid) +
      "&password=" + encodeURIComponent(password);

    // Tampilkan URL pada konsol untuk memastikan URL sudah benar
    console.log("Request URL:", url);

    fetch(url)
      .then(response => {
        // Pastikan respons OK, jika tidak lempar error
        if (!response.ok) {
          throw new Error("Network response was not ok: " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.status === "success") {
          displayData(data.data);
        } else {
          alert(data.message || "Login gagal!");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat koneksi ke server.");
      });
  });

  // Tombol HOME menuju URL utama
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.addEventListener("click", function () {
    window.location.href = "https://SAFF35.github.io/Pencairan";
  });
});
  
  // Tombol HOME menuju URL utama
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.addEventListener("click", function () {
    window.location.href = "https://SAFF35.github.io/Dashboard";
  });
});

/**
 * Menampilkan data anggota dalam format tabel.
 * Untuk field yang termasuk kategori uang (Bonus, Komisi, Pencairan) nilainya akan diformat.
 */
function displayData(userData) {
  // Sembunyikan kontainer login dan tampilkan kontainer data
  document.getElementById("loginContainer").style.display = "none";
  const dataContainer = document.getElementById("dataContainer");
  dataContainer.style.display = "block";

  // Set judul untuk halaman WD
  document.getElementById("dataTitle").innerText = "Komisi dan Bonus";

  // Buat tabel untuk menampilkan data dengan label dan nilai
  const table = document.createElement("table");
  table.className = "table-data";

  // Urutan field sesuai dengan data di Google Sheet (Password tidak ditampilkan)
  const fieldsOrder = [
    "Kode ID",
    "Tgl Bergabung",
    "Nama",
    "Pengundang",
    "WA Pengundang",
    "Kode Produk",
    "Poin Produk",
    "Poin Sebelumnya",
    "Anggota Generasi 1",
    "Poin Generasi 1",
    "Komisi Generasi 1",
    "Anggota Generasi 2-10",
    "Poin Generasi 2",
    "Komisi Generasi 2-10",
    "Jumlah Komisi",
    "Bonus Spesial 1",
    "Bonus Spesial 2",
    "Bonus Spesial 3",
    "Bonus Spesial 4",
    "Bonus Spesial 5",
    "Total Komisi+Bonus",
    "Pencairan Sebelumnya",
    "Pencairan Baru",
    "Tgl Pencairan",
    "Jumlah Pencairan",
    "Jumlah Komisi+Bonus",
    "Bonus Tambahan 1",
    "Bonus Tambahan 2",
    "Bonus Tambahan 3"
  ];

  // Daftar field yang harus diformat sebagai mata uang
  const currencyFields = [
    "Komisi Generasi 1",
    "Komisi Generasi 2-10",
    "Jumlah Komisi",
    "Bonus Spesial 1",
    "Bonus Spesial 2",
    "Bonus Spesial 3",
    "Bonus Spesial 4",
    "Bonus Spesial 5",
    "Total Komisi+Bonus",
    "Pencairan Sebelumnya",
    "Pencairan Baru",
    "Jumlah Pencairan",
    "Jumlah Komisi+Bonus",
    "Bonus Tambahan 1",
    "Bonus Tambahan 2",
    "Bonus Tambahan 3"
  ];

  fieldsOrder.forEach(function (field) {
    const tr = document.createElement("tr");

    // Kolom label (rata kiri)
    const th = document.createElement("th");
    th.innerText = field;

    // Kolom titik dua (agar sejajar)
    const tdColon = document.createElement("td");
    tdColon.innerText = ":";
    tdColon.style.width = "10px";

    // Kolom nilai (posisi tengah)
    const tdValue = document.createElement("td");
    let value = userData[field] || "";

    // Jika field merupakan mata uang, format dengan Rp dan separator ribuan
    if (currencyFields.includes(field)) {
      value = formatCurrency(value);
    }

    tdValue.innerText = value;

    tr.appendChild(th);
    tr.appendChild(tdColon);
    tr.appendChild(tdValue);
    table.appendChild(tr);
  });

  // Masukkan tabel ke dalam kontainer data, bersihkan konten lama jika ada
  const dataContent = document.getElementById("dataContent");
  dataContent.innerHTML = "";
  dataContent.appendChild(table);
}

/**
 * Fungsi untuk memformat nilai ke dalam format rupiah (contoh: Rp 10.000)
 */
function formatCurrency(value) {
  let number = parseFloat(value);
  if (isNaN(number)) return value;
  return "Rp " + number.toLocaleString("id-ID");
}
