var dashboardPage = `
<h1>Dashboard</h1>

<div class="cards">
  <div class="card">Total Students<br><b>420</b></div>
  <div class="card">Fees Collected<br><b>₹5,20,000</b></div>
  <div class="card">Pending Fees<br><b>₹1,30,000</b></div>
  <div class="card">Attendance Avg<br><b>92%</b></div>
</div>

<canvas id="feeChart" height="120"></canvas>

<script>
new Chart(document.getElementById('feeChart'), {
  type: 'bar',
  data: {
    labels: ['Apr','May','Jun','Jul'],
    datasets: [{
      label: 'Fees Collected',
      data: [120000, 150000, 130000, 120000],
    }]
  }
});
</script>
`;
