# Blogify App

Welcome to Blogify - a powerful and feature-rich blogging application built with Quasar, Firebase, and Node.js. This app provides a seamless experience for creating, updating, deleting, liking, and favoriting blog posts. It also comes with Progressive Web App (PWA) features and push notifications to enhance user engagement.
![Untitled design](https://github.com/divyasonaraa/quasar-blogify/assets/129390572/c1c84600-1e66-4b4b-a6ee-f8c166824f5d)


## Demo

Check out the live demo of Blogify at [https://quasar-blogify.netlify.app/#/](https://quasar-blogify.netlify.app/#/)

## Features

- **Create, Update, and Delete Posts:** Easily manage your blog content with intuitive CRUD operations.
  
- **Like and Favorite Posts:** Engage with your audience by allowing them to express their appreciation for your posts through likes and favorites.

- **PWA Features:** Enjoy a seamless offline experience and quick access to the app from your home screen, thanks to Progressive Web App features.

- **Push Notifications:** Stay connected with your audience by sending push notifications for important updates or new blog posts.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Quasar CLI](https://quasar.dev/start/quasar-cli)
- Firebase account and project
- Node.js backend (included in the subfolder)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/divyasonaraa/quasar-blogify.git
   ```

2. Navigate to the project folder:

   ```bash
   cd quasar-blogify
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up Firebase:

   - Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
   - Obtain your Firebase configuration (API Key, Auth Domain, Database URL, etc.).
   - Replace the Firebase configuration in `src/boot/firebase.js` with your own.

5. Run the app in PWA mode:

   ```bash
   quasar dev -m pwa
   ```

   The app will be accessible at `http://localhost:9200`.


### Backend

The Node.js backend is included in the `backend` subfolder. Follow the instructions below to set it up:

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the backend server:

   ```bash
   npm start
   ```

   The backend will be accessible at `http://localhost:3000`.

## Contributing

Feel free to contribute to the development of Blogify. Submit bug reports, suggest new features, or even contribute directly by submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Quasar Framework](https://quasar.dev/)
- [Firebase](https://firebase.google.com/)
- Node.js Community

Thank you for using Blogify! If you have any questions or issues, feel free to open an [issue](https://github.com/your-username/blogify/issues). Happy blogging!
