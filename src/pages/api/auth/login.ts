import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { nik, password } = req.body;

    if (!nik || !password) {
      return res.status(400).json({ message: 'NIK dan password harus diisi' });
    }

    const client = await clientPromise;
    const db = client.db('situational_leadership');
    const users = db.collection('users');

    const user = await users.findOne({ nik });

    if (!user) {
      return res.status(401).json({ message: 'NIK tidak ditemukan' });
    }

    // ⚠️ Idealnya gunakan hashing seperti bcrypt (ini hanya demo)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const payload = {
      nik: user.nik,
      nama: user.nama,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24,
      path: '/',
    };

    res.setHeader('Set-Cookie', [
      serialize('token', token, cookieOptions),
      serialize('role', user.role, cookieOptions),
    ]);

    return res.status(200).json({ message: 'Login berhasil', user: payload });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}
