"use client";

interface WellnessSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  colorClass?: string;
}

export function WellnessSlider({ label, value, onChange, colorClass = "accent-calm-600" }: WellnessSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-stone-700 dark:text-stone-300">{label}</label>
        <span className="text-lg font-bold text-calm-600">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-stone-200 dark:bg-stone-700 ${colorClass}`}
      />
      <div className="flex justify-between text-xs text-stone-400">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}
