/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import Cookies from "js-cookie";

export const baseUrl = `${process.env.NEXT_PUBLIC_LOCAL_API_URL}`;

export const Axios = axios.create({
  baseURL: baseUrl,
});

Axios.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// add an interceptor in the axios that will handle the response and then continue to the next step
// Axios.interceptors.response.use(
//   (response: any) => {
//     return response;
//   },
//   (error: any) => {
//     // if (error.response.status === 401) {
//     //   Cookies.remove("token");
//     //   window.location.href = "/login";
//     // }

//     if (error.response.status === 400) {
//       console.log("error-----------", error.response.data.message);
//       toast.error(error.response.data.message);
//     }

//     return Promise.reject(error);
//   }
// );
