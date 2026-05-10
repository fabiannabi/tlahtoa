import { saludoTlahtoa, crearPartida, escenarioFacil } from "@tlahtoa/core";
import type { ResourceKind, BarrioId, RolId } from "@tlahtoa/core";
import "./styles.css";

const LABEL_RECURSO: Record<ResourceKind, string> = {
  maiz:         "Maíz — Tlaolli",
  copal:        "Copal — Copalli",
  jade:         "Jade — Chalchiuitl",
  ft:           "Fuerza de Trabajo",
  conocimiento: "Conocimiento — Toltecayotl",
};

const LABEL_ROL: Record<RolId, string> = {
  sacerdote:   "Teopixqui — Sacerdote",
  general:     "Cuāuhpilli — General",
  comerciante: "Pochtecatl — Comerciante",
  curandera:   "Ticitl — Curandera",
  astronomo:   "Tonalpouhqui — Astrónomo",
};

const estado = crearPartida(escenarioFacil);

export function App() {
  return (
    <main className="app">
      <h1>Tlahtoa</h1>

      <p className="lead">{saludoTlahtoa()}</p>

      <p className="muted">
        Si ves los recursos abajo, el monorepo funciona y la UI importa desde{" "}
        <code>@tlahtoa/core</code>. Escenario:{" "}
        <em>{estado.escenario.nombre}</em> — Ciclo {estado.cicloActual}/
        {estado.escenario.ciclosTotales}
      </p>

      <section>
        <h2>Recursos del escenario fácil</h2>
        <ul className="recursos">
          {(Object.keys(estado.recursos) as ResourceKind[]).map((key) => {
            const r = estado.recursos[key];
            return (
              <li key={key}>
                <span className="resource-name">{LABEL_RECURSO[key]}</span>
                <span className="resource-value">
                  {r.valor}
                  <span className="resource-max">/{r.maximo}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Barrios</h2>
        <ul className="barrios">
          {(Object.keys(estado.barrios) as BarrioId[]).map((id) => {
            const b = estado.barrios[id];
            return (
              <li key={id} data-activo={b.activo}>
                <span className="barrio-nombre">{b.nombre}</span>
                <span className={`barrio-estado ${b.activo ? "activo" : "caido"}`}>
                  {b.activo ? "Activo" : "Caído"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Consejo</h2>
        <ul className="jugadores">
          {estado.jugadores.map((j) => (
            <li key={j.rol}>
              <span className="rol-nombre">{LABEL_ROL[j.rol]}</span>
              <span className="rol-info">
                Nivel {j.nivel} · {j.accionesRestantes} acc.
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mazo de eventos ({estado.mazoEventos.length} cartas)</h2>
        <ul className="mazo">
          {estado.mazoEventos.map((carta, i) => (
            <li key={carta.id} className={`carta-${carta.categoria}`}>
              <span className="carta-pos">#{i + 1}</span>
              <span className="carta-nombre">{carta.nombre}</span>
              <span className="carta-cat">{carta.categoria}</span>
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
                Ciclo {entrada.ciclo} — {entrada.fase}
              </span>
              <span className="log-msg">{entrada.mensaje}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
