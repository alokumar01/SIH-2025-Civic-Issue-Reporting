import Logo from "@/components/Logo";

export default function HeroSection() {
  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-6 md:p-12 text-primary-foreground">
      <div className="max-w-md text-white">
        <div className="flex justify-center mb-6">
            <Logo height="300" width="300"/>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow">
          Sahyogi
        </h1>
        <p className="text-lg md:text-xl opacity-95 leading-relaxed mb-6">
          आपका सुझाव, हमारी ज़िम्मेदारी — शिकायत दर्ज कराएं, हल पाएं।
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="text-sm">
            Transparent reporting · Timely responses · Community-driven
          </div>
        </div>
      </div>
    </div>
  );
}
