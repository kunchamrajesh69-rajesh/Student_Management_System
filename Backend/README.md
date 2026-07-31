# Student Management System — Backend (Phase 2)

REST API for the Student Management System, built with **Java + Spring Boot +
MySQL**, exactly as described in the project abstract. It provides the
endpoints the Phase 1 frontend was designed to call.

**Author:** *&lt;Your Name&gt;*
**Course / Batch:** *&lt;Your Batch&gt;*
**Stack:** Java 17 · Spring Boot 3.3 · Spring Data JPA · MySQL · Maven

---

## 1. What it does

A three-layer backend — Controller → Service → Repository — that stores student
records in a database and exposes them over a REST API. It covers every
operation in the abstract: add, view, update, delete, search and admin login.

---

## 2. The 8 backend steps → where each one lives

The problem statement lists eight backend steps. This is where each is done:

| # | Step | In this project |
| --- | --- | --- |
| 1 | Setup environment | JDK 17 + Maven (see *How to run* below) |
| 2 | Initialize project | Maven project (`pom.xml`), Git (`.gitignore`) |
| 3 | Set up the server | `StudentManagementApplication.java` — Spring Boot on port 8080 |
| 4 | Define routes | `controller/StudentController.java`, `controller/AuthController.java` — RESTful GET/POST/PUT/DELETE |
| 5 | Connect to database | `application.properties` + `repository/StudentRepository.java` (Spring Data JPA) |
| 6 | Create models & schemas | `model/Student.java` — JPA entity with validation annotations |
| 7 | Implement business logic | `service/StudentService.java` + `service/StudentServiceImpl.java`, `controller/AuthController.java` |
| 8 | Handle requests & responses | `exception/GlobalExceptionHandler.java`, `middleware/RequestLoggingFilter.java`, `config/CorsConfig.java` |

---

## 3. Folder structure

```
Student_Management_System_Backend/
├── pom.xml                     Maven build file and dependencies
├── README.md
├── .gitignore
└── src/main/
    ├── java/com/studentmanagement/
    │   ├── StudentManagementApplication.java   Server entry point (Step 3)
    │   ├── model/Student.java                  Entity + validation (Step 6)
    │   ├── repository/StudentRepository.java   Database access (Step 5)
    │   ├── service/StudentService.java         Business-logic contract (Step 7)
    │   ├── service/StudentServiceImpl.java     Business logic (Step 7)
    │   ├── controller/StudentController.java   Student routes (Steps 4, 8)
    │   ├── controller/AuthController.java       Login route (Step 7)
    │   ├── dto/LoginRequest.java               Login request object
    │   ├── exception/                          Custom errors + global handler (Step 8)
    │   ├── config/CorsConfig.java              CORS for the frontend (Step 8)
    │   ├── config/DataSeeder.java              Sample data on first run
    │   └── middleware/RequestLoggingFilter.java  Request logging (Step 8)
    └── resources/
        ├── application.properties              MySQL configuration (Step 5)
        └── application-h2.properties           No-setup H2 alternative
```

---

## 4. How to run

### Step 1 — install the tools
- **JDK 17 or newer** — check with `java -version`
- **Maven** — check with `mvn -version`
  (or open the folder in IntelliJ IDEA / VS Code, which can run it for you)

### Option A — run with MySQL (matches the abstract)
1. Start MySQL and create the database:
   ```sql
   CREATE DATABASE student_management;
   ```
2. Open `src/main/resources/application.properties` and set your MySQL
   `username` and `password`.
3. From the project folder:
   ```bash
   mvn spring-boot:run
   ```

Hibernate creates the `student` table automatically from the entity, and the
sample students are inserted on first run.

### Option B — run without installing MySQL (quick test / grading)
Uses an in-memory H2 database, no setup at all:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
Browse the data at `http://localhost:8080/h2-console`
(JDBC URL `jdbc:h2:mem:sms`, user `sa`, empty password).

Either way, the API is then live at **http://localhost:8080**.

---

## 5. API endpoints

Base URL: `http://localhost:8080`

| Method | Path | Purpose | Success code |
| --- | --- | --- | --- |
| GET | `/api/students` | List all students | 200 |
| GET | `/api/students?search=aarav` | Search name / roll / email / course | 200 |
| GET | `/api/students/{id}` | Get one student | 200 |
| GET | `/api/students/stats` | Dashboard counts | 200 |
| POST | `/api/students` | Create a student | 201 |
| PUT | `/api/students/{id}` | Update a student | 200 |
| DELETE | `/api/students/{id}` | Delete a student | 200 |
| POST | `/api/auth/login` | Admin login (`admin` / `admin123`) | 200 |

These paths match the calls the Phase 1 frontend already makes, so connecting
the two only means pointing the frontend's `store.js` at this base URL.

### Quick test with curl

```bash
# list
curl http://localhost:8080/api/students

# create
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","rollNumber":"24CV900","email":"test@college.edu","phone":"9998887776","course":"Civil","year":2,"status":"Active"}'

# login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 6. The Student record

| Field | Type | Rule |
| --- | --- | --- |
| id | Long | Auto-generated primary key |
| name | String | 3–60 chars, letters and spaces |
| rollNumber | String | 3–20 letters/numbers/hyphens, **unique** |
| email | String | Valid email format |
| phone | String | Exactly 10 digits |
| course | String | Required |
| year | Integer | 1 to 4 |
| status | String | `Active` or `Inactive` |

Validation runs automatically on every create and update. A bad request
returns **400** with a `fieldErrors` object naming each problem field; a
duplicate roll number returns **409**; a missing id returns **404**.

---

## 7. Testing done

- The core business logic (validation rules, roll-number uniqueness on create
  and update, not-found handling, case normalisation, and the search filter)
  was verified with a standalone Java test harness — **23 checks, all passing**.
- All endpoints were exercised with curl against the running application.
- Every source file compiles cleanly with `mvn clean package`.

---

## 8. How this connects to Phase 1 (frontend)

The Phase 1 frontend currently stores data in the browser through `js/store.js`.
Each function there maps to one endpoint above, so connecting the two only
means replacing the body of those functions with a `fetch()` call:

```js
// Phase 1 (browser storage)          // Phase 2 (this API)
Store.getAll()          ->  fetch('http://localhost:8080/api/students')
Store.add(student)      ->  fetch('.../api/students', { method:'POST', body: JSON.stringify(student) })
Store.update(student)   ->  fetch('.../api/students/' + id, { method:'PUT',  ... })
Store.remove(id)        ->  fetch('.../api/students/' + id, { method:'DELETE' })
```

CORS is already enabled, so the frontend can call the API from a different port.

---

## 9. Possible next steps

1. Replace the demo login with **Spring Security** and hashed passwords + JWT.
2. Add **pagination and sorting** to the list endpoint.
3. Add **attendance and marks** modules as related tables.
4. Write **JUnit + MockMvc** integration tests for each endpoint.
