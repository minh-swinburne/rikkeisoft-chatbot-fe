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

function censorEmail(email) {
  const [local, domain] = email.split("@");
  if (local.length <= 4) {
    return `${local[0]}****@${domain}`;
  }
  return `${local.slice(0, 3)}****${local.slice(-2)}@${domain}`;
}

function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

export { camelize, censorEmail, escapeHtml }
