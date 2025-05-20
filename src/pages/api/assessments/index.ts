// pages/api/assessments/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Assessment } from '@/models/Assessment';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("situational_leadership");
    const collection = db.collection<Assessment>("assessments");

    switch (req.method) {
      case 'GET': {
        // Ambil dan validasi query params
        const { nik, style, startDate, endDate } = req.query;
        const query: Record<string, any> = {};

        if (nik && typeof nik === 'string') {
          query.nik = nik;
        }

        if (style && typeof style === 'string') {
          query.leadership_style = style;
        }

        if (startDate || endDate) {
          query.created_at = {};
          if (startDate && typeof startDate === 'string') query.created_at.$gte = new Date(startDate);
          if (endDate && typeof endDate === 'string') query.created_at.$lte = new Date(endDate);
          // Jika created_at kosong (karena tanggal tidak valid), hapus properti query
          if (Object.keys(query.created_at).length === 0) delete query.created_at;
        }

        const assessments = await collection.find(query).sort({ created_at: -1 }).toArray();
        return res.status(200).json(assessments);
      }

      case 'POST': {
        // Validasi body dasar
        const body = req.body as Partial<Assessment>;
        if (
          !body.nik || typeof body.nik !== 'string' ||
          !body.nama || typeof body.nama !== 'string' ||
          !body.unit_kerja || typeof body.unit_kerja !== 'string' ||
          !Array.isArray(body.jawaban) ||
          !body.result ||
          !['Telling', 'Selling', 'Participating', 'Delegating'].includes(body.leadership_style || '')
        ) {
          return res.status(400).json({ error: 'Invalid assessment data' });
        }

        const assessment: Assessment = {
          nik: body.nik,
          nama: body.nama,
          unit_kerja: body.unit_kerja,
          jawaban: body.jawaban,
          result: body.result,
          leadership_style: body.leadership_style as Assessment['leadership_style'],
          created_at: new Date(),
        };

        const result = await collection.insertOne(assessment);
        return res.status(201).json({ id: result.insertedId, ...assessment });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
