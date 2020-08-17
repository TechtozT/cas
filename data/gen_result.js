/* 
  Generating random shool results
*/
const { SchoolResult } = require("../db/model");

const school_result = [];

const grades = ["A", "B", "C", "D", "E", "F"];

const gradeDict = { A: 1, B: 2, C: 3, D: 4, E: 5, S: 6, F: 7 };

const science = ["Physics", "Chemistry", "Mathematics", "Biology", "Geography"];
// const arts = ["History", "Kiswahili", "English", "Commerce"];

const genRandomNumber = () => {
  return Math.floor(Math.random() * (grades.length - 1));
};

let result = {};
let sub1 = "Physics",
  sub2 = "Chemistry",
  sub3 = "Mathematics";
let program = "PCM";
let center = 1298;

for (let prog = 0; prog < 4; prog++) {
  if (prog === 1) {
    sub3 = "Biology";
    program = "PCB";
  } else if (prog === 2) {
    sub2 = "Geography";
    program = "PGM";
  } else {
    sub1 = "Chemistry";
    sub2 = "Biology";
    sub3 = "Geography";
    program = "CBG";
  }

  for (let i = 0; i < 9; i++) {
    // we need 30 student for each school
    for (let j = 10; j < 20; j++) {
      result.indexNo = `S${center}.02${j}.2020`;
      result.level = "a";
      result.enrolledYear = "2018";
      result.center = `${center}`;
      result.program = program;
      result.subjects = [
        {
          name: sub1,
          grade: grades[genRandomNumber()],
        },
        {
          name: sub2,
          grade: grades[genRandomNumber()],
        },
        {
          name: sub3,
          grade: grades[genRandomNumber()],
        },
      ];

      school_result.push(result);
      result = {};
    }
    center++;
  }
}

// Calculate grade point for each result.
let grade = 0;
school_result.forEach((re, i) => {
  re.subjects.forEach((sub) => {
    grade += gradeDict[sub.grade];
  });

  school_result[i].gradPoint = grade;
  grade = 0;
});

const insertSchoolResults = async () => {
  const result = await SchoolResult.insertMany(school_result);

  return result;
};

insertSchoolResults().then((r) => {
  console.log(r);
});
