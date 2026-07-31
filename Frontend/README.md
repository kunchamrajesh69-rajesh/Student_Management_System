# Student Management System — Frontend (Phase 1)

A web-based admin interface for managing student records in an educational
institution. This submission covers **Phase 1: the frontend only**. The
Spring Boot backend and MySQL database will be connected in the next phase.

---

## 1. What this frontend does

| Feature | Where | Status |
|---|---|---|
| Admin login with validation | `index.html` | Working |
| Dashboard with record statistics | `dashboard.html` | Working |
| View all student records | `students.html` | Working |
| Search by name, roll number or email | `students.html` | Working |
| Filter by course and status | `students.html` | Working |
| View full details of one student | `students.html` (modal) | Working |
| Add a new student | `add-student.html` | Working |
| Update an existing student | `add-student.html?id=N` | Working |
| Delete a student with confirmation | `students.html` (modal) | Working |
| Session guard on protected pages | `js/auth.js` | Working |

---

## 2. Folder structure

```
Student_Management_System_Frontend/
│
├── index.html            Login page (entry point)
├── dashboard.html        Statistics and recent records
├── students.html         Student list with search, filters and actions
├── add-student.html      Form used for both adding and editing
│
├── css/
│   └── style.css         All custom styling on top of Bootstrap
│
├── js/
│   ├── store.js          Data layer — will be swapped for REST API calls
│   ├── auth.js           Login, session handling, shared helper functions
│   ├── dashboard.js      Logic for dashboard.html
│   ├── students.js       Logic for students.html
│   └── add-student.js    Logic for add-student.html
│
└── README.md             This file
```

Each page loads only the scripts it needs. `store.js` and `auth.js` are shared
by every page; the remaining files hold the logic for a single page each.

---

## 3. Technologies and libraries used

| Item | Version | Purpose | How it is loaded |
|---|---|---|---|
| HTML5 | — | Page structure | — |
| CSS3 | — | Custom theme in `css/style.css` | Local file |
| Bootstrap | 5.3.3 | Grid, forms, tables, modals, alerts | CDN |
| Bootstrap Icons | 1.11.3 | Interface icons | CDN |
| Google Fonts | — | Sora (headings), Inter (body text) | CDN |
| JavaScript | ES6 | All interactivity, no framework | Local files |

No build step, no npm packages and no bundler are required.

---

## 4. How to run it

**Option A — open directly**

1. Extract the zip folder.
2. Double-click `index.html` to open it in any modern browser.

**Option B — run on a local server (recommended)**

```bash
cd Student_Management_System_Frontend

# Python 3
python -m http.server 5500

# or with Node.js
npx serve .
```

Then open `http://localhost:5500` in the browser.

An internet connection is needed the first time, because Bootstrap, the icons
and the fonts are loaded from a CDN.

### Demo login

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |

These credentials are defined in `js/auth.js` and will be replaced by a real
login API call in Phase 2.

---

## 5. Where the data comes from

Because the backend is not connected yet, student records are kept in the
browser's `localStorage` under the key `sms_students`. Six sample records are
loaded automatically the first time the app is opened, so the interface is
never empty during a demo.

All data access goes through `js/store.js`. Every function there is written to
match a REST endpoint, so in Phase 2 only the body of each function has to
change — no page code will need to be touched:

| Function in `store.js` | Planned endpoint (Phase 2) |
|---|---|
| `getAllStudents()` | `GET /api/students` |
| `getStudentById(id)` | `GET /api/students/{id}` |
| `addStudent(student)` | `POST /api/students` |
| `updateStudent(id, data)` | `PUT /api/students/{id}` |
| `deleteStudent(id)` | `DELETE /api/students/{id}` |

To start over with fresh sample data, open the browser console and run:

```js
Store.resetToSampleData();
location.reload();
```

---

## 6. Form validation rules

Validation runs in `js/add-student.js` before anything is saved. All rules are
checked together so the user sees every problem at once.

| Field | Rule |
|---|---|
| Full name | Required, at least 3 characters, letters/spaces/dots only |
| Roll number | Required, letters and numbers only, must be unique |
| Email | Required, must be a valid email format |
| Phone | Required, exactly 10 digits (non-digits are blocked while typing) |
| Course | Required, chosen from the dropdown |
| Year | Required, chosen from the dropdown |

---

## 7. Testing performed

| Test | Result |
|---|---|
| Login with correct credentials | Redirects to the dashboard |
| Login with wrong credentials | Shows an error, stays on the page |
| Login with empty fields | Shows an error, no request sent |
| Opening a protected page without logging in | Redirects back to login |
| Adding a valid student | Record appears in the list and the statistics update |
| Adding a duplicate roll number | Blocked with a message on the field |
| Adding a 9-digit phone number | Blocked with a message on the field |
| Editing a record | Existing values load, changes are saved |
| Deleting a record | Confirmation dialog appears, record is removed |
| Searching a name that does not exist | Empty-state message is shown |
| Filtering by course and status together | Both filters apply at the same time |
| Sign out then pressing the back button | Returns to the login page |
| Layout at 375 px, 768 px and 1440 px widths | No overflow, all controls reachable |

---

## 8. Design and accessibility notes

- The colour palette, spacing and radius values are defined once as CSS
  variables at the top of `style.css`, so the whole theme can be re-skinned
  from a single block.
- Sora is used for headings and Inter for body text, giving the numbers on the
  dashboard a distinct look from the surrounding labels.
- The sidebar collapses into a horizontal bar under 768 px and the login screen
  drops its branding panel under 992 px.
- Keyboard focus is always visible, modals use Bootstrap's built-in focus trap,
  and `prefers-reduced-motion` is respected.
- All values coming from the data store pass through `escapeHtml()` before they
  are inserted into the page, so text typed into a form can never be executed
  as HTML.

---

## 9. Planned for Phase 2

- Replace the `localStorage` calls in `store.js` with `fetch()` calls to the
  Spring Boot REST API.
- Replace the hard-coded login with a real authentication endpoint and token.
- Add attendance and marks modules.
- Add pagination and sorting to the student table for large record sets.

---

**Project:** Student Management System
**Phase:** 1 — Frontend Development
**Stack:** HTML, CSS, Bootstrap 5, JavaScript (frontend) · Java, Spring Boot, MySQL (planned backend)
