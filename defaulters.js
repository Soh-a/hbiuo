<!DOCTYPE html>  
<html>  
<head>  
  <title>Defaulters List</title>  
  <style>
    /* General body styles */
    body { 
      font-family: Arial, sans-serif; 
      margin: 40px; 
      background: #f5f5f5; 
    }

    /* Heading */
    h2 { 
      text-align: center; 
      margin-bottom: 20px; 
      color: #333;
    }

    /* Button styling */
    #downloadBtn { 
      display: block;
      margin: 10px auto; 
      padding: 10px 20px; 
      cursor: pointer; 
      background: #4CAF50; 
      color: white; 
      border: none; 
      border-radius: 5px; 
      font-size: 16px;
    }

    #downloadBtn:hover {
      background: #45a049;
    }

    /* Table styling */
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 20px; 
      background: #fff; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    th, td { 
      border: 1px solid #ccc; 
      padding: 12px; 
      text-align: center; 
    }

    th { 
      background: #4CAF50; 
      color: white; 
      font-size: 16px;
    }

    td { 
      font-size: 14px; 
      color: #333;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #e6f7e6;
    }
  </style>
</head>  
<body>  
  
<h2>Defaulters List</h2>  
<button id="downloadBtn">Download Defaulters CSV</button>  
  
<table id="defaultersTable">  
  <thead>  
    <tr>  
      <th>Student ID</th>  
      <th>Name</th>  
      <th>Month</th>  
      <th>Fine</th>  
    </tr>  
  </thead>  
  <tbody></tbody>  
</table>  
  
<!-- Link to separate JS file -->  
<script type="module" src="defaulters.js"></script>  
</body>  
</html>
