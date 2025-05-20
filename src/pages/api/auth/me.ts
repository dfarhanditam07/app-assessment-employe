import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Tidak ada sesi login' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      nik: string;
      nama: string;
      role: string;
    };

    if (!decoded.nik || !decoded.nama || !decoded.role) {
      return res.status(401).json({ message: 'Data token tidak lengkap' });
    }

    return res.status(200).json(decoded);
  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
}
