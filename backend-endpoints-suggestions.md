# Backend Endpoints Suggestions

This document lists locations in the codebase where backend endpoints are needed, their purposes, and suggested endpoint names.

## 1. User Registration & Authentication
- **Files:**
  - `/src/app/pages/phone-number/page.tsx`
  - `/src/app/pages/password-pages/setup-password/page.tsx`
- **Purpose:**
  - Register new users (phone number, PIN)
  - Authenticate users (login)
- **Suggested Endpoints:**
  - `POST /api/user/register`
  - `POST /api/user/login`

## 2. Transaction Management
- **Files:**
  - `/src/app/api/transactions/check/route.ts`
  - Any transaction history or send/receive money pages/components
- **Purpose:**
  - Fetch user transaction history
  - Initiate/send/receive transactions
- **Suggested Endpoints:**
  - `GET /api/transactions`
  - `POST /api/transactions/send`
  - `POST /api/transactions/receive`

## 3. User Profile & Settings
- **Files:**
  - Any profile or settings page/component
- **Purpose:**
  - Fetch/update user profile info
  - Change PIN/password
- **Suggested Endpoints:**
  - `GET /api/user/profile`
  - `PUT /api/user/profile`
  - `PUT /api/user/pin`

## 4. Notifications
- **Files:**
  - Any notification-related component/page
- **Purpose:**
  - Fetch user notifications
- **Suggested Endpoints:**
  - `GET /api/notifications`

## 5. Wallet Management
- **Files:**
  - Any wallet-related page/component
- **Purpose:**
  - Fetch wallet balance
  - Create/manage wallet
- **Suggested Endpoints:**
  - `GET /api/wallet/balance`
  - `POST /api/wallet/create`

## 6. Miscellaneous
- **Files:**
  - Any other page/component that displays or updates dynamic data
- **Purpose:**
  - Fetch/update miscellaneous data
- **Suggested Endpoints:**
  - As needed, e.g. `GET /api/data`, `PUT /api/data`

---
**Note:**
- Actual endpoint names and request/response formats should match your backend implementation.
- Review each page/component for mock/static data and replace with backend calls as needed.
