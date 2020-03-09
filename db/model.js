const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const {urls} = require('../env');

const Schema = mongoose.Schema;
const ObjectID = Schema.Types.ObjectId;

mongoose.connect(urls.DB_URL, {useNewUrlParser: true,  useUnifiedTopology: true })
.then(()=>{
  console.log('Database connected');
});


/* 
  Applicants may be applying thgough High school or  college.
  But all these can be tracked using indexNo. Problem is how can we inergrate these
  with the college in which the results are from different data soruces. Unless 
  TCU has central database for college results like NECTA.
*/
const applicant = new Schema({
  firstName: {
    type: String,
    required: true
  },

  middleName: {
    type: String,
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNomber: {
    type: String,
    required: true,
    unique: true,
  },

  gender: { // M || F
    type: String,
    required: true,
  },

  indexNo: {  // for tracking students results.
    type: String,
    required: true,
    unique: true
  },

  applications: [{
    applicationID: {
      type: ObjectID,
      required: true,
      ref: 'Application'
    }
  }]
});

const institution = new Schema({
  // Programs -> criteria -> mandatory-sub, coll-level, high-school-level
  details: {
    name: {
      type: String,
      required: true,
    },

    regNo: {
      type: String,
      required: true,
      unique: true
    }
  },

  programs: [{
    name: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    criteria: { // Can choose the available standard criteria (i.e TCU) or create new one.
      type: ObjectID,
      required: true,
      ref: 'Criteria'
    },

    maxCandidates: {  // max accomodation of the students in this program
      type: Number,
      required: true
    },
  }]
});

const criteria = new Schema({
  collegeLevel: { // college level criteria

  },

  highSchoolLevel: { // highschool level criteria
    minEntryLevel: { // A-level || O-level
      type: String,
      required: true,
    },

    minGP: {  // eg 9
      type: Number,
      required: true
    },
    
    combinations: [{  // More than one combination
      name: {
        type: String,
        required: true,
        unique: true
      }
    }],

    mandatorySubjects: [{
      subjectName: {
        type: String,
        required: true,
        unique: true,
      },

      subjectMinGrade: {
        type: String,
        required: true
      }
    }]
  }
});

const application = new Schema({
  
  applicantID: {
    type: ObjectID,
    ref: Applicants
  },

  status: {
    isComplete: { // to track incomplete applications {e.g unpayed, ...}
      type: Boolean,
      required: true,
      default: false
    },

    admission: {
      applicationID: {
        type: ObjectID,
      },

      admissionDate: {
        type: Date,
        default: Date.now()
      }
    }
  },


  applications: [{  // user can apply multiple institutions
    institutionID: {
      type: ObjectID,
      ref: 'Institutions',
      required: true,
      unique: true
    },

    institutionChoiceNo: {  // ranks by universities
      type: Number,
      required: true
    },

    programs: [{  // User can select multiple programs on the same institution
      programID: {
        type: ObjectID,
        required: true,
      },
    
      choiceNo: {
        type: Number,
        required: true
      },
    }],
  
    appliedDate: {
      type: Date,
      required: true,
      default: Date.now()
    },
  }],
});

// For admins to add them to the programs by selecting instead of typing
const progList = new Schema({
  name: {
    type: String,
    required: true
  }
});

// For admins to tweek the applications behaviour
const attribute = new Schema({
  maxAppliedInstitutions: {
    type: Number,
    required: true,
  },

  maxProgramsPerInstitution: {
    type: Number,
    required: true,
  }
});

// For demonstrations: T
//his results should be queried from the respective darta source

const highSchoolResults = new Schema({

});

const collegeResults = new Schema({

});


