import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@advice_favorites";

// Obtém a lista de conselhos salvos no AsyncStorage
export async function getSavedAdvices() {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("JSON Recuperado do Storage:", jsonValue); //Log

    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Erro ao carregar conselhos:", error);
    return [];
  }
}

//Salva um novo conselho no AsyncStorage
export async function saveAdvice(advice) {
  try {
    let existing = await getSavedAdvices();

    if (!Array.isArray(existing)) {
      console.log("Dados corrompidos, redefinindo lista...");
      existing = [];
    }

    const slipIdStr = String(advice.slip_id).trim(); //Garante que `slip_id` nunca é undefined

    if (!slipIdStr || slipIdStr === "undefined") {
      console.error("ERRO: slip_id inválido, não salvando.");
      return;
    }

    const alreadyExists = existing.some(
      (item) => String(item.slip_id) === slipIdStr
    );

    if (!alreadyExists) {
      const updated = [...existing, { ...advice, slip_id: slipIdStr }];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log("Conselho salvo com sucesso!", updated);
    } else {
      console.log("Conselho já está nos favoritos.");
    }
  } catch (error) {
    console.error("Erro ao salvar conselho:", error);
  }
}

// Atualiza um conselho existente
export async function updateAdvice(updatedAdvice) {
  try {
    let existing = await getSavedAdvices();

    //Converte slip_id para string para evitar erros de comparação
    const slipIdStr = String(updatedAdvice.slip_id).trim();

    // Atualiza o conselho correspondente
    const updatedList = existing.map((item) =>
      String(item.slip_id) === slipIdStr
        ? { ...item, advice: updatedAdvice.advice }
        : item
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    console.log("Conselho atualizado com sucesso!", updatedList);
  } catch (error) {
    console.error("Erro ao atualizar conselho:", error);
  }
}

//Remove um conselho pelo `slip_id`
export async function deleteAdvice(id) {
  try {
    const existing = await getSavedAdvices();
    const updated = existing.filter(
      (item) => String(item.slip_id) !== String(id)
    );

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log("Conselho removido com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir conselho:", error);
  }
}
