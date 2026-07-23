import { useDigitModel } from '@/hooks/useDigitModel';
import { DrawingCanvas } from '@/components/DrawingCanvas';
import { PredictionPanel } from '@/components/PredictionPanel';
import { Sparkles, Loader2, AlertCircle, Github, Brain, Pencil, BarChart3 } from 'lucide-react';

export default function App() {
  const { modelState, predictions, isInferring, predict, clearPredictions } = useDigitModel();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-500/3 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm bg-black/20">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-white leading-tight">Digit Recognizer</h1>
                <p className="text-xs text-slate-400 leading-tight">CNN · MNIST · TensorFlow.js</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {modelState.status === 'ready' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Model Ready
                </span>
              )}
              {(modelState.status === 'loading' || modelState.status === 'training') && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {modelState.status === 'training'
                    ? `Training ${modelState.epoch}/${modelState.totalEpochs}`
                    : 'Loading'}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero */}
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Runs entirely in your browser
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Draw a digit.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Let AI read it.
              </span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              A convolutional neural network trained on the MNIST dataset recognizes
              handwritten digits (0–9) in real time, right on your device.
            </p>
          </div>

          {modelState.status === 'error' && (
            <div className="max-w-md mx-auto mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Failed to load model</p>
                <p className="text-xs text-red-300/70 mt-1">{modelState.error}</p>
              </div>
            </div>
          )}

          {/* Workspace */}
          <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Drawing panel */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Pencil className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Canvas</h3>
              </div>
              <DrawingCanvas
                onStrokeEnd={predict}
                onClear={clearPredictions}
              />
              {modelState.status !== 'ready' && (
                <p className="mt-4 text-xs text-slate-500 text-center">
                  Drawing is enabled — predictions begin once the model finishes training.
                </p>
              )}
            </div>

            {/* Prediction panel */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Results</h3>
              </div>
              {modelState.status === 'loading' ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                  <p className="text-sm text-slate-400">Preparing dataset...</p>
                </div>
              ) : modelState.status === 'training' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                  <p className="text-sm font-semibold text-white mb-1">
                    Training neural network
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Epoch {modelState.epoch} of {modelState.totalEpochs}
                  </p>
                  {modelState.accuracy != null && (
                    <div className="w-full max-w-xs">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                          style={{
                            width: `${((modelState.epoch ?? 0) / (modelState.totalEpochs ?? 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-mono text-emerald-400">
                        accuracy: {Math.round((modelState.accuracy ?? 0) * 100)}%
                      </p>
                    </div>
                  )}
                  <p className="mt-4 text-xs text-slate-500 max-w-xs">
                    On first load the model trains on 55,000 MNIST digits in your browser.
                    It caches automatically for instant future use.
                  </p>
                </div>
              ) : (
                <PredictionPanel predictions={predictions} isInferring={isInferring} />
              )}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
            {[
              { title: 'On-device training', desc: 'CNN trains in-browser, cached in IndexedDB' },
              { title: 'CNN Architecture', desc: 'Conv2D x2 ? Dense(128) ? Dense(10)' },
              { title: '55k MNIST samples', desc: 'Trained on the standard 55,000-digit set' },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <p className="text-sm font-semibold text-white mb-1">{card.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Built with React, TensorFlow.js, and Tailwind CSS
            </p>
            <a
              href="https://github.com/tensorflow/tfjs-models"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <Github className="w-3.5 h-3.5" />
              tfjs-models
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
