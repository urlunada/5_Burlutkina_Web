class DefenseCard extends Card {
  #defense;
  #health;
  #manaCost;

  constructor({
    id,
    name,
    description,
    imageSrc,
    rarity,
    defense,
    health,
    manaCost,
  }) {
    super({ id, name, description, imageSrc, rarity });
    this.#defense = defense;
    this.#health = health;
    this.#manaCost = manaCost;
  }

  get defense() {
    return this.#defense;
  }
  get health() {
    return this.#health;
  }
  get manaCost() {
    return this.#manaCost;
  }
  set defense(value) {
    this.#defense = value;
  }
  set health(value) {
    this.#health = value;
  }
  set manaCost(value) {
    this.#manaCost = value;
  }

  getType() {
    return "Защита";
  }

  getStatsHTML() {
    return `
      <div class="stat">
        <span class="stat-icon">🛡️</span>
        <span class="stat-value">Блок: ${this.#defense}</span>
      </div>
      <div class="mana-cost">
        <span>⚡</span> ${this.#manaCost}
      </div>
    `;
  }

  getEditFormHTML() {
    return `
      <div class="edit-form">
        <h4 class="edit-form-title defense">✏️ Редактировать карту</h4>
        <div class="form-group">
          <label for="name-${this.id}">Название карты</label>
          <input type="text" id="name-${this.id}" value="${this.name}" required>
        </div>
        <div class="form-group">
          <label for="type-${this.id}">Тип карты</label>
          <select id="type-${this.id}" disabled>
            <option value="attack">Атака</option>
            <option value="defense" selected>Защита</option>
            <option value="special">Специальная</option>
          </select>
        </div>
        <div class="form-group">
          <label for="mana-${this.id}">Стоимость</label>
          <input type="number" id="mana-${this.id}" value="${this.#manaCost}" min="0">
        </div>
        <div class="form-group">
          <label for="desc-${this.id}">Описание</label>
          <textarea id="desc-${this.id}">${this.description}</textarea>
        </div>
        <div class="form-group">
          <label for="defense-${this.id}">Блок</label>
          <input type="number" id="defense-${this.id}" value="${this.#defense}" min="0">
        </div>
        <div class="form-group">
          <label for="image-${this.id}">Изображение (путь к файлу)</label>
          <input type="text" id="image-${this.id}" value="${this.imageSrc}">
        </div>
        <div class="action-buttons">
          <button class="btn-save" data-action="save" data-card-id="${this.id}">💾 Сохранить</button>
          <button class="btn-cancel" data-action="cancel">✖️ Отмена</button>
        </div>
      </div>
    `;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      defense: this.#defense,
      health: this.#health,
      manaCost: this.#manaCost,
    };
  }

  static fromJSON(data) {
    return new DefenseCard(data);
  }
}
