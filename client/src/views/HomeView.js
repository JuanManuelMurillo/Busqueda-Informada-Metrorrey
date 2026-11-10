import { useHealthViewModel } from '../viewmodels/useHealthViewModel';

export function HomeView() {
  const { statusText, error } = useHealthViewModel();

  return (
    <main>

      <section>
        <span>{statusText}</span>
      </section>

      {error && <p>{error}</p>}

    </main>
  );
}
