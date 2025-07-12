const menu = [
  { name: "Nasi Goreng", price: 25000 },
  { name: "Ayam Bakar", price: 30000 },
  { name: "Es Teh", price: 5000 },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderMenu() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  menu.forEach((item, index) => {
    menuList.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>Rp ${item.price.toLocaleString("id-ID")}</td>
        <td><button onclick="addToCart(${index})">➕</button></td>
      </tr>`;
  });
  renderCart();
}

function addToCart(index) {
  const found = cart.find(c => c.name === menu[index].name);
  if (found) {
    found.qty++;
  } else {
    cart.push({ ...menu[index], qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("total");
  cartEl.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    cartEl.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>Rp ${item.price.toLocaleString("id-ID")}</td>
        <td>${item.qty}</td>
        <td>Rp ${itemTotal.toLocaleString("id-ID")}</td>
        <td>
          <button onclick="decrease(${i})">➖</button>
          <button onclick="removeItem(${i})">🗑️</button>
        </td>
      </tr>`;
  });
  totalEl.textContent = "Rp " + total.toLocaleString("id-ID");
}

function decrease(i) {
  if (cart[i].qty > 1) {
    cart[i].qty--;
  } else {
    cart.splice(i, 1);
  }
  renderCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Disimpan ke localStorage!");
}

function sendToWA() {
  const nama = document.getElementById("nama").value.trim();
  const tglPesan = document.getElementById("tglPesan").value;
  const tglKirim = document.getElementById("tglKirim").value;
  const waktu = document.getElementById("waktu").value;

  if (!nama || !tglPesan || !tglKirim || !waktu) {
    alert("Mohon lengkapi semua data pemesan.");
    return;
  }

  let message = `📦 PESANAN BARU\n`;
  message += `👤 Nama: ${nama}\n`;
  message += `🗓️ Tanggal Pesan: ${tglPesan}\n`;
  message += `🚚 Dipakai/Dikirim: ${tglKirim}\n`;
  message += `🕒 Waktu Acara: ${waktu}\n\n`;
  message += `📝 Detail Pesanan:\n`;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    message += `- ${item.name} x ${item.qty} = Rp ${subtotal.toLocaleString("id-ID")}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  message += `\n💰 Total: Rp ${total.toLocaleString("id-ID")}`;

  // Nomor admin (jangan pakai spasi atau tanda +)
  const adminNo = "6287729728489";

  // Encode text WA biar aman
  const encodedMessage = encodeURIComponent(message);

  // Ganti URL ke wa.me (bukan api.whatsapp.com)
  const url = `https://wa.me/${adminNo}?text=${encodedMessage}`;

  window.open(url, "_blank");
}


function downloadCart() {
  let text = "Pesanan Saya:\n";
  cart.forEach(item => {
    text += `${item.name} x ${item.qty} = Rp ${item.price * item.qty}\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  text += `\nTotal: Rp ${total.toLocaleString("id-ID")}`;
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "pesanan.txt";
  a.click();
}

// ⬇️ INI YANG PALING PENTING
window.onload = () => {
  renderMenu();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("tglPesan").value = today;
};