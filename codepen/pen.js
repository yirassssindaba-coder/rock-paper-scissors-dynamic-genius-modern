const $ = (id)=>document.getElementById(id);
const KEY = "rps_markov_state_v1";

const moves = ["rock","paper","scissors"];
const beats = { rock:"scissors", paper:"rock", scissors:"paper" }; // key beats value
const counter = { rock:"paper", paper:"scissors", scissors:"rock" };

function emptyMatrix(){
  const m = {};
  for (const a of moves){
    m[a] = { rock:1, paper:1, scissors:1 }; // Laplace smoothing
  }
  return m;
}

function load(){
  try { return JSON.parse(localStorage.getItem(KEY) || "null") || null; }
  catch { return null; }
}
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

let state = load() || {
  last: null,
  trans: emptyMatrix(),
  stats: { win:0, lose:0, draw:0, total:0 }
};

function predictNext(){
  if (!state.last) return "rock"; // default
  const row = state.trans[state.last];
  // pick max probability
  let best = "rock";
  for (const m of moves){
    if (row[m] > row[best]) best = m;
  }
  return best;
}

function chooseAI(){
  const predictedUser = predictNext();
  return counter[predictedUser];
}

function judge(user, ai){
  if (user === ai) return "draw";
  // user wins if user beats ai
  if (beats[user] === ai) return "win";
  return "lose";
}

function updateTrans(prev, curr){
  if (!prev) return;
  state.trans[prev][curr] = (state.trans[prev][curr] || 0) + 1;
}

function render(last){
  const s = state.stats;
  $("stats").innerHTML = `
    <div class="tile"><div class="k">Total</div><div class="v">${s.total}</div></div>
    <div class="tile"><div class="k">Win</div><div class="v">${s.win}</div></div>
    <div class="tile"><div class="k">Lose</div><div class="v">${s.lose}</div></div>
    <div class="tile"><div class="k">Draw</div><div class="v">${s.draw}</div></div>
    <div class="tile"><div class="k">Last move</div><div class="v">${state.last || "-"}</div></div>
    <div class="tile"><div class="k">Markov predicts</div><div class="v">${predictNext()}</div></div>
  `;
  $("status").innerHTML = last ? last : "Choose your move to play.";
}

function play(user){
  const ai = chooseAI();
  const result = judge(user, ai);

  // update markov transition
  updateTrans(state.last, user);

  // update stats
  state.stats.total += 1;
  state.stats[result] += 1;
  state.last = user;

  save(state);

  const msg = `You: <b>${user}</b> | AI: <b>${ai}</b> → <b>${result.toUpperCase()}</b>`;
  render(msg);
}

document.querySelectorAll(".move").forEach((btn)=>{
  btn.addEventListener("click", ()=>play(btn.dataset.m));
});

$("reset").addEventListener("click", ()=>{
  state = { last:null, trans: emptyMatrix(), stats:{win:0, lose:0, draw:0, total:0} };
  save(state);
  render("Reset done. Choose your move to play.");
});

render(null);
