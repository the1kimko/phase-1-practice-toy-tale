let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  let addToy = false;

  // Fetch and display Andy's toys
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
        `;
        toyCollection.appendChild(card);

        // Add click event listener to the "Like" button
        card.querySelector(".like-btn").addEventListener("click", () => {
          increaseLikes(toy.id, toy.likes);
        });
      });
    })
    .catch(error => console.error(error));

  // Add a new toy
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.querySelector('[name="name"]').value;
    const image = document.querySelector('[name="image"]').value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ name, image, likes: 0 })
    })
      .then(response => response.json())
      .then(newToy => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h2>${newToy.name}</h2>
          <img src="${newToy.image}" class="toy-avatar" />
          <p>${newToy.likes} Likes</p>
          <button class="like-btn" id="${newToy.id}">Like ❤️</button>
        `;
        toyCollection.appendChild(card);

        card.querySelector(".like-btn").addEventListener("click", () => {
          increaseLikes(newToy.id, newToy.likes);
        });

        form.reset();
        toyFormContainer.style.display = "none";
        addToy = false;
      })
      .catch(error => console.error(error));
  });

  // Increase a toy's likes
  function increaseLikes(id, currentLikes) {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: currentLikes + 1 })
    })
      .then(response => response.json())
      .then(updatedToy => {
        const likeBtn = document.getElementById(`${updatedToy.id}`);
        likeBtn.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error(error));
  }
});
