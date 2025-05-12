import { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addWeeks,
  subWeeks
} from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Agenda() {
  const [modo, setModo] = useState("semana");
  const [referencia, setReferencia] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const atividades = JSON.parse(localStorage.getItem("atividades")) || [];

  const inicioSemana = startOfWeek(referencia, { weekStartsOn: 1 });
  const diasDaSemana = Array.from({ length: 7 }, (_, i) => addDays(inicioSemana, i));

  const atividadesPorDia = diasDaSemana.map((dia) => {
    const atividadesDoDia = atividades.filter((a) => {
      const dataBase = a.dataLiberacao || a.dataAgendamento;
      const data = dataBase && new Date(dataBase + "T00:00:00");
      return data && isSameDay(data, dia);
    });
    return { dia, atividades: atividadesDoDia };
  });

  const inicioMes = startOfMonth(referencia);
  const fimMes = endOfMonth(referencia);
  const diasDoMes = eachDayOfInterval({ start: inicioMes, end: fimMes });

  const atividadesNoMes = diasDoMes.map((dia) => {
    const atividadesDoDia = atividades.filter((a) => {
      const dataBase = a.dataLiberacao || a.dataAgendamento;
      const data = dataBase && new Date(dataBase + "T00:00:00");
      return data && isSameDay(data, dia);
    });
    return { dia, atividades: atividadesDoDia };
  });

  const obterStatus = (a) => {
    if (a.dataLiberacao) return "CONCLUÍDO";
    if (!a.dataLiberacao && new Date(a.dataAgendamento) <= new Date()) return "EM ANDAMENTO";
    return "AGENDADO";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Agenda</h2>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setModo("semana")}
          className={`px-4 py-2 rounded-full shadow text-sm font-medium ${modo === "semana" ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}>
          Semana
        </button>
        <button onClick={() => setModo("mensal")}
          className={`px-4 py-2 rounded-full shadow text-sm font-medium ${modo === "mensal" ? "bg-black text-white" : "bg-gray-200 text-gray-700"}`}>
          Mês
        </button>
      </div>

      {modo === "semana" && (
        <>
          <div className="flex justify-between mb-4">
            <button onClick={() => setReferencia(subWeeks(referencia, 1))} className="text-blue-600">← Semana anterior</button>
            <button onClick={() => setReferencia(new Date())} className="text-gray-600">Semana atual</button>
            <button onClick={() => setReferencia(addWeeks(referencia, 1))} className="text-blue-600">Próxima semana →</button>
          </div>
          <div className="grid gap-4">
            {atividadesPorDia.map(({ dia, atividades }) => (
              <div key={dia} className="bg-white rounded-2xl shadow p-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  {format(dia, "EEEE dd/MM", { locale: ptBR })}
                </h3>
                {atividades.length === 0 ? (
                  <p className="text-gray-400 text-sm">Nenhuma atividade</p>
                ) : (
                  <ul className="space-y-1">
                    {atividades.map((a) => (
                      <li key={a.id} className="text-sm text-gray-800">
                        <strong>{a.obra}</strong> — {a.servico} ({a.equipamento})
                        <span className={`ml-2 text-xs font-semibold ${obterStatus(a) === "CONCLUÍDO" ? "text-green-600" : "text-gray-500"}`}>
                          {obterStatus(a)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {modo === "mensal" && (
        <>
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-700">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dia) => (
              <div key={dia} className="font-semibold mb-1">{dia}</div>
            ))}

            {(() => {
              const primeiroDiaSemana = getDay(inicioMes) || 7;
              const vazios = Array.from({ length: primeiroDiaSemana - 1 });
              return [
                ...vazios.map((_, i) => <div key={`vazio-${i}`}></div>),
                ...atividadesNoMes.map(({ dia, atividades }) => (
                  <div
                    key={dia}
                    onClick={() => setDiaSelecionado(dia)}
                    className="bg-white rounded-xl shadow p-1 min-h-[60px] text-xs flex flex-col items-start cursor-pointer hover:bg-gray-100"
                  >
                    <div className="font-semibold text-gray-800">
                      {format(dia, "d")}
                    </div>
                    {atividades.map((a) => (
                      <div key={a.id} className="text-left text-[11px] w-full">
                        <span className="block font-medium truncate">{a.servico} — {a.obra} ({a.construtora})</span>
                        <span className={`text-[10px] ${obterStatus(a) === "CONCLUÍDO" ? "text-green-600" : "text-gray-500"}`}>
                          {obterStatus(a)}
                        </span>
                      </div>
                    ))}
                  </div>
                )),
              ];
            })()}
          </div>

          {diaSelecionado && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Detalhes do dia {format(diaSelecionado, "dd/MM/yyyy")}
              </h3>
              <ul className="space-y-2">
                {atividades.filter((a) => {
                  const dataBase = a.dataLiberacao || a.dataAgendamento;
                  const data = dataBase && new Date(dataBase + "T00:00:00");
                  return data && isSameDay(data, diaSelecionado);
                }).map((a) => (
                  <li key={a.id} className="bg-white rounded-xl shadow p-3 text-sm">
                    <div><strong>Obra:</strong> {a.obra}</div>
                    <div><strong>Construtora:</strong> {a.construtora}</div>
                    <div><strong>Serviço:</strong> {a.servico}</div>
                    <div><strong>Equipamento:</strong> {a.equipamento}</div>
                    <div><strong>Status:</strong> <span className={`${obterStatus(a) === "CONCLUÍDO" ? "text-green-600" : "text-gray-600"}`}>{obterStatus(a)}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
