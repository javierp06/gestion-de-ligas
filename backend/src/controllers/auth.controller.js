const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/mysql');
const { logActivity } = require('../utils/activityLogger');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    const pool = getPool();

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario - SIEMPRE como 'user'
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, 'user']
    );

    // Registrar actividad
    await logActivity({
      userId: result.insertId,
      userName: name,
      action: 'register',
      resource: 'user',
      resourceId: result.insertId,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Cuando crees tu primera liga, te convertirás en organizador automáticamente.',
      data: {
        id: result.insertId,
        email,
        name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();

    // Buscar usuario
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Guardar refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt]
    );

    // Registrar actividad
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: 'login',
      resource: 'user',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    const pool = getPool();

    // Verificar refresh token
    const [tokens] = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [refreshToken]
    );

    if (tokens.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido o expirado'
      });
    }

    // Verificar JWT
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token inválido'
        });
      }

      // Obtener usuario
      const [users] = await pool.query(
        'SELECT id, email, role FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const user = users[0];

      // Generar nuevo access token
      const newAccessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });
    });
  } catch (error) {
    console.error('Error en refresh token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al refrescar token'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const pool = getPool();

    if (refreshToken) {
      await pool.query(
        'DELETE FROM refresh_tokens WHERE token = ?',
        [refreshToken]
      );
    }

    // Registrar actividad
    await logActivity({
      userId: req.user.id,
      userName: req.user.name || 'Usuario',
      action: 'logout',
      resource: 'user',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión'
    });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const pool = getPool();

    // Verificar token de Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Buscar usuario por google_id o email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE google_id = ? OR email = ?',
      [googleId, email]
    );

    let user;

    if (users.length === 0) {
      // Crear nuevo usuario
      const [result] = await pool.query(
        'INSERT INTO users (name, email, google_id, avatar, role, password) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, googleId, picture, 'user', 'GOOGLE_AUTH_NO_PASSWORD']
      );

      user = {
        id: result.insertId,
        name,
        email,
        role: 'user',
        avatar: picture
      };

      await logActivity({
        userId: user.id,
        userName: user.name,
        action: 'register',
        resource: 'user',
        resourceId: user.id,
        details: { method: 'google' },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
    } else {
      user = users[0];

      // Actualizar google_id y avatar si faltan
      if (!user.google_id || !user.avatar) {
        await pool.query(
          'UPDATE users SET google_id = ?, avatar = ? WHERE id = ?',
          [googleId, picture, user.id]
        );
        user.avatar = picture;
      }
    }

    // Generar tokens (igual que login normal)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshToken, expiresAt]
    );

    await logActivity({
      userId: user.id,
      userName: user.name,
      action: 'login',
      resource: 'user',
      details: { method: 'google' },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'Login con Google exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        },
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en Google login:', error);
    res.status(401).json({
      success: false,
      message: 'Token de Google inválido'
    });
  }
};

// Obtener perfil del usuario actual
const getProfile = async (req, res) => {
  try {
    const pool = getPool();
    const [users] = await pool.query(
      'SELECT id, email, name, role, phone, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  getProfile
};
