import { useEffect, useState } from "react";

export default function RelatorioFinanceiro() {
  const [atividades, setAtividades] = useState([]);
  const [construtoras, setConstrutoras] = useState([]);
  const [obras, setObras] = useState([]);
  const [valores, setValores] = useState({});

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
    setValores(JSON.parse(localStorage.getItem("valoresServicos") || "{}"));
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

  const calcularTotal = () => {
    return filtradas.reduce((acc, item) => {
      const chave = `${item.equipamento}-${item.servico}`;
      const valor = parseFloat(valores[chave] || 0);
      return acc + valor;
    }, 0).toFixed(2);
  };

  const exportarWhatsApp = () => {
    const linhas = filtradas.map((item) => {
      const chave = `${item.equipamento}-${item.servico}`;
      const valor = parseFloat(valores[chave] || 0).toFixed(2);
      return `${item.servico} - ${item.equipamento} (${item.construtora} / ${item.obra}) - ${formatarData(item.dataLiberacao)} - R$ ${valor}`;
    });

    const texto = `📊 *Relatório Financeiro*\n\n${linhas.join("\n")}\n\nTotal: R$ ${calcularTotal()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">💰 Relatório Financeiro</h2>

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
        {filtradas.map((item) => {
          const chave = `${item.equipamento}-${item.servico}`;
          const valor = parseFloat(valores[chave] || 0).toFixed(2);
          return (
            <li key={item.id} className="border p-3 rounded bg-white shadow-sm">
              <strong>{item.servico} - {item.equipamento}</strong> <br />
              {item.construtora} / {item.obra} <br />
              Liberado: {formatarData(item.dataLiberacao)} <br />
              💲 R$ {valor}
            </li>
          );
        })}
      </ul>

      <div className="mt-4 font-bold">
        Total: R$ {calcularTotal()}
      </div>

      <button
        onClick={exportarWhatsApp}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2"
      >
        Enviar por WhatsApp
      </button>
    </div>
  );
}
