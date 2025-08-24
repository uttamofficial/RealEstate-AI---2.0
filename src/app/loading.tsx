import Logo from "@/components/icons/logo";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Logo className="w-24 h-24 text-primary animate-pulse" />
        <p className="font-headline text-2xl text-primary animate-pulse">
          Analyzing Market Data...
        </p>
      </div>
    </div>
  );
}
