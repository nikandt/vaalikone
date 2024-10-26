const config = {
    apiKey: "AIzaSyCAJr0-x7zJlaDtAqqe_VM7uhicxXFah88",
    authDomain: "vaalikone-fcfd6.firebaseapp.com",
    projectId: "vaalikone-fcfd6",
    storageBucket: "vaalikone-fcfd6.appspot.com",
    messagingSenderId: "699069963997",
    appId: "1:699069963997:web:93611d6c03fe065cbfc534",
    measurementId: "G-M3YQ1JZKX9"
  };


  // When deployed, there are quotes that need to be stripped
Object.keys(config).forEach((key) => {
  const configValue = config[key] + "";
  if (configValue.charAt(0) === '"') {
    config[key] = configValue.substring(1, configValue.length - 1);
  }
});

export const firebaseConfig = config;