import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Base URL của API Gateway
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Cấu hình các kịch bản test dựa trên biến môi trường TEST_TYPE
let testStages = [
  { duration: '10s', target: 5 }, // Mặc định: Smoke test (5 users)
];

if (__ENV.TEST_TYPE === '500_users') {
  testStages = [
    { duration: '1m', target: 200 },  // Ramp-up lên 200 Users
    { duration: '2m', target: 500 },  // Ramp-up tiếp lên 500 Users
    { duration: '3m', target: 500 },  // Duy trì tải ở 500 Users
    { duration: '1m', target: 0 },    // Ramp-down về 0 User
  ];
} else if (__ENV.TEST_TYPE === '1000_users') {
  testStages = [
    { duration: '2m', target: 500 },  // Ramp-up lên 500 Users
    { duration: '2m', target: 1000 }, // Ramp-up tiếp lên 1000 Users
    { duration: '4m', target: 1000 }, // Duy trì tải ở 1000 Users
    { duration: '2m', target: 0 },    // Ramp-down về 0 User
  ];
} else if (__ENV.TEST_TYPE === 'stress') {
  testStages = [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 500 },
    { duration: '3m', target: 1000 },
    { duration: '2m', target: 1500 }, // Stress test với tải cực đại
    { duration: '2m', target: 0 },
  ];
}

export const options = {
  stages: testStages,
  thresholds: {
    http_req_failed: ['rate<0.02'], // Tỷ lệ lỗi dưới 2%
    http_req_duration: ['p(95)<1500'], // 95% số request có response time dưới 1.5s
  },
};

export default function () {
  // Tạo email ngẫu nhiên nhưng ổn định cho mỗi Virtual User (VU) để tránh trùng lặp quá nhiều
  const vuId = __VU;
  const iterId = __ITER;
  const email = `tenant.test.${vuId}@example.com`;
  const password = 'password123';
  const fullName = `Load Test Tenant ${vuId}`;

  // Phân phối hành vi người dùng thực tế:
  // - 70% cơ hội: Chỉ xem danh sách căn hộ và chi tiết (Read-heavy)
  // - 20% cơ hội: Đăng nhập và xem trang cá nhân (Auth + Read)
  // - 10% cơ hội: Đăng ký tài khoản mới và đăng nhập (Write-heavy)
  const rand = Math.random();

  if (rand < 0.70) {
    // --- SCENARIO 1: Duyệt Căn Hộ (Public API) ---
    group('Browse Apartments Flow', function () {
      // 1. Lấy danh sách căn hộ đang hiển thị
      const listRes = http.get(`${BASE_URL}/api/apartments/listing?Page=1&PageSize=10`);
      check(listRes, {
        'GET Listing status is 200': (r) => r.status === 200,
        'GET Listing response has body': (r) => r.body.length > 0,
      });

      // Thêm thời gian nghỉ tự nhiên của người dùng (think time) từ 1s đến 3s
      sleep(Math.random() * 2 + 1);

      // 2. Lấy chi tiết một căn hộ (nếu danh sách có phần tử)
      try {
        const apartments = JSON.parse(listRes.body);
        const apartmentList = apartments.data || apartments; // tùy thuộc vào cấu hình API format
        if (apartmentList && apartmentList.length > 0) {
          const firstApartmentId = apartmentList[0].id;
          if (firstApartmentId) {
            const detailRes = http.get(`${BASE_URL}/api/apartments/${firstApartmentId}`);
            check(detailRes, {
              'GET Apartment Detail status is 200': (r) => r.status === 200,
            });
          }
        }
      } catch (e) {
        // Bỏ qua lỗi parse JSON nếu listRes bị lỗi/trống
      }
    });
  } 
  else if (rand < 0.90) {
    // --- SCENARIO 2: Đăng Nhập & Xem Thông Tin Cá Nhân ---
    group('Login & View Profile Flow', function () {
      const payload = JSON.stringify({
        email: email,
        password: password,
      });

      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // 1. Đăng nhập
      const loginRes = http.post(`${BASE_URL}/api/auth/login`, payload, params);
      const isLoginOk = check(loginRes, {
        'POST Login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
      });

      if (isLoginOk && loginRes.status === 200) {
        try {
          const body = JSON.parse(loginRes.body);
          const token = body.accessToken || body.data?.accessToken;

          if (token) {
            sleep(1);

            // 2. Truy cập API cần xác thực (Profile)
            const meParams = {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            };
            const meRes = http.get(`${BASE_URL}/api/auth/me`, meParams);
            check(meRes, {
              'GET Profile me status is 200': (r) => r.status === 200,
            });
          }
        } catch (e) {
          // Bỏ qua lỗi parse JSON
        }
      } else if (loginRes.status === 401) {
        // Nếu chưa tồn tại user này (do DB mới reset), đăng ký nhanh
        const registerPayload = JSON.stringify({
          email: email,
          password: password,
          fullName: fullName,
          role: 'TENANT',
        });
        http.post(`${BASE_URL}/api/auth/register`, registerPayload, params);
      }
    });
  } 
  else {
    // --- SCENARIO 3: Đăng Ký Tài Khoản Mới (Write-heavy) ---
    group('Registration Flow', function () {
      // Đảm bảo email là duy nhất cho mỗi iteration của luồng này
      const uniqueEmail = `tenant.load.${vuId}.${iterId}.${Math.floor(Math.random() * 100000)}@example.com`;
      const registerPayload = JSON.stringify({
        email: uniqueEmail,
        password: password,
        fullName: `New Tenant ${vuId}-${iterId}`,
        role: 'TENANT',
      });

      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // 1. Đăng ký tài khoản
      const registerRes = http.post(`${BASE_URL}/api/auth/register`, registerPayload, params);
      const isRegOk = check(registerRes, {
        'POST Register status is 201': (r) => r.status === 201,
      });

      if (isRegOk) {
        sleep(1.5);
        // 2. Đăng nhập ngay sau khi đăng ký
        const loginPayload = JSON.stringify({
          email: uniqueEmail,
          password: password,
        });
        const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);
        check(loginRes, {
          'POST Login after registration is 200': (r) => r.status === 200,
        });
      }
    });
  }

  // Nghỉ giữa các iteration để mô phỏng hành vi tự nhiên
  sleep(Math.random() * 3 + 2); // Nghỉ ngẫu nhiên từ 2s đến 5s
}
