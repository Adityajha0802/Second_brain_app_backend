
export function random(len:number){
    let options="xkjnspdiuojewnmdciuojwenfcow1237698";
    let length=options.length;
    let ans="";
    for(let i=0;i<len;i++){
        ans+=options[Math.floor((Math.random()*length))]; // 0 to length
    }

    return ans;
}