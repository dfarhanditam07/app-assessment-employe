import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const client = await clientPromise;
    const db = client.db('situational_leadership');
    const collection = db.collection('assessments');

    const [total, styleStats, scoreStats, weeklyStats] = await Promise.all([
      collection.countDocuments(),

      collection.aggregate([
        { $group: { _id: '$leadership_style', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray(),

      collection.aggregate([
        {
          $group: {
            _id: null,
            telling: { $avg: '$result.telling' },
            selling: { $avg: '$result.selling' },
            participating: { $avg: '$result.participating' },
            delegating: { $avg: '$result.delegating' }
          }
        }
      ]).toArray(),

      collection.aggregate([
        {
          $match: {
            created_at: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()
    ]);

    const score = scoreStats[0] || {
      telling: 0,
      selling: 0,
      participating: 0,
      delegating: 0
    };

    return res.status(200).json({
      totalAssessments: total,
      leadershipStyles: styleStats.map(style => ({
        style: style._id,
        count: style.count
      })),
      averageScores: {
        telling: Number(score.telling.toFixed(2)),
        selling: Number(score.selling.toFixed(2)),
        participating: Number(score.participating.toFixed(2)),
        delegating: Number(score.delegating.toFixed(2))
      },
      assessmentsByDate: weeklyStats.map(item => ({
        date: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
