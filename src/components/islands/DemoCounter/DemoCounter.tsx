import { useState } from 'react';

import './demo-counter.css';

export type DemoCounterProps = {
  initial?: number;
};

const STEP_OPTIONS = [1, 2, 5] as const;

export default function DemoCounter({ initial = 0 }: DemoCounterProps) {
  const [count, setCount] = useState(initial);
  const [step, setStep] = useState<number>(STEP_OPTIONS[0]);

  return (
    <section className="demo-counter" aria-live="polite">
      <div className="demo-counter__meta">
        <p className="demo-counter__eyebrow">React hydration demo</p>
        <p className="demo-counter__value">{count}</p>
      </div>
      <div className="demo-counter__controls">
        <label className="demo-counter__label">
          <span>Step</span>
          <select
            className="demo-counter__select"
            value={step}
            onChange={(event) => setStep(Number.parseInt(event.target.value, 10))}
          >
            {STEP_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <div className="demo-counter__buttons">
          <button
            type="button"
            className="demo-counter__button demo-counter__button--ghost"
            onClick={() => setCount((value) => value - step)}
          >
            −
          </button>
          <button
            type="button"
            className="demo-counter__button"
            onClick={() => setCount((value) => value + step)}
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}

DemoCounter.displayName = 'DemoCounter';
