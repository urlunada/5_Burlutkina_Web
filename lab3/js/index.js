const questions = [
  {
    question: "С какой планеты прилетел Маленький принц?",
    answer: "Б-612",
    alternatives: ["Б-612", "А-123", "В-512"],
  },
  {
    question: "Кто научил Маленького принца дружбе?",
    answer: "Лис",
    alternatives: ["Лис", "Котик", "Роза"],
  },
  {
    question: "Что оставил Маленький принц на своей планете?",
    answer: "Розу",
    alternatives: ["Розу", "Кактус", "Шарф"],
  },
  {
    question: "Где встретил лётчик Маленького принца?",
    answer: "Сахара",
    alternatives: ["Сахара", "WB", "Амазония"],
  },
  {
    question: "Какая фраза принадлежит Лису?",
    answer: "Зорко одно лишь сердце, самого главного глазами не увидишь",
    alternatives: [
      "Зорко одно лишь сердце, самого главного глазами не увидишь",
      "Ты навсегда в ответе за всех, кого приручил",
      "И снится вам не рокот космодромааа, когда вы кот и на диване домаааа",
    ],
  },
  {
    question: "Сколько раз Маленький принц закатывал солнце?",
    answer: "43",
    alternatives: ["43", "52 да здравствует...", "101"],
  },
  {
    question: "Что едят баобабы?",
    answer: "Ничего, это растения",
    alternatives: ["Ничего, это растения", "Маленьких принцев", "Розы"],
  },
];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const funnyMessages = {
  perfect: [
    "👑 БОГ! ТЫ ЧИТАЛ КНИГУ ПОД МИКРОСКОПОМ!",
    "👑 Твой результат заставил бы автора плакать от счастья!",
    "🌹 САМА РОЗА БЫ ГОРДИЛАСЬ ТОБОЙ!",
  ],
  excellent: [
    "🦊 Почти идеально! Лис бы тобой гордился!",
    "💫 Ты видишь сердцем! (Ну почти всё)",
    "🦊 Лис шепчет: «Ты приручил эту викторину!»",
  ],
  good: [
    "🌹 Неплохо! Но Роза бы сказала: «Можно лучше»",
    "🌳 Твёрдая четвёрка! Баобабы не захватили твой мозг!",
    "💫 Ты на правильном пути, маленький принц!",
  ],
  average: [
    "🌳 Ну... хотя бы ты не баобаб!",
    "🦊 Роза бы поплакала, но Лис бы поддержал!",
    "🌳 Баобабы начинают захватывать твою планету...",
  ],
  bad: [
    "💀💀💀 ТЫ ЧИТАЛ ОПИСАНИЕ НА ОБЛОЖКЕ?!",
    "🙈🙈🙈 Маленький принц в шоке! Срочно перечитывай!",
    "🌳🌳🌳 Твоя планета уже захвачена баобабами!",
  ],
  disaster: [
    "💔💔💔 КАТАСТРОФА! Лис удалился в закат!",
    "🌹💔 Роза умерла от стыда за твой результат!",
    "💔 ВСЕ БАОБАБЫ ТВОЕЙ ПЛАНЕТЫ ПРАЗДНУЮТ!",
  ],
};

function startGame() {
  const wantToPlay = confirm(
    "Добро пожаловать в викторину по «Маленькому принцу»!\n\n" +
      "Вас ждёт 7 вопросов на знание книги.\n" +
      "🦊 Лис уже готовится оценивать твои знания!\n\n" +
      "Нажмите ОК чтобы начать, или Отмена чтобы выйти.",
  );

  if (!wantToPlay) {
    const sadMessages = [
      "Жаль, лис уже расстроился...",
      "Роза плачет в углу... 🥀",
    ];
    alert(sadMessages[Math.floor(Math.random() * sadMessages.length)]);
    return;
  }

  let score = 0;
  let currentQuestion = 0;

  while (currentQuestion < questions.length) {
    const q = questions[currentQuestion];

    const shuffledAlternatives = shuffleArray(q.alternatives);

    let promptText =
      `Вопрос ${currentQuestion + 1} из ${questions.length}\n\n` +
      `${q.question}\n\n` +
      `Варианты:\n`;

    shuffledAlternatives.forEach((alt, index) => {
      promptText += `  ${index + 1}. ${alt}\n`;
    });

    promptText += "\nВведите номер правильного ответа (1-3):";

    const userAnswer = prompt(promptText);

    if (userAnswer === null) {
      const quitConfirm = confirm(
        "Вы нажали «Отмена»!\n\n" +
          `Текущий счёт: ${score} из ${currentQuestion}\n\n` +
          "Хотите завершить игру?(",
      );

      if (quitConfirm) {
        endGame(score, questions.length, true);
        return;
      } else {
        continue;
      }
    }

    if (userAnswer.trim() === "") {
      alert("⚠️ Пустой ответ не принимается, лис недоволен🦊");
      continue;
    }

    const answerNumber = parseInt(userAnswer.trim(), 10);

    if (isNaN(answerNumber)) {
      alert("⚠️ Это не число, баобабы путают твои мысли");
      continue;
    }

    if (answerNumber < 1 || answerNumber > 3) {
      alert("⚠️ Число должно быть от 1 до 3");
      continue;
    }

    const selectedAnswer = shuffledAlternatives[answerNumber - 1];

    if (selectedAnswer === q.answer) {
      score++;
      const happyMessages = [
        "Правильно, лис доволен! 🦊",
        "Верно, роза цветёт от радости! 🌹",
        "Отлично, звёзды сияют ярче! ✨",
      ];
      alert(happyMessages[Math.floor(Math.random() * happyMessages.length)]);
    } else {
      const sadMessages = [
        `❌ Правильный ответ: ${q.answer}`,
        "Лис грустит, но верит в тебя🦊",
      ];
      alert(sadMessages[Math.floor(Math.random() * sadMessages.length)]);
    }

    currentQuestion++;
  }

  endGame(score, questions.length, false);
}

function endGame(score, total, quitEarly) {
  let message = "Игра завершена\n\n";

  if (quitEarly) {
    message += "Вы вышли досрочно.\n";
  }

  message += `Ваш счёт: ${score} из ${total}\n`;
  message += `Процент: ${Math.round((score / total) * 100)}%\n\n`;

  const percentage = (score / total) * 100;
  const possibleResults = [
    {
      predicate: () => percentage === 100,
      title: "ИДЕАЛЬНО!",
      messages: funnyMessages.perfect,
    },
    {
      predicate: () => percentage >= 85,
      title: "ОТЛИЧНО!",
      messages: funnyMessages.excellent,
    },
    {
      predicate: () => percentage >= 70,
      title: "ХОРОШО!",
      messages: funnyMessages.good,
    },
    {
      predicate: () => percentage >= 50,
      title: "+- ГУД",
      messages: funnyMessages.average,
    },
    {
      predicate: () => percentage >= 30,
      title: "ПЛОХОВАТО",
      messages: funnyMessages.bad,
    },
    {
      predicate: () => percentage < 30,
      title: "ИДИ ЧИТАЙ",
      messages: funnyMessages.disaster,
    },
  ];

  let title = "";
  let messages = [];

  for (const result of possibleResults) {
    if (result.predicate()) {
      title = result.title;
      messages = result.messages;
      break;
    }
  }

  message += `${title}\n\n`;
  message += `${messages[Math.floor(Math.random() * messages.length)]}\n\n`;

  message += "💡 Совет: ";
  if (percentage < 70) {
    message += "Перечитай «Маленького принца», оно того стоит!";
  }

  alert(message);

  const playAgain = confirm("🎮 Хотите сыграть ещё раз?");
  if (playAgain) {
    alert("Запускаем повторно, удачки ✨");
    startGame();
  } else {
    const endings = [
      "Спасибо за игру, лис машет хвостиком 🦊💛",
      "Заходи ещё, роза будет ждать 🌹",
      "До встречи! Помни: зорко одно лишь сердце! ❤️",
    ];
    alert(endings[Math.floor(Math.random() * endings.length)]);
  }
}
