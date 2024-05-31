export const Fetch = (url, method, response, data) => {
  response({ loading: true });
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Status != 200");
      }
      return response.text();
    })
    .then((result) => {
      response({ loading: false, data: result });
    })
    .catch((err) => {
      console.error(err);
    });
};
