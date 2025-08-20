let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editIndex = null;
let sortOrder = {};

const form = document.getElementById("employeeForm");
const basicBody = document.querySelector("#basicTable tbody");
const advancedTable = document.getElementById("advancedTable");
const advancedBody = document.querySelector("#advancedTable tbody");
const today = new Date().toISOString().split("T")[0];
document.getElementById("dob").setAttribute("max", today);

// Render Basic Table
function renderTable() {
    basicBody.innerHTML = "";
    employees.forEach((emp, index) => {
        let row = `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.gender}</td>
                <td>${emp.dob}</td>
                <td>${emp.email}</td>
                <td>${emp.phone || ""}</td>
                <td>${emp.hobbies || ""}</td>
                <td>
                    <button class="action-btn edit" onclick="editEmployee(${index})">Edit</button>
                    <button class="action-btn delete" onclick="deleteEmployee(${index})">Delete</button>
                </td>
            </tr>
        `;
        basicBody.innerHTML += row;
    });
    fillAdvancedTable();
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

// Add or Update Employee
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const gender = document.querySelector("input[name='gender']:checked").value;
    const dob = document.getElementById("dob").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const hobbies = Array.from(document.querySelectorAll("input[name='hobbies']:checked"))
        .map(cb => cb.value)
        .join(", ");

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    // DOB validation
    if (new Date(dob) > new Date()) {
        alert("Date of Birth cannot be in the future.");
        return;
    }

    const employee = { name, gender, dob, email, phone, hobbies };

    if (editIndex === null) {
        employees.push(employee);
    } else {
        employees[editIndex] = employee;
        editIndex = null;
    }

    saveToLocalStorage();
    renderTable();
    form.reset();
});

// Edit Employee
function editEmployee(index) {
    const emp = employees[index];
    document.getElementById("name").value = emp.name;
    document.querySelector(`input[name='gender'][value='${emp.gender}']`).checked = true;
    document.getElementById("dob").value = emp.dob;
    document.getElementById("email").value = emp.email;
    document.getElementById("phone").value = emp.phone;
    document.querySelectorAll("input[name='hobbies']").forEach(cb => {
        cb.checked = emp.hobbies && emp.hobbies.split(", ").includes(cb.value);
    });
    editIndex = index;
}

// Delete Employee
function deleteEmployee(index) {
    if (confirm("Are you sure you want to delete this employee?")) {
        employees.splice(index, 1);
        saveToLocalStorage();
        renderTable();
    }
}

// Fill Advanced Table
function fillAdvancedTable() {
    let rows = document.querySelectorAll("#basicTable tbody tr");
    advancedBody.innerHTML = "";

    const headers = ["Name", "Gender", "DOB", "Email", "Phone", "Hobbies", "Actions"];

    headers.forEach((header, colIndex) => {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.textContent = header;
        tr.appendChild(th);

        rows.forEach(row => {
            let td = document.createElement("td");
            td.innerHTML = row.children[colIndex]?.innerHTML || "";
            tr.appendChild(td);
        });

        advancedBody.appendChild(tr);
    });
}
renderTable();