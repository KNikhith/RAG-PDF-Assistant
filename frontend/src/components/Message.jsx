export default function Message({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-[11px] font-semibold text-white shadow-2xs">
          AI
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "bg-zinc-900 text-white shadow-2xs"
            : "border border-zinc-200/80 bg-white text-zinc-800 shadow-[0_2px_10px_-4px_rgba(24,24,27,0.06)]"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>

      {isUser && (
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-[11px] font-semibold text-zinc-700">
          You
        </div>
      )}
    </div>
  );
}
