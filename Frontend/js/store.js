/* =============================================================
   store.js  -  REST API Data Access Layer (Spring Boot Integration)
   ============================================================= */

const Store = (function () {

    'use strict';

    // Auto-detect hostname for local development or docker container environment
    const HOST = window.location.hostname || 'localhost';
    const API_BASE = `http://${HOST}:8080/api/students`;

    function formatYearString(year) {
        if (typeof year === 'number' || (typeof year === 'string' && !isNaN(year) && year.trim() !== '')) {
            const y = parseInt(year, 10);
            if (y === 1) return '1st Year';
            if (y === 2) return '2nd Year';
            if (y === 3) return '3rd Year';
            if (y === 4) return '4th Year';
            return y + 'th Year';
        }
        return String(year || '');
    }

    function parseYearInteger(yearStr) {
        if (typeof yearStr === 'number') return yearStr;
        if (!yearStr) return 1;
        const match = String(yearStr).match(/\d+/);
        return match ? parseInt(match[0], 10) : 1;
    }

    function normalizeStudent(s) {
        if (!s) return null;
        const roll = s.rollNumber || s.rollNo || '';
        return {
            id: s.id,
            name: s.name || '',
            rollNo: roll,
            rollNumber: roll,
            email: s.email || '',
            phone: s.phone || '',
            course: s.course || '',
            year: formatYearString(s.year),
            yearRaw: s.year,
            status: s.status || 'Active'
        };
    }

    function prepareForBackend(s) {
        const payload = {
            name: s.name ? s.name.trim() : '',
            rollNumber: (s.rollNo || s.rollNumber || '').trim(),
            email: s.email ? s.email.trim() : '',
            phone: s.phone ? s.phone.trim() : '',
            course: s.course ? s.course.trim() : '',
            year: parseYearInteger(s.year),
            status: s.status || 'Active'
        };
        if (s.id) {
            payload.id = Number(s.id);
        }
        return payload;
    }

    return {

        getApiBaseUrl: function () {
            return API_BASE;
        },

        getAllStudents: async function (search = '', course = '', status = '') {
            try {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (course) params.append('course', course);
                if (status) params.append('status', status);

                const queryString = params.toString() ? `?${params.toString()}` : '';
                const res = await fetch(`${API_BASE}${queryString}`);
                
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                const list = await res.json();
                return list.map(normalizeStudent);
            } catch (err) {
                console.error('API Error in getAllStudents:', err);
                return [];
            }
        },

        getRecentStudents: async function () {
            try {
                const res = await fetch(`${API_BASE}/recent`);
                if (!res.ok) return await this.getAllStudents();
                const list = await res.json();
                return list.map(normalizeStudent);
            } catch (err) {
                console.error('API Error in getRecentStudents:', err);
                const all = await this.getAllStudents();
                return all.slice(0, 5);
            }
        },

        getStudentById: async function (id) {
            try {
                const res = await fetch(`${API_BASE}/${id}`);
                if (!res.ok) return null;
                const student = await res.json();
                return normalizeStudent(student);
            } catch (err) {
                console.error(`API Error in getStudentById(${id}):`, err);
                return null;
            }
        },

        addStudent: async function (student) {
            const payload = prepareForBackend(student);
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to create student record');
            }
            const saved = await res.json();
            return normalizeStudent(saved);
        },

        updateStudent: async function (id, updated) {
            const payload = prepareForBackend(updated);
            payload.id = Number(id);
            const res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to update student record');
            }
            const saved = await res.json();
            return normalizeStudent(saved);
        },

        deleteStudent: async function (id) {
            try {
                const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
                return res.ok;
            } catch (err) {
                console.error(`API Error in deleteStudent(${id}):`, err);
                return false;
            }
        },

        isRollNoTaken: async function (rollNo, ignoreId) {
            try {
                const list = await this.getAllStudents();
                return list.some(s =>
                    s.rollNo.toUpperCase() === String(rollNo).trim().toUpperCase() &&
                    s.id !== Number(ignoreId)
                );
            } catch (err) {
                return false;
            }
        },

        getStats: async function () {
            try {
                const res = await fetch(`${API_BASE}/stats`);
                if (res.ok) {
                    return await res.json();
                }
            } catch (err) {
                console.error('API Error in getStats:', err);
            }
            const list = await this.getAllStudents();
            return {
                total: list.length,
                active: list.filter(s => s.status === 'Active').length,
                inactive: list.filter(s => s.status === 'Inactive').length,
                courses: new Set(list.map(s => s.course)).size
            };
        },

        getDistinctCourses: async function () {
            try {
                const res = await fetch(`${API_BASE}/courses`);
                if (res.ok) {
                    return await res.json();
                }
            } catch (err) {
                console.error('API Error in getDistinctCourses:', err);
            }
            const students = await this.getAllStudents();
            return [...new Set(students.map(s => s.course))].sort();
        }
    };

})();
