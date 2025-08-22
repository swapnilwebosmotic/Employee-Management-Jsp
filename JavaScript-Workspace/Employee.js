let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editIndex = null;

const form = document.getElementById("employeeForm");
const basicBody = document.querySelector("#employeeTableBasic tbody");

// Form Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const gender = document.querySelector("input[name='gender']:checked")?.value;
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const hobbies = Array.from(
    document.querySelectorAll("input[name='hobbies']:checked")
  ).map((h) => h.value);

  if (!validateForm(name, gender, dob, email, phone)) return;

  const employee = { name, gender, dob, email, phone, hobbies };

  if (editIndex !== null) {
    console.log("Editing employee at index:", editIndex, employee);
    employees[editIndex] = employee;
    updateTableRow(editIndex, employee);
    editIndex = null;
  } else {
    console.log("Adding new employee:", employee);
    employees.push(employee);
    addTableRow(employees.length - 1, employee);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  form.reset();
  document.querySelector("input[name='gender'][value='Male']").checked = true;
});

// Basic Table
const addTableRow = (index, emp) => {
  console.log("Adding row in Basic Table:", index, emp.name);
  basicBody.appendChild(createBasicRow(index, emp));
  addAdvancedRow(emp, index); // only append
};

const updateTableRow = (index, emp) => {
  console.log("Updating row in Basic Table:", index, emp.name);
  const row = basicBody.querySelector(`tr[data-index="${index}"]`);
  if (row) row.outerHTML = createBasicRow(index, emp).outerHTML;
  updateAdvancedRow(emp, index); // only update
};

const createBasicRow = (index, emp) => {
  const tr = document.createElement("tr");
  tr.dataset.index = index;
  tr.innerHTML = `
    <td>${emp.name}</td>
    <td>${emp.gender}</td>
    <td>${emp.dob}</td>
    <td>${emp.email}</td>
    <td>${emp.phone}</td>
    <td>${
      Array.isArray(emp.hobbies) ? emp.hobbies.join(", ") : emp.hobbies || ""
    }</td>
    <td>
      <button onclick="editEmployee(${index})">Edit</button>
      <button onclick="deleteEmployee(${index})">Delete</button>
    </td>
  `;
  return tr;
};

// Advanced Table
const addAdvancedRow = (emp, index) => {
  console.log("Adding row in Advanced Table:", index, emp.name);
  const tbody = document.querySelector("#employeeTableAdvanced tbody");

  // If advanced table is empty, create rows once
  if (!tbody.querySelector("tr")) {
    const fields = [
      "Name",
      "Gender",
      "DOB",
      "Email",
      "Phone",
      "Hobbies",
      "Action",
    ];
    fields.forEach((label) => {
      const tr = document.createElement("tr");
      tr.dataset.label = label;
      tr.innerHTML = `<th>${label}</th>`;
      tbody.appendChild(tr);
    });
  }

  // Append a cell for this employee to each row
  tbody
    .querySelector('[data-label="Name"]')
    .insertAdjacentHTML("beforeend", `<td>${emp.name}</td>`);
  tbody
    .querySelector('[data-label="Gender"]')
    .insertAdjacentHTML("beforeend", `<td>${emp.gender}</td>`);
  tbody
    .querySelector('[data-label="DOB"]')
    .insertAdjacentHTML("beforeend", `<td>${emp.dob}</td>`);
  tbody
    .querySelector('[data-label="Email"]')
    .insertAdjacentHTML("beforeend", `<td>${emp.email}</td>`);
  tbody
    .querySelector('[data-label="Phone"]')
    .insertAdjacentHTML("beforeend", `<td>${emp.phone}</td>`);
  tbody
    .querySelector('[data-label="Hobbies"]')
    .insertAdjacentHTML("beforeend", `<td>${emp.hobbies.join(", ")}</td>`);
  tbody.querySelector('[data-label="Action"]').insertAdjacentHTML(
    "beforeend",
    `
    <td>
      <button onclick="editEmployee(${index})">Edit</button>
      <button onclick="deleteEmployee(${index})">Delete</button>
    </td>
  `
  );
};

const updateAdvancedRow = (emp, index) => {
  console.log("Updating row in Advanced Table:", index, emp.name);
  const tbody = document.querySelector("#employeeTableAdvanced tbody");
  tbody.querySelector('[data-label="Name"]').children[index + 1].textContent =
    emp.name;
  tbody.querySelector('[data-label="Gender"]').children[index + 1].textContent =
    emp.gender;
  tbody.querySelector('[data-label="DOB"]').children[index + 1].textContent =
    emp.dob;
  tbody.querySelector('[data-label="Email"]').children[index + 1].textContent =
    emp.email;
  tbody.querySelector('[data-label="Phone"]').children[index + 1].textContent =
    emp.phone;
  tbody.querySelector('[data-label="Hobbies"]').children[
    index + 1
  ].textContent = emp.hobbies.join(", ");
  tbody.querySelector('[data-label="Action"]').children[index + 1].innerHTML = `
    <button onclick="editEmployee(${index})">Edit</button>
    <button onclick="deleteEmployee(${index})">Delete</button>
  `;
};

const deleteAdvancedRow = (index) => {
  console.log("Deleting row in Advanced Table:", index);
  const tbody = document.querySelector("#employeeTableAdvanced tbody");
  tbody.querySelectorAll("tr").forEach((tr) => {
    const cell = tr.children[index + 1]; // +1 because [0] is <th>
    if (cell) cell.remove();
  });
};

const reindexAdvancedRows = () => {
  const tbody = document.querySelector("#employeeTableAdvanced tbody");
  tbody
    .querySelector('[data-label="Action"]')
    .querySelectorAll("td")
    .forEach((cell, idx) => {
      cell.innerHTML = `
      <button onclick="editEmployee(${idx})">Edit</button>
      <button onclick="deleteEmployee(${idx})">Delete</button>
    `;
    });
};

// CRUD
window.editEmployee = (index) => {
  console.log("Editing employee at index:", index);
  const emp = employees[index];
  document.getElementById("name").value = emp.name;
  document.querySelector(
    `input[name='gender'][value='${emp.gender}']`
  ).checked = true;
  document.getElementById("dob").value = emp.dob;
  document.getElementById("email").value = emp.email;
  document.getElementById("phone").value = emp.phone;

  document.querySelectorAll("input[name='hobbies']").forEach((cb) => {
    cb.checked = emp.hobbies.includes(cb.value);
  });

  editIndex = index;
};

window.deleteEmployee = (index) => {
  employees.splice(index, 1);
  localStorage.setItem("employees", JSON.stringify(employees));

  // Basic table
  const row = basicBody.querySelector(`tr[data-index="${index}"]`);
  if (row) row.remove();
  reindexRows();

  // Advanced table
  deleteAdvancedRow(index);
  reindexAdvancedRows();
};

const reindexRows = () => {
  employees.forEach((_, idx) => {
    const row = basicBody.querySelector(`tr:nth-child(${idx + 1})`);
    if (row) {
      row.dataset.index = idx;
      const [editBtn, delBtn] = row.querySelectorAll("button");
      editBtn.setAttribute("onclick", `editEmployee(${idx})`);
      delBtn.setAttribute("onclick", `deleteEmployee(${idx})`);
    }
  });
};

// Validation
const validateForm = (name, gender, dob, email, phone) => {
  let valid = true;

  const setError = (id, msg) => (document.getElementById(id).textContent = msg);

  if (!/^[a-zA-Z0-9 ]{4,20}$/.test(name)) {
    setError("nameError", "Name must be 4-20 alphanumeric characters");
    valid = false;
  } else setError("nameError", "");

  if (!gender || !["Male", "Female"].includes(gender)) {
    setError("genderError", "Please select Male or Female");
    valid = false;
  } else setError("genderError", "");

  if (!dob) {
    setError("dobError", "Date of Birth is required");
    valid = false;
  } else {
    const dobDate = new Date(dob);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(dobDate)) {
      setError("dobError", "Invalid date format");
      valid = false;
    } else if (dobDate > today) {
      setError("dobError", "Future dates are not allowed");
      valid = false;
    } else setError("dobError", "");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("emailError", "Enter a valid email address");
    valid = false;
  } else setError("emailError", "");

  if (!/^[0-9]{10}$/.test(phone)) {
    setError("phoneError", "Enter a valid 10-digit phone number");
    valid = false;
  } else setError("phoneError", "");

  return valid;
};

// Init
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dob").setAttribute("max", today);
  employees.forEach((emp, idx) => addTableRow(idx, emp));
});
