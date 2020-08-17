/**
 * @param stdResults The students school result.
 * @param progCriteria The criteria of the program that we need to check.
 * @returns Return true if the student results meet all the minimum criteria
 * of the program and false otherwise.
 */

const gradDictionary = { A: 1, B: 2, C: 3, D: 4, E: 5, S: 6, F: 7 };

const compareResultOverProgram = (stdResults, progCriteria) => {
  // Assuming level is advanced level ("a").
  if (progCriteria.school.gradPoint < stdResults.gradPoint) return false;

  if (!progCriteria.school.programs.includes(stdResults.program)) return false;

  const critSubs = progCriteria.school.mandatorySubs;
  const stdSubs = stdResults.subjects;
  for (let i = 0; i < critSubs.length; i++) {
    let match = stdSubs.find((s) => s.name === critSubs[i].name);
    if (!match) return false;

    if (gradDictionary[match.grade] > gradDictionary[critSubs[i].grade])
      return false;
  }

  return true;
};

module.exports = {
  compareResultOverProgram,
};
