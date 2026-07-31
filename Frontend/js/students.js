/* =============================================================
   students.js  -  Students Directory Interactive Logic
   ============================================================= */

'use strict';

let pendingDeleteId = null;

async function fillCourseFilter() {
    const select = document.getElementById('courseFilter');
    if (!select) return;

    try {
        const courses = await Store.getDistinctCourses();
        select.length = 1; // Keep first default option
        courses.forEach(function (course) {
            if (course) {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                select.appendChild(option);
            }
        });
    } catch (err) {
        console.error('Error populating course filter:', err);
    }
}

async function paintTable() {
    const body = document.getElementById('studentTableBody');
    if (!body) return;

    const term   = document.getElementById('searchInput').value.trim();
    const course = document.getElementById('courseFilter').value;
    const status = document.getElementById('statusFilter').value;

    try {
        const students = await Store.getAllStudents(term, course, status);

        const countLabel = document.getElementById('resultCount');
        if (countLabel) {
            countLabel.textContent = students.length + (students.length === 1 ? ' record' : ' records');
        }

        if (students.length === 0) {
            body.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5 text-muted">
                        <i class="bi bi-search fs-1 d-block mb-2 text-muted opacity-50"></i>
                        <strong class="d-block text-dark mb-1">No matching student records</strong>
                        <small>Try clearing your search query or adjusting course/status filters.</small>
                    </td>
                </tr>
            `;
            return;
        }

        body.innerHTML = students.map(function (s) {
            const pillClass = s.status === 'Active' ? 'pill-active' : 'pill-inactive';
            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar-chip">${escapeHtml(getInitials(s.name))}</div>
                            <div>
                                <div class="fw-semibold text-dark">${escapeHtml(s.name)}</div>
                                <small class="text-muted" style="font-size:0.775rem;">${escapeHtml(s.email)}</small>
                            </div>
                        </div>
                    </td>
                    <td><span class="badge bg-light text-dark border font-monospace" style="font-size:0.8rem;">${escapeHtml(s.rollNo)}</span></td>
                    <td>${escapeHtml(s.phone)}</td>
                    <td><span class="fw-medium">${escapeHtml(s.course)}</span></td>
                    <td>${escapeHtml(s.year)}</td>
                    <td><span class="pill ${pillClass}">${escapeHtml(s.status)}</span></td>
                    <td class="text-end text-nowrap">
                        <button class="btn btn-sm btn-light border text-secondary me-1" title="View details" 
                                onclick="openViewModal(${s.id})">
                            <i class="bi bi-eye-fill"></i>
                        </button>
                        <a class="btn btn-sm btn-light border text-secondary me-1" title="Edit record" 
                           href="add-student.html?id=${s.id}">
                            <i class="bi bi-pencil-fill"></i>
                        </a>
                        <button class="btn btn-sm btn-light border text-danger" title="Remove record" 
                                onclick="openDeleteModal(${s.id})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Error rendering table:', err);
        body.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-4">Error fetching student records from server.</td></tr>`;
    }
}

async function openViewModal(id) {
    const s = await Store.getStudentById(id);
    if (!s) {
        showAlert('Student record not found.', 'danger');
        return;
    }

    const rows = [
        ['Full Name',     s.name],
        ['Roll Number',   s.rollNo],
        ['Email Address', s.email],
        ['Phone Number',  s.phone],
        ['Programme',     s.course],
        ['Academic Year', s.year],
        ['Enrolment Status', s.status]
    ];

    const body = document.getElementById('viewModalBody');
    if (!body) return;

    body.innerHTML = `
        <div class="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 bg-light border">
            <div class="avatar-chip" style="width:52px;height:52px;font-size:1.1rem;background:linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%);color:#fff;">
                ${escapeHtml(getInitials(s.name))}
            </div>
            <div>
                <div class="fw-bold text-dark fs-5">${escapeHtml(s.name)}</div>
                <span class="badge bg-secondary font-monospace">${escapeHtml(s.rollNo)}</span>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
                ${rows.map(function (row) {
                    return `
                        <tr>
                            <td class="text-muted fw-medium py-2" style="width:40%; font-size:0.85rem;">${escapeHtml(row[0])}</td>
                            <td class="fw-semibold text-dark py-2">${escapeHtml(row[1])}</td>
                        </tr>
                    `;
                }).join('')}
            </table>
        </div>
    `;

    const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    viewModal.show();
}

async function openDeleteModal(id) {
    const s = await Store.getStudentById(id);
    if (!s) return;

    pendingDeleteId = id;
    const nameEl = document.getElementById('deleteStudentName');
    if (nameEl) nameEl.textContent = s.name;

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

async function confirmDelete() {
    if (pendingDeleteId === null) return;

    const student = await Store.getStudentById(pendingDeleteId);
    const removed = await Store.deleteStudent(pendingDeleteId);

    const modalEl = document.getElementById('deleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    pendingDeleteId = null;

    if (removed) {
        await fillCourseFilter();
        await paintTable();
        showAlert(`Successfully deleted record for ${student ? student.name : 'student'}.`, 'success');
    } else {
        showAlert('Failed to delete student record.', 'danger');
    }
}

async function clearFilters() {
    document.getElementById('searchInput').value  = '';
    document.getElementById('courseFilter').value = '';
    document.getElementById('statusFilter').value = '';
    await paintTable();
}

window.openViewModal = openViewModal;
window.openDeleteModal = openDeleteModal;
window.confirmDelete = confirmDelete;
window.clearFilters = clearFilters;

document.addEventListener('DOMContentLoaded', async function () {
    if (!requireLogin()) return;
    paintSessionInfo();

    await fillCourseFilter();
    await paintTable();

    document.getElementById('searchInput').addEventListener('input', paintTable);
    document.getElementById('courseFilter').addEventListener('change', paintTable);
    document.getElementById('statusFilter').addEventListener('change', paintTable);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);

    const savedMessage = sessionStorage.getItem('sms_flash');
    if (savedMessage) {
        showAlert(savedMessage, 'success');
        sessionStorage.removeItem('sms_flash');
    }
});
