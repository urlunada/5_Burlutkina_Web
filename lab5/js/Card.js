class Card {
  #id;
  #name;
  #description;
  #imageSrc;
  #rarity;

  constructor({ id, name, description, imageSrc, rarity = "common" }) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#imageSrc = imageSrc;
    this.#rarity = rarity;
  }

  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get description() {
    return this.#description;
  }
  get imageSrc() {
    return this.#imageSrc;
  }
  get rarity() {
    return this.#rarity;
  }

  set name(value) {
    this.#name = value;
  }
  set description(value) {
    this.#description = value;
  }
  set imageSrc(value) {
    this.#imageSrc = value;
  }
  set rarity(value) {
    this.#rarity = value;
  }

  isValidImageUrl(url) {
    if (!url || typeof url !== "string") {
      return false;
    }
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const hasValidExtension = validExtensions.some((ext) =>
      url.toLowerCase().includes(ext),
    );
    return hasValidExtension || url.startsWith("data:image/");
  }

  getSafeImageUrl() {
    if (this.isValidImageUrl(this.#imageSrc)) {
      return this.#imageSrc;
    }
    return "images/default-card(муд_сейчас🤍✨).png";
  }

  toHTML(isEditMode = false, isEditing = false) {
    const safeImageSrc = this.getSafeImageUrl();
    return `
      <article class="card ${this.constructor.name.toLowerCase()} ${isEditing ? "editing" : ""}" data-id="${this.#id}" id="card-${this.#id}">
        <img src="${safeImageSrc}" alt="${this.#name}" class="card-image"
        onerror="this.onerror=null; this.src='images/default-card(муд_сейчас🤍✨).png'; this.classList.add('image-error');"
        onload="this.classList.add('image-loaded');"
        >
        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title view-only">${this.#name}</h3>
            <span class="card-type view-only">${this.getType()}</span>
          </div>
          <p class="card-description view-only">${this.#description}</p>
          
          <div class="card-stats view-only">
            ${this.getStatsHTML()}
          </div>

          ${isEditMode && !isEditing ? this.getEditButtonsHTML() : ""}
          ${isEditing ? this.getEditFormHTML() : ""}
        </div>
      </article>
    `;
  }

  getType() {
    return "Карта";
  }

  getStatsHTML() {
    return "";
  }

  getEditButtonsHTML() {
    return `
      <div class="card-edit-buttons edit-only">
        <button class="btn-edit-card" data-action="edit" data-card-id="${this.#id}">✏️ Редактировать</button>
        <button class="btn-delete-card" data-action="delete" data-card-id="${this.#id}">🗑️ Удалить</button>
      </div>
    `;
  }

  getEditFormHTML() {
    return `
      <div class="edit-form">
        <h4 class="edit-form-title">✏️ Редактировать карту</h4>
        <div class="form-group">
          <label for="name-${this.#id}">Название карты</label>
          <input type="text" id="name-${this.#id}" value="${this.#name}" required>
        </div>
        <div class="form-group">
          <label for="desc-${this.#id}">Описание</label>
          <textarea id="desc-${this.#id}">${this.#description}</textarea>
        </div>
        <div class="form-group">
          <label for="image-${this.#id}">Изображение (путь к файлу)</label>
          <input type="text" id="image-${this.#id}" value="${this.#imageSrc}">
        </div>
        <div class="form-group">
          <label for="rarity-${this.#id}">Редкость</label>
          <select id="rarity-${this.#id}">
            <option value="common" ${this.#rarity === "common" ? "selected" : ""}>Обычная</option>
            <option value="rare" ${this.#rarity === "rare" ? "selected" : ""}>Редкая</option>
            <option value="epic" ${this.#rarity === "epic" ? "selected" : ""}>Эпическая</option>
            <option value="legendary" ${this.#rarity === "legendary" ? "selected" : ""}>Легендарная</option>
          </select>
        </div>
        <div class="action-buttons">
          <button class="btn-save" data-action="save" data-card-id="${this.#id}">💾 Сохранить</button>
          <button class="btn-cancel" data-action="cancel">✖️ Отмена</button>
        </div>
      </div>
    `;
  }

  toJSON() {
    return {
      type: this.constructor.name,
      id: this.#id,
      name: this.#name,
      description: this.#description,
      imageSrc: this.#imageSrc,
      rarity: this.#rarity,
    };
  }

  static fromJSON(data) {
    return new Card(data);
  }
}
