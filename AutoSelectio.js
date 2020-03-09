/*
* School details:
* A school have combinations, capacity of candidates, balance of gender, balance of combinations to alocate.
* The admission process for school:
*   If there are many students make sure to balance combinations and gender.
*   For gender, if one gender is full while the other is not jus take one gender and fill to another.
*   If the capacity is reached then discard the other candidates.
*
* Candidates processing:
*   Have two school to apply(firstchoiceSchool and secondChoiceSchool).
*   For each school have to choose two combinations(firstChoiceCombination and secondChoiceCombination).
* */



/*
* Some schools have only one gender i.e femles only or males only so we have to first check if the school has males and females or have only one gender and then prcess accordingly.
* */

/*
* if(isDualSex(School)){
*   then process accordingly i.e define:
*     malesCapacity;
*     femalesCapacity;
* } else{
*   else define only a capacity;
* }
* */

let malesCapacity = 8;
let femalesCapacity = 10;

// We treat males and females in different array so that we can esasely balance them.

let schoolCapacity = malesCapacity + femalesCapacity;
let combiAttributes = {'PCB': 0, 'PCM': 0, 'CBG': 0};
const numberOfCombinations = 3;
const candidatesPerCombi = Math.floor(schoolCapacity/ numberOfCombinations);

let schoolAllocatedCand = [];
let femalesAlocated = 0;
let malesAlocated = 0;

let femaleCandidates = [
  {
    "_id":"S1298/0235/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
  {
    "_id":"S1298/0236/2014","choice1":{"combi":{"combi1":"PCB","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0237/2014","choice1":{"combi":{"combi1":"CBG","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0238/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0239/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0240/2014","choice1":{"combi":{"combi1":"CBG","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0241/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/02442/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0243/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0244/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"F","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  }
];

let malesCandidates = [
  {
    "_id":"S1298/0245/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
  {
    "_id":"S1298/0246/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0247/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0248/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0249/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0250/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0251/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0252/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0253/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  },
    {
    "_id":"S1298/0254/2014","choice1":{"combi":{"combi1":"PCM","combi2":"PCM"},"centerNo":"S1298","schoolName":"KIEMBESAMAKI SEC SCHOOL"},"date":"2019-03-31T19:42:06.963Z","names":"KHALIFA MOHAMED KHALIFA","gender":"M","__v":0,"choice2":{"centerNo":"S1230","schoolName":"MPENDAE SEC SCHOOL","combi":{"combi1":"PCB","combi2":"PCM"}}
  }
];

//let counter = 0;
femaleCandidates.forEach(function (item, index) {
  if (index +1 <= femalesCapacity){
    // Keep track of each combination.
    if(combiAttributes.hasOwnProperty(item.choice1.combi.combi1) && combiAttributes[item.choice1.combi.combi1] <= candidatesPerCombi){

      // Push the results in to array first and then isert them into database using isertMany() so that to reduse multiple query to DB
      schoolAllocatedCand.push({'_id': item._id, 'centerNo': item.choice1.centerNo, 'school': item.choice1.schoolName, 'combi': item.choice1.combi.combi1, 'schoolChoice': 1, 'combiChoice': 1});
      combiAttributes[item.choice1.combi.combi1] ++;
      femalesAlocated++;
    } else if (combiAttributes.hasOwnProperty(item.choice1.combi.combi2) && combiAttributes[item.choice1.combi.combi2] <= candidatesPerCombi){

      schoolAllocatedCand.push({'_id': item._id, 'centerNo': item.choice1.centerNo, 'school': item.choice1.schoolName, 'combi': item.choice1.combi.combi2, 'schoolChoice': 2, 'combiChoice': 2});
      malesAlocated++;
    }
  }
});

// After the prosess is finished insert them to DB
//Admitted.jnsertMany(schoolAllocatedCand, callback);

/*
* After the first run of the process is finished check if all gender are balanced
* i.e Refine thr applictions
* */


if ((femalesAlocated < femalesCapacity) && malesAlocated === malesCapacity){
  if(malesCandidates.length > malesAlocated){
    // Add males to females array while icremanting femalesAllocted
  }
} else if ((malesAlocated < malesCapacity) && femalesAlocated === malesCapacity){
  if(femaleCandidates.length > femalesAlocated){
    // Add females to females array while icremanting malesAllocated
  }
} else{
  // Everything is done
}

schoolAllocatedCand.map(function (item, index) {
  console.log(index+1);
  console.log(item);

});

console.log(combiAttributes);

