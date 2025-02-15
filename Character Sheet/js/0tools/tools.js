function fetchcharacter(id) {
    id = String(id);
    for (const key in characters) {
      if (characters[key].id === id) return characters[key];
    }
    return undefined;
  }