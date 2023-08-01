export const mapping = (results: any) => {
  const newList = [];

  for (const row of results) {
    newList.push({ row });
  }

  return newList;
}