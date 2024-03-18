<script setup>
import NavComp from "../components/NavComp.vue";
</script>
<template>
  <NavComp />

  <main>
    <div class="hero py-5 bg-light">
      <div class="container text-center">
        <h2 class="mb-2">{{ form.name }}</h2>
        <div class="text-muted mb-4">{{ form.description }}</div>
        <div>
          <div>
            <small>For user domains</small>
          </div>
          <small
            ><span
              class="text-primary"
              v-for="(domain, index) in domains"
              :key="index"
              >{{ domain.domain + ", " }}
            </span></small
          >
        </div>
      </div>
    </div>

    <div class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-6">
            <div class="input-group mb-5">
              <input
              id="formUrl"
                type="text"
                class="form-control form-link"
                readonly
                :value="'http://localhost:5173/forms/' + slug + '/response'"
              />
              <a href="#" @click.prevent="copyFormUrl" class="btn btn-primary">Copy</a>
            </div>

            <ul class="nav nav-tabs mb-2 justify-content-center">
              <li class="nav-item">
                <a
                  href="#"
                  @click.prevent="toQuestion(slug)"
                  class="nav-link active"
                  >Questions</a
                >
              </li>
              <li class="nav-item">
                <a href="#" @click.prevent="toResponse(slug)" class="nav-link"
                  >Responses</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-6">
            <div
              class="question-item card card-default my-4"
              v-for="question in questions"
              :key="question.id"
            >
              <div class="card-body">
                <div class="form-group my-3">
                  <input
                    type="text"
                    placeholder="Question"
                    class="form-control"
                    name="name"
                    :value="question.name"
                    disabled
                  />
                </div>

                <div class="form-group my-3">
                  <select name="choice_type" class="form-select" disabled>
                    <option>Choice Type</option>
                    <option
                      :selected="question.choice_type == 'short answer'"
                      value="short answer"
                    >
                      Short Answer
                    </option>
                    <option
                      :selected="question.choice_type == 'paragraph'"
                      value="paragraph"
                    >
                      Paragraph
                    </option>
                    <option
                      :selected="question.choice_type == 'multiple choice'"
                      value="multiple choice"
                    >
                      Multiple Choice
                    </option>
                    <option
                      :selected="question.choice_type == 'dropdown'"
                      value="dropdown"
                    >
                      Dropdown
                    </option>
                    <option
                      :selected="question.choice_type == 'checkboxes'"
                      value="checkboxes"
                    >
                      Checkboxes
                    </option>
                    <option
                      :selected="question.choice_type == 'date'"
                      value="date"
                    >
                      Date
                    </option>
                  </select>
                </div>
                <div
                  class="form-group my-3"
                  v-if="
                    question.choice_type == 'multiple choice' ||
                    question.choice_type == 'dropdown' ||
                    question.choice_type == 'checkboxes'
                  "
                >
                  <textarea
                    :placeholder="question.choices"
                    class="form-control"
                    name="choices"
                    rows="4"
                    disabled
                  ></textarea>
                </div>
                <div class="form-check form-switch" aria-colspan="my-3">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="required"
                    disabled
                    :checked="question.is_required == true"
                  />

                  <label class="form-check-label" for="required"
                    >Required</label
                  >
                </div>
                <div class="mt-3">
                  <button
                    type="submit"
                    class="btn btn-outline-danger"
                    @click.prevent="removeQuestion(question.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div class="question-item card card-default my-4">
              <div class="card-body">
                <form>
                  <div class="form-group my-3">
                    <input
                      type="text"
                      placeholder="Question"
                      class="form-control"
                      v-model="questionData.name"
                      value=""
                    />
                  </div>

                  <div class="form-group my-3">
                    <select @change="choiceOnChange" class="form-select">
                      <option selected>Choice Type</option>
                      <option value="short answer">Short Answer</option>
                      <option value="paragraph">Paragraph</option>
                      <option value="date">Date</option>
                      <option value="multiple choice">Multiple Choice</option>
                      <option value="dropdown">Dropdown</option>
                      <option value="checkboxes">Checkboxes</option>
                    </select>
                  </div>
                  <div
                    class="form-group my-3"
                    v-if="
                      questionData.choice_type == 'multiple choice' ||
                      questionData.choice_type == 'dropdown' ||
                      questionData.choice_type == 'checkboxes'
                    "
                  >
                    <textarea
                      placeholder="Choices..."
                      class="form-control"
                      v-model="questionData.choices"
                      rows="4"
                    >
Choices...</textarea
                    >
                    <div class="form-text">
                      Separate choices using comma ",".
                    </div>
                  </div>
                  <div class="form-check form-switch" aria-colspan="my-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="required"
                      v-model="questionData.is_required"
                    />
                    <label class="form-check-label" for="required"
                      >Required</label
                    >
                  </div>
                  <div class="mt-3">
                    <button
                      type="submit"
                      class="btn btn-outline-primary"
                      @click.prevent="addQuestion(slug)"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      slug: "",
      form: "",
      domains: [],
      questions: [],

      questionData: {
        choice_type: "",
        choices: [],
        name: "",
        is_required: 0,
      },
    };
  },
  computed: {
    token() {
      return localStorage.getItem("token");
    },
    headers() {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      };
    },
    separateChoice: {
      get() {
        return this.questionData.choices
          .split(",")
          .map((value) => value.trim());
      },
      set() {
        this.questionData.choices = value.join(",");
      },
    },
  },
  methods: {
    async getDetailForm(slug) {
      await axios
        .get("forms/" + slug, { headers: this.headers })
        .then((res) => {
          if (res && res.status == 200) {
            this.form = res.data.form;
            this.domains = res.data.form.allowed_domains;
            this.questions = res.data.form.questions;
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    async addQuestion(slug) {
      await axios
        .post(
          "forms/" + slug + "/questions",
          {
            name: this.questionData.name,
            choice_type: this.questionData.choice_type,
            choices: this.separateChoice,
            is_required: this.questionData.is_required,
          },
          { headers: this.headers }
        )
        .then((res) => {
          if (res && res.status == 200) {
            this.questionData.name = "";
            this.questionData.choice_type = "Choice Type";
            this.questionData.choices = [];
            this.is_required = 0;
            this.slug = this.$route.params.slug;
            this.getDetailForm(this.slug);
            alert("question successfully added");
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    async removeQuestion(id) {
      await axios
        .delete("forms/" + this.slug + "/questions/" + id, {
          headers: this.headers,
        })
        .then((res) => {
          if (res && res.status == 200) {
            this.slug = this.$route.params.slug;
            this.getDetailForm(this.slug);
            alert("question successfully deleted");
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    choiceOnChange(event) {
      this.questionData.choice_type = event.target.value;
    },
    toResponse(slug) {
      this.$router.push({ name: "responses", params: { slug: slug } });
    },
    toQuestion(slug) {
      this.$router.push({ name: "form", params: { slug: slug } });
    },
    copyFormUrl(){
      const input = document.getElementById('formUrl');
      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand('copy');
    }
  },
  mounted() {
    this.slug = this.$route.params.slug;
    this.getDetailForm(this.slug);
  },
};
</script>
