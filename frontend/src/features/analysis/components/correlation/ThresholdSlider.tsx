interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function ThresholdSlider({
  value,
  onChange,
}: ThresholdSliderProps) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Correlation Threshold
          </h3>

          <p className="text-xs text-slate-500">
            Show correlations stronger than the selected value.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {value.toFixed(2)}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer rounded-lg"
      />

      <div className="mt-3 flex justify-between text-xs text-slate-500">
        <span>Weak (0.00)</span>
        <span>Moderate (0.50)</span>
        <span>Strong (1.00)</span>
      </div>
    </div>
  );
}