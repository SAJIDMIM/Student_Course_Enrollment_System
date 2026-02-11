require('dotenv').config();

class LoginController {
  static login(req, res) {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Admin login check
    if (email === adminEmail && password === adminPassword) {
      return res.status(200).json({
        name: 'Admin',
        role: 'admin',
        email: adminEmail
      });
    }

    // If you want student login later, add DB check here

    return res.status(401).json({ message: 'Invalid credentials' });
  }
}

module.exports = LoginController;
