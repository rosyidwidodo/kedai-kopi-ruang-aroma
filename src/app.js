document.addEventListener("alpine:init", () => {
  Alpine.data("menu", () => ({
    items: [
      {
        id: 1,
        name: "Black Coffee",
        img: "1.jpg",
        text: "Kopi hitam tanpa campuran, rasa pahit khas kopi",
        price: 18000,
      },
      {
        id: 2,
        name: "Cappuccino",
        img: "2.jpg",
        text: "Espresso dengan susu berbusa tebal, rasa creamy",
        price: 22000,
      },
      {
        id: 3,
        name: "Espresso",
        img: "3.jpg",
        text: "Kopi sangat pekat, cocok untuk yang suka rasa kuat",
        price: 20000,
      },
      {
        id: 4,
        name: "Ice Vanilla Latte",
        img: "4.jpg",
        text: "Kopi susu dingin dengan aroma vanilla yang manis",
        price: 18000,
      },
      {
        id: 5,
        name: "Latte Ice Cream",
        img: "5.jpg",
        text: "Perpaduan es krim dan kopi susu, rasa unik",
        price: 22000,
      },
      {
        id: 6,
        name: "Luwak White Coffee",
        img: "6.jpg",
        text: "Kopi unik dari biji kopi yang dimakan dan dikeluarkan oleh luwak",
        price: 20000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // Jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // Jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau di remove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validasi
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika checkout di klik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);

  // Minta transaction token menggunakan ajax / fetch
  try {
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();

    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// Konversi nilai uang ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
