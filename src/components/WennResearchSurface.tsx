import { WennRuntimePanel } from './WennRuntimePanel';
import { useWennRuntime } from '../hooks/useWennRuntime';

export function WennResearchSurface() {
  const { cycle, loading, error } = useWennRuntime();

  return <WennRuntimePanel cycle={cycle} loading={loading} error={error} />;
}
