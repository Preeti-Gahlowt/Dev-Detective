const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const reposList = document.getElementById("repos");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchUser(input.value.trim());
  }
});

async function fetchUser(username) {
  if (!username) return;

  loading.classList.remove("hidden");
  error.classList.add("hidden");
  profile.classList.add("hidden");

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("User Not Found");
    }

    const data = await response.json();
    displayUser(data);
    fetchRepos(data.repos_url);

  } catch (err) {
    error.textContent = err.message;
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function displayUser(user) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || "No Name";
  document.getElementById("bio").textContent = user.bio || "No Bio Available";
  document.getElementById("date").textContent =
    "Joined: " + formatDate(user.created_at);
  document.getElementById("portfolio").href = user.html_url;

  profile.classList.remove("hidden");
}

async function fetchRepos(url) {
  reposList.innerHTML = "";

  const res = await fetch(`${url}?sort=created&per_page=5`);
  const repos = await res.json();

  repos.forEach(repo => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = repo.html_url;
    a.target = "_blank";
    a.textContent = repo.name;

    li.appendChild(a);
    reposList.appendChild(li);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
