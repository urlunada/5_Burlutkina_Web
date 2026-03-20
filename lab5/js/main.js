let cards = [];
let isEditMode = false;
let nextId = 1;
let editingCardId = null;

function renderPage() {
  const mainContent = document.getElementById("mainContent");

  const container = document.createElement("div");
  container.className = "cards-container";

  cards.forEach((card) => {
    const isEditing = editingCardId === card.id;
    container.innerHTML += card.toHTML(isEditMode, isEditing);
  });

  if (isEditMode) {
    const addButton = document.createElement("button");
    addButton.className = "btn-add edit-only";
    addButton.textContent = "+ Добавить новую карту";
    addButton.type = "button";
    addButton.addEventListener("click", showAddCardForm);
    container.appendChild(addButton);
  }

  mainContent.innerHTML = "";
  mainContent.appendChild(container);

  const infoPanel = createInfoPanel();
  mainContent.appendChild(infoPanel);

  document.body.classList.toggle("edit-mode", isEditMode);
}

function createInfoPanel() {
  const aside = document.createElement("aside");
  aside.className = "info-panel";

  const modeText = isEditMode ? "Редактирование" : "Просмотр";
  const editStatus = editingCardId ? "Активно" : "Не активно";

  aside.innerHTML = `
        <h2>📊 Информация</h2>
        <p>Всего карт: <span>${cards.length}</span></p>
        <p>Режим: <span>${modeText}</span></p>
        <p>Редактирование: <span>${editStatus}</span></p>
    `;

  return aside;
}

function loadCards() {
  const savedData = localStorage.getItem("cardCollection");

  if (savedData) {
    const parsed = JSON.parse(savedData);
    cards = parsed.map((cardData) => {
      switch (cardData.type) {
        case "AttackCard":
          return AttackCard.fromJSON(cardData);
        case "DefenseCard":
          return DefenseCard.fromJSON(cardData);
        case "SpecialCard":
          return SpecialCard.fromJSON(cardData);
        default:
          return Card.fromJSON(cardData);
      }
    });

    if (cards.length > 0) {
      nextId = Math.max(...cards.map((c) => c.id)) + 1;
    }
  } else {
    initializeDefaultCards();
  }
}

function saveCards() {
  const data = cards.map((card) => card.toJSON());
  localStorage.setItem("cardCollection", JSON.stringify(data));
}

function initializeDefaultCards() {
  cards = [
    new AttackCard({
      id: nextId++,
      name: "Огненный шар",
      description: "Наносит урон всем врагам",
      imageSrc: "images/fireball.png",
      rarity: "rare",
      attack: 8,
      manaCost: 3,
    }),
    new AttackCard({
      id: nextId++,
      name: "Удар клинком",
      description: "Быстрая атака одним оружием",
      imageSrc: "images/strike.png",
      rarity: "common",
      attack: 5,
      manaCost: 1,
    }),
    new AttackCard({
      id: nextId++,
      name: "Смертельный выпад",
      description: "Критический удар в уязвимое место",
      imageSrc: "images/deadly.png",
      rarity: "epic",
      attack: 12,
      manaCost: 2,
    }),

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
  ];
}

function startEditCard(cardId) {
  editingCardId = cardId;
  renderPage();

  setTimeout(() => {
    const cardElement = document.getElementById(`card-${cardId}`);
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
}

function cancelEdit() {
  editingCardId = null;
  renderPage();
}

function saveCard(cardId) {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;

  const nameInput = document.getElementById(`name-${cardId}`);
  const descInput = document.getElementById(`desc-${cardId}`);
  const imageInput = document.getElementById(`image-${cardId}`);

  card.name = nameInput.value;
  card.description = descInput.value;
  card.imageSrc = imageInput.value;

  if (card instanceof AttackCard) {
    const attackInput = document.getElementById(`attack-${cardId}`);
    const manaInput = document.getElementById(`mana-${cardId}`);
    card.attack = parseInt(attackInput.value);
    card.manaCost = parseInt(manaInput.value);
  } else if (card instanceof DefenseCard) {
    const defenseInput = document.getElementById(`defense-${cardId}`);
    const manaInput = document.getElementById(`mana-${cardId}`);
    card.defense = parseInt(defenseInput.value);
    card.manaCost = parseInt(manaInput.value);
  } else if (card instanceof SpecialCard) {
    const durationInput = document.getElementById(`duration-${cardId}`);
    const manaInput = document.getElementById(`mana-${cardId}`);
    card.duration = parseInt(durationInput.value);
    card.manaCost = parseInt(manaInput.value);
  }

  saveCards();
  editingCardId = null;
  renderPage();
}

function deleteCard(cardId) {
  if (confirm("Вы уверены, что хотите удалить эту карту?")) {
    cards = cards.filter((c) => c.id !== cardId);
    saveCards();
    renderPage();
  }
}

function showAddCardForm() {
  const modal = document.getElementById("addCardModal");
  modal.classList.add("active");

  setTimeout(() => {
    document.getElementById("newCardName").focus();
  }, 100);
}

function closeAddCardModal() {
  const modal = document.getElementById("addCardModal");
  modal.classList.remove("active");

  document.getElementById("addCardForm").reset();
}

document.addEventListener("DOMContentLoaded", () => {
  loadCards();
  renderPage();
  setupEventListeners();
});

function handleAddCardSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("newCardName").value.trim();
  const type = document.getElementById("newCardType").value;
  const description = document.getElementById("newCardDesc").value.trim();
  const imageSrc = document.getElementById("newCardImage").value.trim();

  if (!name || !type) {
    alert("Заполните название и выберите тип карты!");
    return;
  }

  let newCard;

  switch (type) {
    case "attack":
      newCard = new AttackCard({
        id: nextId++,
        name: name,
        description: description || "Новая атакующая карта",
        imageSrc: imageSrc || "images/new-card.png",
        rarity: "common",
        attack: 5,
        manaCost: 1,
      });
      break;
    case "defense":
      newCard = new DefenseCard({
        id: nextId++,
        name: name,
        description: description || "Новая защитная карта",
        imageSrc: imageSrc || "images/new-card.png",
        rarity: "common",
        defense: 5,
        health: 0,
        manaCost: 1,
      });
      break;
    case "special":
      newCard = new SpecialCard({
        id: nextId++,
        name: name,
        description: description || "Новая специальная карта",
        imageSrc: imageSrc || "images/new-card.png",
        rarity: "common",
        effect: "Новый эффект",
        duration: 1,
        manaCost: 1,
      });
      break;
  }

  cards.push(newCard);
  saveCards();
  renderPage();
  closeAddCardModal();

  setTimeout(() => {
    const newCardElement = document.getElementById(`card-${newCard.id}`);
    if (newCardElement) {
      newCardElement.scrollIntoView({ behavior: "smooth", block: "center" });
      startEditCard(newCard.id);
    }
  }, 100);
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  editingCardId = null;

  const button = document.getElementById("editModeToggle");

  button.classList.toggle("active", isEditMode);
  button.textContent = isEditMode
    ? "Выйти из редактирования"
    : "Редактирование";

  renderPage();
}

function setupEventListeners() {
  const editButton = document.getElementById("editModeToggle");
  if (editButton) {
    editButton.addEventListener("click", toggleEditMode);
  }

  const addCardForm = document.getElementById("addCardForm");
  if (addCardForm) {
    addCardForm.addEventListener("submit", handleAddCardSubmit);
  }

  const modalCloseBtn = document.getElementById("modalCloseBtn");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeAddCardModal);
  }

  const modalCancelBtn = document.getElementById("modalCancelBtn");
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", closeAddCardModal);
  }

  const modal = document.getElementById("addCardModal");
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeAddCardModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("active")) {
        closeAddCardModal();
      }
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("btn-edit-card")) {
      const cardId = parseInt(target.dataset.cardId);
      startEditCard(cardId);
      return;
    }

    if (target.classList.contains("btn-delete-card")) {
      const cardId = parseInt(target.dataset.cardId);
      deleteCard(cardId);
      return;
    }

    if (target.classList.contains("btn-save")) {
      const cardId = parseInt(target.dataset.cardId);
      saveCard(cardId);
      return;
    }

    if (target.classList.contains("btn-cancel")) {
      cancelEdit();
      return;
    }
  });
}
