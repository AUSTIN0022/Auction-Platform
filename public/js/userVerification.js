
document.addEventListener('DOMContentLoaded', function() {
    // Fetch users from the API
    fetchUsers();
    
    // Add event listeners to tabs
    document.querySelectorAll('.nav-tabs .nav-link').forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Set active tab
        document.querySelectorAll('.nav-tabs .nav-link').forEach(t => {
          t.classList.remove('active');
        });
        this.classList.add('active');
        
        // Filter users by selected status
        const status = this.getAttribute('data-status');
        filterUsersByStatus(status);
      });
    });
    
    // Add event listener to search input
    document.getElementById('searchInput').addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const activeTab = document.querySelector('.nav-tabs .nav-link.active').getAttribute('data-status');
      filterUsersBySearch(searchTerm, activeTab);
    });
    
    // Add event listener to sidebar toggle
    document.getElementById('menuToggle').addEventListener('click', function() {
      document.getElementById('sidebar').classList.toggle('active');
      document.getElementById('main').classList.toggle('expanded');
    });
  });
  
  
  async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Store users in global variable
      window.allUsers = data.users || [];
      
      // Update stats counts
      updateStatsCounts(data.counts);
      
      // Display users initially filtered to pending (default tab)
      filterUsersByStatus('pending');
      
    } catch (error) {
      console.error('Error fetching users:', error);
      document.getElementById('userTableBody').innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            Error loading user data. Please try again later.
          </td>
        </tr>
      `;
    }
  }
  
 
  function updateStatsCounts(counts) {
    if (counts) {
      document.getElementById('pendingStatsCount').textContent = counts.pendingUsers || 0;
      document.getElementById('verifiedStatsCount').textContent = counts.approveUsers || 0;
      document.getElementById('rejectedStatsCount').textContent = counts.rejectUsers || 0;
      
      // Update tab counts
      document.getElementById('pendingCount').textContent = `(${counts.pendingUsers || 0})`;
      document.getElementById('verifiedCount').textContent = `(${counts.approveUsers || 0})`;
      document.getElementById('rejectedCount').textContent = `(${counts.rejectUsers || 0})`;
    }
  }
  
  
  function filterUsersByStatus(status) {
    if (!window.allUsers) return;
    
    const filteredUsers = window.allUsers.filter(user => {
      if (status === 'pending') {
        return user.verifyStatus === 'pending' || !user.verifyStatus;
      } else {
        return user.verifyStatus === status;
      }
    });
    
    renderUserTable(filteredUsers);
  }
  
  
  function filterUsersBySearch(searchTerm, status) {
    if (!window.allUsers) return;
    
    const filteredUsers = window.allUsers.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm) ||
        user._id.toLowerCase().includes(searchTerm);
      
      const matchesStatus = status === 'all' ? true : 
        (status === 'pending' ? (user.verifyStatus === 'pending' || !user.verifyStatus) : user.verifyStatus === status);
      
      return matchesSearch && matchesStatus;
    });
    
    renderUserTable(filteredUsers);
  }
  
  function renderUserTable(users) {
    const tableBody = document.getElementById('userTableBody');
    
    if (!users || users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">No users found.</td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
      // Format date
      const registrationDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Create table row
      const tr = document.createElement('tr');
      
      // Status badge class
      let statusClass = 'bg-warning';
      if (user.verifyStatus === 'verified') {
        statusClass = 'bg-success';
      } else if (user.verifyStatus === 'rejected') {
        statusClass = 'bg-danger';
      }
      
      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${registrationDate}</td>
        <td><span class="badge ${statusClass}">${user.verifyStatus || 'pending'}</span></td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="viewDocuments('${user._id}')">
            <i class="fas fa-file-alt"></i> View
          </button>
        </td>
        <td>
          <div class="action-buttons">
            ${user.verifyStatus !== 'verified' ? `
              <button class="btn btn-sm btn-success me-1" onclick="verifyUser('${user._id}')">
                <i class="fas fa-check"></i>
              </button>
            ` : ''}
            ${user.verifyStatus !== 'rejected' ? `
              <button class="btn btn-sm btn-danger me-1" onclick="rejectUser('${user._id}')">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
            <button class="btn btn-sm btn-info" onclick="viewUserDetails('${user._id}')">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </td>
      `;
      
      tableBody.appendChild(tr);
    });
  }
  

  function verifyUser(userId) {
    // You would implement the API call here
    alert(`Verify user with ID: ${userId}`);
    // After successful verification, refresh the user data
    fetchUsers();
  }
  

  function rejectUser(userId) {
    // You would implement the API call here
    alert(`Reject user with ID: ${userId}`);
    // After successful rejection, refresh the user data
    fetchUsers();
  }
  
  
  function viewUserDetails(userId) {
    // You would implement the details view here
    alert(`View details for user with ID: ${userId}`);
  }
  

  function viewDocuments(userId) {
    // You would implement the document viewer here
    alert(`View documents for user with ID: ${userId}`);
  }