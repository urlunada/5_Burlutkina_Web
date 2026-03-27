const API_ENDPOINTS = {
  posts: "https://jsonplaceholder.typicode.com/posts",
  users: "https://jsonplaceholder.typicode.com/users",
  comments: "https://jsonplaceholder.typicode.com/comments",
};

const FALLBACK_ENDPOINTS = {
  posts: "https://my-json-server.typicode.com/typicode/demo/posts",
  users: "https://gorest.co.in/public/v2/users",
  comments: "https://jsonplaceholder.typicode.com/comments",
};

const $ = (selector) => document.querySelector(selector);

const showElement = (element) => element.classList.remove("hidden");
const hideElement = (element) => element.classList.add("hidden");

const showLoader = (section) => {
  const loader = section.querySelector(".loader");
  const error = section.querySelector(".error-message");
  const success = section.querySelector(".success-message");
  const container = section.querySelector(".data-container");

  if (loader) showElement(loader);
  if (error) hideElement(error);
  if (success) hideElement(success);
  if (container) container.innerHTML = "";
};

const hideLoader = (section) => {
  const loader = section.querySelector(".loader");
  if (loader) hideElement(loader);
};

const showError = (section, message) => {
  hideLoader(section);
  const errorEl = section.querySelector(".error-message");
  if (errorEl) {
    errorEl.textContent = `❌ Ошибка: ${message}`;
    showElement(errorEl);
  }
};

const showSuccess = (section, message) => {
  hideLoader(section);
  const successEl = section.querySelector(".success-message");
  if (successEl) {
    successEl.textContent = `✅ ${message}`;
    showElement(successEl);
  }
};

const renderPosts = (posts, container) => {
  const postList = Array.isArray(posts) ? posts : [posts];
  container.innerHTML = postList
    .slice(0, 10)
    .map(
      (post) => `
        <article class="data-card">
            <h4>${escapeHtml(post.title)}</h4>
            <p>${escapeHtml(post.body)}</p>
            <div class="meta">
                <span>ID: ${post.id}</span> | 
                <span>Автор: ${post.userId}</span>
            </div>
        </article>
    `,
    )
    .join("");
};

const renderUsers = (users, container) => {
  const userList = Array.isArray(users) ? users : [users];
  container.innerHTML = userList
    .slice(0, 10)
    .map(
      (user) => `
        <article class="data-card">
            <h4>${escapeHtml(user.name)}</h4>
            <p>Email: ${escapeHtml(user.email)}</p>
            <p>Телефон: ${escapeHtml(user.phone)}</p>
            <div class="meta">
                <span>ID: ${user.id}</span> | 
                <span>Город: ${escapeHtml(user.address?.city || "N/A")}</span>
            </div>
        </article>
    `,
    )
    .join("");
};

const renderComments = (comments, container) => {
  const commentList = Array.isArray(comments) ? comments : [comments];
  container.innerHTML = commentList
    .slice(0, 10)
    .map(
      (comment) => `
        <article class="data-card">
            <h4>${escapeHtml(comment.name)}</h4>
            <p>${escapeHtml(comment.body)}</p>
            <div class="meta">
                <span>ID: ${comment.id}</span> | 
                <span>Пост: ${comment.postId}</span>
            </div>
        </article>
    `,
    )
    .join("");
};

const escapeHtml = (text) => {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("ERR_CONNECTION_RESET")
    ) {
      throw new Error(
        "API временно недоступен. Проверьте интернет-соединение и попробуйте снова.",
      );
    }
    if (error.message.includes("timeout")) {
      throw new Error("Запрос превысил время ожидания. Попробуйте снова.");
    }
    throw error;
  }
};

const initPostsSection = () => {
  const formSection = $("#postForm");
  const form = $("#postFormElement");
  const formTitle = $("#postFormTitle");
  const submitBtn = $("#postSubmitBtn");
  const cancelBtn = $("#postCancelBtn");
  const resultSection = $("#postsResult");
  const container = resultSection.querySelector(".data-container");

  const resetForm = () => {
    form.reset();
    $("#postId").value = "";
    $("#postUserId").value = "1";
  };

  const showForm = (title, btnText, requireId) => {
    formTitle.textContent = title;
    submitBtn.textContent = btnText;

    $("#postTitle").disabled = false;
    $("#postBody").disabled = false;
    $("#postUserId").disabled = false;
    $("#postId").disabled = false;

    if (requireId) {
      $("#postId").required = true;
    } else {
      $("#postId").required = false;
      $("#postId").value = "";
      $("#postId").disabled = true;
    }
    showElement(formSection);
    showElement(cancelBtn);
  };

  $("#getPosts").addEventListener("click", async () => {
    showLoader(resultSection);
    hideElement(formSection);
    try {
      const posts = await fetchData(API_ENDPOINTS.posts);
      renderPosts(posts, container);
      showSuccess(resultSection, `Получено ${posts.length} постов`);
    } catch (error) {
      showError(resultSection, error.message);
    }
  });

  $("#createPost").addEventListener("click", () => {
    resetForm();
    showForm("Создать пост", "Создать", false);
    form.dataset.action = "create";
  });

  $("#updatePost").addEventListener("click", () => {
    resetForm();
    showForm("Обновить пост", "Обновить", true);
    form.dataset.action = "put";
  });

  $("#patchPost").addEventListener("click", () => {
    resetForm();
    showForm("Частично обновить пост", "Обновить", true);
    $("#postBody").disabled = true;
    $("#postUserId").disabled = true;
    form.dataset.action = "patch";
  });

  $("#deletePost").addEventListener("click", () => {
    resetForm();
    showForm("Удалить пост", "Удалить", true);
    $("#postTitle").disabled = true;
    $("#postBody").disabled = true;
    $("#postUserId").disabled = true;
    form.dataset.action = "delete";
  });

  cancelBtn.addEventListener("click", () => {
    hideElement(formSection);
    hideElement(cancelBtn);
    resetForm();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader(resultSection);

    const action = form.dataset.action || "create";
    const postId = $("#postId").value;
    const formData = {
      title: $("#postTitle").value,
      body: $("#postBody").value,
      userId: parseInt($("#postUserId").value),
    };

    try {
      let result;
      if (action === "create") {
        result = await fetchData(API_ENDPOINTS.posts, {
          method: "POST",
          body: JSON.stringify(formData),
        });
        renderPosts([result], container);
        showSuccess(resultSection, "Пост успешно создан!");
      } else if (action === "put") {
        if (!postId) throw new Error("Укажите ID поста");
        result = await fetchData(`${API_ENDPOINTS.posts}/${postId}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
        renderPosts([result], container);
        showSuccess(resultSection, "Пост успешно обновлён!");
      } else if (action === "patch") {
        if (!postId) throw new Error("Укажите ID поста");
        const patchData = { title: formData.title };
        result = await fetchData(`${API_ENDPOINTS.posts}/${postId}`, {
          method: "PATCH",
          body: JSON.stringify(patchData),
        });
        renderPosts([result], container);
        showSuccess(resultSection, "Пост частично обновлён (PATCH)!");
      } else if (action === "delete") {
        if (!postId) throw new Error("Укажите ID поста");
        await fetchData(`${API_ENDPOINTS.posts}/${postId}`, {
          method: "DELETE",
        });
        showSuccess(resultSection, `Пост #${postId} успешно удалён!`);
      }
      hideElement(formSection);
      hideElement(cancelBtn);
      resetForm();
    } catch (error) {
      showError(resultSection, error.message);
    }
  });
};

const initUsersSection = () => {
  const resultSection = $("#usersResult");
  const container = resultSection.querySelector(".data-container");

  $("#getUsers").addEventListener("click", async () => {
    showLoader(resultSection);
    try {
      const users = await fetchData(API_ENDPOINTS.users);
      renderUsers(users, container);
      showSuccess(resultSection, `Получено ${users.length} пользователей`);
    } catch (error) {
      showError(resultSection, error.message);
    }
  });
};

const initCommentsSection = () => {
  const formSection = $("#commentForm");
  const form = $("#commentFormElement");
  const cancelBtn = $("#commentCancelBtn");
  const resultSection = $("#commentsResult");
  const container = resultSection.querySelector(".data-container");

  $("#getComments").addEventListener("click", async () => {
    showLoader(resultSection);
    hideElement(formSection);
    try {
      const comments = await fetchData(`${API_ENDPOINTS.comments}?postId=1`);
      renderComments(comments, container);
      showSuccess(resultSection, `Получено ${comments.length} комментариев`);
    } catch (error) {
      showError(resultSection, error.message);
    }
  });

  $("#deleteComment").addEventListener("click", () => {
    showElement(formSection);
    showElement(cancelBtn);
  });

  cancelBtn.addEventListener("click", () => {
    hideElement(formSection);
    form.reset();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader(resultSection);

    const commentId = $("#commentId").value;

    try {
      await fetchData(`${API_ENDPOINTS.comments}/${commentId}`, {
        method: "DELETE",
      });
      showSuccess(resultSection, `Комментарий #${commentId} успешно удалён!`);
      hideElement(formSection);
      form.reset();
    } catch (error) {
      showError(resultSection, error.message);
    }
  });
};

const initPromiseAllDemo = () => {
  const loadAllBtn = $("#loadAll");
  const resultSection = $("#promiseResult");
  const container = resultSection.querySelector(".data-container");

  loadAllBtn.addEventListener("click", async () => {
    showLoader(resultSection);

    try {
      const [posts, users, comments] = await Promise.all([
        fetch(API_ENDPOINTS.posts).then((r) => r.json()),
        fetch(API_ENDPOINTS.users).then((r) => r.json()),
        fetch(`${API_ENDPOINTS.comments}?postId=1`).then((r) => r.json()),
      ]);

      container.innerHTML = `
                <article class="data-card">
                    <h4>📌 Посты</h4>
                    <p>Загружено: ${posts.length}</p>
                </article>
                <article class="data-card">
                    <h4>👥 Пользователи</h4>
                    <p>Загружено: ${users.length}</p>
                </article>
                <article class="data-card">
                    <h4>💬 Комментарии</h4>
                    <p>Загружено: ${comments.length}</p>
                </article>
            `;

      showSuccess(resultSection, "Все данные загружены параллельно!");
    } catch (error) {
      showError(resultSection, error.message);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initPostsSection();
  initUsersSection();
  initCommentsSection();
  initPromiseAllDemo();

  console.log("🚀 Лабораторная работа №6 инициализирована");
  console.log("📡 Используемые API:", API_ENDPOINTS);
});
