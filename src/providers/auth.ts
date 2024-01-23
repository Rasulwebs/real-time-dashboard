import { AuthBindings } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";

export const authCredetials = {
  email: "boboqulovrasul80@gamil.com",
  password: "demodemo",
};

export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    try {
      //call the login mutation
      // dataProvider.custom is used custom request GraphQL API
      // this call dataProvider fetchWrapper func
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `muation Login($email:String!){
                    login(loginInput:{email:$email}){
                     accessToken
                    }
                }`,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;
      return {
        success: false,
        message: "message" in error ? error.message : "Login failed",
        name: "name" in error ? error.name : "Invalid email or password",
      };
    }
  },

  //remove the accessToken from localStorage fro logout
  logout: async () => {
    localStorage.removeItem("access_token");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  onError: async (error) => {
    //check iff the error is authentication error
    //if so set logout to true
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }
    return { error };
  },

  check: async () => {
    try {
      //get identity the user
      // this know if the user authentication or not
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: ` query Me {
                        me{
                            name
                        }
                    }`,
        },
      });

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  //get the user information
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      //call the GraphQL API to get user info
      const { data } = await dataProvider.custom<{ me: any }>({
        url: API_URL,
        method: "post",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        meta: {
          //get user info such as name, email, etc
          rawQuery: `
                    query Me {
                        me{
                            id
                            name
                            email
                            phone
                            jobTitle
                            timezone
                            avatarUrl

                        }
                    }
                    `,
        },
      });
      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};
