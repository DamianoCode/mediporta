const baseURL = "https://api.stackexchange.com/2.3/tags?site=stackoverflow";

const urlGenerator = (options) => {
  let optionsString = "";

  for (const [key, value] of Object.entries(options)) {
    optionsString += `&${key}=${value}`;
  }

  return baseURL + optionsString;
};

export default urlGenerator;
