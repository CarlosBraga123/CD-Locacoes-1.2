import { useState } from "react";
import { db } from "../firebase";
import { collection, setDoc, getDocs, doc } from "firebase/firestore";

export default function BackupImportacao() {
  const [status, setStatus] = useState("");

  const colecoes = [
    "usuarios",
    "construtoras",
    "obras",
    "atividades",
    "tarefas",
    "pecasBalancinho",
    "pecasAncoragem",
  ];

  const exportar = async () => {
    setStatus("Exportando dados para o Firebase...");
    try {
      for (const colecao of colecoes) {
        const dados = JSON.parse(localStorage.getItem(colecao) || "[]");
        await setDoc(doc(db, "backup", colecao), { dados });
      }
      setStatus("✅ Exportação concluída com sucesso.");
    } catch (erro) {
      setStatus("❌ Erro ao exportar: " + erro.message);
    }
  };

  const importar = async () => {
    setStatus("Importando dados do Firebase...");
    try {
      for (const colecao of colecoes) {
        const snap = await getDocs(collection(db, "backup"));
        const docData = snap.docs.find((d) => d.id === colecao);
        if (docData) {
          localStorage.setItem(colecao, JSON.stringify(docData.data().dados));
        }
      }
      setStatus("✅ Importação concluída com sucesso.");
    } catch (erro) {
      setStatus("❌ Erro ao importar: " + erro.message);
    }
  };

  const fazerBackupLocal = () => {
    const backup = {};
    for (const colecao of colecoes) {
      backup[colecao] = JSON.parse(localStorage.getItem(colecao) || "[]");
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const hoje = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `cd-locacoes-backup-${hoje}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">💾 Backup e Importação</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={exportar}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Exportar para Firebase
        </button>

        <button
          onClick={importar}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Importar do Firebase
        </button>

        <button
          onClick={fazerBackupLocal}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Fazer Backup Local (.json)
        </button>
      </div>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
    </div>
  );
}
