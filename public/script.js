// script.js

const urlBar = document.getElementById("url-bar");
const btnBack = document.getElementById("btn-back");
const btnForward = document.getElementById("btn-forward");
const btnReload = document.getElementById("btn-reload");
const btnSearch = document.getElementById("btn-search");
const webview = document.getElementById("webview");
const homepage = document.querySelector(".homepage");
const searchInput = document.getElementById("search-input");
const btnMainSearch = document.getElementById("btn-main-search");

const modalNotas = document.getElementById("modal-notas");
const modalPomodoro = document.getElementById("modal-pomodoro");
const btnNotas = document.getElementById("btn-notas");
const btnPomodoro = document.getElementById("btn-pomodoro");
const btnTema = document.getElementById("btn-tema");

// Webview navigation
btnBack.onclick = () => webview.goBack();
btnForward.onclick = () => webview.goForward();
btnReload.onclick = () => webview.reload();
btnSearch.onclick = () => navegar(urlBar.value);
btnMainSearch.onclick = () => navegar(searchInput.value);

function navegar(query) {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
  let url = query.trim();
  if (!urlRegex.test(url)) {
    url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  } else if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  // fallback para DuckDuckGo
  webview.src = url;
  webview.style.display = "flex";
  homepage.style.display = "none";
  urlBar.value = url;
}

// Atalhos
window.openURL = (url) => navegar(url);

// Tema claro/escuro
btnTema.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "tema",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
};

window.onload = () => {
  if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
  }
  const notasSalvas = localStorage.getItem("notas");
  if (notasSalvas) document.getElementById("notas").value = notasSalvas;
};

// Bloco de notas
btnNotas.onclick = () => (modalNotas.style.display = "block");
function salvarNotas() {
  const texto = document.getElementById("notas").value;
  localStorage.setItem("notas", texto);
  modalNotas.style.display = "none";
}
function descartarNotas() {
  modalNotas.style.display = "none";
}

// Pomodoro
let timer = null;
let tempoRestante = 0;
let emEstudo = true;

btnPomodoro.onclick = () => (modalPomodoro.style.display = "block");

function iniciarPomodoro() {
  const estudo = parseInt(document.getElementById("tempo-estudo").value) * 60;
  const pausa = parseInt(document.getElementById("tempo-pausa").value) * 60;
  tempoRestante = emEstudo ? estudo : pausa;
  atualizarTimer();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    tempoRestante--;
    if (tempoRestante <= 0) {
      clearInterval(timer);
      emEstudo = !emEstudo;
      alert(emEstudo ? "Hora de estudar!" : "Hora de descansar!");
      iniciarPomodoro();
    }
    atualizarTimer();
  }, 1000);
}

function pararPomodoro() {
  clearInterval(timer);
  document.getElementById("timer").textContent = "00:00";
}

function atualizarTimer() {
  const min = String(Math.floor(tempoRestante / 60)).padStart(2, "0");
  const sec = String(tempoRestante % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

// Tecla Enter nas buscas
urlBar.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && navegar(urlBar.value),
);
searchInput.addEventListener(
  "keydown",
  (e) => e.key === "Enter" && navegar(searchInput.value),
);
