import axios from "axios";

const state = {
  token: localStorage.getItem("token") || "",
  status: ""
};

const getters = {
  getToken: state => state.token,
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status
};

const actions = {
  register({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit("auth_request");
      axios
        .post("api/user/register", user)
        .then(resp => {
          // const token = resp.data.token;
          // const user = resp.data.user;
          // localStorage.setItem("token", token);
          // axios.defaults.headers.common["Authorization"] = token;
          // commit("auth_success", token, user);
          resolve(resp);
        })
        .catch(err => {
          console.log(err);
          // commit("auth_error", err);
          // localStorage.removeItem("token");
          reject(err);
        });
    });
  },
  login({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit("auth_request");
      axios
        .post("api/user/login", user)
        .then(resp => {
          let response = resp.data;
          const token = response.data;
          // const user = response.user
          localStorage.setItem("token", token);
          axios.defaults.headers.common["x-access-token"] = token;
          commit("auth_success", token, user);
          resolve(response);
        })
        .catch(err => {
          commit("auth_error");
          localStorage.removeItem("token");
          reject(err);
        });
    });
  },

  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit("logout");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["x-access-token"];
      resolve();
    });
  }
};

const mutations = {
  auth_request(state) {
    state.status = "loading";
  },

  auth_success(state, token, user) {
    state.status = "success";
    state.token = token;
    // state.user = user;
  },

  auth_error(state) {
    state.status = "error";
  },

  logout(state) {
    state.status = "";
    state.token = "";
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
