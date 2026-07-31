/* =============================================================
   add-student.js  -  Student Registration & Edit Form Handler
   ============================================================= */

'use strict';

let editingId = null;

function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
    }
    const errEl = document.getElementById(fieldId + 'Error');
    if (errEl) {
        errEl.textContent = message;
    }
}

function clearAllErrors() {
    document.querySelectorAll('.is-invalid').forEach(function (el) {
        el.classList.remove('is-invalid');
    });
}

async function validateForm(data) {
    let isValid = true;

    // Name
    if (!data.name) {
        setFieldError('name', 'Full name is required.');
        isValid = false;
    } else if (data.name.length < 3) {
        setFieldError('name', 'Name must be at least 3 characters.');
        isValid = false;
    } else if (!/^[A-Za-z .'-]+$/.test(data.name)) {
        setFieldError('name', 'Name can contain only letters, spaces, and hyphens.');
        isValid = false;
    }

    // Roll number
    if (!data.rollNo) {
        setFieldError('rollNo', 'Roll number is required.');
        isValid = false;
    } else if (!/^[A-Za-z0-9-]+$/.test(data.rollNo)) {
        setFieldError('rollNo', 'Roll number can contain letters, numbers, and hyphens.');
        isValid = false;
    } else if (await Store.isRollNoTaken(data.rollNo, editingId)) {
        setFieldError('rollNo', 'This roll number is already registered to another student.');
        isValid = false;
    }

    // Email
    if (!data.email) {
        setFieldError('email', 'Email address is required.');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
        setFieldError('email', 'Enter a valid email address.');
        isValid = false;
    }

    // Phone
    if (!data.phone) {
        setFieldError('phone', 'Phone number is required.');
        isValid = false;
    } else if (!/^[0-9]{10}$/.test(data.phone)) {
        setFieldError('phone', 'Phone number must be exactly 10 digits.');
        isValid = false;
    }

    // Course and year
    if (!data.course) {
        setFieldError('course', 'Please select a programme / course.');
        isValid = false;
    }
    if (!data.year) {
        setFieldError('year', 'Please select an academic year.');
        isValid = false;
    }

    return isValid;
}

function readForm() {
    const statusRadio = document.querySelector('input[name="status"]:checked');
    return {
        name:   document.getElementById('name').value.trim(),
        rollNo: document.getElementById('rollNo').value.trim(),
        email:  document.getElementById('email').value.trim(),
        phone:  document.getElementById('phone').value.trim(),
        course: document.getElementById('course').value,
        year:   document.getElementById('year').value,
        status: statusRadio ? statusRadio.value : 'Active'
    };
}

function fillForm(student) {
    if (!student) return;
    document.getElementById('name').value   = student.name || '';
    document.getElementById('rollNo').value = student.rollNo || student.rollNumber || '';
    document.getElementById('email').value  = student.email || '';
    document.getElementById('phone').value  = student.phone || '';
    document.getElementById('course').value = student.course || '';

    const yearSelect = document.getElementById('year');
    if (student.year) {
        const valStr = String(student.year);
        let matched = false;
        for (let i = 0; i < yearSelect.options.length; i++) {
            if (yearSelect.options[i].value === valStr || yearSelect.options[i].value.startsWith(valStr.charAt(0))) {
                yearSelect.selectedIndex = i;
                matched = true;
                break;
            }
        }
        if (!matched) yearSelect.value = valStr;
    }

    if (student.status === 'Inactive') {
        document.getElementById('statusInactive').checked = true;
    } else {
        document.getElementById('statusActive').checked = true;
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    clearAllErrors();
    const data = readForm();

    const isValid = await validateForm(data);
    if (!isValid) {
        showAlert('Please correct the highlighted input fields.', 'danger');
        return;
    }

    try {
        if (editingId === null) {
            await Store.addStudent(data);
            sessionStorage.setItem('sms_flash', `Successfully registered student ${data.name}.`);
        } else {
            await Store.updateStudent(editingId, data);
            sessionStorage.setItem('sms_flash', `Successfully updated record for ${data.name}.`);
        }
        window.location.href = 'students.html';
    } catch (err) {
        console.error('Error saving student:', err);
        showAlert(err.message || 'Server error while saving student record.', 'danger');
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    if (!requireLogin()) return;
    paintSessionInfo();

    const idFromUrl = new URLSearchParams(window.location.search).get('id');

    if (idFromUrl) {
        const student = await Store.getStudentById(idFromUrl);

        if (student) {
            editingId = Number(idFromUrl);
            fillForm(student);

            document.getElementById('formTitle').textContent = 'Edit Student Profile';
            document.getElementById('formSubtitle').textContent = `Update information for ${student.name}.`;
            document.getElementById('submitBtn').innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Update Changes`;
            document.title = 'Edit Student | Student Management System';
        } else {
            showAlert('Student record not found.', 'warning');
        }
    }

    document.getElementById('studentForm').addEventListener('submit', handleSubmit);

    document.getElementById('resetBtn').addEventListener('click', function () {
        document.getElementById('studentForm').reset();
        clearAllErrors();
    });

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }
});
