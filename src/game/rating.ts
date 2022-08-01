import { Rating, TrueSkill } from "ts-trueskill";
import { Rating as RatingModel } from "@prisma/client";

type DbRating = Omit<RatingModel, "id" | "botId">;

//import { inferQueryOutput } from "src/utils/trpc";

//type DbRating = NonNullable<inferQueryOutput<"rating.get-by-id">>;

//type DbRating =

/**
 * trueskill environment for rating this game
 *
 * see [The Math Behind TrueSkill](http://www.moserware.com/assets/computing-your-skill/The%20Math%20Behind%20TrueSkill.pdf) for nice explanations of arguments and the algorithm in general.
 *
 * The defaults for new TrueSkill() are as follows;
 * ```js
 * const mu = 25; //initial mean of ratings
 * const sigma = mu / 3; //initial standard deviation of ratings
 * const beta = sigma / 2; //distance that guarantees about 76% chance of winning
 * const tau = sigma / 100; //dynamic factor (determines how easy it will be for a player to move up and down a leaderboard)
 * const drawProbability = 0.1; //draw probability of the game
 * const gaussian = new Gaussian(0, 1); //reuseable gaussian
 *
 * new TrueSkill(mu, sigma, beta, tau, drawProbability, gaussian);
 * ```
 */
function newTrueskillEnv() {
  // These are the defualt you get with const env = new TrueSkill()
  //write them out here to change later
  const mu = 3000; //initial mean of ratings
  const sigma = 300; //initial standard deviation of ratings
  const beta = sigma / 2; //distance that guarantees about 76% chance of winning
  const tau = sigma / 100; //dynamic factor
  const drawProbability = 0.1; //draw probability of the game
  //const gaussian = new Gaussian(0, 1); //reuseable gaussian

  return new TrueSkill(mu, sigma, beta, tau, drawProbability);
}

//type DbRating = {
//  mu: number;
//  sigma: number;
//  /** use this as a sort key in leaderboard. */
//  exposed: number;
//};

function dbratingFromRating(r: Rating): DbRating {
  return {
    mu: r.mu,
    sigma: r.sigma,
    exposed: exposeRating(r),
  };
}

function ratingFromDbRating(dbrating: DbRating): Rating {
  return new Rating(dbrating.mu, dbrating.sigma);
}

export function newDbRating() {
  const env = newTrueskillEnv();
  const rating = env.createRating();
  return dbratingFromRating(rating);
}

function qualityIsOk(ratingGroups: Rating[][]) {
  const env = newTrueskillEnv();
  if (env.quality(ratingGroups) < 0.5) {
    return false;
  }

  return true;
}

function exposeRating(rating: Rating) {
  const env = newTrueskillEnv();
  const exposed = env.expose(rating);
  return exposed;
}

function rate_team_vs_team(winners: DbRating[], losers: DbRating[], wasDraw: boolean) {
  const ranks = [0, wasDraw ? 0 : 1];
  const [newWinners, newLosers] = rate_teams_vs_teams([winners, losers], ranks);
  if (!newWinners || !newLosers) {
    throw new Error("rate_team_vs_team bad rate() result");
  }
  return { newWinners, newLosers };
}

function rate_player_vs_player(winner: DbRating, loser: DbRating, wasDraw: boolean) {
  const { newWinners, newLosers } = rate_team_vs_team([winner], [loser], wasDraw);
  const newWinner = newWinners[0];
  const newLoser = newLosers[0];
  if (!newWinner || !newLoser) {
    throw new Error("rate_player_vs_player bad rate() result");
  }
  return { newWinner, newLoser };
}

/**
 * essentially env.rate(teamratings, ranks) but with DbRating
 */
function rate_teams_vs_teams(teamratings: DbRating[][], ranks: number[]) {
  const env = newTrueskillEnv();

  const ratinggroups = teamratings.map((rs) => rs.map(ratingFromDbRating));
  const rated: Rating[][] = env.rate(ratinggroups, ranks);
  const newTeamratings = rated.map((rs) => rs.map(dbratingFromRating));

  return newTeamratings;
}
/*
function testrating() {
  let res = {
    newWinner: newDbRating(),
    newLoser: newDbRating(),
  };

  console.log("W    L");
  for (let i = 0; i < 40; i++) {
    const w = res.newWinner;
    const l = res.newLoser;

    console.log(i);
    console.log(`winner exposed: ${w.exposed.toFixed(0)} (${w.mu.toFixed(0)}, ${w.sigma.toFixed(0)})`);
    console.log(`loser exposed: ${l.exposed.toFixed(0)} (${l.mu.toFixed(0)}, ${l.sigma.toFixed(0)})`);
    console.log();

    //console.log(w.exposed.toFixed(), l.exposed.toFixed());
    res = rate_player_vs_player(res.newWinner, res.newLoser, false);
  }
}

testrating();
*/
