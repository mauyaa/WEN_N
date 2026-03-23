import { WennPredictionPanel } from './WennPredictionPanel';
import { WennRegimePanel } from './WennRegimePanel';
import { WennInsightsPanel } from './WennInsightsPanel';
import { WennCommandBundle } from '../hooks/useWennCommandBundle';

interface WennOperatorStackProps {
  bundle: WennCommandBundle | null;
  loading?: boolean;
  error?: string | null;
}

export function WennOperatorStack({ bundle, loading, error }: WennOperatorStackProps) {
  return (
    <div className="space-y-8">
      <WennPredictionPanel
        data={bundle ? { insights: bundle.insights, prediction: bundle.prediction } : null}
        loading={loading}
        error={error}
      />
      <WennRegimePanel bundle={bundle} />
      <WennInsightsPanel bundle={bundle} />
    </div>
  );
}
