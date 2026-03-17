/**
 * @file cookie.js
 * @description Модуль для работы с cookie и localStorage
 * @version 1.0
 * @author Студент
 *
 * @functions
 * setCookie(name, value, days) - установить cookie
 * getCookie(name) - получить cookie
 * deleteCookie(name) - удалить cookie
 * saveData(name, value, days) - универсальное сохранение (cookie + localStorage)
 * getData(name) - универсальное получение (localStorage + cookie)
 */

/**
 * Установить cookie
 * @param {string} name - имя cookie
 * @param {string} value - значение cookie
 * @param {number} days - срок хранения в днях
 * @returns {boolean} успешно ли сохранено
 */
function setCookie(name, value, days) {
  try {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/";
    return true;
  } catch (e) {
    console.error("setCookie ошибка:", e);
    return false;
  }
}

/**
 * Получить cookie
 * @param {string} name - имя cookie
 * @returns {string|null}
 */
function getCookie(name) {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  } catch (e) {
    console.error("getCookie ошибка:", e);
    return null;
  }
}

/**
 * Удалить cookie
 * @param {string} name - имя cookie
 */
function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

/**
 * Сохранить в localStorage
 * @param {string} name - имя
 * @param {string} value - значение
 * @returns {boolean}
 */

function setStorage(name, value) {
  try {
    localStorage.setItem("lab4_" + name, value);
    return true;
  } catch (e) {
    console.error("localStorage ошибка:", e);
    return false;
  }
}

/**
 * Получить из localStorage
 * @param {string} name - имя
 * @returns {string|null}
 */

function getStorage(name) {
  try {
    return localStorage.getItem("lab4_" + name);
  } catch (e) {
    console.error("localStorage ошибка:", e);
    return null;
  }
}

/**
 * Универсальное сохранение
 * @param {string} name - имя
 * @param {string} value - значение
 * @param {number} days - дней
 * @returns {boolean}
 */

function saveData(name, value, days) {
  const cookieSaved = setCookie(name, value, days);
  localStorage.setItem("lab4_" + name, value);
  return cookieSaved;
}

/**
 * Универсальное получение
 * @param {string} name - имя
 * @returns {string|null}
 */

function getData(name) {
  let data = getStorage(name);

  if (data) {
    return data;
  }

  data = getCookie(name);
  if (data) {
    setStorage(name, data);
  }

  return data;
}

function clearLabData() {
  deleteCookie("reviews");
  deleteCookie("theme");
  localStorage.removeItem("lab4_reviews");
  localStorage.removeItem("lab4_theme");
}
