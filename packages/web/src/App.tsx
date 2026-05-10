import { saludoTlahtoa, escenarioFacilResources, ResourceKind } from "@tlahtoa/core";

export function App() {
  return (
    <main className="app">
      <h1>Tlahtoa</h1>

      <p className="lead">{saludoTlahtoa()}</p>

      <p className="muted">
        Si ves los recursos abajo, el monorepo funciona y la UI ya importa desde{" "}
        <code>@tlahtoa/core</code>.
      </p>

      <section>
        <h2>Recursos del escenario fácil</h2>
        <ul className="recursos">
          {(Object.keys(escenarioFacilResources) as ResourceKind[]).map((key) => (
            <li key={key}>
              <span className="resource-name">{key}</span>
              <span className="resource-value">{escenarioFacilResources[key]}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
