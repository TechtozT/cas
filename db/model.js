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

const institution = new Schema(
  {
    // Programs -> criteria -> mandatory-sub, coll-level, high-school-level
    name: { type: String, required: true },

    regNo: { type: String, required: true, unique: true },
    website: { type: String, required: true },
    desc: { type: String },
    programs: [
      {
        name: { type: String, required: true },

        // 0 - 4. Certificate - PHD.
        level: { type: Number, required: true },

        // Can choose the available standard criteria (i.e TCU) or create new one.
        criteria: { type: ObjectID, required: true, ref: "Criteria" },

        // max accommodation of the students in this program
        maxCandidates: { type: Number, required: true },

        // 0 - 1. 0 means balance is not considered.
        malesToFemalesRatio: { type: Number, required: true, default: 0 },

        // 0 - 1. 0 means level balance is not considered.
        aLevelToDiplomaRatio: { type: Number, required: true, default: 0 },

        // a-level to diploma conversion factor. 0 -> gp = gpa * nSubjects.
        // -1 -> It doesn't apply, that is this application is not for bachelor.
        adFactor: { type: Number, required: true, default: 0 },
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
    highSchoolLevelEntry: {
      // a -> A-Level, o -> O-level.
      minEntryLevel: { type: String, required: true, enum: ["a", "o"] },
      minGradPoint: { type: Number, required: true },
      // PCM, PGM, PCB, CBG, EGM, ...
      combinations: [{ type: String, required: true }],
      mandatorySubjects: [
        {
          name: { type: String, unique: true },
          minGrade: { type: Number },
        },
      ],
      // c -> certificate, ...
      applicationLevel: {
        type: String,
        required: true,
        enum: ["c", "d", "b", "m", "p"],
      },
    },

    collegeLevelEntry: {},
  },
  { timestamps: true }
);

const application = new Schema(
  {
    controlNumber: { type: String, required: true, unique: true },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["p", "h", "n"],
    },

    entries: [
      {
        choiceNo: { type: Number, required: true }, // 1 - 5.
        institution: { type: ObjectID, required: true, ref: "Institution" },
        program: { type: ObjectID, required: true }, // Has its own criteria.
      },
    ],
    /**
     * 0 => pending, 1 - 5 => accepted at entries.choiceNo, -1 => rejected.
     */
    acceptedChoice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

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

  level: { type: String, required: true, enum: ["c", "d", "b", "m", "p"] },
});

// For demonstrations:
// This results should be queried from the respective data source
const schoolResult = new Schema({
  indexNo: { type: String, required: true },
  level: { type: String, required: true, enum: ["O", "A"] },
  yearEnrolled: { type: String, required: true },
  center: { type: String, required: true },
  gp: { type: Number, required: true },
  program: { type: String, required: true }, // combination: PCM, PCB, CBG, EGM ....
  subjects: [
    {
      name: { type: String, required: true },
      grade: { type: String, required: true },
    },
  ],
});

const collegeResult = new Schema({
  indexNo: {type: String, required: true},
  level: { type: String, required: true, enum: ["O", "A"] },
  yearEnrolled: { type: String, required: true },
  center: { type: String, required: true },
  gpa: { type: Number, required: true },
  program: { type: String, required: true },
});

module.exports = {
  Applicant: mongoose.model("Applicant", applicant, "applicants"),
  Institution: mongoose.model("Institution", institution, "institutions"),
  Criteria: mongoose.model("Criteria", criteria, "criteria"),
  Application: mongoose.model("Application", application, "applications"),
  Attribute: mongoose.model("Attribute", attribute, "attributes"),
  SchoolResult: mongoose.model("SchoolResult", schoolResult, "school_results"),
  CollegeResult: mongoose.model("CollegeResult", collegeResult, "collage_results"),
};
