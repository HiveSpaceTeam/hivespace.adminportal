# Environment Variables Configuration

Tạo file `.env` trong root directory của project và copy các biến sau:

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:7001/api
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_CALLBACK_URL=http://localhost:5173/auth/callback

# Application
VITE_APP_NAME=HiveSpace Admin Portal
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Feature Flags
VITE_ENABLE_LOGGING=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# External Services
VITE_STORAGE_BASE_URL=https://storage.hivespace.com
VITE_CDN_BASE_URL=https://cdn.hivespace.com

# Microservices Endpoints (Optional - nếu bạn muốn override specific services)
VITE_AUTH_SERVICE_URL=https://localhost:7002
VITE_USER_SERVICE_URL=https://localhost:7003
VITE_ADMIN_SERVICE_URL=https://localhost:7004
VITE_NOTIFICATION_SERVICE_URL=https://localhost:7005
```

## Mô tả các biến:

### API Configuration
- `VITE_API_BASE_URL`: URL của API Gateway
- `VITE_API_TIMEOUT`: Timeout cho API requests (milliseconds)

### Authentication
- `VITE_AUTH_CALLBACK_URL`: URL callback sau khi authentication

### Application
- `VITE_APP_NAME`: Tên ứng dụng
- `VITE_APP_VERSION`: Version của ứng dụng
- `VITE_APP_ENVIRONMENT`: Environment (development, staging, production)

### Feature Flags
- `VITE_ENABLE_LOGGING`: Bật/tắt logging
- `VITE_ENABLE_ANALYTICS`: Bật/tắt analytics
- `VITE_ENABLE_DEBUG`: Bật/tắt debug mode

### External Services
- `VITE_STORAGE_BASE_URL`: URL của storage service
- `VITE_CDN_BASE_URL`: URL của CDN

### Microservices Endpoints
Các biến này là optional. Nếu không set, sẽ sử dụng API Gateway URL.
- `VITE_AUTH_SERVICE_URL`: URL trực tiếp đến Auth Service
- `VITE_USER_SERVICE_URL`: URL trực tiếp đến User Service
- `VITE_ADMIN_SERVICE_URL`: URL trực tiếp đến Admin Service
- `VITE_NOTIFICATION_SERVICE_URL`: URL trực tiếp đến Notification Service
