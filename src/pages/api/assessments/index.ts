import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export interface Assessment {
  nik: string;
  nama: string;
  unit_kerja: string;
  jawaban: { questionId: number; answer: 'A' | 'B' | 'C' | 'D' }[];
  result: {
    telling: number;
    selling: number;
    participating: number;
    delegating: number;
    dominantStyle: string;
  };
  leadership_style: 'Telling' | 'Selling' | 'Participating' | 'Delegating';
  created_at: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('situational_leadership');
    const collection = db.collection<Assessment>('assessments');

    switch (req.method) {
      case 'GET': {
        const { nik, style, startDate, endDate } = req.query;
        const query: Record<string, any> = {};

        if (nik && typeof nik === 'string') query.nik = nik;
        if (style && typeof style === 'string') query.leadership_style = style;

        if (startDate || endDate) {
          query.created_at = {};
          if (startDate && typeof startDate === 'string')
            query.created_at.$gte = new Date(startDate);
          if (endDate && typeof endDate === 'string')
            query.created_at.$lte = new Date(endDate);

          if (Object.keys(query.created_at).length === 0) delete query.created_at;
        }

        const assessments = await collection.find(query).sort({ created_at: -1 }).toArray();
        return res.status(200).json(assessments);
      }

      case 'POST': {
        const body = req.body as Partial<Assessment>;
        console.log('Received assessment data:', body);

        // Validasi dasar
        if (!body.nik || !body.nama) {
          console.log('Missing required fields:', { nik: !body.nik, nama: !body.nama });
          return res.status(400).json({ error: 'NIK dan nama harus diisi' });
        }

        // Validasi jawaban
        if (!Array.isArray(body.jawaban) || body.jawaban.length === 0) {
          console.log('Invalid jawaban:', body.jawaban);
          return res.status(400).json({ error: 'Jawaban tidak valid' });
        }

        // Validasi result
        if (!body.result || 
            typeof body.result.telling !== 'number' ||
            typeof body.result.selling !== 'number' ||
            typeof body.result.participating !== 'number' ||
            typeof body.result.delegating !== 'number') {
          console.log('Invalid result:', body.result);
          return res.status(400).json({ error: 'Data hasil tidak valid' });
        }

        // Validasi leadership style
        if (!body.leadership_style || 
            !['Telling', 'Selling', 'Participating', 'Delegating'].includes(body.leadership_style)) {
          console.log('Invalid leadership style:', body.leadership_style);
          return res.status(400).json({ error: 'Gaya kepemimpinan tidak valid' });
        }

        const assessment: Assessment = {
          nik: body.nik,
          nama: body.nama,
          unit_kerja: body.unit_kerja || '',
          jawaban: body.jawaban,
          result: {
            telling: body.result.telling,
            selling: body.result.selling,
            participating: body.result.participating,
            delegating: body.result.delegating,
            dominantStyle: body.result.dominantStyle || body.leadership_style
          },
          leadership_style: body.leadership_style,
          created_at: new Date(),
        };

        console.log('Processed assessment data:', assessment);
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
