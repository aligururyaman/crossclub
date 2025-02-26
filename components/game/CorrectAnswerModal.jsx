export default function CorrectAnswerModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Doğru Cevap! 🎉
        </h3>
      </div>
    </div>
  );
}