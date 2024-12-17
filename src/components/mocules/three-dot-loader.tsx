export function ThreeDotsLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4">
      <div className="size-3 animate-bounce rounded-full bg-gray-300"></div>
      <div className="size-3 animate-bounce rounded-full bg-gray-300 delay-150"></div>
      <div className="size-3 animate-bounce rounded-full bg-gray-300 delay-300"></div>
    </div>
  );
}
