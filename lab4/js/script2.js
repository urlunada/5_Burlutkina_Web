const defaultReviews = [
  {
    id: 1,
    name: "Иван",
    status: "34 года, безработный",
    text: "Я купил этот носок, и теперь у меня есть носок! Это магия!",
    image: null,
  },
  {
    id: 2,
    name: "Елена",
    status: "домохозяйка",
    text: "Моя правая нога плачет от счастья, глядя на эту красоту.",
    image: null,
  },
  {
    id: 3,
    name: "Илон М.",
    status: "конкурент",
    text: "Лучшая инвестиция в моей жизни. Акции Apple упали, а носок вырос.",
    image: null,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("review-form");
  if (!form) {
    console.error('Форма не найдена, проверьте id="review-form" в HTML');
    return;
  }

  initThemeToggle();
  initReviews();
  initReviewForm();
});

function initThemeToggle() {
  const themeBtn = document.getElementById("theme-toggle");
  const body = document.body;

  if (!themeBtn) {
    console.warn("Кнопка темы не найдена");
    return;
  }

  const savedTheme = getData("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    themeBtn.textContent = "☀️";
  }

  themeBtn.addEventListener("click", function () {
    body.classList.toggle("dark-theme");

    if (body.classList.contains("dark-theme")) {
      themeBtn.textContent = "☀️";
      saveData("theme", "dark", 30);
    } else {
      themeBtn.textContent = "🌓";
      saveData("theme", "light", 30);
    }
  });
}

function initReviews() {
  let reviewsJson = getData("reviews");
  let reviews;

  if (reviewsJson) {
    try {
      reviews = JSON.parse(reviewsJson);
    } catch (e) {
      console.error("Ошибка парсинга отзывов:", e);
      reviews = [...defaultReviews];
    }
  } else {
    reviews = [...defaultReviews];
    saveReviewsToStorage(reviews);
  }

  renderReviews(reviews);
}

function renderReviews(reviews) {
  const container = document.getElementById("reviews-container");
  if (!container) {
    console.error("Контейнер отзывов не найден");
    return;
  }

  container.innerHTML = "";

  reviews.forEach(function (review) {
    const reviewEl = document.createElement("blockquote");
    reviewEl.className = "review-item";

    let html = `<p>"${escapeHtml(review.text)}"</p>`;
    html += `<cite class="otziv-author">— ${escapeHtml(review.name)}`;
    if (review.status) {
      html += `, ${escapeHtml(review.status)}`;
    }
    html += `</cite>`;

    if (review.image) {
      html += `<img src="${escapeHtml(review.image)}" alt="Фото отзыва">`;
    }

    reviewEl.innerHTML = html;
    container.appendChild(reviewEl);
  });
}

function saveReviewsToStorage(reviews) {
  try {
    const json = JSON.stringify(reviews);
    saveData("reviews", json, 30);
  } catch (e) {
    console.error("Ошибка сохранения отзывов:", e);
  }
}

function initReviewForm() {
  const form = document.getElementById("review-form");

  if (!form) {
    console.error("Форма не найдена");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      const nameInput = document.getElementById("review-name");
      const textInput = document.getElementById("review-text");
      const imageInput = document.getElementById("review-image");

      if (!nameInput || !textInput) {
        console.error("Поля формы не найдены");
        alert("Ошибка: поля формы не найдены");
        return;
      }

      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      const newReview = {
        id: Date.now(),
        name: name,
        text: text,
        image: null,
      };

      if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];

        if (file.size > 500 * 1024) {
          showError(
            "image-error",
            "Картинка слишком большая, либо уменьши, либо без фота. Макс 500KB",
          );
          return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
          newReview.image = e.target.result;
          processNewReview(newReview);
        };

        reader.onerror = function (e) {
          console.error("Ошибка чтения файла:", e);
          showError("image-error", "Ошибка чтения файла!");
        };

        reader.readAsDataURL(file);
      } else {
        processNewReview(newReview);
      }
    } catch (e) {
      console.error("Ошибка при отправке:", e);
      alert("Ошибка: " + e.message);
    }
  });
}

function processNewReview(newReview) {
  let reviewsJson = getData("reviews");
  let reviews;

  if (reviewsJson) {
    try {
      reviews = JSON.parse(reviewsJson);
    } catch (e) {
      console.error("Ошибка парсинга:", e);
      reviews = [...defaultReviews];
    }
  } else {
    reviews = [...defaultReviews];
  }

  reviews.push(newReview);
  saveReviewsToStorage(reviews);
  renderReviews(reviews);

  const form = document.getElementById("review-form");
  if (form) form.reset();
  clearErrors();

  alert(
    "Отзыв сохранён, спасибо за ваше мнение, оно для нас важно. После перезагрузки сайта он останется йоу).",
  );
}

function validateForm() {
  let isValid = true;
  clearErrors();

  const nameInput = document.getElementById("review-name");
  const textInput = document.getElementById("review-text");

  if (!nameInput || !textInput) {
    console.error("Поля формы не найдены для валидации!");
    return false;
  }

  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (name.length < 2) {
    showError("name-error", "Имя должно быть не менее 2 символов");
    isValid = false;
  }

  if (text.length < 10) {
    showError("text-error", "Отзыв должен быть не менее 10 символов");
    isValid = false;
  }

  const imageInput = document.getElementById("review-image");
  if (imageInput && imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!validTypes.includes(file.type)) {
      showError("image-error", "Допустимы только JPG, PNG, GIF, WebP");
      isValid = false;
    }
  }

  return isValid;
}

function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
  } else {
    console.warn("Элемент ошибки не найден:", elementId);
  }
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-msg");
  errors.forEach(function (el) {
    el.textContent = "";
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
