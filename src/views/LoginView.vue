<template>
  <main>
    <section class="login">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-6">
            <h1 class="text-center mb-4">Formify</h1>
            <div class="card card-default">
              <div class="card-body">
                <h3 class="mb-3">Login</h3>

                <form action="">
                  <!-- s: input -->
                  <div class="form-group my-3">
                    <label for="email" class="mb-1 text-muted"
                      >Email Address</label
                    >
                    <input
                      type="email"
                      id="email"
                      v-model="email"
                      value=""
                      class="form-control"
                      autofocus
                    />
                  </div>

                  <!-- s: input -->
                  <div class="form-group my-3">
                    <label for="password" class="mb-1 text-muted"
                      >Password</label
                    >
                    <input
                      type="password"
                      id="password"
                      v-model="password"
                      value=""
                      class="form-control"
                    />
                  </div>

                  <div class="mt-4">
                    <button
                      type="submit"
                      @click.prevent="login"
                      class="btn btn-primary"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      // if(!this.email || !this.password){
      //     alert('Data cannot be empty');
      // }
      await axios
        .post("auth/login", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          if (res && res.status == 200) {
            this.$router.push("/");
            localStorage.setItem("token", res.data.user.accessToken);
            localStorage.setItem("userEmail", res.data.user.email);
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
};
</script>
