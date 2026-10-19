const commands = [
  {
    tool: "Git",
    name: "Clone Repository",
    cmd: "git clone <repo-url>",
    desc: "Clone a remote repository to your local machine."
  },
  {
    tool: "Git",
    name: "Check Status",
    cmd: "git status -s",
    desc: "Display modified, staged, and untracked files in a short format."
  },
  {
    tool: "Docker",
    name: "Run Container",
    cmd: "docker run -d -p 80:80 nginx",
    desc: "Run an Nginx web server container in detached mode mapped to port 80."
  },
  {
    tool: "Docker",
    name: "List Running Containers",
    cmd: "docker ps",
    desc: "List all currently running Docker containers on the host system."
  },
  {
    tool: "Kubernetes",
    name: "Get Pods",
    cmd: "kubectl get pods -A",
    desc: "List all Kubernetes pods across all namespaces."
  },
  {
    tool: "Kubernetes",
    name: "Stream Pod Logs",
    cmd: "kubectl logs -f <pod-name>",
    desc: "Stream and tail real-time log output from a specified pod."
  }
];

function renderCards(list) {
  const container = document.getElementById("commandContainer");
  if (!container) return;

  container.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "command-card";

    card.innerHTML = `
      <div class="card-header">
        <span class="tool-tag">${item.tool}</span>
      </div>
      <h3 class="card-title">${item.name}</h3>
      <p class="card-desc">${item.desc}</p>
      <div class="code-box">
        <code>${item.cmd}</code>
        <button class="copy-btn" type="button">Copy</button>
      </div>
    `;

    const copyBtn = card.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(item.cmd).then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 1500);
        }).catch((err) => {
          console.error("Failed to copy command:", err);
        });
      });
    }

    container.appendChild(card);
  });
}

// Initial call on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCards(commands);
});

// Also trigger immediately if DOM is already parsed
if (document.readyState === "complete" || document.readyState === "interactive") {
  renderCards(commands);
}
