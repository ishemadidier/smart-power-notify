# Dark Mode Implementation Plan

## Completed
- [x] Fix CSS import issue (moved index.css to src/)
- [x] Add dark mode to Login.js (with ThemeToggle)
- [x] Add dark mode to Register.js (with ThemeToggle)
- [x] Add dark mode to User/Dashboard.js (with ThemeToggle and dark classes)

## Remaining Pages (Need Dark Mode Classes)
- [ ] User/Notifications.js - add ThemeToggle + dark classes
- [ ] User/MyReports.js - add ThemeToggle + dark classes
- [ ] User/ReportIssue.js - add ThemeToggle + dark classes
- [ ] Admin/CreateNotification.js - add ThemeToggle + dark classes to sidebar/main
- [ ] Admin/ManageNotifications.js - add ThemeToggle + dark classes
- [ ] Admin/ManageUsers.js - add ThemeToggle + dark classes
- [ ] Admin/ManageReports.js - add ThemeToggle + dark classes
- [ ] Admin/Analytics.js - add ThemeToggle + dark classes

**Note:** Admin/Dashboard.js already has extensive dark mode support.

## Dark Mode Pattern Used
```jsx
// 1. Import ThemeToggle
import ThemeToggle from '../../components/common/ThemeToggle';

// 2. Add to header
<ThemeToggle />

// 3. Add dark classes to containers:
- bg-secondary-50 → bg-secondary-50 dark:bg-dark-bg
- bg-white → bg-white dark:bg-dark-card
- border-secondary-200 → border-secondary-200 dark:border-dark-border
- text-secondary-900 → text-secondary-900 dark:text-white
- text-secondary-500 → text-secondary-500 dark:text-dark-400
```

