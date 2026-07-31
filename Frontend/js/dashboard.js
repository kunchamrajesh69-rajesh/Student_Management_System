/* =============================================================
   dashboard.js  -  Dashboard Interactive Logic
   ============================================================= */

'use strict';

async function paintStats() {
    try {
        const stats = await Store.getStats();
        document.getElementById('statTotal').textContent    = stats.total || 0;
        document.getElementById('statActive').textContent   = stats.active || 0;
        document.getElementById('statInactive').textContent = stats.inactive || 0;
        document.getElementById('statCourses').textContent  = stats.courses || 0;
    } catch (err) {
        console.error('Error fetching statistics:', err);
    }
}

async function paintRecentStudents() {
    const body = document.getElementById('recentTableBody');
    if (!body) return;

    try {
        const recent = await Store.getRecentStudents();

        if (!recent || recent.length === 0) {
            body.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        <i class="bi bi-folder2-open fs-2 d-block mb-1 text-muted"></i>
                        <strong>No student records found</strong><br>
                        <small>Click "Add Student" to register the first entry.</small>
                    </td>
                </tr>
            `;
            return;
        }

        body.innerHTML = recent.map(function (s) {
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
                    <td>${escapeHtml(s.course)}</td>
                    <td>${escapeHtml(s.year)}</td>
                    <td><span class="pill ${pillClass}">${escapeHtml(s.status)}</span></td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Error rendering recent students:', err);
        body.innerHTML = `<tr><td colspan="5" class="text-danger text-center py-3">Error loading recent records.</td></tr>`;
    }
}

async function paintCourseBreakdown() {
    const holder = document.getElementById('courseBreakdown');
    if (!holder) return;

    try {
        const students = await Store.getAllStudents();

        if (!students || students.length === 0) {
            holder.innerHTML = '<p class="text-muted mb-0" style="font-size:0.85rem;">No course data available.</p>';
            return;
        }

        const counts = {};
        students.forEach(function (s) {
            if (s.course) {
                counts[s.course] = (counts[s.course] || 0) + 1;
            }
        });

        const total = students.length;

        holder.innerHTML = Object.keys(counts)
            .sort((a, b) => counts[b] - counts[a])
            .map(function (course) {
                const count   = counts[course];
                const percent = Math.round((count / total) * 100);
                return `
                    <div class="mb-3">
                        <div class="d-flex justify-content-between mb-1" style="font-size:0.85rem;">
                            <span class="fw-medium text-dark">${escapeHtml(course)}</span>
                            <span class="text-muted fw-bold">${count} <small style="font-weight:normal;">(${percent}%)</small></span>
                        </div>
                        <div class="progress" style="height:6px; border-radius:10px; background-color:#e2e8f0;">
                            <div class="progress-bar" role="progressbar" 
                                 style="width:${percent}%; background: linear-gradient(90deg, var(--primary) 0%, #06b6d4 100%); border-radius:10px;" 
                                 aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                `;
            }).join('');
    } catch (err) {
        console.error('Error loading course breakdown:', err);
        holder.innerHTML = '<p class="text-danger mb-0" style="font-size:0.85rem;">Unable to load course analytics.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    if (!requireLogin()) return;
    paintSessionInfo();
    await paintStats();
    await paintRecentStudents();
    await paintCourseBreakdown();
});
