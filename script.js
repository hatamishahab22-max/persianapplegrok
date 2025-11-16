// تنظیمات Cloudinary - عوض کن!
const CLOUDINARY_CLOUD = "YOUR_CLOUD_NAME"; // مثلاً dabc123xy
const UPLOAD_PRESET = "persianapple";

async function uploadImage() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) return alert('عکس انتخاب کن!');

  const resultDiv = document.getElementById('uploadResult');
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = 'در حال آپلود...';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'persianapple');

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    if (data.secure_url) {
      resultDiv.innerHTML = `
        <p>آپلود شد!</p>
        <img src="${data.secure_url}" />
        <p><small>لینک: ${data.secure_url}</small></p>
      `;
      addProductToList("محصول جدید", 0, data.secure_url);
    } else {
      throw new Error("آپلود ناموفق");
    }
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">خطا: ${err.message}</p>`;
  }
}

function addProductToList(model, price, image) {
  const productsDiv = document.getElementById('products');
  const productHTML = `
    <div class="product">
      <img src="${image}" />
      <h3>${model}</h3>
      <p>${price > 0 ? price.toLocaleString('fa-IR') + ' تومان' : 'قیمت نامشخص'}</p>
    </div>
  `;
  productsDiv.insertAdjacentHTML('beforeend', productHTML);
}

// بارگذاری محصولات اولیه
fetch('products.json')
  .then(r => r.json())
  .then(products => {
    products.forEach(p => addProductToList(p.model, p.price, p.image));
  })
  .catch(() => console.log('محصولات اولیه لود نشد'));
