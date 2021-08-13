let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
request(url, cb);
// function processSinglematch(url) {

//     request(url, cb);
// }


function cb(err,response,html){
    if(err){
        console.log(err);
    }else if(response.statusCode == 404){
        console.log("page not found");
    }else{
        // console.log(html);
        // console.log("html",);
        // fs.writeFileSync("abc.html",html);
        dataExtractor(html);
    }
}
function dataExtractor(html){
    let searchTool = cheerio.load(html);
    // console.log(bothInningArr);
    // fs.writeFileSync("def.html",searchTool(bothInningArr).html());
    // let scoreCard ="";
    // console.log(bothInningArr.length);
    // for(let i=0; i<bothInningArr.length;i++){
    //         scoreCard = searchTool(bothInningArr[i]).html();
    //         fs.writeFileSync(`innings${i+1}.html`,scoreCard);
    //     }
        let infoElem = searchTool(".event .match-info.match-info-MATCH .description");
        let matchInfo = infoElem.text().split(",");
        let venue = matchInfo[1].trim();
        
        let date = matchInfo[2].trim();
        //console.log(venue +" -- "+ date);
        let resultInfo = searchTool(".event .match-info.match-info-MATCH .status-text");
        let result = resultInfo.text().trim();
        //console.log(result);
        
        
        let bothInningArr = searchTool(".Collapsible");
        for(let i = 0; i < bothInningArr.length; i++){
            let teamNameElem = searchTool(bothInningArr[i]).find("h5");
            
            let teamName = teamNameElem.text();
            teamName = teamName.split("INNINGS")[0];
            teamName = teamName.trim();
            let team = teamName.split("\n");
            let myTeam = i == 0 ? team[0]:team[1];
            console.log(myTeam);
            let opponentTeamName = i == 0 ? team[1]:team[0];
        // console.log(opponentTeamName);
        //     console.log(teamName);
        //     let batsManTableBodyAllRows = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        //     console.log(batsManTableBodyAllRows.length);
        //     for(let j = 0; j < batsManTableBodyAllRows.length; j++){
        //         let noOfTds = searchTool(batsManTableBodyAllRows[j]).find("td");
        //         if(noOfTds.length == 8){
        //             let playerName = searchTool(noOfTds[0]).text();
        //             console.log(playerName);
        //         }
        //     }
        //     console.log("--------------------------");
         }
 }
// module.exports = {
//     processSinglematch
// }