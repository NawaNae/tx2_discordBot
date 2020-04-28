function random(d=100,t)
{
    let rd=(from,to)=>{
        let len=to-from;
        return Math.floor(Math.random() *(len+1))+from;
    }
    if(t)
    {
        let a=Math.min(t,d),b=Math.max(t,d);
        return  rd(a,b);
    }
    else
        return rd(0,d-1);
}
function shuffle(arr) {
    var currentIndex = arr.length, temporaryValue, randomIndex;
    var array=[...arr];
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
module.exports={random,shuffle};