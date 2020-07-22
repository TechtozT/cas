const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const { urls } = require("../env");

const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;

mongoose
  .connect(urls.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  });

/* 
  Applicants may be applying through High school or  college.
  But all these can be tracked using indexNo. Problem is how can we integrate these
  with the college in which the results are from different data sources. Unless 
  TCU has central database for college results like NECTA.
*/

const applicant = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },

    gender: { type: String, required: true },

    // for tracking students results.
    indexNo: { type: String, required: true, unique: true },

    applications: [{ type: ObjectID, required: true, ref: "Application" }],
  },
  { timestamps: true }
);

const admin = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ["M", "F"] },
    role: { type: String, enum: ["admin", "super"], required: true },
    institution: { type: ObjectID, ref: "Institution" },
  },
  { timestamps: true }
);

const program = new Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
});

const institution = new Schema(
  {
    // admins: [{ type: ObjectID, required: true, ref: "Admin", unique: true }],
    // Programs -> criteria -> mandatory-sub, coll-level, high-school-level
    name: { type: String, required: true },

    regNo: { type: String, required: true, unique: true },
    website: { type: String, required: true },
    desc: { type: String },
    programs: [
      {
        /* name: { type: String, required: true },

        // 0 - 4. Certificate - PHD.
        level: { type: Number, required: true }, */
        program: { type: ObjectID, required: true, ref: "Programs" },

        // Can choose the available standard criteria (i.e TCU) or create new one.
        criteria: { type: ObjectID, required: true, ref: "Criteria" },

        // max accommodation of the students in this program
        maxCandidates: { type: Number, required: true },

        allocatedCandidates: { type: Number, required: true, default: 0 },

        // 0 - 1. 0 means balance is not considered.
        malesToFemalesRatio: { type: Number, required: true, default: 0 },

        // 0 - 1. 0 means level balance is not considered.
        aLevelToDiplomaRatio: { type: Number, required: true, default: 0 },

        // a-level to diploma conversion factor. 0 -> gp = gpa * nSubjects.
        // -1 -> It doesn't apply, that is this application is not for bachelor.
        aLevelToDiplomaFactor: { type: Number, required: true, default: 0 },
      },
    ],
    applications: [
      { type: Schema.Types.ObjectId, required: true, ref: "Application" },
    ],
    appCount: { type: Number },
  },
  { timestamps: true }
);

const criteria = new Schema(
  {
    name: { type: String, required: true },
    institution: { type: ObjectID, required: true, ref: "Institution" },
    school: {
      // a -> A-Level, o -> O-level.
      level: [{ type: String, required: true, enum: ["a", "o"] }],
      gradPoint: { type: Number, required: true, default: 0 },
      // PCM, PGM, PCB, CBG, EGM, ...
      programs: [{ type: String, required: true }],
      // minSubjects: {type: Number, required: true},
      mandatorySubs: [
        {
          name: { type: String, required: true },
          grade: { type: String, required: true },
        },
      ],
      // c -> certificate, ...
      applicationLevel: {
        type: String,
        required: true,
        enum: ["c", "d", "b", "m", "p"],
      },
    },

    college: {},
  },
  { timestamps: true }
);

const application = new Schema({
  indexNo: { type: String, required: true },
  applicant: { type: ObjectID, required: true },

  // TODO Payments
  /* controlNumber: { type: String, required: true, unique: true },

   paymentStatus: {
    type: String,
    required: true,
    enum: ["p", "h", "n"],
  }, */
  year: {
    type: Number,
    required: true,
    default: new Date(Date.now()).getFullYear(),
  },
  level: { type: String, required: true },

  entry: [
    {
      program: { type: ObjectID, required: true },
      progName: { type: String, required: true },
      choice: { type: Number, required: true },
      // point is the score that user score for particular program for particular criteria
      // considering only mandatory subjects.
      // But for now we use grade point
      point: { type: Number, required: true },
      institutions: [
        {
          inst: { type: ObjectID, required: true },
          instName: { type: String, required: true },
          priority: { type: Number, required: true },
        },
      ],
    },
  ],

  allocated: { type: Boolean, required: true, default: false },
  allocatedInst: { type: ObjectID, ref: "Institution" },
  allocatedProg: { type: ObjectID },
});

// Index year for faster access applications by year.
application.index({ year: 1 });

// For admins to tweak the applications behaviour
const attribute = new Schema({
  // max allowed institutions per candidates
  maxAppliedInstitutions: {
    type: Number,
    required: true,
  },

  minAppliedInstitutions: {
    type: Number,
    required: true,
  },

  maxProgramsPerInstitution: {
    type: Number,
    required: true,
  },

  minProgramsPerInstitution: {
    type: Number,
    required: true,
  },

  maxAppliedPrograms: { type: Number, required: true, default: 10 },

  level: { type: String, required: true, enum: ["c", "d", "b", "m", "p"] },
});

// For demonstrations:
// This results should be queried from the respective data source
const schoolResult = new Schema({
  indexNo: { type: String, required: true },
  level: { type: String, required: true, enum: ["o", "a"] },
  enrolledYear: { type: String, required: true },
  center: { type: String, required: true },
  gradePoint: { type: Number, required: true },
  program: { type: String, required: true }, // combination: PCM, PCB, CBG, EGM ....
  subjects: [
    {
      name: { type: String, required: true },
      grade: { type: String, required: true },
    },
  ],
});
schoolResult.index({ indexNo: 1 });

const collegeResult = new Schema({
  indexNo: { type: String, required: true },
  level: { type: String, required: true, enum: ["c", "d", "b", "m"] },
  yearEnrolled: { type: String, required: true },
  center: { type: String, required: true },
  gpa: { type: Number, required: true },
  program: { type: String, required: true },
});

const notification = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  //? Who to notify
  subscribers: { type: ObjectID, required: true },
});

module.exports = {
  Applicant: mongoose.model("Applicant", applicant, "applicants"),
  Institution: mongoose.model("Institution", institution, "institutions"),
  Criteria: mongoose.model("Criteria", criteria, "criteria"),
  Application: mongoose.model("Application", application, "applications"),
  Attribute: mongoose.model("Attribute", attribute, "attributes"),
  SchoolResult: mongoose.model("SchoolResult", schoolResult, "school_results"),
  CollegeResult: mongoose.model(
    "CollegeResult",
    collegeResult,
    "collage_results"
  ),
  Program: mongoose.model("Program", program, "programs"),
  Notification: mongoose.model("Notification", notification, "notification"),
  Admin: mongoose.model("Admin", admin, "admins"),
};
