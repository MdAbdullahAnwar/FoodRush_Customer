# 🍽️ FoodRush - Frontend (User Interface)

This is the **Frontend** of the FoodRush food ordering application where users can browse dishes, add items to the cart, apply promo codes, place orders, manage their profile and Live Chat with Admin.

---

## 🚀 Live Features

✅ User Signup/Login  
✅ Browse and filter menu items  
✅ Add/Remove items in cart  
✅ Apply promo codes (FLAT10 / FLAT25 / FLAT50)  
✅ Place orders using RazorPay  
✅ View and track past orders  
✅ Update profile and manage addresses
✅ Live Chat: Talk to Admin instantly while browsing the site

---

## 🛠 Tech Stack

| Type       | Tools Used                                         |
|------------|----------------------------------------------------|
| Frontend   | React.js, CSS Modules, React Toastify              |
| Icons      | Lucide React                                       |
| State Mgmt | Context API                                        |
| Auth       | Firebase Authentication                            |
| Backend    | Firebase Firestore (via Firebase SDK)              |
| Payment    | RazorPay Integration                               |
| Chat       | Tawk.To                                            |

---

## 🗂 Folder Structure

```
frontend/
├── public/
│ └── index.html
├── src/
│ ├── assets/ # Images, logos, etc.
│ ├── components/
│ │ ├── AppDownload/ # App banner section
│ │ ├── ExploreMenu/ # Category filtering UI
│ │ ├── FoodDisplay/ # List foods by category
│ │ ├── FoodItem/ # Individual food card
│ │ ├── Footer/ # Footer
│ │ ├── Header/ # Top header with banner
│ │ ├── LoginPopup/ # Login modal
│ │ ├── Navbar/ # Site-wide navigation bar
│ │ ├── ProtectedRoute/ # Route guard logic
│ │ └── TawkToWidget/ # Chat Widget
│ ├── context/
│ │ └── StoreContext.jsx # Context API store (legacy)
│ ├── features/ # Redux Toolkit slices
│ │ ├── auth/ # Firebase auth slice
│ │ ├── cart/ # Cart slice + helpers
│ │ └── food/ # Food fetch slice
│ ├── pages/
│ │ ├── Cart/ # Cart page
│ │ ├── Home/ # Homepage
│ │ ├── Orders/ # Past order history
│ │ ├── Payment/ # RazorPay integration
│ │ ├── PlaceOrder/ # Address & order confirmation
│ │ └── UserProfile/ # Profile update form
│ ├── firebase.js # Firebase SDK setup
│ ├── App.jsx # Main route file
│ ├── main.jsx # ReactDOM root + Providers
│ └── index.css # Global styles
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

