const postApi = "http://localhost:3000/posts";
const commentApi = "http://localhost:3000/comments";

/* ================= POSTS ================= */

async function loadPosts() {
  const res = await fetch(postApi);
  const posts = await res.json();

  const table = document.getElementById("postTable");
  table.innerHTML = "";

  posts.forEach(p => {
    table.innerHTML += `
      <tr class="${p.isDeleted ? 'deleted' : ''}">
        <td>${p.id}</td>
        <td>${p.title}</td>
        <td>${p.views}</td>
        <td>
          ${!p.isDeleted
            ? `<button class="btn btn-danger btn-sm" onclick="softDeletePost('${p.id}')">Xoá</button>`
            : ''}
        </td>
      </tr>
    `;
  });
}

async function createPost() {
  const title = document.getElementById("titleInput").value;
  if (!title) return alert("Nhập tiêu đề");

  const res = await fetch(postApi);
  const posts = await res.json();
  const maxId = posts.length ? Math.max(...posts.map(p => Number(p.id))) : 0;

  const newPost = {
    id: String(maxId + 1),
    title,
    views: 0,
    isDeleted: false
  };

  await fetch(postApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost)
  });

  document.getElementById("titleInput").value = "";
  loadPosts();
}

async function softDeletePost(id) {
  await fetch(`${postApi}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDeleted: true })
  });
  loadPosts();
}

/* ================= COMMENTS (CRUD) ================= */

async function loadComments() {
  const res = await fetch(commentApi);
  const comments = await res.json();

  const list = document.getElementById("commentList");
  list.innerHTML = "";

  comments.forEach(c => {
    list.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        ${c.text} (Post ${c.postId})
        <div>
          <button class="btn btn-warning btn-sm" onclick="editComment('${c.id}', '${c.text}', '${c.postId}')">Sửa</button>
          <button class="btn btn-danger btn-sm" onclick="deleteComment('${c.id}')">Xoá</button>
        </div>
      </li>
    `;
  });
}

async function saveComment() {
  const text = document.getElementById("commentText").value;
  const postId = document.getElementById("commentPostId").value;
  const id = document.getElementById("commentId").value;

  if (!text || !postId) return alert("Nhập đủ thông tin");

  if (id) {
    // UPDATE
    await fetch(`${commentApi}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, postId })
    });
  } else {
    // CREATE
    const res = await fetch(commentApi);
    const comments = await res.json();
    const maxId = comments.length ? Math.max(...comments.map(c => Number(c.id))) : 0;

    await fetch(commentApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: String(maxId + 1),
        text,
        postId
      })
    });
  }

  document.getElementById("commentText").value = "";
  document.getElementById("commentPostId").value = "";
  document.getElementById("commentId").value = "";

  loadComments();
}

function editComment(id, text, postId) {
  document.getElementById("commentId").value = id;
  document.getElementById("commentText").value = text;
  document.getElementById("commentPostId").value = postId;
}

async function deleteComment(id) {
  await fetch(`${commentApi}/${id}`, { method: "DELETE" });
  loadComments();
}

loadPosts();
loadComments();
