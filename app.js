(function () {
  // объект, откуда брать свойства продукта
  // например, он приходит с сервера и в результате формируем карточку
  const products = {
    polyRed: {
      type: "polycarbonate",
      variantID: "Red Mirror",
      bigImages: ["red_big_1.png", "red_big_2.png", "red_big_3.png"],
      price: 30,
      quantity: 1,
    },
    polyBlue: {
      type: "polycarbonate",
      variantID: "Blue Mirror",
      bigImages: ["blue_big_1.png", "blue_big_2.png", "blue_big_3.png"],
      price: 30,
      quantity: 1,
    },
    polyGreen: {
      type: "polycarbonate",
      variantID: "Green Mirror",
      bigImages: ["green_big_1.png", "green_big_2.png", "green_big_3.png"],
      price: 30,
      quantity: 1,
    },
    polyrizedRed: {
      type: "polycarbonate polarized",
      variantID: "Red Mirror",
      bigImages: ["red_big_1.png", "red_big_2.png", "red_big_3.png"],
      price: 30,
      quantity: 1,
    },
    polyrizedBlue: {
      type: "polycarbonate polarized",
      variantID: "Blue Mirror",
      bigImages: ["blue_big_1.png", "blue_big_2.png", "blue_big_3.png"],
      price: 30,
      quantity: 1,
    },
    polyrizedGreen: {
      type: "polycarbonate polarized",
      variantID: "Green Mirror",
      bigImages: ["green_big_1.png", "green_big_2.png", "green_big_3.png"],
      price: 30,
      quantity: 1,
    },
    trivexRed: {
      type: "trivex &reg; performance",
      variantID: "Red Mirror",
      bigImages: ["red_big_1.png", "red_big_2.png", "red_big_3.png"],
      price: 30,
      quantity: 1,
    },
    trivexBlue: {
      type: "trivex &reg; performance",
      variantID: "Blue Mirror",
      bigImages: ["blue_big_1.png", "blue_big_2.png", "blue_big_3.png"],
      price: 30,
      quantity: 1,
    },
    trivexGreen: {
      type: "trivex &reg; performance",
      variantID: "Green Mirror",
      bigImages: ["green_big_1.png", "green_big_2.png", "green_big_3.png"],
      price: 30,
      quantity: 1,
    },
  };

  // объект с выбранным товаром для отправки на сервер
  const selected = {};
  // объект с методом post для отправки данных на сервер
  // туда же можно потом добавить метод get для получения products
  const http = httpRequest();

  const prevUL = document.getElementById("preview-ul");

  document.addEventListener("DOMContentLoaded", function () {
    prevUL.addEventListener("click", (e) => showBigPicture(e.target));
    const [...options] = document.querySelectorAll(".options");
    options.forEach((el) => {
      el.addEventListener("click", renderPreviewList);
    });

    // при клике на кнопку "добавить в корзину" - отправляем запрос на сервер
    // в качестве колбэка использую логирование в консоль В-)
    const addButton = document.getElementById("add");
    addButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (Object.keys(selected).length === 0) {
        alert("Не выбрано элементов для добавления в корзину.");
        return;
      }
      http.post(
        "https://jsonplaceholder.typicode.com/posts",
        selected,
        console.log
      );
    });
  });

  function renderPreviewList(el) {
    if (el.target.nodeName === "IMG") {
      prevUL.innerHTML = "";
      const sel = el.target.dataset.type;
      products[sel].bigImages.forEach((url) => {
        const li = `<li class="preview-item"><img src="img/${url}" alt="Preview item" /></li>`;
        prevUL.insertAdjacentHTML("beforeend", li);
      });
      showBigPicture(prevUL.firstChild.firstElementChild);
      setSelected(products[sel]);
    }
  }

  // при выборе типа очков - записывать в объект "выбранное"
  function setSelected({ type, variantID: vId, quantity: q }) {
    selected.variantID = type;
    selected.color = vId;
    selected.quantity = q;
  }

  function showBigPicture(element) {
    const bigPicture = document.getElementById("big-picture");

    if (element.nodeName === "IMG") {
      toggleClass();
      element.parentElement.classList.add("active");
      bigPicture.innerHTML = `<img src="${element.src}" alt="Preview" />`;
    } else if (element.nodeName === "LI") {
      toggleClass();
      element.classList.add("active");
      bigPicture.innerHTML = `<img src="${element.children[0].src}" alt="Preview" />`;
    }
  }

  function toggleClass() {
    const prevItem = document.querySelectorAll(".preview-item");
    for (const el of prevItem) {
      el.classList = "preview-item";
    }
  }

  // впихнул все в объект, чтоб можно было вызывать где угодно без переписывания кода
  function httpRequest() {
    return {
      post(url, body, func) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", url);
          xhr.addEventListener("load", () => {
            if (Math.floor(xhr.status / 100) !== 2) {
              func(`#${xhr.status}. ${xhr.statusText}`);
              return;
            }
            const response = JSON.parse(xhr.responseText);
            func(response);
          });
          xhr.addEventListener("error", () => {
            func(`#${xhr.status}. ${xhr.statusText}`);
          });

          xhr.setRequestHeader(
            "Content-type",
            "application/json; charset=UTF-8"
          );

          xhr.send(JSON.stringify(body));
        } catch (error) {
          func(error);
        }
      },
    };
  }
})();
