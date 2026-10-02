const http = require('http');
const app = require('./server');

const PORT = 5001; // Use 5001 for test runner to avoid conflicts

const runTests = async () => {
  const server = app.listen(PORT, async () => {
    console.log(`\n========================================`);
    console.log(`   PETCARE BACKEND API INTEGRATION TEST  `);
    console.log(`========================================\n`);

    const request = (path, method = 'GET', data = null, token = null) => {
      return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : null;
        const options = {
          hostname: 'localhost',
          port: PORT,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload && { 'Content-Length': Buffer.byteLength(payload) }),
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };

        const req = http.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              resolve({ status: res.statusCode, body: parsed });
            } catch (e) {
              resolve({ status: res.statusCode, raw: body });
            }
          });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
      });
    };

    try {
      let passed = 0;
      let failed = 0;

      const assert = (condition, title) => {
        if (condition) {
          console.log(`  ✅ [PASS] ${title}`);
          passed++;
        } else {
          console.error(`  ❌ [FAIL] ${title}`);
          failed++;
        }
      };

      // 1. Health check
      console.log('Testing Server Health...');
      const health = await request('/api/health');
      assert(health.status === 200 && health.body.status === 'healthy', 'Health check responds 200 OK');

      // 2. Admin Login
      console.log('\nTesting Auth - Admin Login...');
      const adminLogin = await request('/api/auth/login', 'POST', {
        email: 'admin@petcare.com',
        password: 'Admin@123',
      });
      assert(adminLogin.status === 200 && adminLogin.body.data.token, 'Admin login returns JWT token');
      const adminToken = adminLogin.body.data.token;

      // 3. Admin Dashboard Metrics
      console.log('\nTesting Admin - Dashboard Stats...');
      const adminStats = await request('/api/admin/dashboard', 'GET', null, adminToken);
      assert(adminStats.status === 200, 'Admin dashboard returns 200 OK');
      assert(adminStats.body.data.totalUsers >= 9, `Total users count is ${adminStats.body.data.totalUsers} (>= 9)`);
      assert(adminStats.body.data.totalProviders === 6, `Total providers is ${adminStats.body.data.totalProviders}`);
      assert(adminStats.body.data.pendingProviders === 1, `Pending providers is ${adminStats.body.data.pendingProviders}`);
      assert(adminStats.body.data.approvedProviders === 4, `Approved providers is ${adminStats.body.data.approvedProviders}`);
      assert(adminStats.body.data.totalPets === 4, `Total pets is ${adminStats.body.data.totalPets}`);
      assert(adminStats.body.data.totalAppointments === 3, `Total appointments is ${adminStats.body.data.totalAppointments}`);

      // 4. Admin Providers List
      console.log('\nTesting Admin - Provider Verification Queue...');
      const providersRes = await request('/api/admin/providers?status=Pending', 'GET', null, adminToken);
      assert(providersRes.status === 200, 'Admin can list pending providers');
      const pendingProvider = providersRes.body.data[0];
      assert(pendingProvider && pendingProvider.approvalStatus === 'Pending', `Found pending provider: ${pendingProvider?.user?.name}`);

      // 5. Admin Approve Provider
      if (pendingProvider) {
        console.log('\nTesting Admin - Approve Provider Action...');
        const approveRes = await request(`/api/admin/providers/${pendingProvider._id}/approve`, 'PATCH', null, adminToken);
        assert(approveRes.status === 200, 'Provider approval returns 200 OK');
        assert(approveRes.body.data.approvalStatus === 'Approved', 'Provider status is now Approved');
      }

      // 6. Admin Users Management & Toggle Status
      console.log('\nTesting Admin - User Moderation...');
      const usersRes = await request('/api/admin/users', 'GET', null, adminToken);
      assert(usersRes.status === 200 && usersRes.body.data.length >= 9, 'Admin can view all platform users');
      const targetUser = usersRes.body.data.find(u => u.role === 'PET_OWNER');
      if (targetUser) {
        const toggleRes = await request(`/api/admin/users/${targetUser._id}/status`, 'PATCH', { isActive: false }, adminToken);
        assert(toggleRes.status === 200 && toggleRes.body.data.isActive === false, 'Admin can deactivate user');
        // Restore
        await request(`/api/admin/users/${targetUser._id}/status`, 'PATCH', { isActive: true }, adminToken);
      }

      // 7. Pet Owner Login & Get Pets
      console.log('\nTesting Auth & Pets - Sarah Jenkins...');
      const ownerLogin = await request('/api/auth/login', 'POST', {
        email: 'sarah@example.com',
        password: 'Owner@123',
      });
      assert(ownerLogin.status === 200, 'Pet owner login successful');
      const ownerToken = ownerLogin.body.data.token;

      const petsRes = await request('/api/pets', 'GET', null, ownerToken);
      assert(petsRes.status === 200 && petsRes.body.data.length === 2, `Sarah Jenkins has ${petsRes.body.data?.length} pets (Max & Bella)`);

      // 8. Public Marketplace Discovery
      console.log('\nTesting Public Marketplace...');
      const marketRes = await request('/api/providers');
      assert(marketRes.status === 200, 'Public marketplace returns 200 OK');
      assert(marketRes.body.data.length >= 4, `Public marketplace displays ${marketRes.body.data.length} approved providers`);
      const hasSuspended = marketRes.body.data.some(p => p.approvalStatus === 'Suspended');
      assert(!hasSuspended, 'Suspended providers are excluded from public marketplace');

      // 9. RBAC Protection Check
      console.log('\nTesting RBAC Security Guards...');
      const forbiddenAdminAccess = await request('/api/admin/dashboard', 'GET', null, ownerToken);
      assert(forbiddenAdminAccess.status === 403, 'Pet owner cannot access admin endpoints (403 Forbidden)');

      const unauthenticatedAccess = await request('/api/admin/dashboard', 'GET');
      assert(unauthenticatedAccess.status === 401, 'Unauthenticated access is rejected (401 Unauthorized)');

      // 10. Register new Pet Owner
      console.log('\nTesting Registration Flow...');
      const testEmail = `newowner_${Date.now()}@example.com`;
      const regRes = await request('/api/auth/register', 'POST', {
        name: 'New Test User',
        email: testEmail,
        phone: '+91 99999 88888',
        password: 'TestPassword@123',
        confirmPassword: 'TestPassword@123',
        role: 'PET_OWNER',
      });
      assert(regRes.status === 201 && regRes.body.data.token, 'New Pet Owner registration successful');

      console.log(`\n========================================`);
      console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED `);
      console.log(`========================================\n`);

      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    } catch (err) {
      console.error('Test execution error:', err);
      server.close(() => process.exit(1));
    }
  });
};

runTests();
