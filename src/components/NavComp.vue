<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Formify</router-link>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" href="#">Administrator</a>
        </li>
        <li class="nav-item">
          <a
            href="#"
            @click.prevent="logout"
            class="btn bg-white text-primary ms-4"
            >Logout</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {};
  },
  computed: {
    token() {
      return localStorage.getItem("token");
    },
    headers() {
      return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.token,
      };
    },
  },
  methods: {
    async logout() {
      const confirmLogout = confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        await axios
          .post("auth/logout", {}, { headers: this.headers })
          .then((res) => {
            if (res && res.status == 200) {
              localStorage.removeItem('token');
              localStorage.removeItem('userEmail');
              this.$router.push("/login");
            }
          })
          .catch((err) => {
            alert(err.response.data.message);
          });
      }
    },
  },
};
</script>
