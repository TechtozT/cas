"use strict";

const mongoose = require("mongoose");
const mod = require("../db/model");
const faker = require("faker");
const { unpackDoc } = require("../helpers/helper");

const fakeData = [];

for (let i = 1000; i < 7000; i++) {
  fakeData.push({
    indexNo: `S${i}`,
    applicant: mongoose.Types.ObjectId(),
    controlNumber: `${Date.now().toString()}${Math.floor(
      Math.random() * 978453
    )}`,
    paymentStatus: "p",
    level: "b",

    entry: [
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },

      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
      {
        program: mongoose.Types.ObjectId(),
        choice: Math.floor(Math.random() * 10),
        point: Math.floor(Math.random() * 20),
        institutions: [
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
          {
            inst: mongoose.Types.ObjectId(),
            priority: Math.floor(Math.random() * 10),
          },
        ],
      },
    ],
  });
}

const load = async (d) => {
  const m = [];

  d.forEach((e) => {
    m.push(new mod.Application(e));
  });

  return await mod.Application.collection.insertMany(m);
};

// load(fakeData);

const update = async () => {
  const id = [];
  for (let i = 1000; i <= 7000; i += 21) {
    id.push(`S${i}`);
  }

  // console.log(id);

  const result = await mod.Application.updateMany(
    { indexNo: { $in: id } },
    {
      $set: {
        "entry.1.program": "5eeb83a472bcab6045a15cb7",
        "entry.1.institutions.inst": "5eeb83a472bcab6045a15cb8",
      },
      //"entry.$.institutions.inst": "5eeb83a472bcab6045a15cb2",
    }
  );
  console.log(result);
};

const addProgs = async () => {
  const prs = [
    {
      name: "Bachelor of Science in Computer Science",
      level: "b",
    },

    {
      name: "Bachelor of Science in Computer Engineering",
      level: "b",
    },

    {
      name: "Bachelor of Arts",
      level: "b",
    },

    {
      name: "Bachelor of Business Administration",
      level: "b",
    },

    {
      name: "Bachelor of Science in Computer Science",
      level: "b",
    },

    {
      name: "Bachelor of Education",
      level: "b",
    },

    {
      name: "Bachelor of Mass Communication",
      level: "b",
    },

    {
      name: "Bachelor of Law",
      level: "b",
    },

    {
      name: "Bachelor of Music",
      level: "b",
    },

    {
      name: "Bachelor of Rocket Science",
      level: "b",
    },
  ];

  const progs = [];

  prs.forEach((pr) => {
    progs.push(pr);
  });

  await mod.Program.collection.insertMany(progs);
  return "OK";
};

const addInst = async () => {
  let progs = await mod.Program.find({}, { _id: 1 });
  
  const ins = [];
  for (let i = 0; i < 20; i++) {
    const programs = [];
    for(let j=0; j<10; j++){
      programs.push({
        program: progs[j]._id,

        // Can choose the available standard criteria (i.e TCU) or create new one.
        criteria: mongoose.Types.ObjectId(),

        // max accommodation of the students in this program
        maxCandidates: Math.floor(Math.random() * 100),
      })
    }
    ins.push({
      name: faker.name.title(),

      regNo: faker.date.past().toDateString(),
      website: faker.internet.url(),
      desc: faker.lorem.text(),
      programs: programs,
    });
  }

  /* const institutions = [];
  ins.forEach((i)=>{
    institutions.push(new mod.Institution(i))
  }); */

  const result = await mod.Institution.insertMany(ins);
  console.log(result)
};

// addInst();

// addProgs();

// update();

// load(fakeData);
