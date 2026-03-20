class SpecialCard extends Card {
  #effect;
  #duration;
  #manaCost;

  constructor({
    id,
    name,
    description,
    imageSrc,
    rarity,
    effect,
    duration,
    manaCost,
  }) {
    super({ id, name, description, imageSrc, rarity });
    this.#effect = effect;
    this.#duration = duration;
    this.#manaCost = manaCost;
  }

  get effect() {
    return this.#effect;
  }
  get duration() {
    return this.#duration;
  }
  get manaCost() {
    return this.#manaCost;
  }
  set effect(value) {
    this.#effect = value;
  }
  set duration(value) {
    this.#duration = value;
  }
  set manaCost(value) {
    this.#manaCost = value;
  }

  getType() {
    return "Специальная";
  }

  getStatsHTML() {
    return `
      <div class="stat">
        <span class="stat-icon">✨</span>
        <span class="stat-value">Ходов: ${this.#duration}</span>
      </div>
      <div class="mana-cost">
        <span>⚡</span> ${this.#manaCost}
      </div>
    `;
  }

  getEditFormHTML() {
    return `
      <div class="edit-form">
        <h4 class="edit-form-title special">✏️ Редактировать карту</h4>
        <div class="form-group">
          <label for="name-${this.id}">Название карты</label>
          <input type="text" id="name-${this.id}" value="${this.name}" required>
        </div>
        <div class="form-group">
          <label for="type-${this.id}">Тип карты</label>
          <select id="type-${this.id}" disabled>
            <option value="attack">Атака</option>
            <option value="defense">Защита</option>
            <option value="special" selected>Специальная</option>
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
          <label for="duration-${this.id}">Длительность (ходов)</label>
          <input type="number" id="duration-${this.id}" value="${this.#duration}" min="0">
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
      effect: this.#effect,
      duration: this.#duration,
      manaCost: this.#manaCost,
    };
  }

  static fromJSON(data) {
    return new SpecialCard(data);
  }
}
