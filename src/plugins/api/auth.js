export const authAPI = (client) => {
  const prefix = "auth";

  return {
    authenticateNative: (params) =>
      client.post(`${prefix}/native`, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      }),

    authenticateGoogle: (accessToken) =>
      client.post(
        `${prefix}/google`,
        { access_token: accessToken },
        { headers: { "Content-Type": "application/json" } }
      ),

    authenticateMicrosoft: (accessToken, idToken) =>
      client.post(
        `${prefix}/microsoft`,
        {
          access_token: accessToken,
          id_token: idToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),

    registerUser: (userDetails) =>
      client.post(`${prefix}/register`, userDetails, {
        headers: { "Content-Type": "application/json" },
      }),

    validateToken: () =>
      client.get(`${prefix}/validate`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }),

    refreshToken: (refreshToken) =>
      client.post(`${prefix}/refresh`, null, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${refreshToken}` },
      }),
  };
};
