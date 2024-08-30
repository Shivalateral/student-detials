document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent the default form submission

    // Collect form data
    const formData = new FormData(e.target);
    const students = [];

    // Get all names and ages from the form
    const names = formData.getAll('name');
    const ages = formData.getAll('age');

    console.log('Names:', names);
    console.log('Ages:', ages);

    // Construct the students array
    for (let i = 0; i < names.length; i++) {
        if (names[i] && ages[i]) {
            students.push({ name: names[i], age: parseInt(ages[i], 10) });
        }
    }

    console.log('Students Array:', students);

    try {
        // Send the data to the server
        const response = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ students })  // Wrap the array in an object with the key 'students'
        });

        if (response.ok) {
            console.log('Students added successfully');
            e.target.reset(); // Clear the form after successful submission
            alert('Students added successfully');
        } else {
            const errorData = await response.json();
            console.error('Failed to add students:', errorData);
            alert(`Failed to add students: ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the students. Please try again.');
    }
});

document.getElementById('addStudentBtn').addEventListener('click', () => {
    const studentEntries = document.getElementById('studentEntries');
    const newEntry = document.createElement('div');
    newEntry.className = 'student-entry';
    newEntry.innerHTML = `
        <label>Name:</label>
        <input type="text" name="name" required>
        <label>Age:</label>
        <input type="number" name="age" required>
    `;
    studentEntries.appendChild(newEntry);
});

document.getElementById('exportBtn').addEventListener('click', () => {
    window.location.href = '/api/export';
});

