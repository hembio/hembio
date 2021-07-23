const preserveCamelCase = (input: string) => {
  let isLastCharLower = false;
  let isLastCharUpper = false;
  let isLastLastCharUpper = false;

  for (let i = 0; i < input.length; i++) {
    const c = input[i];

    if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
      input = input.slice(0, i) + "-" + input.slice(i);
      isLastCharLower = false;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = true;
      i++;
    } else if (
      isLastCharUpper &&
      isLastLastCharUpper &&
      /[a-zA-Z]/.test(c) &&
      c.toLowerCase() === c
    ) {
      input = input.slice(0, i - 1) + "-" + input.slice(i - 1);
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = false;
      isLastCharLower = true;
    } else {
      isLastCharLower = c.toLowerCase() === c;
      isLastLastCharUpper = isLastCharUpper;
      isLastCharUpper = c.toUpperCase() === c;
    }
  }

  return input;
};

function camelize(input: string) {
  if (Array.isArray(input)) {
    input = input
      .map((x) => x.trim())
      .filter((x) => x.length)
      .join("-");
  } else {
    input = input.trim();
  }

  if (input.length === 0) {
    return "";
  }

  if (input.length === 1) {
    return input.toLowerCase();
  }

  if (/^[a-z\d]+$/.test(input)) {
    return input;
  }

  const hasUpperCase = input !== input.toLowerCase();

  if (hasUpperCase) {
    input = preserveCamelCase(input);
  }

  input = input
    .replace(/^[_.\- ]+/, "")
    .toLowerCase()
    .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase());

  return input;
}

export function convertToCamelCase(input: any): any {
  if (typeof input === "boolean" || typeof input === "number") {
    return input;
  } else if (typeof input === "string") {
    if (input === "Yes" || input === "No") {
      return input === "Yes";
    }
    return camelize(input);
  } else if (Array.isArray(input)) {
    return input.map((val) => convertToCamelCase(val));
  } else if (typeof input === "object") {
    Object.keys(input).forEach((key) => {
      // Do not touch extra
      if (key === "extra") {
        return;
      }
      const newKey = camelize(key);
      let val =
        typeof input[key] === "string"
          ? input[key]
          : convertToCamelCase(input[key]);
      if (val === "Yes" || val === "No") {
        val = val === "Yes";
      }
      if (newKey !== key) {
        input[newKey] = val;
        delete input[key];
      } else {
        input[key] = val;
      }
    });
  }
  return input;
}
