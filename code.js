document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

function fetchData() {
    Papa.parse("https://testbucketprojectttterm.s3.amazonaws.com/Testfolder/RegisteredUsers.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data;
            updatePieChart(data);
            updateBarChart(data);
            updateLineChart(data);
        }
    });
}

// function updatePieChart(data) {
//     const attendanceCounts = data.reduce((acc, cur) => {
//         // Trim the attendance value and convert to lowercase for case-insensitive comparison
//         const attendance = (cur.Attendance || 'Unknown').trim().toLowerCase();
//         const key = attendance === 'accepted' ? 'Accepted' : attendance === 'denied' ? 'Denied' : 'Unknown';
//         acc[key] = (acc[key] || 0) + 1;
//         return acc;
//     }, {});

//     const pieChart = new Chart(document.getElementById('pieChart'), {
//         type: 'pie',
//         data: {
//             labels: Object.keys(attendanceCounts),
//             datasets: [{
//                 label: 'People Attended/Not',
//                 data: Object.values(attendanceCounts),
//                 backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)'],
//                 hoverOffset: 4
//             }]
//         },
//         options: {
//             responsive: true,
//             title: {
//                 display: true,
//                 text: 'People Attended/Not'
//             }
//         }
//     });
// }

function updatePieChart(data) {
    console.log("Raw data:", data); // Log the raw data for inspection

    const attendanceCounts = data.reduce((acc, cur) => {
        let attendance = cur.Attendance || 'Unknown'; // Handle missing values
        attendance = attendance.trim(); // Remove any potential white space

        // Normalize to 'Accepted' or 'Denied', or default to 'Unknown'
        if (attendance.toLowerCase() === 'accepted') {
            attendance = 'Accepted';
        } else if (attendance.toLowerCase() === 'denied') {
            attendance = 'Denied';
        } else {
            attendance = 'Unknown'; // This should only occur if there's an unexpected value
        }

        acc[attendance] = (acc[attendance] || 0) + 1;
        return acc;
    }, {});

    console.log("Attendance counts:", attendanceCounts); // Log the computed attendance counts

    const pieChart = new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(attendanceCounts),
            datasets: [{
                label: 'People Attended/Not',
                data: Object.values(attendanceCounts),
                backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)', 'rgb(201, 203, 207)'], // Add a color for 'Unknown'
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'People Attended/Not'
            }
        }
    });
}


function updateBarChart(data) {
    const ageGroups = {};
    data.forEach((item) => {
        if (!ageGroups[item.Age]) {
            ageGroups[item.Age] = { Accepted: 0, Denied: 0 };
        }
        if (item.Attendance === 'Accepted') {
            ageGroups[item.Age].Accepted += 1;
        } else if (item.Attendance === 'Denied') {
            ageGroups[item.Age].Denied += 1;
        }
    });

    const barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(ageGroups),
            datasets: [{
                label: 'Accepted',
                data: Object.values(ageGroups).map(age => age.Accepted),
                backgroundColor: 'rgb(75, 192, 192)'
            }, {
                label: 'Denied',
                data: Object.values(ageGroups).map(age => age.Denied),
                backgroundColor: 'rgb(255, 99, 132)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'People Attended based on Age Groups'
            }
        }
    });
}

function updateLineChart(data) {
    const dates = [];
    const counts = {};
    data.forEach(item => {
        if (counts[item.RegistrationDate]) {
            counts[item.RegistrationDate]++;
        } else {
            counts[item.RegistrationDate] = 1;
            dates.push(item.RegistrationDate);
        }
    });
    dates.sort();

    const cumulativeCounts = [];
    dates.reduce((acc, date) => {
        const count = counts[date] + acc;
        cumulativeCounts.push(count);
        return count;
    }, 0);

    const lineChart = new Chart(document.getElementById('lineChart'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'User Registration Count',
                data: cumulativeCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'User Registrations Count'
            }
        }
    });
}
