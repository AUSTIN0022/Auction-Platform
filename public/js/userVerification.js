
    import userData from './Data/userData.js';
    console.log(userData);    

    // DOM elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    const footer = document.getElementById('footer');
    const pendingTab = document.getElementById('pendingTab');
    const verifiedTab = document.getElementById('verifiedTab');
    const rejectedTab = document.getElementById('rejectedTab');
    const userTableBody = document.getElementById('userTableBody');
    const pendingCount = document.getElementById('pendingCount');
    const verifiedCount = document.getElementById('verifiedCount');
    const rejectedCount = document.getElementById('rejectedCount');
    const pendingStatsCount = document.getElementById('pendingStatsCount');
    const verifiedStatsCount = document.getElementById('verifiedStatsCount');
    const rejectedStatsCount = document.getElementById('rejectedStatsCount');
    const searchInput = document.getElementById('searchInput');

    // Toggle sidebar
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('menu-open');
      sidebar.classList.toggle('sidebar-open');
      
      // For desktop view
      if (window.innerWidth >= 992) {
        sidebar.classList.toggle('sidebar-collapsed');
        main.classList.toggle('main-full');
        footer.classList.toggle('footer-full');
      }
    });

    // Initialize current status filter
    let currentStatus = 'pending';

    // Update counts
    function updateCounts() {
      const pending = userData.filter(user => user.status === 'pending').length;
      const verified = userData.filter(user => user.status === 'verified').length;
      const rejected = userData.filter(user => user.status === 'rejected').length;
      
      pendingCount.textContent = `(${pending})`;
      verifiedCount.textContent = `(${verified})`;
      rejectedCount.textContent = `(${rejected})`;
      
      pendingStatsCount.textContent = pending;
      verifiedStatsCount.textContent = verified;
      rejectedStatsCount.textContent = rejected;
    }

    // Handle tab click
    function handleTabClick(e) {
      e.preventDefault();
      
      // Remove active class from all tabs
      pendingTab.classList.remove('active');
      verifiedTab.classList.remove('active');
      rejectedTab.classList.remove('active');
      
      // Add active class to clicked tab
      e.target.classList.add('active');
      
      // Set current status
      currentStatus = e.target.dataset.status;
      
      // Display users
      displayUsers();
    }

    // Attach event listeners to tabs
    pendingTab.addEventListener('click', handleTabClick);
    verifiedTab.addEventListener('click', handleTabClick);
    rejectedTab.addEventListener('click', handleTabClick);

    // Filter and display users
    function displayUsers() {
      const searchTerm = searchInput.value.toLowerCase();
      
      // Filter users by status and search term
      const filteredUsers = userData.filter(user => 
        user.status === currentStatus && 
        (user.name.toLowerCase().includes(searchTerm) || 
         user.email.toLowerCase().includes(searchTerm) || 
         user.id.toLowerCase().includes(searchTerm))
      );
      
      // Clear table
      userTableBody.innerHTML = '';
      
      // Add users to table
      filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Create cells with user data
        row.innerHTML = `
          <td>#${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.registrationDate}</td>
          <td>
            <span class="status-pill status-${user.status}">
              ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-secondary">
              <i class="fas fa-id-card me-1"></i> View ${user.documents.type}
            </button>
          </td>
          <td>
            ${getActionButtons(user)}
          </td>
        `;
        
        userTableBody.appendChild(row);
      });
      
      // Show message if no users found
      if (filteredUsers.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td colspan="7" class="text-center py-4">
            <i class="fas fa-search me-2"></i> No ${currentStatus} users found.
          </td>
        `;
        userTableBody.appendChild(row);
      }
    }

    // Generate action buttons based on user status
    function getActionButtons(user) {
      switch (user.status) {
        case 'pending':
          return `
            <button class="btn btn-sm btn-success me-1" onclick="changeStatus('${user.id}', 'verified')">
              <i class="fas fa-check me-1"></i> Approve
            </button>
            <button class="btn btn-sm btn-danger" onclick="changeStatus('${user.id}', 'rejected')">
              <i class="fas fa-times me-1"></i> Reject
            </button>
          `;
        case 'verified':
          return `
            <button class="btn btn-sm btn-warning me-1" onclick="changeStatus('${user.id}', 'pending')">
              <i class="fas fa-undo me-1"></i> Revert
            </button>
            <button class="btn btn-sm btn-danger" onclick="changeStatus('${user.id}', 'rejected')">
              <i class="fas fa-times me-1"></i> Reject
            </button>
          `;
        case 'rejected':
          return `
            <button class="btn btn-sm btn-warning me-1" onclick="changeStatus('${user.id}', 'pending')">
              <i class="fas fa-undo me-1"></i> Revert
            </button>
            <button class="btn btn-sm btn-success" onclick="changeStatus('${user.id}', 'verified')">
              <i class="fas fa-check me-1"></i> Approve
            </button>
          `;
        default:
          return '';
      }
    }

    // Change user status
    window.changeStatus = function(userId, newStatus) {
      // Find user
      const userIndex = userData.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        // Update user status
        userData[userIndex].status = newStatus;
        
        // Add dates based on status
        const currentDate = new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        
        if (newStatus === 'verified') {
          userData[userIndex].verificationDate = currentDate;
        } else if (newStatus === 'rejected') {
          userData[userIndex].rejectionDate = currentDate;
          userData[userIndex].rejectionReason = "Pending reason";
        }
        
        // Update counts and display
        updateCounts();
        displayUsers();
      }
    };

    // Search functionality
    searchInput.addEventListener('input', displayUsers);

    // Handle responsive behavior
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 992) {
        // Reset for desktop view
        sidebar.classList.remove('sidebar-open');
        if (menuToggle.classList.contains('menu-open')) {
          main.classList.add('main-full');
          footer.classList.add('footer-full');
          sidebar.classList.add('sidebar-collapsed');
        } else {
          main.classList.remove('main-full');
          footer.classList.remove('footer-full');
          sidebar.classList.remove('sidebar-collapsed');
        }
      } else {
        // Mobile view
        main.classList.remove('main-full');
        footer.classList.remove('footer-full');
        sidebar.classList.remove('sidebar-collapsed');
      }
    });

    // Initialize
    updateCounts();
    displayUsers();

    // Set initial responsive state
    if (window.innerWidth < 992) {
      sidebar.classList.remove('sidebar-open');
    }
  