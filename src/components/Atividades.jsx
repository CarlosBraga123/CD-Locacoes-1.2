import { useEffect, useState } from "react";

export default function Atividades() {
  const [construtoras, setConstrutoras] = useState([]);
  const [obras, setObras] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [mostrarMateriaisId, setMostrarMateriaisId] = useState(null);

  const [form, setForm] = useState({
    id: null,
    construtora: "",
    obra: "",
    equipamento: "",
    servico: "",
    tamanho: "",
    tamanhoAnterior: "",
    ancoragem: "",
    dataAgendamento: "",
    dataLiberacao: "",
    observacoes: "",
  });

  useEffect(() => {
    setConstrutoras(JSON.parse(localStorage.getItem("construtoras") || "[]"));
    setObras(JSON.parse(localStorage.getItem("obras") || "[]"));
    setAtividades(JSON.parse(localStorage.getItem("atividades") || "[]"));
  }, []);

  const formatarData = (data) => {
    if (!data) return "";
    const [y, m, d] = data.split("-");
    return `${d}/${m}/${y}`;
  };

  const salvar = () => {
    const nova = {
      ...form,
      id: form.id || Date.now(),
      tamanho: form.servico === "Deslocamento" ? form.tamanho : form.tamanho,
      tamanhoAnterior: form.servico === "Deslocamento" ? form.tamanhoAnterior : "",
    };

    const atualizadas = form.id
      ? atividades.map((a) => (a.id === form.id ? nova : a))
      : [nova, ...atividades];

    setAtividades(atualizadas);
    localStorage.setItem("atividades", JSON.stringify(atualizadas));

    setForm({
      id: null,
      construtora: "",
      obra: "",
      equipamento: "",
      servico: "",
      tamanho: "",
      tamanhoAnterior: "",
      ancoragem: "",
      dataAgendamento: "",
      dataLiberacao: "",
      observacoes: "",
    });
  };

  const editar = (item) => setForm(item);

  const excluir = (id) => {
    if (confirm("Deseja excluir este registro?")) {
      const atualizadas = atividades.filter((a) => a.id !== id);
      setAtividades(atualizadas);
      localStorage.setItem("atividades", JSON.stringify(atualizadas));
    }
  };

  const liberar = (id) => {
    const atualizadas = atividades.map((a) =>
      a.id === id
        ? { ...a, dataLiberacao: new Date().toISOString().split("T")[0] }
        : a
    );
    setAtividades(atualizadas);
    localStorage.setItem("atividades", JSON.stringify(atualizadas));
  };

  const materiais = (item) => {
    const lista = [];
    const pecasBalancinho = JSON.parse(localStorage.getItem("pecasBalancinho") || "{}");
    const pecasAncoragem = JSON.parse(localStorage.getItem("pecasAncoragem") || "{}");

    if (item.equipamento === "Balancinho") {
      const tamanhoParaUso = item.servico === "Deslocamento" ? item.tamanho : item.tamanho;
      const peçasTamanho = pecasBalancinho[tamanhoParaUso];
      if (peçasTamanho) {
        lista.push(...peçasTamanho.split(",").map((p) => p.trim()));
      }
      const peçasAncoragem = pecasAncoragem[item.ancoragem];
      if (peçasAncoragem) {
        lista.push(...peçasAncoragem.split(",").map((p) => p.trim()));
      }
    }

    if (item.equipamento === "Mini Grua") {
      lista.push("Mini Grua completa", "Base", "Cabo de Aço", "Controle");
    }

    return lista;
  };

  const enviarWhatsApp = (item) => {
    const lista = materiais(item).join(", ");
    const texto = `🚧 ${item.servico} - ${item.equipamento}${
      item.equipamento === "Balancinho" && item.tamanho ? ` [${item.tamanho}m]` : ""
    }\nObra: ${item.obra}\nConstrutora: ${item.construtora}\nAgendado: ${formatarData(item.dataAgendamento)}\nLiberado: ${formatarData(item.dataLiberacao) || "—"}\nMateriais: ${lista}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">📋 Atividades</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select value={form.construtora} onChange={(e) => setForm({ ...form, construtora: e.target.value, obra: "" })} className="border p-2 rounded">
          <option value="">Construtora</option>
          {construtoras.map((c) => (
            <option key={c.id} value={c.nome}>{c.nome}</option>
          ))}
        </select>

        <select value={form.obra} onChange={(e) => setForm({ ...form, obra: e.target.value })} className="border p-2 rounded">
          <option value="">Obra</option>
          {obras.filter((o) => o.construtora === form.construtora).map((o) => (
            <option key={o.id} value={o.nome}>{o.nome}</option>
          ))}
        </select>

        <select value={form.equipamento} onChange={(e) => setForm({ ...form, equipamento: e.target.value, servico: "", tamanho: "", tamanhoAnterior: "", ancoragem: "" })} className="border p-2 rounded">
          <option value="">Equipamento</option>
          <option>Balancinho</option>
          <option>Mini Grua</option>
        </select>

        <select value={form.servico} onChange={(e) => setForm({ ...form, servico: e.target.value })} className="border p-2 rounded">
          <option value="">Serviço</option>
          {form.equipamento === "Balancinho" && ["Instalação", "Deslocamento", "Manutenção", "Remoção"].map((s) => <option key={s}>{s}</option>)}
          {form.equipamento === "Mini Grua" && ["Ascensão", "Instalação", "Manutenção", "Remoção"].map((s) => <option key={s}>{s}</option>)}
        </select>

        {form.equipamento === "Balancinho" && (
          <>
            {form.servico === "Deslocamento" ? (
              <>
                <select value={form.tamanhoAnterior} onChange={(e) => setForm({ ...form, tamanhoAnterior: e.target.value })} className="border p-2 rounded">
                  <option value="">Tamanho Anterior</option>
                  {["1", "1.5", "2", "3", "4", "5", "6"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select value={form.tamanho} onChange={(e) => setForm({ ...form, tamanho: e.target.value })} className="border p-2 rounded">
                  <option value="">Tamanho Novo</option>
                  {["1", "1.5", "2", "3", "4", "5", "6"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </>
            ) : (
              <select value={form.tamanho} onChange={(e) => setForm({ ...form, tamanho: e.target.value })} className="border p-2 rounded">
                <option value="">Tamanho</option>
                {["1", "1.5", "2", "3", "4", "5", "6"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            )}

            <select value={form.ancoragem} onChange={(e) => setForm({ ...form, ancoragem: e.target.value })} className="border p-2 rounded">
              <option value="">Ancoragem</option>
              <option>Andaime Simples</option>
              <option>Andaime Duplo</option>
              <option>Afastador</option>
            </select>
          </>
        )}

<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Data de Agendamento</label>
  <input
    type="date"
    value={form.dataAgendamento}
    onChange={(e) => setForm({ ...form, dataAgendamento: e.target.value })}
    className="border p-2 rounded"
  />
</div>

<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700 mb-1">Data da Liberação</label>
  <input
    type="date"
    value={form.dataLiberacao}
    onChange={(e) => setForm({ ...form, dataLiberacao: e.target.value })}
    className="border p-2 rounded"
  />
</div>

      </div>

      <textarea placeholder="Observações" value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} className="border p-2 rounded w-full" />

      <button onClick={salvar} className="bg-blue-600 text-white px-4 py-2 rounded">
        {form.id ? "Atualizar" : "Salvar"}
      </button>

      <ul className="mt-6 space-y-4">
        {atividades.map((item) => (
          <li key={item.id} className="border rounded p-3 bg-gray-50 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <strong>
                  {item.servico} - {item.equipamento}
                  {item.equipamento === "Balancinho" && item.tamanho ? ` [${item.tamanho}m]` : ""}
                </strong>
                <br />
                {item.construtora} / {item.obra} <br />
                Agendado: {formatarData(item.dataAgendamento)} — Liberado: {formatarData(item.dataLiberacao) || "—"}
                {item.servico === "Deslocamento" && item.tamanhoAnterior && item.tamanhoNovo && (
  <p className="text-sm text-gray-700 mt-1">
    🔁 De: {item.tamanhoAnterior}m - Para: {item.tamanhoNovo}m
  </p>
)}

                {item.observacoes?.trim() && (
                  <p className="mt-1 text-sm text-gray-700">
                    📝 Observações: {item.observacoes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => liberar(item.id)} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">Liberar</button>
              <button onClick={() => setMostrarMateriaisId(mostrarMateriaisId === item.id ? null : item.id)} className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm">
                {mostrarMateriaisId === item.id ? "Ocultar Materiais" : "Ver Materiais"}
              </button>
              <button onClick={() => enviarWhatsApp(item)} className="bg-green-700 text-white px-3 py-1 rounded-md text-sm">WhatsApp</button>
              <button onClick={() => editar(item)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Editar</button>
              <button onClick={() => excluir(item.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">Excluir</button>
            </div>

            {mostrarMateriaisId === item.id && (
              <ul className="mt-2 text-sm list-disc pl-5 text-gray-700">
                {materiais(item).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
