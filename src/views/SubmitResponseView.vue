<template>
  <main>
    <div class="hero py-5 bg-light">
      <div class="container text-center">
        <h2 class="mb-3">{{ form.name }}</h2>
        <div class="text-muted">
          {{ form.description }}
        </div>
      </div>
    </div>

    <div class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-6">
            <div class="text-muted">
              <span class="text-primary">{{ userEmail }}</span>
              <small><i> (shared)</i></small>
            </div>

            <form @submit.prevent="submitResponse(slug)">
              <div
                class="form-item card card-default my-4"
                v-for="question in questions"
                :key="question.id"
              >
                <div class="card-body">
                  <div class="form-group">
                    <label for="" class="mb-1 text-muted"
                      >{{ question.name }}
                      <span
                        class="text-danger"
                        v-if="question.is_required == true"
                        >*</span
                      ></label
                    >
                    <input
                      v-if="question.choice_type == 'short answer'"
                      type="text"
                      placeholder="Your answer"
                      class="form-control"
                      @change="getAnswer(question.id, $event.target.value)"
                    />
                    <textarea
                      v-if="question.choice_type == 'paragraph'"
                      rows="4"
                      placeholder="Your answer"
                      class="form-control"
                      @change="getAnswer(question.id, $event.target.value)"
                    ></textarea>
                    <div
                      class="form-check"
                      v-if="question.choice_type == 'multiple choice'"
                    >
                      <div
                        v-for="(choice, index) in question.choices.split(',')"
                        :key="index"
                      >
                        <input
                          class="form-check-input"
                          type="radio"
                          name="choice"
                          :value="choice"
                          @change="getAnswer(question.id, $event.target.value)"
                        />
                        <label class="form-check-label">
                          {{ choice }}
                        </label>
                      </div>
                    </div>
                    <input
                      v-if="question.choice_type == 'date'"
                      type="date"
                      placeholder="Your answer"
                      class="form-control"
                      @change="getAnswer(question.id, $event.target.value)"
                    />
                    <div
                      class="form-check"
                      v-if="question.choice_type == 'checkboxes'"
                    >
                      <div
                        v-for="(choice, index) in question.choices.split(',')"
                        :key="index"
                      >
                        <input
                          class="form-check-input"
                          type="checkbox"
                          @change="getAnswer(question.id, $event.target.value)"
                        />
                        <label class="form-check-label">
                          {{ choice }}
                        </label>
                      </div>
                    </div>
                    <div
                      class="form-group my-3"
                      v-if="question.choice_type == 'dropdown'"
                    >
                      <select
                        id="selectQuestion"
                        class="form-select"
                        @change="getAnswer(question.id, $event.target.value)"
                      >
                        <option
                          v-for="(choice, index) in question.choices.split(',')"
                          :key="index"
                        >
                          {{ choice }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button class="btn btn-primary">Submit</button>
              </div>
            </form>
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
      form: [],
      domains: [],
      questions: [],
      userEmail: localStorage.getItem("userEmail"),

      answers: [
      ],
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
            this.questions.forEach(element => {
              if (element.choice_type == "dropdown"){
                this.getAnswer(element.id, element.choices.split(',')[0]);
              }
            });
            console.log(this.questions);
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    async submitResponse(slug) {
      await axios
        .post("forms/" + slug + "/responses", { answers:this.answers },{ headers: this.headers })
        .then((res) => {
          if (res && res.status == 200) {
            alert(res.response.data.message);
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getAnswer(questionId, value) {
      
      // Find the index of the answer object in the answers array based on the questionId
      const answerIndex = this.answers.findIndex(
        (answer) => answer.question_id === questionId
      );

      // If the answer exists, update its value; otherwise, add a new answer object
      if (answerIndex !== -1) {
        this.$set(this.answers, answerIndex, {
          question_id: questionId,
          value: value,
        });
      } else {
        this.answers.push({ question_id: questionId, value: value });
      }
    },
  },
  mounted() {
    this.slug = this.$route.params.slug;
    this.getDetailForm(this.slug);
    
  },
};
</script>
