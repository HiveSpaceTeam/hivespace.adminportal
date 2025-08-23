import { createI18n } from 'vue-i18n'

// Vietnamese translations
const vi = {
  // App Header
  header: {
    search: 'Tìm kiếm...',
    notifications: 'Thông báo',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
    language: 'Ngôn ngữ'
  },

  // Sidebar
  sidebar: {
    menu: 'Menu',
    accounts: 'Tài khoản',
    accountList: 'Danh sách tài khoản',
    addAccount: 'Thêm tài khoản'
  },

  // Table
  table: {
    username: 'Tên đăng nhập',
    fullName: 'Họ và tên',
    email: 'Email',
    seller: 'Người bán',
    status: 'Trạng thái',
    createdDate: 'Ngày tạo',
    lastLoginDate: 'Lần đăng nhập cuối',
    actions: 'Thao tác',
    delete: 'Xóa',
    activate: 'Kích hoạt',
    deactivate: 'Vô hiệu hóa',
    yes: 'Có',
    no: 'Không',
    active: 'Hoạt động',
    inactive: 'Không hoạt động'
  },

  // Common
  common: {
    loading: 'Đang tải...',
    save: 'Lưu',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    close: 'Đóng'
  }
}

// English translations
const en = {
  // App Header
  header: {
    search: 'Search...',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    language: 'Language'
  },

  // Sidebar
  sidebar: {
    menu: 'Menu',
    accounts: 'Accounts',
    accountList: 'Account List',
    addAccount: 'Add Account'
  },

  // Table
  table: {
    username: 'Username',
    fullName: 'Full Name',
    email: 'Email',
    seller: 'Seller',
    status: 'Status',
    createdDate: 'Created Date',
    lastLoginDate: 'Last Login Date',
    actions: 'Actions',
    delete: 'Delete',
    activate: 'Activate',
    deactivate: 'Deactivate',
    yes: 'Yes',
    no: 'No',
    active: 'Active',
    inactive: 'Inactive'
  },

  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'vi', // default locale
  fallbackLocale: 'en',
  messages: {
    vi,
    en
  }
})

export default i18n
