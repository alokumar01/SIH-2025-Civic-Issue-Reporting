export default function HeroSection() {
  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-6 md:p-12 text-primary-foreground">
      <div className="max-w-md text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow">
          Sayogi
        </h1>
        <p className="text-lg md:text-xl opacity-95 leading-relaxed mb-6">
          आपका सुझाव, हमारी ज़िम्मेदारी — शिकायत दर्ज कराएं, हल पाएं।
        </p>

        <div className="flex items-center justify-center gap-3">
          {/* <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-90"
          >
            <path d="M12 2L3 7v6c0 5 3.8 9.8 9 11 5.2-1.2 9-6 9-11V7l-9-5z" fill="currentColor" opacity="0.08" />
            <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="currentColor" strokeWidth="0.8" fill="none" />
          </svg> */}
          <div className="text-sm">
            Transparent reporting · Timely responses · Community-driven
          </div>
        </div>
      </div>
    </div>
  );
}
