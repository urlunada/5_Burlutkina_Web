let cards = [];
let isEditMode = false;
let nextId = 1;
let editingCardId = null;

function renderPage() {
  if (document.getElementById("mainContent") === null) {
    const headerElement = document.createElement("header");
    headerElement.className = "site-header";

    const h1 = document.createElement("h1");
    h1.textContent = "ManaVault";
    headerElement.appendChild(h1);

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "editModeToggle";
    toggleBtn.className = "edit-button";
    toggleBtn.type = "button";
    toggleBtn.textContent = "Редактирование";
    headerElement.appendChild(toggleBtn);

    const mainElement = document.createElement("main");
    mainElement.id = "mainContent";

    const modalDiv = document.createElement("div");
    modalDiv.id = "addCardModal";
    modalDiv.className = "modal-overlay";
    modalDiv.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>➕ Добавить новую карту</h2>
                    <button class="modal-close" type="button" id="modalCloseBtn">✕</button>
                </div>
                <form id="addCardForm" class="modal-form">
                    <div class="form-group">
                        <label for="newCardName">Название карты</label>
                        <input type="text" id="newCardName" placeholder="Введите название" required />
                    </div>
                    <div class="form-group">
                        <label for="newCardType">Тип карты</label>
                        <select id="newCardType" required>
                            <option value="" disabled selected>Выберите тип</option>
                            <option value="attack">⚔️ Атака</option>
                            <option value="defense">🛡️ Защита</option>
                            <option value="special">✨ Специальная</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newCardDesc">Описание</label>
                        <textarea id="newCardDesc" placeholder="Введите описание" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="newCardImage">Изображение (путь к файлу)</label>
                        <input type="text" id="newCardImage" placeholder="images/картинка.png" value="images/new-card.png" />
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="btn-save">💾 Создать</button>
                        <button type="button" class="btn-cancel" id="modalCancelBtn">✖️ Отмена</button>
                    </div>
                </form>
            </div>
        `;

    document.body.appendChild(headerElement);
    document.body.appendChild(mainElement);
    document.body.appendChild(modalDiv);

    setupEventListeners();
  }

  const mainContent = document.getElementById("mainContent");
  const container = document.createElement("div");
  container.className = "cards-container";

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let isEditing = false;
    if (editingCardId === card.id) {
      isEditing = true;
    }

    container.innerHTML += card.toHTML(isEditMode, isEditing);
  }

  if (isEditMode === true) {
    const addButton = document.createElement("button");
    addButton.className = "btn-add edit-only";
    addButton.textContent = "+ Добавить новую карту";
    addButton.type = "button";
    addButton.addEventListener("click", function () {
      showAddCardForm();
    });
    container.appendChild(addButton);
  }

  mainContent.innerHTML = "";
  mainContent.appendChild(container);

  const info = createInfoPanel();
  mainContent.appendChild(info);

  const toggleButton = document.getElementById("editModeToggle");
  if (isEditMode === true) {
    document.body.classList.add("edit-mode");
    toggleButton.textContent = "Выйти из редактирования";
    toggleButton.classList.add("active");
  } else {
    document.body.classList.remove("edit-mode");
    toggleButton.textContent = "Редактирование";
    toggleButton.classList.remove("active");
  }
}

function saveCard(cardId) {
  let card = null;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].id === cardId) {
      card = cards[i];
    }
  }

  const nameInput = document.getElementById("name-" + cardId);
  const descInput = document.getElementById("desc-" + cardId);
  const imageInput = document.getElementById("image-" + cardId);

  if (nameInput.value.trim() === "") {
    alert("Название карты не может быть пустым");
    return;
  }

  if (card instanceof AttackCard) {
    let attackField = document.getElementById("attack-" + cardId);
    let manaField = document.getElementById("mana-" + cardId);

    if (
      isNaN(parseInt(attackField.value)) ||
      isNaN(parseInt(manaField.value))
    ) {
      alert("Урон и мана должны быть цифиркой или числом");
      return;
    }
    card.attack = parseInt(attackField.value);
    card.manaCost = parseInt(manaField.value);
  } else if (card instanceof DefenseCard) {
    let defenseField = document.getElementById("defense-" + cardId);
    let manaField = document.getElementById("mana-" + cardId);

    if (
      isNaN(parseInt(defenseField.value)) ||
      isNaN(parseInt(manaField.value))
    ) {
      alert("Защита и мана должны быть цифиркой или числом");
      return;
    }
    card.defense = parseInt(defenseField.value);
    card.manaCost = parseInt(manaField.value);
  } else if (card instanceof SpecialCard) {
    let durationField = document.getElementById("duration-" + cardId);
    let manaField = document.getElementById("mana-" + cardId);

    if (
      isNaN(parseInt(durationField.value)) ||
      isNaN(parseInt(manaField.value))
    ) {
      alert("Длительность и мана должны быть цифиркой или числом");
      return;
    }
    card.duration = parseInt(durationField.value);
    card.manaCost = parseInt(manaField.value);
  }

  card.name = nameInput.value;
  card.description = descInput.value;
  card.imageSrc = imageInput.value;

  saveCards();
  editingCardId = null;
  renderPage();
}

function initializeDefaultCards() {
  cards.push(
    new AttackCard({
      id: nextId++,
      name: "Огненный шар",
      description: "Наносит урон всем врагам",
      imageSrc: "images/fireball.png",
      rarity: "rare",
      attack: 8,
      manaCost: 3,
    }),
  );
  cards.push(
    new AttackCard({
      id: nextId++,
      name: "Удар клинком",
      description: "Быстрая атака одним оружием",
      imageSrc: "images/strike.png",
      rarity: "common",
      attack: 5,
      manaCost: 1,
    }),
  );
  cards.push(
    new AttackCard({
      id: nextId++,
      name: "Смертельный выпад",
      description: "Критический удар",
      imageSrc: "images/deadly.png",
      rarity: "epic",
      attack: 12,
      manaCost: 2,
    }),
  );
  cards.push(
    new DefenseCard({
      id: nextId++,
      name: "Щитоносец",
      description: "Защищает союзников",
      imageSrc: "images/shield.png",
      rarity: "common",
      defense: 10,
      health: 0,
      manaCost: 2,
    }),
  );
  cards.push(
    new DefenseCard({
      id: nextId++,
      name: "Каменная кожа",
      description: "Временное укрепление кожи",
      imageSrc: "images/stone.png",
      rarity: "rare",
      defense: 6,
      health: 0,
      manaCost: 1,
    }),
  );
  cards.push(
    new DefenseCard({
      id: nextId++,
      name: "Барьер магии",
      description: "Магический защитный купол",
      imageSrc: "images/barrier.png",
      rarity: "epic",
      defense: 15,
      health: 0,
      manaCost: 3,
    }),
  );
  cards.push(
    new SpecialCard({
      id: nextId++,
      name: "Ярость берсерка",
      description: "Увеличивает урон на несколько ходов",
      imageSrc: "images/berserk.png",
      rarity: "legendary",
      effect: "Урон x2",
      duration: 3,
      manaCost: 2,
    }),
  );
  cards.push(
    new SpecialCard({
      id: nextId++,
      name: "Исцеление",
      description: "Восстанавливает здоровье",
      imageSrc: "images/heal.png",
      rarity: "common",
      effect: "Лечение",
      duration: 0,
      manaCost: 1,
    }),
  );
}

function loadCards() {
  const data = localStorage.getItem("cardCollection");
  if (data !== null) {
    const parsed = JSON.parse(data);
    for (let i = 0; i < parsed.length; i++) {
      let item = parsed[i];
      if (item.type === "AttackCard") {
        cards.push(AttackCard.fromJSON(item));
      } else if (item.type === "DefenseCard") {
        cards.push(DefenseCard.fromJSON(item));
      } else if (item.type === "SpecialCard") {
        cards.push(SpecialCard.fromJSON(item));
      } else {
        cards.push(Card.fromJSON(item));
      }
    }

    if (cards.length > 0) {
      let max = 0;
      for (let j = 0; j < cards.length; j++) {
        if (cards[j].id > max) {
          max = cards[j].id;
        }
      }
      nextId = max + 1;
    }
  } else {
    initializeDefaultCards();
  }
}

function saveCards() {
  const listToSave = [];
  for (let i = 0; i < cards.length; i++) {
    listToSave.push(cards[i].toJSON());
  }
  const jsonString = JSON.stringify(listToSave);
  localStorage.setItem("cardCollection", jsonString);
}

function createInfoPanel() {
  const aside = document.createElement("aside");
  aside.className = "info-panel";
  let modeTitle = "";
  if (isEditMode === true) {
    modeTitle = "Редактирование";
  } else {
    modeTitle = "Просмотр";
  }
  aside.innerHTML =
    "<h2>📊 Информация</h2>" +
    "<p>Всего карт: <span>" +
    cards.length +
    "</span></p>" +
    "<p>Режим: <span>" +
    modeTitle +
    "</span></p>";
  return aside;
}

function setupEventListeners() {
  const toggle = document.getElementById("editModeToggle");
  toggle.addEventListener("click", function () {
    if (isEditMode === true) {
      isEditMode = false;
    } else {
      isEditMode = true;
    }
    editingCardId = null;
    renderPage();
  });

  const form = document.getElementById("addCardForm");
  form.addEventListener("submit", handleAddCardSubmit);

  const closeBtn = document.getElementById("modalCloseBtn");
  closeBtn.addEventListener("click", function () {
    closeAddCardModal();
  });

  const cancelBtn = document.getElementById("modalCancelBtn");
  cancelBtn.addEventListener("click", function () {
    closeAddCardModal();
  });

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (target.classList.contains("btn-edit-card")) {
      editingCardId = parseInt(target.dataset.cardId);
      renderPage();
    }

    if (target.classList.contains("btn-delete-card")) {
      if (confirm("Вы точно хотите удалить эту карту?")) {
        let idToDelete = parseInt(target.dataset.cardId);
        cards = cards.filter(function (c) {
          return c.id !== idToDelete;
        });
        saveCards();
        renderPage();
      }
    }

    if (target.classList.contains("btn-save") && target.dataset.cardId) {
      saveCard(parseInt(target.dataset.cardId));
    }

    if (target.classList.contains("btn-cancel") && editingCardId !== null) {
      editingCardId = null;
      renderPage();
    }
  });
}

function showAddCardForm() {
  const modal = document.getElementById("addCardModal");
  modal.classList.add("active");
}

function closeAddCardModal() {
  const modal = document.getElementById("addCardModal");
  modal.classList.remove("active");
}

function handleAddCardSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("newCardName").value;
  const type = document.getElementById("newCardType").value;
  const desc = document.getElementById("newCardDesc").value;
  const img = document.getElementById("newCardImage").value;

  let newObj = null;
  const baseData = {
    id: nextId++,
    name: name,
    description: desc,
    imageSrc: img,
    rarity: "common",
    manaCost: 1,
  };

  if (type === "attack") {
    newObj = new AttackCard(Object.assign(baseData, { attack: 5 }));
  } else if (type === "defense") {
    newObj = new DefenseCard(
      Object.assign(baseData, { defense: 5, health: 0 }),
    );
  } else if (type === "special") {
    newObj = new SpecialCard(
      Object.assign(baseData, { effect: "Эффект", duration: 1 }),
    );
  }

  cards.push(newObj);
  saveCards();
  closeAddCardModal();
  renderPage();
}

document.addEventListener("DOMContentLoaded", function () {
  loadCards();
  renderPage();
});
