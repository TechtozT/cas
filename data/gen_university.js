const { Institution, Program } = require("../db/model");
const faker = require("faker");

const institutions = [
  "Sokoine University of Agriculture",
  "University of Dodoma",
  "National Institute of Transport",
  "Dar-es-salaam Institute of Technology",
  "Ardhi University",
  "Hubert Kairuki Memorial University",
  "Mbeya University of Science and Technology",
  "Moshi Cooperative University",
  "Muhimbili University of Health and Allied Science",
  "Mzumbe University",
  "State University of Zanzibar",
  "Tumaini University MAkumira",
  "University of Arusha",
  "Zanzibar University",
  "Institute of Tax administration",
  "Kampala International University in Tanzania",
  "Muslim University of Morogroro",
  "Mwalimu Nyerere Memorial Academy",
  "Mwenge Catholic University",
  "St.Augustine University of TAnzania",
];

const insertInst = async () => {
  const inst = [];

  institutions.forEach((ins) => {
    inst.push({
      name: ins,
      regNo: faker.random.alphaNumeric(6).toUpperCase(),
      website: faker.internet.domainName(),
    });
  });

  Institution.insertMany(inst, (err, doc) => {
    console.log(r);
  });
};

const genPrograms = async (instID, critID) => {
  const programs = await Program.find({});
  if (!programs) console.log("Failed to fetch programs");
  const ln = programs.length - 1;
  const progs = [];
  for (let i = 0; i < 6; i++) {
    progs.push({
      name: programs[Math.floor(Math.random() * ln)].name,
      program: programs[Math.floor(Math.random() * ln)]._id,
      criteria: critID,
      maxCandidates: Math.floor(Math.random() * 100),
    });
  }

  return Institution.updateOne({ _id: instID }, { $push: { programs: progs } });
};

const insertUniProgs = async () => {
  const crit1 = "5f3ba0363d65ec1e177b01ae";
  const crit2 = "5f3ba4253b8a1f256fcee065";

  const institutions = await Institution.find({}, { _id: 1 });

  let pg;
  institutions.forEach(async (inst, index) => {
    console.log(inst);
    if (index > 10) {
      pg = await genPrograms(inst._id, crit1);
      console.log(pg)
    } else {
      pg = await genPrograms(inst._id, crit2);
      console.log(pg)
    }
  });
};

// insertUniProgs();
