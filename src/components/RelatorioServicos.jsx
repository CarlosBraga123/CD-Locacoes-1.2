import { useEffect, useState } from "react";

export default function RelatorioServicos() {
  const [atividades, setAtividades] = useState([]);
  const [construtoras, setConstrutoras] = useState([]);
  const [obras, setObras] = useState([]);

  const [filtros, setFiltros] = useState({
    construtora: "",
    obra: "",
    dataInicio: "",
    dataFim: "",
  });

  useEffect(() => {
    setAtividades(JSON.parse(localStorage.getItem("atividades") || "[]"));
    setConstrutoras(JSON.parse(localStorage.getItem("construtoras") || "[]"));
    setObras(JSON.parse(localStorage.getItem("obras") || "[]"));
  }, []);

  const formatarData = (data) => {
    if (!data) return "—";
    const [y, m, d] = data.split("-");
    return `${d}/${m}/${y}`;
  };

  const filtradas = atividades.filter((a) => {
    const dentroConstrutora = !filtros.construtora || a.construtora === filtros.construtora;
    const dentroObra = !filtros.obra || a.obra === filtros.obra;

    const dentroPeriodo =
      (!filtros.dataInicio || a.dataLiberacao >= filtros.dataInicio) &&
      (!filtros.dataFim || a.dataLiberacao <= filtros.dataFim);

    return dentroConstrutora && dentroObra && dentroPeriodo;
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">📄 Relatório de Serviços</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <select
          value={filtros.construtora}
          onChange={(e) => setFiltros({ ...filtros, construtora: e.target.value, obra: "" })}
          className="border p-2 rounded"
        >
          <option value="">Todas as Construtoras</option>
          {construtoras.map((c) => (
            <option key={c.id} value={c.nome}>{c.nome}</option>
          ))}
        </select>

        <select
          value={filtros.obra}
          onChange={(e) => setFiltros({ ...filtros, obra: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Todas as Obras</option>
          {obras
            .filter((o) => !filtros.construtora || o.construtora === filtros.construtora)
            .map((o) => (
              <option key={o.id} value={o.nome}>{o.nome}</option>
            ))}
        </select>

        <input
          type="date"
          value={filtros.dataInicio}
          onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filtros.dataFim}
          onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <ul className="mt-4 space-y-2">
        {filtradas.map((item) => (
          <li key={item.id} className="border p-3 rounded bg-white shadow-sm">
            <strong>{item.servico} - {item.equipamento}</strong>
            {item.equipamento === "Balancinho" && item.tamanho ? ` [${item.tamanho}m]` : ""}<br />
            {item.construtora} / {item.obra} <br />
            Liberado: {formatarData(item.dataLiberacao)}
          </li>
        ))}
      </ul>
    </div>
  );
}
