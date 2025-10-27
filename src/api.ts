export const productApi = (page: any) => {
  console.log("res.status, res.statusText");
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(`/products?page=${page}&per_page=10`, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((payload) => {
      return payload;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};
export const productList = (args: any) => {
  console.log("productList args:", args);
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Build query string with pagination parameters
  const queryParams = new URLSearchParams();
  if (args?.page) {
    queryParams.append("page", args.page.toString());
  }
  if (args?.per_page) {
    queryParams.append("per_page", args.per_page.toString());
  } else {
    queryParams.append("per_page", "10"); // Default page size
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/products?${queryString}` : "/products";

  return fetch(url, options)
    .then((res) => {
      console.log("API Response status:", res.status);
      if (!res.ok) {
        console.log("API Error - status not ok:", res.status);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((payload) => {
      console.log("API Success payload:", payload);
      return payload;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};
