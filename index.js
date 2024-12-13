import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const startDateString = "2023-05-17";
const endDateString = "2024-12-13";

const isValidDate = (date) => {
  const startDate = moment(startDateString);
  const endDate = moment(endDateString);
  return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data);
  const git = simpleGit();
  await git.add([path]);
  await git.commit(date.toISOString(), { "--date": date.toISOString() });
};

const makeCommits = async (n) => {
  const git = simpleGit();
  let success = 0;
  let failure = 0;
  for (let i = 0; i < n; i++) {
    const randomWeeks = random.int(0, 54 * 4);
    const randomDays = random.int(0, 6);

    const randomDate = moment(startDateString).add(randomWeeks, "weeks").add(randomDays, "days");

    if (isValidDate(randomDate)) {
      success = success + 1;
      console.log(`${i + 1}. Creating commit: ${randomDate.toISOString()}----------------Susccess: ${success}`);
      await markCommit(randomDate);
    } else {
      failure = failure + 1;
      console.log(`${i + 1}. Invalid date: ${randomDate.toISOString()}), skipping...----------------Failure: ${failure}`);
    }
  }
  console.log("Pushing all commits...");
  await git.push();
};

makeCommits(500);
