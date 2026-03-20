class AttackCard extends Card {
  #attack;
  #manaCost;

  constructor({ id, name, description, imageSrc, rarity, attack, manaCost }) {
    super({ id, name, description, imageSrc, rarity });
    this.#attack = attack;
    this.#manaCost = manaCost;
  }

  get attack() {
    return this.#attack;
  }
  get manaCost() {
    return this.#manaCost;
  }
  set attack(value) {
    this.#attack = value;
  }
  set manaCost(value) {
    this.#manaCost = value;
  }

  getType() {
    return "Атака";
  }

  getStatsHTML() {
    return `
      <div class="stat">
        <span class="stat-icon">⚔️</span>
        <span class="stat-value">Урон: ${this.#attack}</span>
      </div>
      <div class="mana-cost">
        <span>⚡</span> ${this.#manaCost}
      </div>
    `;
  }

  getEditFormHTML() {
    return `
      <div class="edit-form">
        <h4 class="edit-form-title attack">✏️ Редактировать карту</h4>
        <div class="form-group">
          <label for="name-${this.id}">Название карты</label>
          <input type="text" id="name-${this.id}" value="${this.name}" required>
        </div>
        <div class="form-group">
          <label for="type-${this.id}">Тип карты</label>
          <select id="type-${this.id}" disabled>
            <option value="attack" selected>Атака</option>
            <option value="defense">Защита</option>
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
          <label for="attack-${this.id}">Урон</label>
          <input type="number" id="attack-${this.id}" value="${this.#attack}" min="0">
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
      attack: this.#attack,
      manaCost: this.#manaCost,
    };
  }

  static fromJSON(data) {
    return new AttackCard(data);
  }
}
