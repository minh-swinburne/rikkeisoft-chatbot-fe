function snakeToCamel(str) {
  return str.replace(/([-_]\w)/g, g => g[1].toUpperCase());
}

function camelize(data) {
  if (data instanceof Array) {
    return data.map(camelize);
  } else if (data instanceof Object) {
    const newData = {};
    Object.keys(data).forEach(key => {
      newData[snakeToCamel(key)] = camelize(data[key]);
    });
    return newData;
  }
  return data;
}

export { camelize };