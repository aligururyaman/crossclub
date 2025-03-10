"use client";

import { useEffect, useState } from 'react';
import { db } from '@/utils/firestore';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ScoreboardPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresRef = collection(db, "scores");
        const q = query(scoresRef, orderBy("score", "desc"), limit(100));
        const querySnapshot = await getDocs(q);

        const scoresData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setScores(scoresData);
      } catch (error) {
        console.error("Skorlar yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skor Tablosu
          </h1>
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Ana Sayfa
            </Button>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Kullanıcı Adı</th>
                  <th className="px-6 py-4 text-right">Skor</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr
                    key={score.id}
                    className="border-b border-gray-200 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      {score.username}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600">
                      {score.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 