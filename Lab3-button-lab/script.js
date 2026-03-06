let count = 0;
const btn = document.getElementById("actionBtn");
const status = document.getElementById("status");

function performAction() {
  count++;
  btn.style.transform = "scale(0.95)";
  setTimeout(() => btn.style.transform = "", 100);

  if (count > 3) {
    btn.disabled = true;
    status.innerHTML = '<span style="color: red;">⚠️ Limit reached!</span>';
  } else {
    status.innerHTML = `✅ Processed ${count} time${count > 1 ? 's' : ''}`;
  }
}

btn.addEventListener("click", performAction);
