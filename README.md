# 🏠 RentalMate – Premium PG Finder App

🚨 **NOTE:** This is a demo representation of a cross-platform (iOS + Android) app currently not published on Play Store or App Store. However, the **live working version is hosted on the web**:

👉 **Live Web Demo**: [https://rentalmate-demo.web.app](https://rentalmate-demo.web.app)

📱 **Login is done via mobile number** (mocked) and the **OTP is always `123456`** for demonstration purposes.

---

## 📌 About the Project

**RentalMate** is a modern PG/hostel discovery and management app tailored for students, bachelors, and working professionals. It allows users to discover nearby PGs, explore details, connect with landlords, and even manage listings if they're PG owners.

Built with a **premium black-gold themed UI**, RentalMate focuses on both **aesthetics and usability**, making it intuitive and appealing for modern users.

---

## ✨ Key Features

| Functionality             | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| 🔐 **Mobile Number Login**   | Mock mobile login with always-valid OTP (`123456`)                          |
| 🎬 **Animated Splash Screen**| Lottie animation for splash experience                                     |
| 🏠 **PG Listing (Home)**     | Fetches mock PG listings from a REST API                                   |
| 🔍 **PG Detail Screen**      | Displays detailed information (price, amenities, address, etc.)             |
| ➕ **Add PG Screen**         | For landlords to add their PG listing (mock functionality)                 |
| 💬 **Chat Screen**          | Simulated chat UI with styled chat bubbles                                |
| 👤 **Profile Screen**       | Shows user info, logout functionality                                     |
| 🌐 **Web Accessible**       | Fully working app hosted on web (via Firebase Hosting)                     |

---

## 🧪 Scope & Use Cases

RentalMate can be extended to:

- Enable real-time booking & availability of PGs
- Support verified landlord/KYC features
- Integrate maps and location-based search
- Add rating & reviews for PGs
- Enable rent payments and reminders
- Provide AI-based PG recommendations

---

## 🧑‍💻 Technologies Used

| Category         | Tools / Libraries                               |
|------------------|-------------------------------------------------|
| 🧱 Framework      | **React Native (Expo)**                         |
| 🔄 Navigation     | `@react-navigation/native`, `native-stack`, `bottom-tabs` |
| 🔐 Authentication | **Firebase Authentication** (mocked for demo)  |
| 📦 Backend        | **Firebase Firestore** (for user/PG data)      |
| 🗃️ Storage         | Firebase Storage (for PG images - mock)        |
| 🎨 UI/UX Design   | Black-Gold theme, Lottie animation, Icons       |
| 🖼️ Assets         | Lottie JSON, PNG logo                          |
| 📱 Platform       | Web, Android, iOS (not yet published on stores) |

---

## 📂 Project Structure

RentalMate/
├── App.js
├── firebaseConfig.js
├── /assets
│ ├── logo.png
│ └── splash-lottie.json
├── /screens
│ ├── SplashScreen.js
│ ├── LoginScreen.js
│ ├── SignUpScreen.js
│ ├── HomeScreen.js
│ ├── PGDetailScreen.js
│ ├── AddPGScreen.js
│ ├── ChatScreen.js
│ └── ProfileScreen.js
├── /components
│ ├── PGCard.js
│ └── ChatBubble.js
├── /navigation
│ ├── AuthNavigator.js
│ └── MainNavigator.js
├── /style
│ ├── colors.js
│ └── fonts.js

css
Copy
Edit

---

## 🔗 API Integration

- Home screen and PG details are **mock APIs** taken from a real-world app using **REST API** endpoints.
- Example structure returned:

```json
[
  {
    "id": "pg1",
    "name": "Royal PG",
    "location": "Delhi",
    "price": "₹7000/mo",
    "image": "https://...",
    "amenities": ["AC", "WiFi", "Laundry"]
  }
]
🚀 Getting Started Locally
1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/your-username/rentalmate.git
cd rentalmate
2. Install Dependencies
bash
Copy
Edit
npm install
3. Setup Firebase
Go to Firebase Console

Create a project, enable Authentication (Phone)

Add Firestore & Storage rules

Replace firebaseConfig.js with your credentials

4. Run Locally (Expo)
bash
Copy
Edit
npx expo start
👥 Contributors
Dikshant Mahajan – Project Lead, Android & Firebase Integration

UI Inspired by: CRED, Google Pay, NoBroker

💡 Future Improvements
Real OTP Integration

Landlord Verification

Google Maps Integration

Payment Gateway for Rent

Admin Dashboard Panel

📸 Screenshots
Splash	Login	Home	PG Details

📄 License
This project is for educational/demo purposes only. Not for commercial use.

vbnet
Copy
Edit

Let me know if you'd like to turn this into an actual GitHub `README.md` file with assets or deploy scripts added!







You said:
make a complete file for it


ChatGPT said:
Here is your complete README.md file for the RentalMate project, formatted and ready to paste directly into your project root:

md
Copy
Edit
# 🏠 RentalMate – Premium PG Finder App

🚨 **NOTE:**  
This is a **demo representation** of a cross-platform mobile app (Android/iOS) that is **currently not published on Play Store or App Store**, but is available via **web deployment**.

👉 **Live Web Demo**: [https://rentalmate-demo.web.app](https://rentalmate-demo.web.app)

📲 **Mobile Login OTP is mocked**.  
You can use any **10-digit mobile number**, and the **OTP will always be `123456`**.

---

## 📌 About the Project

**RentalMate** is a modern, visually appealing PG discovery platform for students, professionals, and bachelors. With a black-gold premium UI, the app allows users to:

- Discover nearby PGs and hostels
- View details, images, amenities, and pricing
- Add new PG listings
- Simulate chat with owners
- Manage their profile

All of this is implemented using **mock data + real-time Firebase backend + REST API integrations**, built with React Native and Expo.

---

## ✨ Core Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| 🔐 **Mock Mobile OTP Login** | Login via mobile number (OTP always `123456`)                             |
| 🎬 **Splash Screen**         | Lottie-powered animated splash intro                                    |
| 🏠 **Home Screen**           | Lists PGs from a mock REST API                                          |
| 📄 **PG Detail Screen**      | Full PG info: rent, location, amenities, photos                         |
| ➕ **Add PG Screen**         | Simulated PG add feature (form-based UI)                               |
| 💬 **Chat Screen**          | Simulated chat bubbles using sample messages                            |
| 👤 **Profile Screen**       | Displays user profile and logout                                        |
| 🌐 **Web Deployed**         | Deployed to web using Firebase Hosting                                  |

---

## 🧪 Project Scope

- 🔍 Scalable for real estate PG discovery
- 📍 Can integrate location-based PG search
- 💸 Supports future rent collection and in-app payments
- 🔒 Can be extended for verified landlords via KYC
- 📊 Real-time analytics via Firebase for user tracking

---

## 🧰 Tech Stack

| Category        | Tools / Services                                  |
|------------------|--------------------------------------------------|
| Framework        | **React Native** with **Expo**                   |
| Navigation       | `@react-navigation/native`, `stack`, `bottom-tabs` |
| Auth & DB        | **Firebase Authentication**, Firestore, Storage  |
| API              | **Mock REST API** for PG listings                |
| UI               | Custom design system, Lottie, Icons              |
| Deployment       | **Firebase Hosting** (web build)                 |

---

## 📁 Project Structure

RentalMate/
├── App.js
├── firebaseConfig.js
├── /assets
│ ├── logo.png
│ ├── splash-lottie.json
├── /screens
│ ├── SplashScreen.js
│ ├── LoginScreen.js
│ ├── SignUpScreen.js
│ ├── HomeScreen.js
│ ├── PGDetailScreen.js
│ ├── AddPGScreen.js
│ ├── ChatScreen.js
│ └── ProfileScreen.js
├── /components
│ ├── PGCard.js
│ └── ChatBubble.js
├── /navigation
│ ├── AuthNavigator.js
│ └── MainNavigator.js
├── /style
│ ├── colors.js
│ └── fonts.js

css
Copy
Edit

---

## 🔌 API & Data

**Mock REST API** is used to power HomeScreen and PGDetailScreen.

Sample PG Data:
```json
[
  {
    "id": "pg001",
    "name": "Sky Residency",
    "price": "₹7500/month",
    "location": "Bangalore",
    "image": "https://example.com/pg1.jpg",
    "amenities": ["AC", "Wi-Fi", "Laundry", "Power Backup"]
  }
]
Images are either local or pulled from URLs.

PG data is stored in mock JSON or Firebase.

🚀 Getting Started
🔧 Prerequisites
Node.js ≥ 16

Expo CLI (npm install -g expo-cli)

Firebase account

🛠️ Setup
Clone the repo:

bash
Copy
Edit
git clone https://github.com/your-username/rentalmate.git
cd rentalmate
Install dependencies:

bash
Copy
Edit
npm install
Configure Firebase:

Create a new Firebase project

Enable Authentication (Phone)

Create Firestore DB

Enable Firebase Hosting

Replace the contents of firebaseConfig.js with your project config

Start the App:

bash
Copy
Edit
npx expo start
App can run on Android/iOS emulator or web browser

🖼️ Screenshots
Splash Screen	Login Page	Home Screen	PG Detail
<img width="1919" height="974" alt="Screenshot 2025-07-10 012420" src="https://github.com/user-attachments/assets/78c9e39c-cc7f-4016-bfb7-33c090623be4" />
<img width="825" height="952" alt="Screenshot 2025-07-10 002002" src="https://github.com/user-attachments/assets/11cd0cec-410d-40ba-a70e-4c501780d43f" />
![1000094369](https://github.com/user-attachments/assets/d6002baa-e86b-497b-b8e6-454510e0f937)
![1000094370](https://github.com/user-attachments/assets/436781ff-e83b-4a6a-b8cc-1d023c1bf8aa)
![1000094371](https://github.com/user-attachments/assets/9d4e5555-5309-4ba7-b13a-9d6abe342782)


📌 Future Enhancements
✅ Real-time OTP via Firebase Auth

📍 Geo-location for nearby PGs

💳 Rent Payment Gateway

🧾 Booking Management

📊 Admin Analytics Dashboard

📱 Publish to Play Store & App Store

👤 Author
Dikshant Mahajan
Android Developer, Firebase Integrator
📧 dikshant.mahajan@email.com

📄 License
This project is for educational/demo purposes only.
All APIs, OTP, and data are mocked or sample-based.

© 2025 RentalMate. All rights reserved.

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
