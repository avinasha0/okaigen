"use client";

export function DemoSuggestedQuestions({
  botId,
  questions,
}: {
  botId: string;
  questions: string[];
}) {
  function handleClick(text: string) {
    window.dispatchEvent(
      new CustomEvent("sitebotgpt-send", {
        detail: { botId, text },
      })
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => handleClick(q)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-[#1a6aff]/40 hover:bg-[#1a6aff]/5 hover:text-[#1a6aff] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/30 focus:ring-offset-2"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
