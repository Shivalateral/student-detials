const express = require('express');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;

// In-memory storage for simplicity
const students = [];

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Get student data
app.get('/api/students', (req, res) => {
    console.log('Fetching students');
    res.json(students);
});

// Add new students
app.post('/api/students', (req, res) => {
    const newStudents = req.body.students;  // Expecting an array of student objects

    console.log('Request Body:', req.body);
    console.log('Received Students:', newStudents);

    if (Array.isArray(newStudents) && newStudents.length > 0) {
        newStudents.forEach(student => {
            const { name, age } = student;
            if (name && age) {
                students.push({ name, age });
                console.log('Student added:', student);
            } else {
                console.error('Error: Each student must have a name and age');
            }
        });
        res.status(201).json({ message: 'Students added successfully' });
    } else {
        console.error('Error: An array of students is required');
        res.status(400).json({ error: 'An array of students is required' });
    }
});

// Route to generate and download Excel file
app.get('/api/export', async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Add header row
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Age', key: 'age', width: 10 }
    ];

    // Add rows
    students.forEach(student => {
        worksheet.addRow(student);
    });

    // Set response headers and send the file
    res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
