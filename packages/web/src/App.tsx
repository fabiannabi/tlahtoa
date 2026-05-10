import { saludoTlahtoa, createInitialState } from "@tlahtoa/core";
import type { ResourceKind, DistrictId, RoleId } from "@tlahtoa/core";
import "./styles.css";

const LABEL_RECURSO: Record<ResourceKind, string> = {
  maiz:         "Maíz — Tlaolli",
  copal:        "Copal — Copalli",
  jade:         "Jade — Chalchiuitl",
  ft:           "Fuerza de Trabajo",
  conocimiento: "Conocimiento — Toltecayotl",
};

const LABEL_ROL: Record<RoleId, string> = {
  sacerdote:   "Teopixqui — Sacerdote",
  general:     "Cuāuhpilli — General",
  comerciante: "Pochtecatl — Comerciante",
  curandera:   "Ticitl — Curandera",
  astronomo:   "Tonalpouhqui — Astrónomo",
};

const estado = createInitialState({
  scenarioId: 1,
  jugadores: [
    { nombre: 'Jugador 1', role: 'sacerdote' },
    { nombre: 'Jugador 2', role: 'general' },
    { nombre: 'Jugador 3', role: 'curandera' },
    { nombre: 'Jugador 4', role: 'astronomo' },
  ],
  seed: 20250510,
});

export function App() {
  return (
    <main className="app">
      <h1>Tlahtoa</h1>

      <p className="lead">{saludoTlahtoa()}</p>

      <p className="muted">
        Si ves los recursos abajo, el monorepo funciona y la UI importa desde{" "}
        <code>@tlahtoa/core</code>. Escenario:{" "}
        <em>{estado.scenario.nombre}</em> — Ciclo {estado.currentCycle}/
        {estado.scenario.totalCycles}
      </p>

      <section>
        <h2>Recursos del escenario fácil</h2>
        <ul className="recursos">
          {(Object.keys(estado.resources) as ResourceKind[]).map((key) => {
            const r = estado.resources[key];
            return (
              <li key={key}>
                <span className="resource-name">{LABEL_RECURSO[key]}</span>
                <span className="resource-value">
                  {r.value}
                  <span className="resource-max">/{r.max}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Barrios</h2>
        <ul className="barrios">
          {(Object.keys(estado.districts) as DistrictId[]).map((id) => {
            const b = estado.districts[id];
            return (
              <li key={id} data-activo={b.active}>
                <span className="barrio-nombre">{b.nombre}</span>
                <span className={`barrio-estado ${b.active ? "activo" : "caido"}`}>
                  {b.active ? "Activo" : "Caído"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Consejo</h2>
        <ul className="jugadores">
          {estado.players.map((j) => (
            <li key={j.role}>
              <span className="rol-nombre">{LABEL_ROL[j.role]}</span>
              <span className="rol-info">
                {j.nombre} · Nivel {j.level} · {j.actionsLeft} acc.
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mazo de eventos ({estado.eventDeck.length} cartas)</h2>
        <ul className="mazo">
          {estado.eventDeck.map((carta, i) => (
            <li key={carta.id} className={`carta-${carta.category}`}>
              <span className="carta-pos">#{i + 1}</span>
              <span className="carta-nombre">{carta.nombre}</span>
              <span className="carta-cat">{carta.category}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Bitácora</h2>
        <ul className="log">
          {estado.log.map((entrada, i) => (
            <li key={i}>
              <span className="log-meta">
                Ciclo {entrada.cycle} — {entrada.phase}
              </span>
              <span className="log-msg">{entrada.mensaje}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
